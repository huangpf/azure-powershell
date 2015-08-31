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
Cmdlet          Remove-AzureVirtualMachineScaleSetVM               AzureResourceManager
Cmdlet          Restart-AzureVirtualMachineScaleSet                AzureResourceManager
Cmdlet          Restart-AzureVirtualMachineScaleSetVM              AzureResourceManager
Cmdlet          Start-AzureVirtualMachineScaleSet                  AzureResourceManager
Cmdlet          Start-AzureVirtualMachineScaleSetVM                AzureResourceManager
Cmdlet          Stop-AzureVirtualMachineScaleSet                   AzureResourceManager
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
        New-AzureResourceGroup -Name $rgname -Location $loc -Force;

        # NRP
        $subnet = New-AzureVirtualNetworkSubnetConfig -Name ('subnet' + $rgname) -AddressPrefix "10.0.0.0/24";
        $vnet = New-AzureVirtualNetwork -Force -Name ('vnet' + $rgname) -ResourceGroupName $rgname -Location $loc -AddressPrefix "10.0.0.0/16" -DnsServer "10.1.1.1" -Subnet $subnet;
        $vnet = Get-AzureVirtualNetwork -Name ('vnet' + $rgname) -ResourceGroupName $rgname;
        $subnetId = $vnet.Subnets[0].Id;
        $pubip = New-AzurePublicIpAddress -Force -Name ('pubip' + $rgname) -ResourceGroupName $rgname -Location $loc -AllocationMethod Dynamic -DomainNameLabel ('pubip' + $rgname);
        $pubip = Get-AzurePublicIpAddress -Name ('pubip' + $rgname) -ResourceGroupName $rgname;
        $pubipId = $pubip.Id;
        $nic = New-AzureNetworkInterface -Force -Name ('nic' + $rgname) -ResourceGroupName $rgname -Location $loc -SubnetId $subnetId -PublicIpAddressId $pubip.Id;
        $nic = Get-AzureNetworkInterface -Name ('nic' + $rgname) -ResourceGroupName $rgname;
        $nicId = $nic.Id;

        # SRP
        $stoname = 'sto' + $rgname;
        $stotype = 'Standard_GRS';
        New-AzureStorageAccount -ResourceGroupName $rgname -Name $stoname -Location $loc -Type $stotype;
        $stoaccount = Get-AzureStorageAccount -ResourceGroupName $rgname -Name $stoname;

        # New VMSS Parameters
        $vmss = New-AzureComputeParameterObject -FullName Microsoft.Azure.Management.Compute.Models.VirtualMachineScaleSet;
        $vmss.Name = 'vmss' + $rgname;
        $vmss.Type = 'Microsoft.Compute/virtualMachineScaleSets';
        $vmss.Location = $loc;

        $vmss.NetworkProfile = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetNetworkProfile;

        $ipCfg = New-Object Microsoft.Azure.Management.Compute.Models.VirtualMachineScaleSetIPConfiguration;
        $ipcfg.Name = 'test';
        $ipCfg.LoadBalancerBackendAddressPools = $null;
        $ipCfg.Subnet = New-Object Microsoft.Azure.Management.Compute.Models.ApiEntityReference;
        $ipCfg.Subnet.ReferenceUri = $subnetId;
        $netCfg = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetNetworkConfiguration;
        $netCfg.Name = 'test';
        $netCfg.Primary = $true;
        $netCfg.IPConfigurations.Add($ipCfg);
        $vmss.NetworkProfile.NetworkConfigurations.Add($netCfg);

        $vmss.Sku = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetSku;
        $vmss.Sku.Capacity = 2;
        $vmss.Sku.Name = $vmsize;

        $vmss.VirtualMachineProfile = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetVMProfile;
        $vmss.VirtualMachineProfile.Extensions = $null;
        $vmss.VirtualMachineProfile.OSProfile = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetOSProfile;
        $vmss.VirtualMachineProfile.OSProfile.ComputerNamePrefix = 'test';
        $vmss.VirtualMachineProfile.OSProfile.AdminUsername = 'Foo12';
        $vmss.VirtualMachineProfile.OSProfile.AdminPassword = "BaR@123" + $rgname;

        $vmss.VirtualMachineProfile.StorageProfile = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetStorageProfile;
        $imgRef = Get-DefaultCRPImage -loc $loc;
        $vmss.VirtualMachineProfile.StorageProfile.ImageReference = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetImageReference;
        $vmss.VirtualMachineProfile.StorageProfile.ImageReference.Publisher = $imgRef.Publisher;
        $vmss.VirtualMachineProfile.StorageProfile.ImageReference.Offer = $imgRef.Offer;
        $vmss.VirtualMachineProfile.StorageProfile.ImageReference.Sku = $imgRef.Skus;
        $vmss.VirtualMachineProfile.StorageProfile.ImageReference.Version = $imgRef.Version;
        $vmss.VirtualMachineProfile.StorageProfile.OSDisk = New-AzureComputeParameterObject -FriendlyName VirtualMachineScaleSetOSDisk;
        $vmss.VirtualMachineProfile.StorageProfile.OSDisk.Caching = 'None';
        $vmss.VirtualMachineProfile.StorageProfile.OSDisk.CreateOption = 'FromImage';
        $vmss.VirtualMachineProfile.StorageProfile.OSDisk.Name = 'test';
        $vmss.VirtualMachineProfile.StorageProfile.OSDisk.OperatingSystemType = 'Windows';
        $vhdContainer = "https://" + $stoname + ".blob.core.windows.net/" + $vmssname;
        $vmss.VirtualMachineProfile.StorageProfile.OSDisk.VirtualHardDiskContainers.Add($vhdContainer);

        # $st = New-AzureVirtualMachineScaleSet -ResourceGroupName $rgname -VirtualMachineScaleSetCreateOrUpdateParameters $vmss;
        # $vmssResult = Get-AzureVirtualMachineScaleSet -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
        # Assert-True { $vmss.Name -eq $vmssResult.Name };

        # List All
        $all_vmss = Get-AzureVirtualMachineScaleSetAllList -VirtualMachineScaleSetListAllParameters $null;
    }
    finally
    {
        # Cleanup
        Clean-ResourceGroup $rgname
    }
}
