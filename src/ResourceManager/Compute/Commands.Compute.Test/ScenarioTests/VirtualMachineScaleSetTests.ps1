﻿# ----------------------------------------------------------------------------------
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

PS C:\> Get-Command *VirtualMachineScaleSet*

CommandType     Name                                               ModuleName
-----------     ----                                               ----------
Cmdlet          Get-AzureVirtualMachineScaleSet                    AzureResourceManager
Cmdlet          Get-AzureVirtualMachineScaleSetAllList             AzureResourceManager
Cmdlet          Get-AzureVirtualMachineScaleSetList                AzureResourceManager
Cmdlet          Get-AzureVirtualMachineScaleSetNextList            AzureResourceManager
Cmdlet          Get-AzureVirtualMachineScaleSetSkusList            AzureResourceManager
Cmdlet          Get-AzureVirtualMachineScaleSetVM                  AzureResourceManager
Cmdlet          Get-AzureVirtualMachineScaleSetVMInstanceView      AzureResourceManager
Cmdlet          Get-AzureVirtualMachineScaleSetVMList              AzureResourceManager
Cmdlet          New-AzureVirtualMachineScaleSet                    AzureResourceManager
Cmdlet          Remove-AzureVirtualMachineScaleSet                 AzureResourceManager
Cmdlet          Remove-AzureVirtualMachineScaleSetInstances        AzureResourceManager
Cmdlet          Remove-AzureVirtualMachineScaleSetVM               AzureResourceManager
Cmdlet          Restart-AzureVirtualMachineScaleSet                AzureResourceManager
Cmdlet          Restart-AzureVirtualMachineScaleSetInstances       AzureResourceManager
Cmdlet          Restart-AzureVirtualMachineScaleSetVM              AzureResourceManager
Cmdlet          Start-AzureVirtualMachineScaleSet                  AzureResourceManager
Cmdlet          Start-AzureVirtualMachineScaleSetInstances         AzureResourceManager
Cmdlet          Start-AzureVirtualMachineScaleSetVM                AzureResourceManager
Cmdlet          Stop-AzureVirtualMachineScaleSet                   AzureResourceManager
Cmdlet          Stop-AzureVirtualMachineScaleSetInstances          AzureResourceManager
Cmdlet          Stop-AzureVirtualMachineScaleSetInstancesWithDe... AzureResourceManager
Cmdlet          Stop-AzureVirtualMachineScaleSetVM                 AzureResourceManager
Cmdlet          Stop-AzureVirtualMachineScaleSetVMWithDeallocation AzureResourceManager
Cmdlet          Stop-AzureVirtualMachineScaleSetWithDeallocation   AzureResourceManager
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
        $vmss.VirtualMachineProfile.Extensions = $null;
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

        $st = New-AzureVirtualMachineScaleSet -ResourceGroupName $rgname -VirtualMachineScaleSetCreateOrUpdateParameters $vmss;
        $vmssResult = Get-AzureVirtualMachineScaleSet -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
        Assert-True { $vmss.Name -eq $vmssResult.VirtualMachineScaleSet.Name };

        # List All
        $vmssList = Get-AzureVirtualMachineScaleSetAllList -VirtualMachineScaleSetListAllParameters $null;
        Assert-True { ($vmssList.VirtualMachineScaleSets | select -ExpandProperty Name) -contains $vmss.Name };

        # List from RG
        $vmssList = Get-AzureVirtualMachineScaleSetList -ResourceGroupName $rgname;
        Assert-True { ($vmssList.VirtualMachineScaleSets | select -ExpandProperty Name) -contains $vmss.Name };

        # List Skus
        $skuList = Get-AzureVirtualMachineScaleSetSkusList -ResourceGroupName $rgname  -VMScaleSetName $vmss.Name;

        # List All VMs
        $vmListParams = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetVMListParameters;
        $vmListParams.ResourceGroupName = $rgname;
        $vmListParams.VirtualMachineScaleSetName = $vmss.Name;
        $vmListResult = Get-AzureVirtualMachineScaleSetVMList -VirtualMachineScaleSetVMListParameters $vmListParams;
        $vmList = $vmListResult.VirtualMachineScaleSetVMs;

        # List each VM
        for ($i = 0; $i -lt $vmList.Count; $i++)
        {
            $vm = Get-AzureVirtualMachineScaleSetVM -ResourceGroupName $rgname  -VMScaleSetName $vmss.Name -InstanceId $i;
            Assert-NotNull $vm.VirtualMachineScaleSetVM;
            $vmInstance = Get-AzureVirtualMachineScaleSetVMInstanceView  -ResourceGroupName $rgname  -VMScaleSetName $vmss.Name -InstanceId $i;
            Assert-NotNull $vmInstance.VirtualMachineScaleSetVMInstanceView;
        }

        # List Next (negative test)
        Assert-ThrowsContains { Get-AzureVirtualMachineScaleSetNextList -NextLink test.com  } "Invalid URI: The format of the URI could not be determined.";

        # Stop/Start/Restart Operation
        for ($i = 0; $i -lt $vmList.Count; $i++)
        {
            $st = Stop-AzureVirtualMachineScaleSetVM -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -InstanceId $i;
            $st = Stop-AzureVirtualMachineScaleSetVMWithDeallocation -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -InstanceId $i;
            $st = Start-AzureVirtualMachineScaleSetVM -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -InstanceId $i;
            $st = Restart-AzureVirtualMachineScaleSetVM -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -InstanceId $i;
        }

        $st = Stop-AzureVirtualMachineScaleSet -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
        $st = Stop-AzureVirtualMachineScaleSetWithDeallocation -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
        $st = Start-AzureVirtualMachineScaleSet -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
        $st = Restart-AzureVirtualMachineScaleSet -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;

        $instanceListParam = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetVMInstanceIDs;
        for ($i = 0; $i -lt $vmList.Count; $i++)
        {
            $instanceListParam.InstanceIDs.Add($i);
        }
        $st = Stop-AzureVirtualMachineScaleSetInstances -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -VMInstanceIDs $instanceListParam;
        $st = Stop-AzureVirtualMachineScaleSetInstancesWithDeallocation -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -VMInstanceIDs $instanceListParam;
        $st = Start-AzureVirtualMachineScaleSetInstances -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -VMInstanceIDs $instanceListParam;
        $st = Restart-AzureVirtualMachineScaleSetInstances -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -VMInstanceIDs $instanceListParam;

        # Remove
        $instanceListParam = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetVMInstanceIDs;
        $instanceListParam.InstanceIDs.Add(1);
        $st = Remove-AzureVirtualMachineScaleSetInstances -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -VMInstanceIDs $instanceListParam;
        Assert-ThrowsContains { $st = Remove-AzureVirtualMachineScaleSetVM -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -InstanceId 0 } "cannot be deleted because it is the last remaining";
        $st = Remove-AzureVirtualMachineScaleSet -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
    }
    finally
    {
        # Cleanup
        Clean-ResourceGroup $rgname
    }
}
