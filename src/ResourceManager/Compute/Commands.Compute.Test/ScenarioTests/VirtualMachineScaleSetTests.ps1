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

PS C:\> Get-Command *VMSS* | ft Name,Version,ModuleName

Name                                            Version ModuleName
----                                            ------- ----------
Add-AzureRmVmssAdditionalUnattendContent        1.2.3   AzureRM.Compute
Add-AzureRmVmssExtension                        1.2.3   AzureRM.Compute
Add-AzureRmVMSshPublicKey                       1.2.3   AzureRM.Compute
Add-AzureRmVmssListener                         1.2.3   AzureRM.Compute
Add-AzureRmVmssNetworkInterfaceConfiguration    1.2.3   AzureRM.Compute
Add-AzureRmVmssPublicKey                        1.2.3   AzureRM.Compute
Add-AzureRmVmssSecret                           1.2.3   AzureRM.Compute
Get-AzureRmVmss                                 1.2.3   AzureRM.Compute
Get-AzureRmVmssSkusList                         1.2.3   AzureRM.Compute
Get-AzureRmVmssVM                               1.2.3   AzureRM.Compute
New-AzureRmVmss                                 1.2.3   AzureRM.Compute
New-AzureRmVmssConfig                           1.2.3   AzureRM.Compute
New-AzureRmVmssIpConfigurationConfig            1.2.3   AzureRM.Compute
New-AzureRmVmssVaultCertificateConfig           1.2.3   AzureRM.Compute
Remove-AzureRmVmss                              1.2.3   AzureRM.Compute
Remove-AzureRmVmssAdditionalUnattendContent     1.2.3   AzureRM.Compute
Remove-AzureRmVmssExtension                     1.2.3   AzureRM.Compute
Remove-AzureRmVmssInstances                     1.2.3   AzureRM.Compute
Remove-AzureRmVmssListener                      1.2.3   AzureRM.Compute
Remove-AzureRmVmssNetworkInterfaceConfiguration 1.2.3   AzureRM.Compute
Remove-AzureRmVmssPublicKey                     1.2.3   AzureRM.Compute
Remove-AzureRmVmssSecret                        1.2.3   AzureRM.Compute
Remove-AzureRmVmssVM                            1.2.3   AzureRM.Compute
Restart-AzureRmVmss                             1.2.3   AzureRM.Compute
Restart-AzureRmVmssVM                           1.2.3   AzureRM.Compute
Set-AzureRmVmssOsProfile                        1.2.3   AzureRM.Compute
Set-AzureRmVmssStorageProfile                   1.2.3   AzureRM.Compute
Start-AzureRmVmss                               1.2.3   AzureRM.Compute
Start-AzureRmVmssVM                             1.2.3   AzureRM.Compute
Stop-AzureRmVmss                                1.2.3   AzureRM.Compute
Stop-AzureRmVmssVM                              1.2.3   AzureRM.Compute
Update-AzureRmVmssInstances                     1.2.3   AzureRM.Compute
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

        $ipCfg = New-AzureRmVmssIPConfigurationConfig -Name 'test' -LoadBalancerBackendAddressPoolsId $null -SubnetId $subnetId;
        $vmss = New-AzureRmVmssConfig -Location $loc -SkuCapacity 2 -SkuName 'Standard_A0' -UpgradePolicyMode 'automatic' -NetworkInterfaceConfiguration $netCfg `
            | Add-AzureRmVmssNetworkInterfaceConfiguration -Name 'test' -Primary $true -IPConfiguration $ipCfg `
            | Set-AzureRmVmssOSProfile -ComputerNamePrefix 'test' -AdminUsername $adminUsername -AdminPassword $adminPassword `
            | Set-AzureRmVmssStorageProfile -Name 'test' -CreateOption 'FromImage' -Caching 'None' `
            -ImageReferenceOffer $imgRef.Offer -ImageReferenceSku $imgRef.Skus -ImageReferenceVersion $imgRef.Version `
            -ImageReferencePublisher $imgRef.PublisherName -VhdContainer $vhdContainer `
            | Add-AzureRmVmssAdditionalUnattendContent -ComponentName  $aucComponentName -Content  $aucContent -PassName  $aucPassName -SettingName  $aucSetting `
            | Remove-AzureRmVmssAdditionalUnattendContent -ComponentName  $aucComponentName;

        $st = New-AzureRmVmss -ResourceGroupName $rgname -Name $vmssName -VirtualMachineScaleSetCreateOrUpdateParameter $vmss;

        Write-Verbose ('Running Command : ' + 'Get-AzureRmVmss');
        $vmssResult = Get-AzureRmVmss -ResourceGroupName $rgname -VMScaleSetName $vmssName;
        Assert-True { $vmssName -eq $vmssResult.Name };
        $output = $vmssResult | Out-String;
        Write-Verbose ($output);
        Assert-True { $output.Contains("VirtualMachineProfile") };

        # List All
        Write-Verbose ('Running Command : ' + 'Get-AzureRmVmssAllList');

        $argList = New-AzureComputeArgumentList -MethodName VirtualMachineScaleSetsListAll;
        $args = ($argList | select -ExpandProperty Value);
        $vmssList = Get-AzureRmVmss;
        Assert-True { ($vmssList | select -ExpandProperty Name) -contains $vmssName };
        $output = $vmssList | Out-String;
        Write-Verbose ($output);
        Assert-True { $output.Contains("VirtualMachineProfile") };

        # List from RG
        Write-Verbose ('Running Command : ' + 'Get-AzureRmVmss List');
        $vmssList = Get-AzureRmVmss -ResourceGroupName $rgname;
        Assert-True { ($vmssList | select -ExpandProperty Name) -contains $vmssName };
        $output = $vmssList | Out-String;
        Write-Verbose ($output);
        Assert-True { $output.Contains("VirtualMachineProfile") };

        # List Skus
        Write-Verbose ('Running Command : ' + 'Get-AzureRmVmssSkusList');
        $skuList = Get-AzureRmVmssSkusList -ResourceGroupName $rgname  -VMScaleSetName $vmssName;
        $output = $skuList | Out-String;
        Write-Verbose ($output);
        Assert-True { $output.Contains("Sku") };

        # List All VMs
        Write-Verbose ('Running Command : ' + 'Get-AzureRmVmssVM List');

        $argList = New-AzureComputeArgumentList -MethodName VirtualMachineScaleSetVMsList;
        $argList[0].Value = $rgname;
        $argList[1].Value = $vmssName;
        $args = ($argList | select -ExpandProperty Value);
        $vmListResult = Get-AzureRmVmssVM -ResourceGroupName $rgname -VMScaleSetName $vmssName; # -Select $null;
        $output = $vmListResult | Out-String;
        Write-Verbose ($output);
        Assert-True { $output.Contains("StorageProfile") };

        # List each VM
        for ($i = 0; $i -lt 2; $i++)
        {
            Write-Verbose ('Running Command : ' + 'Get-AzureRmVmssVM');
            $vm = Get-AzureRmVmssVM -ResourceGroupName $rgname  -VMScaleSetName $vmssName -InstanceId $i;
            Assert-NotNull $vm;
            $output = $vm | Out-String;
            Write-Verbose ($output);
            Assert-True { $output.Contains("StorageProfile") };

            Write-Verbose ('Running Command : ' + 'Get-AzureRmVmssVM -InstanceView');
            $vmInstance = Get-AzureRmVmssVM -InstanceView  -ResourceGroupName $rgname  -VMScaleSetName $vmssName -InstanceId $i;
            Assert-NotNull $vmInstance;
            $output = $vmInstance | Out-String;
            Write-Verbose($output);
            Assert-True { $output.Contains("PlatformUpdateDomain") };
        }

        # List Next (negative test)
        # Assert-ThrowsContains { Get-AzureRmVmssNextList -NextPageLink test.com  } "Invalid URI: The format of the URI could not be determined.";

        # Stop/Start/Restart Operation
        for ($i = 0; $i -lt 2; $i++)
        {
            $st = Stop-AzureRmVmssVM -StayProvision -ResourceGroupName $rgname -VMScaleSetName $vmssName -InstanceId $i;
            $st = Stop-AzureRmVmssVM -ResourceGroupName $rgname -VMScaleSetName $vmssName -InstanceId $i;
            $st = Start-AzureRmVmssVM -ResourceGroupName $rgname -VMScaleSetName $vmssName -InstanceId $i;
            $st = Restart-AzureRmVmssVM -ResourceGroupName $rgname -VMScaleSetName $vmssName -InstanceId $i;
        }

        $st = Stop-AzureRmVmss -StayProvision -ResourceGroupName $rgname -VMScaleSetName $vmssName;
        $st = Stop-AzureRmVmss -ResourceGroupName $rgname -VMScaleSetName $vmssName;
        $st = Start-AzureRmVmss -ResourceGroupName $rgname -VMScaleSetName $vmssName;
        $st = Restart-AzureRmVmss -ResourceGroupName $rgname -VMScaleSetName $vmssName;

        $instanceListParam = @();
        for ($i = 0; $i -lt 2; $i++)
        {
            $instanceListParam += $i.ToString();
        }

        $st = Stop-AzureRmVmss -StayProvision -ResourceGroupName $rgname -VMScaleSetName $vmssName -InstanceID $instanceListParam;
        $st = Stop-AzureRmVmss -ResourceGroupName $rgname -VMScaleSetName $vmssName -InstanceID $instanceListParam;
        $st = Start-AzureRmVmss -ResourceGroupName $rgname -VMScaleSetName $vmssName -InstanceID $instanceListParam;
        $st = Restart-AzureRmVmss -ResourceGroupName $rgname -VMScaleSetName $vmssName -InstanceID $instanceListParam;

        # Remove
        $st = Remove-AzureRmVmssInstances -ResourceGroupName $rgname -VMScaleSetName $vmssName -InstanceID 1;
        Assert-ThrowsContains { $st = Remove-AzureRmVmssVM -ResourceGroupName $rgname -VMScaleSetName $vmssName -InstanceId 0 } "BadRequest";
        $st = Remove-AzureRmVmss -ResourceGroupName $rgname -VMScaleSetName $vmssName;
    }
    finally
    {
        # Cleanup
        Clean-ResourceGroup $rgname
    }
}
