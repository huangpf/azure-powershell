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
Test New-AzureRmVhdVM
#>
function Test-NewAzureRmVhdVM
{
    # Setup
    $rgname = Get-ComputeTestResourceName

    try
    {
        # Common
        [string]$loc = Get-ComputeVMLocation;
        $loc = $loc.Replace(' ', '');

        New-AzureRmResourceGroup -Name $rgname -Location $loc -Force;

        # VM Profile & Hardware
        $vmsize = 'Standard_A4';
        $vmname = 'vm' + $rgname;

        # NRP
        $subnet = New-AzureRmVirtualNetworkSubnetConfig -Name ('subnet' + $rgname) -AddressPrefix "10.0.0.0/24";
        $vnet = New-AzureRmVirtualNetwork -Force -Name ('vnet' + $rgname) -ResourceGroupName $rgname -Location $loc -AddressPrefix "10.0.0.0/16" -Subnet $subnet;
        $vnet = Get-AzureRmVirtualNetwork -Name ('vnet' + $rgname) -ResourceGroupName $rgname;
        $subnetId = $vnet.Subnets[0].Id;
        $pubip = New-AzureRmPublicIpAddress -Force -Name ('pubip' + $rgname) -ResourceGroupName $rgname -Location $loc -AllocationMethod Dynamic -DomainNameLabel ('pubip' + $rgname);
        $pubip = Get-AzureRmPublicIpAddress -Name ('pubip' + $rgname) -ResourceGroupName $rgname;
        $pubipId = $pubip.Id;
        $nic = New-AzureRmNetworkInterface -Force -Name ('nic' + $rgname) -ResourceGroupName $rgname -Location $loc -SubnetId $subnetId -PublicIpAddressId $pubip.Id;
        $nic = Get-AzureRmNetworkInterface -Name ('nic' + $rgname) -ResourceGroupName $rgname;
        $nicId = $nic.Id;

        # Storage Account (SA)
        $stoname = 'sto' + $rgname;
        $stotype = 'Standard_GRS';
        New-AzureRmStorageAccount -ResourceGroupName $rgname -Name $stoname -Location $loc -Type $stotype;
        $stoaccount = Get-AzureRmStorageAccount -ResourceGroupName $rgname -Name $stoname;

        $osDiskName = 'osDisk';
        $osDiskCaching = 'ReadWrite';
        $osDiskVhdUri = "https://$stoname.blob.core.windows.net/test/os.vhd";

        # OS & Image
        $user = "Foo12";
        $password = 'PLACEHOLDER';
        $securePassword = ConvertTo-SecureString $password -AsPlainText -Force;
        $cred = New-Object System.Management.Automation.PSCredential ($user, $securePassword);
        $computerName = 'test';
        $vhdContainer = "https://$stoname.blob.core.windows.net/test";

        $p = New-AzureRmVMConfig -VMName $vmname -VMSize $vmsize `
             | Add-AzureRmVMNetworkInterface -Id $nicId -Primary `
             | Set-AzureRmVMOSDisk -Name $osDiskName -VhdUri $osDiskVhdUri -Caching $osDiskCaching -CreateOption FromImage `
             | Set-AzureRmVMOperatingSystem -Windows -ComputerName $computerName -Credential $cred;

        $imgRef = Get-DefaultCRPImage -loc $loc;
        $imgRef | Set-AzureRmVMSourceImage -VM $p | New-AzureRmVM -ResourceGroupName $rgname -Location $loc;

        # Get VM
        $vm1 = Get-AzureRmVM -Name $vmname -ResourceGroupName $rgname;

        # Create VHD VM
        $vmname2 = 'v2' + $rgname;
        $vhd1 = $osDiskVhdUri;
        $vhd2 = $osDiskVhdUri;
        
        if ((Get-ComputeTestMode) -ne 'Record')
        {
            $st = New-AzureRmVhdVM -ResourceGroupName $rgName -VMName $vmname2 -Location $loc -OSType Windows -DiskLink $vhd1,$vhd2 -NoDiskLinkExistenceCheck;
        }
        else
        {
            $st = New-AzureRmVhdVM -ResourceGroupName $rgName -VMName $vmname2 -Location $loc -OSType Windows -DiskLink $vhd1,$vhd2;
        }
        $vm2 = Get-AzureRmVM -Name $vmname2 -ResourceGroupName $rgname;
        Assert-AreEqual $vm2.Name $vmname2;
    }
    finally
    {
        # Cleanup
        Clean-ResourceGroup $rgname
    }
}


<#
.SYNOPSIS
Test New-AzureRmVhdVM with invalid disk files
#>
function Test-NewAzureRmVhdVMWithInvalidDiskFiles
{
    # Setup
    $rgname = Get-ComputeTestResourceName

    try
    {
        # Create fake VHD files
        [string]$file1 = ".\test1.vhd";
        $st = Set-Content -Path $file1 -Value "test1" -Force;
        [string]$file2 = ".\test2.vhd";
        $st = Set-Content -Path $file2 -Value "test2" -Force;

        # Common
        [string]$loc = Get-ComputeVMLocation;
        $loc = $loc.Replace(' ', '');

        # Try create VM using VHD files
        $expectedException = $false;
        try
        {
            $st = New-AzureRmVhdVM -ResourceGroupName $rgName -VMName $rgName -Location $loc -OSType Windows -DiskFile $file1,$file2;
        }
        catch
        {
            if ($_ -like "*unsupported format*")
            {
                $expectedException = $true;
            }
        }
        
        if (-not $expectedException)
        {
            throw "Expected exception from calling New-AzureRmVhdVM was not caught.";
        }
    }
    finally
    {
        # Cleanup
        Clean-ResourceGroup $rgname;
    }
}


<#
.SYNOPSIS
Test Move VM scripts
#>
function Test-MoveVM
{
    $scriptExists = Test-Path $PSScriptRoot\Move-AzureRmVhdVM.ps1;
    Assert-AreEqual $true $scriptExists;

    # Mock
    function Login-AzureRmAccount {};
    function Get-AzureRmVM {};
    function Get-VM([string]$ComputeName, [string]$Name = $null)
    {
        # Mock hard drive objects
        $hd1 = New-Object –TypeName PSObject;
        $hd1 | Add-Member –MemberType NoteProperty –Name Path –Value "$PSScriptRoot\hd1.vhd";
        $hd2 = New-Object –TypeName PSObject;
        $hd2 | Add-Member –MemberType NoteProperty –Name Path –Value "$PSScriptRoot\hd2.vhd";
        
        # Mock VM objects
        $vmObj1 = New-Object –TypeName PSObject;
        $vmObj1 | Add-Member –MemberType NoteProperty –Name Name –Value $Name;
        $vmObj1 | Add-Member –MemberType NoteProperty –Name HardDrives –Value (New-object System.Collections.Arraylist);
        $vmObj1.HardDrives.Add($hd1);
        $vmObj1.HardDrives.Add($hd2);
        $vmObj2 = New-Object –TypeName PSObject;
        $vmObj2 | Add-Member –MemberType NoteProperty –Name Name –Value ($Name + 'test');
        $vmObj2 | Add-Member –MemberType NoteProperty –Name HardDrives –Value (New-object System.Collections.Arraylist);
        $vmObj2.HardDrives.Add($hd2);
        $vmObj2.HardDrives.Add($hd1);

        if ([string]::IsNullOrEmpty($vmName))
        {
            return @($vmObj2, $vmObj1);
        }
        else
        {
            return $vmObj1;
        }
    }
    function Export-VM($ComputerName, $Name, $Path)
    {
        $exportVhdDir = Join-Path (Join-Path $Path $Name) 'Virtual Hard Disks';
        $st = mkdir -Force $exportVhdDir;
        $mockVM = Get-VM $ComputerName $Name;
        foreach ($hd in $mockVM.HardDrives)
        {
            $st = Set-Content -Force -Path (Join-Path $exportVhdDir (Split-Path -Leaf -Path $hd.Path)) -Value 'hd';
        }
        $object = New-Object –TypeName PSObject;
        $object | Add-Member –MemberType NoteProperty –Name State –Value 'Completed';
        return $object;
    }

    # Import Move VM functions
    . $PSScriptRoot\Move-AzureRmVhdVM.ps1;
    Try-LoginAzureRmAccount;

    # Test Export VM
    Assert-AreEqual $true (Try-GetHyperVVM "localhost" "test");
    $disks = Export-VMWithProgress 'a' 'b' $PSScriptRoot;
    Assert-AreEqual 2 $disks.Count;

    # Test Move VM
    Move-AzureRmVhdVM -HyperVVMName 'test123' -ExportPath '.' -Location 'westus';
    Move-AzureRmVhdVM -HyperVVMName 'test123' -ExportPath '.' -Location 'westus' -HyperVServer 'localhost' -ResourceGroupName 'testrg' -OSType 'Windows';
}
