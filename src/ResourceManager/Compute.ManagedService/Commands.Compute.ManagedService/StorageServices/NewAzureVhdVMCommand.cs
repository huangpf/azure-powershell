// ----------------------------------------------------------------------------------
//
// Copyright Microsoft Corporation
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// ----------------------------------------------------------------------------------

using Microsoft.Azure.Commands.Common.Authentication;
using Microsoft.Azure.Commands.Common.Authentication.Abstractions;
using Microsoft.Azure.Commands.Compute.Common;
using Microsoft.Azure.Commands.Compute.Models;
using Microsoft.Azure.Commands.Compute.StorageServices;
using Microsoft.Azure.Management.Compute;
using Microsoft.Azure.Management.Compute.Models;
using Microsoft.Azure.Management.Network;
using Microsoft.Azure.Management.Network.Models;
using Microsoft.Azure.Management.Resources;
using Microsoft.Azure.Management.Resources.Models;
using Microsoft.Azure.Management.Storage;
using Microsoft.Azure.Management.Storage.Models;
using Microsoft.WindowsAzure.Commands.Sync.Download;
using Microsoft.WindowsAzure.Commands.Tools.Vhd;
using Microsoft.WindowsAzure.Commands.Tools.Vhd.Model;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Management.Automation;

namespace Microsoft.Azure.Commands.Compute
{
    [Cmdlet(VerbsCommon.New, ProfileNouns.VirtualHardDiskVirtualMachine, DefaultParameterSetName = DiskLinkParameterSetNameStr, SupportsShouldProcess = true)]
    [OutputType(typeof(PSAzureOperationResponse))]
    public class NewAzureVhdVMCommand : VirtualMachineBaseCmdlet
    {
        [Parameter(ParameterSetName = DiskLinkParameterSetNameStr, Mandatory = true, Position = 0, ValueFromPipelineByPropertyName = true)]
        [Parameter(ParameterSetName = DiskFileParameterSetNameStr, Mandatory = true, Position = 0, ValueFromPipelineByPropertyName = true)]
        [ValidateNotNullOrEmpty]
        public string ResourceGroupName { get; set; }
        
        [Parameter(ParameterSetName = DiskLinkParameterSetNameStr, Mandatory = true, Position = 1, ValueFromPipelineByPropertyName = true)]
        [Parameter(ParameterSetName = DiskFileParameterSetNameStr, Mandatory = true, Position = 1, ValueFromPipelineByPropertyName = true)]
        [ValidateNotNullOrEmpty]
        public string Location { get; set; }
        
        [Parameter(ParameterSetName = DiskLinkParameterSetNameStr, Mandatory = true, Position = 2, ValueFromPipelineByPropertyName = true)]
        [Parameter(ParameterSetName = DiskFileParameterSetNameStr, Mandatory = true, Position = 2, ValueFromPipelineByPropertyName = true)]
        [ValidateNotNullOrEmpty]
        [ValidateSet("Windows", "Linux")]
        public string OSType { get; set; }
        
        [Parameter(ParameterSetName = DiskLinkParameterSetNameStr, Mandatory = true, Position = 3, ValueFromPipelineByPropertyName = true)]
        [ValidateNotNullOrEmpty]
        public string[] DiskLink { get; set; }
        
        [Parameter(ParameterSetName = DiskFileParameterSetNameStr, Mandatory = true, Position = 3, ValueFromPipelineByPropertyName = true)]
        [ValidateNotNullOrEmpty]
        public string[] DiskFile { get; set; }

        [Parameter(ParameterSetName = DiskLinkParameterSetNameStr, Mandatory = false, Position = 4, ValueFromPipelineByPropertyName = true)]
        [Parameter(ParameterSetName = DiskFileParameterSetNameStr, Mandatory = false, Position = 4, ValueFromPipelineByPropertyName = true)]
        [ValidateNotNullOrEmpty]
        public string VMName { get; set; }

