# ----------------------------------------------------------------------------------
#
# Copyright Microsoft Corporation
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ----------------------------------------------------------------------------------

<#
.SYNOPSIS
Test Virtual Machine Scalet Set

PS C:\> Get-Command *VMSS*

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Cmdlet          Add-AzureRmVMSshPublicKey                          0.9.9      AzureResourceManager
Cmdlet          Get-AzureVMSS                                      0.9.9      AzureResourceManager
Cmdlet          Get-AzureVMSSAllList                               0.9.9      AzureResourceManager
Cmdlet          Get-AzureVMSSInstanceView                          0.9.9      AzureResourceManager
Cmdlet          Get-AzureVMSSList                                  0.9.9      AzureResourceManager
Cmdlet          Get-AzureVMSSNextList                              0.9.9      AzureResourceManager
Cmdlet          Get-AzureVMSSSkusList                              0.9.9      AzureResourceManager
Cmdlet          Get-AzureVMSSVM                                    0.9.9      AzureResourceManager
Cmdlet          Get-AzureVMSSVMInstanceView                        0.9.9      AzureResourceManager
Cmdlet          Get-AzureVMSSVMList                                0.9.9      AzureResourceManager
Cmdlet          New-AzureVMSS                                      0.9.9      AzureResourceManager
Cmdlet          Remove-AzureVMSS                                   0.9.9      AzureResourceManager
Cmdlet          Remove-AzureVMSSInstances                          0.9.9      AzureResourceManager
Cmdlet          Remove-AzureVMSSVM                                 0.9.9      AzureResourceManager
Cmdlet          Restart-AzureVMSS                                  0.9.9      AzureResourceManager
Cmdlet          Restart-AzureVMSSInstances                         0.9.9      AzureResourceManager
Cmdlet          Restart-AzureVMSSVM                                0.9.9      AzureResourceManager
Cmdlet          Start-AzureVMSS                                    0.9.9      AzureResourceManager
Cmdlet          Start-AzureVMSSInstances                           0.9.9      AzureResourceManager
Cmdlet          Start-AzureVMSSVM                                  0.9.9      AzureResourceManager
Cmdlet          Stop-AzureVMSS                                     0.9.9      AzureResourceManager
Cmdlet          Stop-AzureVMSSInstances                            0.9.9      AzureResourceManager
Cmdlet          Stop-AzureVMSSInstancesWithDeallocation            0.9.9      AzureResourceManager
Cmdlet          Stop-AzureVMSSVM                                   0.9.9      AzureResourceManager
Cmdlet          Stop-AzureVMSSVMWithDeallocation                   0.9.9      AzureResourceManager
Cmdlet          Stop-AzureVMSSWithDeallocation                     0.9.9      AzureResourceManager
Cmdlet          Update-AzureVMSSInstances                          0.9.9      AzureResourceManager
#>
function Test-VirtualMachineScaleSet
{
    # Setup
    $rgname = Get-ComputeTestResourceName

    try
    {
        # Common
        $loc = 'westus';
        New-AzureRMResourceGroup -Name $rgname -Location $loc -Force;

        # NRP
        $subnet = New-AzureRMVirtualNetworkSubnetConfig -Name ('subnet' + $rgname) -AddressPrefix "10.0.0.0/24";
        $vnet = New-AzureRMVirtualNetwork -Force -Name ('vnet' + $rgname) -ResourceGroupName $rgname -Location $loc -AddressPrefix "10.0.0.0/16" -DnsServer "10.1.1.1" -Subnet $subnet;
        $vnet = Get-AzureRMVirtualNetwork -Name ('vnet' + $rgname) -ResourceGroupName $rgname;
        $subnetId = $vnet.Subnets[0].Id;
        $pubip = New-AzureRMPublicIpAddress -Force -Name ('pubip' + $rgname) -ResourceGroupName $rgname -Location $loc -AllocationMethod Dynamic -DomainNameLabel ('pubip' + $rgname);
        $pubip = Get-AzureRMPublicIpAddress -Name ('pubip' + $rgname) -ResourceGroupName $rgname;
        $pubipId = $pubip.Id;
        $nic = New-AzureRMNetworkInterface -Force -Name ('nic' + $rgname) -ResourceGroupName $rgname -Location $loc -SubnetId $subnetId -PublicIpAddressId $pubip.Id;
        $nic = Get-AzureRMNetworkInterface -Name ('nic' + $rgname) -ResourceGroupName $rgname;
        $nicId = $nic.Id;

        # SRP
        $stoname = 'sto' + $rgname;
        $stotype = 'Standard_GRS';
        New-AzureRMStorageAccount -ResourceGroupName $rgname -Name $stoname -Location $loc -Type $stotype;
        $stoaccount = Get-AzureRMStorageAccount -ResourceGroupName $rgname -Name $stoname;

        # New VMSS Parameters
        $vmss = New-AzureComputeParameterObject -FullName Microsoft.Azure.Management.Compute.Models.VirtualMachineScaleSet;
        $vmss.Name = 'vmss' + $rgname;
        $vmss.Type = 'Microsoft.Compute/virtualMachineScaleSets';
        $vmss.Location = $loc;

        $vmss.VirtualMachineProfile = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetVMProfile;
        $vmss.VirtualMachineProfile.ExtensionProfile = $null;
        $vmss.Sku = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetSku;
        $vmss.Sku.Capacity = 2;
        $vmss.Sku.Name = 'Standard_A0';
        $vmss.UpgradePolicy = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetUpgradePolicy;
        $vmss.UpgradePolicy.Mode = 'automatic';

        $vmss.VirtualMachineProfile.NetworkProfile = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetNetworkProfile;
        $ipCfg = New-Object Microsoft.Azure.Management.Compute.Models.VirtualMachineScaleSetIPConfiguration;
        $ipcfg.Name = 'test';
        $ipCfg.LoadBalancerBackendAddressPools = $null;
        $ipCfg.Subnet = New-Object Microsoft.Azure.Management.Compute.Models.ApiEntityReference;
        $ipCfg.Subnet.ReferenceUri = $subnetId;
        $netCfg = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetNetworkConfiguration;
        $netCfg.Name = 'test';
        $netCfg.Primary = $true;
        $netCfg.IPConfigurations.Add($ipCfg);
        $vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations.Add($netCfg);

        $vmss.VirtualMachineProfile.OSProfile = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetOSProfile;
        $vmss.VirtualMachineProfile.OSProfile.ComputerNamePrefix = 'test';
        $vmss.VirtualMachineProfile.OSProfile.AdminUsername = 'Foo12';
        $vmss.VirtualMachineProfile.OSProfile.AdminPassword = "BaR@123" + $rgname;

        $vmss.VirtualMachineProfile.StorageProfile = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetStorageProfile;
        $imgRef = Get-DefaultCRPImage -loc $loc;
        $vmss.VirtualMachineProfile.StorageProfile.ImageReference = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetImageReference;
        $vmss.VirtualMachineProfile.StorageProfile.ImageReference.Publisher = $imgRef.PublisherName;
        $vmss.VirtualMachineProfile.StorageProfile.ImageReference.Offer = $imgRef.Offer;
        $vmss.VirtualMachineProfile.StorageProfile.ImageReference.Sku = $imgRef.Skus;
        $vmss.VirtualMachineProfile.StorageProfile.ImageReference.Version = $imgRef.Version;
        $vmss.VirtualMachineProfile.StorageProfile.OSDisk = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetOSDisk;
        $vmss.VirtualMachineProfile.StorageProfile.OSDisk.Caching = 'None';
        $vmss.VirtualMachineProfile.StorageProfile.OSDisk.CreateOption = 'FromImage';
        $vmss.VirtualMachineProfile.StorageProfile.OSDisk.Name = 'test';
        $vhdContainer = "https://" + $stoname + ".blob.core.windows.net/" + $vmss.Name;
        $vmss.VirtualMachineProfile.StorageProfile.OSDisk.VirtualHardDiskContainers.Add($vhdContainer);

        $st = New-AzureVMSS -ResourceGroupName $rgname -VirtualMachineScaleSetCreateOrUpdateParameters $vmss;

        Write-Verbose ('Running Command : ' + 'Get-AzureVMSS');
        $vmssResult = Get-AzureVMSS -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
        Assert-True { $vmss.Name -eq $vmssResult.VirtualMachineScaleSet.Name };
        $output = $vmssResult | Out-String;
        Write-Verbose ($output);
        Assert-True { $output.Contains("VirtualMachineScaleSet") };

        # List All
        Write-Verbose ('Running Command : ' + 'Get-AzureVMSSAllList');
        $vmssList = Get-AzureVMSSAllList -VirtualMachineScaleSetListAllParameters $null;
        Assert-True { ($vmssList.VirtualMachineScaleSets | select -ExpandProperty Name) -contains $vmss.Name };
        $output = $vmssList | Out-String;
        Write-Verbose ($output);
        Assert-True { $output.Contains("VirtualMachineScaleSets") };

        # List from RG
        Write-Verbose ('Running Command : ' + 'Get-AzureVMSSList');
        $vmssList = Get-AzureVMSSList -ResourceGroupName $rgname;
        Assert-True { ($vmssList.VirtualMachineScaleSets | select -ExpandProperty Name) -contains $vmss.Name };
        $output = $vmssList | Out-String;
        Write-Verbose ($output);
        Assert-True { $output.Contains("VirtualMachineScaleSet") };

        # List Skus
        Write-Verbose ('Running Command : ' + 'Get-AzureVMSSSkusList');
        $skuList = Get-AzureVMSSSkusList -ResourceGroupName $rgname  -VMScaleSetName $vmss.Name;
        $output = $skuList | Out-String;
        Write-Verbose ($output);
        Assert-True { $output.Contains("VirtualMachineScaleSetSku") };

        # List All VMs
        $vmListParams = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetVMListParameters;
        $vmListParams.ResourceGroupName = $rgname;
        $vmListParams.VirtualMachineScaleSetName = $vmss.Name;

        Write-Verbose ('Running Command : ' + 'Get-AzureVMSSVMList');
        $vmListResult = Get-AzureVMSSVMList -VirtualMachineScaleSetVMListParameters $vmListParams;
        $output = $vmListResult | Out-String;
        Write-Verbose ($output);
        Assert-True { $output.Contains("VirtualMachineScaleSetVM") };

        $vmList = $vmListResult.VirtualMachineScaleSetVMs;

        # List each VM
        for ($i = 0; $i -lt $vmList.Count; $i++)
        {
            Write-Verbose ('Running Command : ' + 'Get-AzureVMSSVM');
            $vm = Get-AzureVMSSVM -ResourceGroupName $rgname  -VMScaleSetName $vmss.Name -InstanceId $i;
            Assert-NotNull $vm.VirtualMachineScaleSetVM;
            $output = $vm | Out-String;
            Write-Verbose ($output);
            Assert-True { $output.Contains("VirtualMachineScaleSetVM") };

            Write-Verbose ('Running Command : ' + 'Get-AzureVMSSVMInstanceView');
            $vmInstance = Get-AzureVMSSVMInstanceView  -ResourceGroupName $rgname  -VMScaleSetName $vmss.Name -InstanceId $i;
            Assert-NotNull $vmInstance.VirtualMachineScaleSetVMInstanceView;
            $output = $vmInstance | Out-String;
            Write-Verbose($output);
            Assert-True { $output.Contains("VirtualMachineScaleSetVMInstanceView") };
        }

        # List Next (negative test)
        Assert-ThrowsContains { Get-AzureVMSSNextList -NextLink test.com  } "Invalid URI: The format of the URI could not be determined.";

        # Stop/Start/Restart Operation
        for ($i = 0; $i -lt $vmList.Count; $i++)
        {
            $st = Stop-AzureVMSSVM -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -InstanceId $i;
            $st = Stop-AzureVMSSVMWithDeallocation -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -InstanceId $i;
            $st = Start-AzureVMSSVM -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -InstanceId $i;
            $st = Restart-AzureVMSSVM -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -InstanceId $i;
        }

        $st = Stop-AzureVMSS -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
        $st = Stop-AzureVMSSWithDeallocation -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
        $st = Start-AzureVMSS -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
        $st = Restart-AzureVMSS -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;

        $instanceListParam = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetVMInstanceIDs;
        for ($i = 0; $i -lt $vmList.Count; $i++)
        {
            $instanceListParam.InstanceIDs.Add($i);
        }
        $st = Stop-AzureVMSSInstances -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -VMInstanceIDs $instanceListParam;
        $st = Stop-AzureVMSSInstancesWithDeallocation -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -VMInstanceIDs $instanceListParam;
        $st = Start-AzureVMSSInstances -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -VMInstanceIDs $instanceListParam;
        $st = Restart-AzureVMSSInstances -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -VMInstanceIDs $instanceListParam;

        # Remove
        $instanceListParam = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetVMInstanceIDs;
        $instanceListParam.InstanceIDs.Add(1);
        $st = Remove-AzureVMSSInstances -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -VMInstanceIDs $instanceListParam;
        Assert-ThrowsContains { $st = Remove-AzureVMSSVM -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -InstanceId 0 } "cannot be deleted because it is the last remaining";
        $st = Remove-AzureVMSS -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
    }
    finally
    {
        # Cleanup
        Clean-ResourceGroup $rgname
    }
}
