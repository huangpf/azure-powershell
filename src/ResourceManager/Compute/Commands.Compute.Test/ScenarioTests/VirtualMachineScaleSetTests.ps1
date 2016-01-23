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
Cmdlet          Add-AzureRmVMSshPublicKey                          0.10.1     AzureRM.Compute
Cmdlet          Get-AzureRmVmss                                    0.10.1     AzureRM.Compute
Cmdlet          Get-AzureRmVmssAllList                             0.10.1     AzureRM.Compute
Cmdlet          Get-AzureRmVmssInstanceView                        0.10.1     AzureRM.Compute
Cmdlet          Get-AzureRmVmssList                                0.10.1     AzureRM.Compute
Cmdlet          Get-AzureRmVmssNextList                            0.10.1     AzureRM.Compute
Cmdlet          Get-AzureRmVmssSkusList                            0.10.1     AzureRM.Compute
Cmdlet          Get-AzureRmVmssVM                                  0.10.1     AzureRM.Compute
Cmdlet          Get-AzureRmVmssVMInstanceView                      0.10.1     AzureRM.Compute
Cmdlet          Get-AzureRmVmssVMList                              0.10.1     AzureRM.Compute
Cmdlet          New-AzureRmVmss                                    0.10.1     AzureRM.Compute
Cmdlet          Remove-AzureRmVmss                                 0.10.1     AzureRM.Compute
Cmdlet          Remove-AzureRmVmssInstances                        0.10.1     AzureRM.Compute
Cmdlet          Remove-AzureRmVmssVM                               0.10.1     AzureRM.Compute
Cmdlet          Restart-AzureRmVmss                                0.10.1     AzureRM.Compute
Cmdlet          Restart-AzureRmVmssInstances                       0.10.1     AzureRM.Compute
Cmdlet          Restart-AzureRmVmssVM                              0.10.1     AzureRM.Compute
Cmdlet          Start-AzureRmVmss                                  0.10.1     AzureRM.Compute
Cmdlet          Start-AzureRmVmssInstances                         0.10.1     AzureRM.Compute
Cmdlet          Start-AzureRmVmssVM                                0.10.1     AzureRM.Compute
Cmdlet          Stop-AzureRmVmss                                   0.10.1     AzureRM.Compute
Cmdlet          Stop-AzureRmVmssInstances                          0.10.1     AzureRM.Compute
Cmdlet          Stop-AzureRmVmssInstancesWithDeallocation          0.10.1     AzureRM.Compute
Cmdlet          Stop-AzureRmVmssVM                                 0.10.1     AzureRM.Compute
Cmdlet          Stop-AzureRmVmssVMWithDeallocation                 0.10.1     AzureRM.Compute
Cmdlet          Stop-AzureRmVmssWithDeallocation                   0.10.1     AzureRM.Compute
Cmdlet          Update-AzureRmVmssInstances                        0.10.1     AzureRM.Compute
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
        $vmssName = 'vmss' + $rgname;
        $vmssType = 'Microsoft.Compute/virtualMachineScaleSets';

        $adminUsername = 'Foo12';
        $adminPassword = "BaR@123" + $rgname;

        $imgRef = Get-DefaultCRPImage -loc $loc;
        $vhdContainer = "https://" + $stoname + ".blob.core.windows.net/" + $vmssName;

        $aucComponentName="Microsoft-Windows-Shell-Setup";
        $aucPassName ="oobeSystem";
        $aucSetting = "AutoLogon";
        $aucContent = "<UserAccounts><AdministratorPassword><Value>password</Value><PlainText>true</PlainText></AdministratorPassword></UserAccounts>";

        $ipCfg = New-AzureVmssIPConfigurationsConfig -Name 'test' -LoadBalancerBackendAddressPoolsReferenceUri $null -SubnetReferenceUri $subnetId;

        $vmss = New-AzureVmssConfig -Name $vmssName -Type $vmssType -Location $loc `
            -SkuCapacity 2 -SkuName 'Standard_A0' -UpgradePolicyMode 'automatic' -NetworkInterfaceConfigurations $netCfg `
            | Add-AzureVmssNetworkInterfaceConfiguration -Name 'test' -Primary $true -IPConfigurations $ipCfg `
            | Set-AzureVmssOSProfile -ComputerNamePrefix 'test' -AdminUsername $adminUsername -AdminPassword $adminPassword `
            | Set-AzureVmssStorageProfile -Name 'test' -CreateOption 'FromImage' -Caching 'None' `
            -ImageReferenceOffer $imgRef.Offer -ImageReferenceSku $imgRef.Skus -ImageReferenceVersion $imgRef.Version `
            -ImageReferencePublisher $imgRef.PublisherName -VirtualHardDiskContainers $vhdContainer `
            | Add-AzureVmssAdditionalUnattendContent -ComponentName  $aucComponentName -Content  $aucContent -PassName  $aucPassName -SettingName  $aucSetting `
            | Remove-AzureVmssAdditionalUnattendContent -ComponentName  $aucComponentName;

        $st = New-AzureRmVmss -ResourceGroupName $rgname -VirtualMachineScaleSetCreateOrUpdateParameters $vmss;

        Write-Verbose ('Running Command : ' + 'Get-AzureRmVmss');
        $vmssResult = Get-AzureRmVmss -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
        Assert-True { $vmss.Name -eq $vmssResult.VirtualMachineScaleSet.Name };
        $output = $vmssResult | Out-String;
        Write-Verbose ($output);
        Assert-True { $output.Contains("VirtualMachineScaleSet") };

        # List All
        Write-Verbose ('Running Command : ' + 'Get-AzureRmVmssAllList');

        $argList = New-AzureComputeArgumentList -MethodName VirtualMachineScaleSetListAll;
        $args = ($argList | select -ExpandProperty Value);
        $vmssList = Get-AzureRmVmssAllList;
        Assert-True { ($vmssList.VirtualMachineScaleSets | select -ExpandProperty Name) -contains $vmss.Name };
        $output = $vmssList | Out-String;
        Write-Verbose ($output);
        Assert-True { $output.Contains("VirtualMachineScaleSets") };

        # List from RG
        Write-Verbose ('Running Command : ' + 'Get-AzureRmVmssList');
        $vmssList = Get-AzureRmVmssList -ResourceGroupName $rgname;
        Assert-True { ($vmssList.VirtualMachineScaleSets | select -ExpandProperty Name) -contains $vmss.Name };
        $output = $vmssList | Out-String;
        Write-Verbose ($output);
        Assert-True { $output.Contains("VirtualMachineScaleSet") };

        # List Skus
        Write-Verbose ('Running Command : ' + 'Get-AzureRmVmssSkusList');
        $skuList = Get-AzureRmVmssSkusList -ResourceGroupName $rgname  -VMScaleSetName $vmss.Name;
        $output = $skuList | Out-String;
        Write-Verbose ($output);
        Assert-True { $output.Contains("VirtualMachineScaleSetSku") };

        # List All VMs
        Write-Verbose ('Running Command : ' + 'Get-AzureRmVmssVMList');

        $argList = New-AzureComputeArgumentList -MethodName VirtualMachineScaleSetVMList;
        $argList[2].Value = $rgname;
        $argList[4].Value = $vmss.Name;
        $args = ($argList | select -ExpandProperty Value);
        $vmListResult = Get-AzureRmVmssVMList -ResourceGroupName $rgname -VirtualMachineScaleSetName $vmss.Name;
        $output = $vmListResult | Out-String;
        Write-Verbose ($output);
        Assert-True { $output.Contains("VirtualMachineScaleSetVM") };

        $vmList = $vmListResult.VirtualMachineScaleSetVMs;

        # List each VM
        for ($i = 0; $i -lt $vmList.Count; $i++)
        {
            Write-Verbose ('Running Command : ' + 'Get-AzureRmVmssVM');
            $vm = Get-AzureRmVmssVM -ResourceGroupName $rgname  -VMScaleSetName $vmss.Name -InstanceId $i;
            Assert-NotNull $vm.VirtualMachineScaleSetVM;
            $output = $vm | Out-String;
            Write-Verbose ($output);
            Assert-True { $output.Contains("VirtualMachineScaleSetVM") };

            Write-Verbose ('Running Command : ' + 'Get-AzureRmVmssVMInstanceView');
            $vmInstance = Get-AzureRmVmssVMInstanceView  -ResourceGroupName $rgname  -VMScaleSetName $vmss.Name -InstanceId $i;
            Assert-NotNull $vmInstance.VirtualMachineScaleSetVMInstanceView;
            $output = $vmInstance | Out-String;
            Write-Verbose($output);
            Assert-True { $output.Contains("VirtualMachineScaleSetVMInstanceView") };
        }

        # List Next (negative test)
        Assert-ThrowsContains { Get-AzureRmVmssNextList -NextLink test.com  } "Invalid URI: The format of the URI could not be determined.";

        # Stop/Start/Restart Operation
        for ($i = 0; $i -lt $vmList.Count; $i++)
        {
            $st = Stop-AzureRmVmssVM -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -InstanceId $i;
            $st = Stop-AzureRmVmssVMWithDeallocation -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -InstanceId $i;
            $st = Start-AzureRmVmssVM -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -InstanceId $i;
            $st = Restart-AzureRmVmssVM -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -InstanceId $i;
        }

        $st = Stop-AzureRmVmss -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
        $st = Stop-AzureRmVmssWithDeallocation -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
        $st = Start-AzureRmVmss -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
        $st = Restart-AzureRmVmss -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;

        $instanceListParam = @();
        for ($i = 0; $i -lt $vmList.Count; $i++)
        {
            $instanceListParam += $i.ToString();
        }

        $st = Stop-AzureRmVmssInstances -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -VMInstanceIDs $instanceListParam;
        $st = Stop-AzureRmVmssInstancesWithDeallocation -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -VMInstanceIDs $instanceListParam;
        $st = Start-AzureRmVmssInstances -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -VMInstanceIDs $instanceListParam;
        $st = Restart-AzureRmVmssInstances -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -VMInstanceIDs $instanceListParam;

        # Remove
        $st = Remove-AzureRmVmssInstances -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -VMInstanceIDs 1;
        Assert-ThrowsContains { $st = Remove-AzureRmVmssVM -ResourceGroupName $rgname -VMScaleSetName $vmss.Name -InstanceId 0 } "cannot be deleted because it is the last remaining";
        $st = Remove-AzureRmVmss -ResourceGroupName $rgname -VMScaleSetName $vmss.Name;
    }
    finally
    {
        # Cleanup
        Clean-ResourceGroup $rgname
    }
}