        [Parameter(ParameterSetName = DiskLinkParameterSetNameStr, Mandatory = false, Position = 5, ValueFromPipelineByPropertyName = true)]
        [Parameter(ParameterSetName = DiskFileParameterSetNameStr, Mandatory = false, Position = 5, ValueFromPipelineByPropertyName = true)]
        [ValidateNotNullOrEmpty]
        public string VMSize { get; set; }
        
        [Parameter(ParameterSetName = DiskLinkParameterSetNameStr, Mandatory = false, Position = 6, ValueFromPipelineByPropertyName = true)]
        [Parameter(ParameterSetName = DiskFileParameterSetNameStr, Mandatory = false, Position = 6, ValueFromPipelineByPropertyName = true)]
        [ValidateNotNullOrEmpty]
        public List<SecurityRule> SecurityRules { get; set; }

        [Parameter(ParameterSetName = DiskLinkParameterSetNameStr, Mandatory = false, Position = 7, ValueFromPipelineByPropertyName = true)]
        [Parameter(ParameterSetName = DiskFileParameterSetNameStr, Mandatory = false, Position = 7, ValueFromPipelineByPropertyName = true)]
        [ValidateNotNullOrEmpty]
        public string DefaultVNetAddressSpace { get; set; }

        [Parameter(ParameterSetName = DiskLinkParameterSetNameStr, Mandatory = false, Position = 8, ValueFromPipelineByPropertyName = true)]
        [Parameter(ParameterSetName = DiskFileParameterSetNameStr, Mandatory = false, Position = 8, ValueFromPipelineByPropertyName = true)]
        [ValidateNotNullOrEmpty]
        public string DefaultSubnetAddressSpace { get; set; }

        [Parameter(ParameterSetName = DiskLinkParameterSetNameStr, Mandatory = false, Position = 9, ValueFromPipelineByPropertyName = true)]
        [Parameter(ParameterSetName = DiskFileParameterSetNameStr, Mandatory = false, Position = 9, ValueFromPipelineByPropertyName = true)]
        [ValidateNotNullOrEmpty]
        [ValidateRange(1, 64)]
        public int NumberOfUploaderThreads { get; set; }

        [Parameter(ParameterSetName = DiskLinkParameterSetNameStr, Mandatory = false, Position = 10, ValueFromPipelineByPropertyName = true)]
        [Parameter(ParameterSetName = DiskFileParameterSetNameStr, Mandatory = false, Position = 10, ValueFromPipelineByPropertyName = true)]
        public SwitchParameter NoDiskLinkExistenceCheck { get; set; }

        protected const string DiskLinkParameterSetNameStr = "DiskLink";
        protected const string DiskFileParameterSetNameStr = "DiskFile";
        private const int DefaultNumberOfUploaderThreads = 2;

        private StorageManagementClient storageClient = null;
        private NetworkManagementClient networkClient = null;
        private List<string> diskIds = new List<string>();
        private StorageAccount stoAccount = null;

        public override void ExecuteCmdlet()
        {
            base.ExecuteCmdlet();

            ExecuteClientAction(() =>
            {
                InitializeOptionalParameters();
                ValidateInitialInputParameters();
                CreateResourceGroupIfNotExists();
                CreateDefaultStorageAccount();
                UploadDiskFilesAsPageBlobs();
                ThrowIfOSOrDataDisksNotExist();
                CreateManagedOSAndDataDisks();
                NetworkInterface nic = CreateDefaultNetworkInterface();
                CreateVirtualMachine(nic);
            });
        }

        private void InitializeOptionalParameters()
        {
            if (string.IsNullOrEmpty(this.VMName))
            {
                this.VMName = string.Format("vm-{0}{1}{2}{3}", this.Location, DateTime.Now.ToString("yyyyMMddhhmmss"), this.ResourceGroupName, Path.GetRandomFileName().Replace(".", ""));
            }

            if (string.IsNullOrEmpty(this.VMSize))
            {
                this.VMSize = "Standard_A2";
            }

            if (this.SecurityRules == null)
            {
                this.SecurityRules = new List<SecurityRule>()
                {
                    new SecurityRule
                    {
                        Name = "allow3389",
                        Description = "allow3389",
                        Access = "Allow",
                        Protocol = "Tcp",
                        Direction = "Inbound",
                        Priority = 110,
                        SourceAddressPrefix = "*",
                        SourcePortRange = "*",
                        DestinationAddressPrefix = "*",
                        DestinationPortRange = "3389"
                    },
                    new SecurityRule
                    {
                        Name = "allow80",
                        Description = "allow80",
                        Access = "Allow",
                        Protocol = "Tcp",
                        Direction = "Inbound",
                        Priority = 120,
                        SourceAddressPrefix = "*",
                        SourcePortRange = "*",
                        DestinationAddressPrefix = "*",
                        DestinationPortRange = "80"
                    },
                    new SecurityRule
                    {
                        Name = "allow8080",
                        Description = "allow8080",
                        Access = "Allow",
                        Protocol = "Tcp",
                        Direction = "Inbound",
                        Priority = 130,
                        SourceAddressPrefix = "*",
                        SourcePortRange = "*",
                        DestinationAddressPrefix = "*",
                        DestinationPortRange = "8080"
                    }
                };
            }

            if (string.IsNullOrEmpty(this.DefaultVNetAddressSpace))
            {
                this.DefaultVNetAddressSpace = "10.0.0.0/16";
            }

            if (string.IsNullOrEmpty(this.DefaultSubnetAddressSpace))
            {
                this.DefaultSubnetAddressSpace = "10.0.0.0/24";
            }
        }

        private void ValidateInitialInputParameters()
        {
            if (this.DiskFile == null && this.DiskLink == null)
            {
                throw new ArgumentException("DiskFile and DiskLink cannot be both null.");
            }

            if (this.DiskFile != null && this.DiskLink != null)
            {
                throw new ArgumentException("DiskFile and DiskLink cannot be both not null.");
            }

            if (this.DiskFile != null && this.DiskFile.Count() <= 0)
            {
                throw new ArgumentOutOfRangeException("DiskFile", "DiskFile input must contain at least one file.");
            }

            if (this.DiskLink != null && this.DiskLink.Count() <= 0)
            {
                throw new ArgumentOutOfRangeException("DiskLink", "DiskLink input must contain at least one link.");
            }
        }

        private void CreateResourceGroupIfNotExists()
        {
            IResourceManagementClient resourceManagementClient = AzureSession.Instance.ClientFactory.CreateClient<ResourceManagementClient>(
                        DefaultProfile.DefaultContext, AzureEnvironment.Endpoint.ResourceManager);
            var resourceGroups = resourceManagementClient.ResourceGroups.List(new ResourceGroupListParameters { });
            if (!resourceGroups.ResourceGroups.Any(r => string.Equals(r.Name, this.ResourceGroupName, StringComparison.OrdinalIgnoreCase)))
            {
                resourceManagementClient.ResourceGroups.CreateOrUpdate(this.ResourceGroupName, new ResourceGroup
                {
                    Location = this.Location
                });
            }
        }

        private void CreateDefaultStorageAccount()
        {
            InitializeStorageManagementClient();
            string stoName = GetPrefixBasedResourceName("sto", false, true, 24);
            stoAccount = this.storageClient.StorageAccounts.Create(this.ResourceGroupName, stoName, new StorageAccountCreateParameters
            {
                AccountType = AccountType.StandardGRS,
                Location = this.Location
            });
            stoAccount = this.storageClient.StorageAccounts.GetProperties(this.ResourceGroupName, stoName);
        }

        private void InitializeStorageManagementClient()
        {
            if (this.storageClient == null)
            {
                this.storageClient = AzureSession.Instance.ClientFactory.CreateArmClient<StorageManagementClient>(
                            DefaultProfile.DefaultContext, AzureEnvironment.Endpoint.ResourceManager);
            }
        }

        private void InitializeNetworkManagementClient()
        {
            if (this.networkClient == null)
            {
                this.networkClient = AzureSession.Instance.ClientFactory.CreateArmClient<NetworkManagementClient>(
                            DefaultProfile.DefaultContext, AzureEnvironment.Endpoint.ResourceManager);
            }
        }

        private void UploadDiskFilesAsPageBlobs()
        {
            if (this.DiskFile != null)
            {
                var uploadedDiskBlobs = new List<Uri>();
                var ctnName = GetPrefixBasedResourceName("cnt", false);
                var blobNamePrefix = GetPrefixBasedResourceName("blb", false);
                int index = 0;
                foreach (var diskFile in this.DiskFile)
                {
                    PathIntrinsics currentPath = SessionState.Path;
                    var filePath = new FileInfo(currentPath.GetUnresolvedProviderPathFromPSPath(diskFile));

                    using (var vds = new VirtualDiskStream(filePath.FullName))
                    {
                        if (vds.DiskType == DiskType.Fixed)
                        {
                            long divisor = Convert.ToInt64(Math.Pow(2, 9));
                            long rem = 0;
                            Math.DivRem(filePath.Length, divisor, out rem);
                            if (rem != 0)
                            {
                                throw new ArgumentOutOfRangeException("filePath", string.Format("Given vhd file '{0}' is a corrupted fixed vhd", filePath));
                            }
                        }
                    }
                    BlobUri destinationUri = null;
                    BlobUri.TryParseUri(new Uri(stoAccount.PrimaryEndpoints.Blob + ctnName + "/" + blobNamePrefix + index++ + ".vhd"), out destinationUri);
                    if (destinationUri == null)
                    {
                        throw new ArgumentNullException("destinationUri");
                    }
                    var storageCredentialsFactory = CreateStorageCredentialsFactory(destinationUri.Uri);
                    var parameters = new UploadParameters(destinationUri, null, filePath, true, NumberOfUploaderThreads <= 0 ? DefaultNumberOfUploaderThreads : NumberOfUploaderThreads)
                    {
                        Cmdlet = this,
                        BlobObjectFactory = new CloudPageBlobObjectFactory(storageCredentialsFactory, TimeSpan.FromMinutes(1))
                    };
                    var vhdUploadContext = VhdUploaderModel.Upload(parameters);
                    WriteObject(vhdUploadContext);
                    uploadedDiskBlobs.Add(vhdUploadContext.DestinationUri);
                }
                this.DiskLink = uploadedDiskBlobs.Select(a => a.ToString()).ToArray();
            }
            else
            {
                WriteVerbose("DiskFile input is empty or null; skip disk file uploading...");
            }
        }
        
        private StorageCredentialsFactory CreateStorageCredentialsFactory(Uri pageBlobUrl)
        {
            if (pageBlobUrl == null)
            {
                throw new ArgumentNullException("pageBlobUrl");
            }
            StorageCredentialsFactory storageCredentialsFactory;
            if (pageBlobUrl != null && StorageCredentialsFactory.IsChannelRequired(pageBlobUrl))
            {
                storageCredentialsFactory = new StorageCredentialsFactory(this.ResourceGroupName, this.storageClient, DefaultContext.Subscription);
            }
            else
            {
                storageCredentialsFactory = new StorageCredentialsFactory();
            }

            return storageCredentialsFactory;
        }

        private void ThrowIfOSOrDataDisksNotExist()
        {
            if (NoDiskLinkExistenceCheck)
            {
                WriteVerbose("Skip checking disk link's existence...");
                return;
            }

            foreach (var blobUrl in this.DiskLink)
            {
                if (!CheckIfPageBlobExists(blobUrl, this.storageClient))
                {
                    throw new ArgumentOutOfRangeException("blobUrl", "Disk's page blob does not exist: '" + blobUrl + "'.");
                }
            }
        }

        private bool CheckIfPageBlobExists(string blobUrlInput, StorageManagementClient storageClient)
        {
            if (storageClient == null)
            {
                throw new ArgumentNullException("storageClient");
            }

            BlobUri blobUri = null;
            bool result = BlobUri.TryParseUri(new Uri(blobUrlInput), out blobUri);
            if (blobUri == null)
            {
                throw new ArgumentOutOfRangeException(blobUrlInput, "Input Blob Url is invalid: '" + blobUrlInput + "'.");
            }

            CloudPageBlob pageBlobRef = new CloudPageBlob(blobUri.Uri);
            var allStoAccounts = storageClient.StorageAccounts.List();
            if (allStoAccounts.Count(c => string.Equals(c.Name, blobUri.StorageAccountName, StringComparison.OrdinalIgnoreCase)) != 1)
            {
                return false;
            }
            var storageKeys = storageClient.StorageAccounts.ListKeys(this.ResourceGroupName, blobUri.StorageAccountName);
            StorageCredentials cred = new StorageCredentials(blobUri.StorageAccountName, storageKeys.GetFirstAvailableKey());
            CloudBlobClient cbc = new CloudBlobClient(new StorageUri(new Uri(blobUri.BaseUri)), cred);
            var containerList = cbc.ListContainers();
            CloudBlobContainer container = containerList.FirstOrDefault(c => string.Equals(c.Name, pageBlobRef.Container.Name, StringComparison.OrdinalIgnoreCase));
            if (container != null)
            {
                CloudPageBlob pageBlobReference = container.GetPageBlobReference(pageBlobRef.Name);
                return pageBlobReference.Exists();
            }
            else
            {
                return false;
            }
        }

        private void CreateManagedOSAndDataDisks()
        {
            for (int i = 0; i < this.DiskLink.Count(); i++)
            {
                string prefix = "d";
                if (i == 0)
                {
                    prefix = "os";
                }
                Disk diskConfig = CreateManagedDiskConfig(this.DiskLink[i], this.Location);
                var disk = this.ComputeClient.ComputeManagementClient.Disks.CreateOrUpdate(this.ResourceGroupName, GetPrefixBasedResourceName(prefix + i), diskConfig);
                diskIds.Add(disk.Id);
            }
        }

        private Disk CreateManagedDiskConfig(string diskSourceUri, string location)
        {
            Disk diskConfig = new Disk
            {
                Sku = new DiskSku
                {
                    Name = StorageAccountTypes.PremiumLRS
                },
                Location = location,
                CreationData = new CreationData
                {
                    CreateOption = DiskCreateOption.Import,
                    SourceUri = diskSourceUri
                }
            };
            return diskConfig;
        }

        private string GetPrefixBasedResourceName(string prefix, bool useHypen = true, bool toLower = false, int maxLength = 80)
        {
            if (string.IsNullOrEmpty(prefix))
            {
                throw new ArgumentNullException("prefix");
            }

            if (maxLength <= 0)
            {
                throw new ArgumentOutOfRangeException("maxLength");
            }
            
            string name = prefix + "-" + this.VMName;
            if (!useHypen)
            {
                name = name.Replace("-", "");
            }

            if (name.Length > maxLength)
            {
                name = name.Substring(0, maxLength);
            }

            if (toLower)
            {
                name = name.ToLower();
            }

            return name;
        }

        private NetworkInterface CreateDefaultNetworkInterface()
        {
            InitializeNetworkManagementClient();
            string vnetName = GetPrefixBasedResourceName("vnet");
            string subnetName = GetPrefixBasedResourceName("subnet");
            var vnetResult = this.networkClient.VirtualNetworks.CreateOrUpdate(this.ResourceGroupName, vnetName, new VirtualNetwork
            {
                Location = this.Location,
                AddressSpace = new AddressSpace
                {
                    AddressPrefixes = new List<string>() { this.DefaultVNetAddressSpace }
                },
                Subnets = new List<Subnet>()
                {
                    new Subnet
                    {
                        Name = subnetName,
                        AddressPrefix = this.DefaultSubnetAddressSpace
                    }
                }
            });
            string nsgName = GetPrefixBasedResourceName("nsg");
            var nsgResult = this.networkClient.NetworkSecurityGroups.CreateOrUpdate(this.ResourceGroupName, nsgName, new NetworkSecurityGroup
            {
                Location = this.Location,
                SecurityRules = this.SecurityRules
            });
            string publicIpName = GetPrefixBasedResourceName("pip");
            var pipResult = this.networkClient.PublicIPAddresses.CreateOrUpdate(this.ResourceGroupName, publicIpName, new PublicIPAddress
            {
                Location = this.Location,
                PublicIPAllocationMethod = "Dynamic"
            });
            string nicName = GetPrefixBasedResourceName("nic");
            var nicResult = this.networkClient.NetworkInterfaces.CreateOrUpdate(this.ResourceGroupName, nicName, new NetworkInterface
            {
                Location = this.Location,
                IpConfigurations = new List<NetworkInterfaceIPConfiguration>()
                {
                    new NetworkInterfaceIPConfiguration
                    {
                        Subnet = new Subnet
                        {
                            Id = vnetResult.Subnets.First().Id
                        },
                        PublicIPAddress = new PublicIPAddress
                        {
                            Id = pipResult.Id
                        },
                        Name = nicName
                    }
                },
                NetworkSecurityGroup = new NetworkSecurityGroup
                {
                    Id = nsgResult.Id
                }
            });
            return nicResult;
        }

        void CreateVirtualMachine(NetworkInterface nic)
        {
            VirtualMachine vmConfig = new VirtualMachine
            {
                Location = this.Location,
                NetworkProfile = new NetworkProfile
                {
                    NetworkInterfaces = new List<NetworkInterfaceReference>()
                    {
                        new NetworkInterfaceReference
                        {
                            Id = nic.Id
                        }
                    }
                },
                HardwareProfile = new HardwareProfile
                {
                    VmSize = this.VMSize
                },
                DiagnosticsProfile = new DiagnosticsProfile
                {
                    BootDiagnostics = new BootDiagnostics
                    {
                        Enabled = true,
                        StorageUri = stoAccount.PrimaryEndpoints.Blob
                    }
                },
                StorageProfile = new StorageProfile
                {
                    OsDisk = new OSDisk
                    {
                        CreateOption = DiskCreateOptionTypes.Attach,
                        OsType = string.Equals(this.OSType, "Windows", StringComparison.OrdinalIgnoreCase) ? OperatingSystemTypes.Windows : OperatingSystemTypes.Linux,
                        ManagedDisk = new ManagedDiskParameters
                        {
                            Id = diskIds[0],
                            StorageAccountType = StorageAccountTypes.StandardLRS
                        }
                    }
                }
            };
            for (int i = 1; i < diskIds.Count; i++)
            {
                if (vmConfig.StorageProfile.DataDisks == null)
                {
                    vmConfig.StorageProfile.DataDisks = new List<DataDisk>();
                }
                vmConfig.StorageProfile.DataDisks.Add(new DataDisk
                {
                    CreateOption = DiskCreateOptionTypes.Attach,
                    Lun = i,
                    ManagedDisk = new ManagedDiskParameters
                    {
                        Id = diskIds[i],
                        StorageAccountType = StorageAccountTypes.StandardLRS
                    }
                });
            }
            var result = this.ComputeClient.ComputeManagementClient.VirtualMachines.CreateOrUpdate(this.ResourceGroupName, this.VMName, vmConfig);
            WriteObject(result);
        }
    }
}
