<#
.ExternalHelp AzureRM.Compute.ManagedService-help.xml
#>

function Move-AzureRmVhdVM
{
    param
    (
        [Parameter(ParameterSetName = 'HyperV', Mandatory = $true)]
        [string]$HyperVVMName,
        
        [Parameter(ParameterSetName = 'HyperV', Mandatory = $true)]
        [string]$ExportPath,
        
        [Parameter(ParameterSetName = 'HyperV', Mandatory = $true)]
        [string]$Location,
        
        [Parameter(ParameterSetName = 'HyperV', Mandatory = $false)]
        [string]$HyperVServer = 'localhost',

        [Parameter(Mandatory = $false)]
        [string]$ResourceGroupName = '',
        
        [Parameter(Mandatory = $false)]
        [string]$OSType = 'Windows'
    )

    $ErrorActionPreference = 'Stop';
    Try-LoginAzureRmAccount;
    if (-not $?)
    {
        Write-Warning "Error occurred while trying to login to AzureRM account. Exit.";
        return;
    }

    [string[]]$diskFiles = @();
    if (-not [string]::IsNullOrEmpty($HyperVVMName))
    {
        if (-not (Try-GetHyperVVM $HyperVServer $HyperVVMName))
        {
            Write-Host "Exit.";
            return;
        }
        $osName = Get-VMOperatingSystemName $HyperVServer $HyperVVMName;

        $vhdxFolder = Join-Path $ExportPath "${HyperVVMName}\Virtual Hard Disks";
        [string[]]$vhdFiles = @();
        if (Test-Path $vhdxFolder)
        {
            Write-Warning "Export path already exists '$vhdxFolder'; please delete & retry...";
            return;
        }
        else
        {
            $vhdFiles = Export-VMWithProgress $HyperVServer $HyperVVMName $ExportPath;
        }

        # Convert the various VHD/VHDX file formats to fixed VHD files
        $convertedVhdPath = Join-Path $vhdxFolder "converted";
        mkdir $convertedVhdPath -Force;

        foreach ($vhdFile in $vhdFiles)
        {
            $vhdFileName = Split-Path -Leaf -Path $vhdFile;
            $destFile = Join-Path $convertedVhdPath $vhdFileName.Replace('.vhdx', '.vhd');
            Write-Host "Converting '$($vhdFile)' to '$destFile'...";
            if (Test-Path $destFile)
            {
                Write-Warning "Path already exists '$destFile'; please delete & retry...";
            }
            else
            {
                Convert-VHD -Path $vhdFile -DestinationPath $destFile;
            }
            $diskFiles += $destFile;
        }
    }

    if ($diskFiles.Count -ge 1)
    {
        $rgName = $ResourceGroupName;
        if ([string]::IsNullOrEmpty($rgName))
        {
            $rgName = ($HyperVVMName + (date).Ticks).Substring(0, 21);
        }
        New-AzureRmVhdVM -ResourceGroupName $rgName -Location $Location -OSType $OSType -DiskFile $diskFiles;
    }
    else
    {
        Write-Warning "Cannot find the VHD files for VM '$HyperVVMName'. Exit.";
    }
}

function Get-VMOperatingSystemName($computerNameInput, $hyperVVMNameInput)
{
    # Filter for parsing XML data
    filter Import-CimXml
    {
        # Create new XML object from input
        $CimXml = [Xml]$_;
        $CimObj = New-Object -TypeName System.Object;

        # Iterate over the data and pull out just the value name and data for each entry
        foreach ($CimProperty in $CimXml.SelectNodes("/INSTANCE/PROPERTY[@NAME='Name']"))
        {
            $CimObj | Add-Member -MemberType NoteProperty -Name $CimProperty.NAME -Value $CimProperty.VALUE;
        }

        foreach ($CimProperty in $CimXml.SelectNodes("/INSTANCE/PROPERTY[@NAME='Data']")) 
        {
            $CimObj | Add-Member -MemberType NoteProperty -Name $CimProperty.NAME -Value $CimProperty.VALUE;
        }
        # Display output
        $CimObj;
    }

    # Get the virtual machine object
    $query = "Select * From Msvm_ComputerSystem Where ElementName='" + $hyperVVMNameInput + "'";
    $Vm = gwmi -Namespace root\virtualization\v2 -Query $query -ComputerName $computerNameInput;

    # Get the KVP Object
    $query = "Associators of {$Vm} Where AssocClass=Msvm_SystemDevice ResultClass=Msvm_KvpExchangeComponent";
    $Kvp = gwmi -Namespace root\virtualization\v2 -Query $query -ComputerName $computerNameInput;

    #Write-Host "Guest KVP information for: '$hyperVVMNameInput'";

    # Filter the results
    try
    {
        $osNameItem = $Kvp.GuestIntrinsicExchangeItems | Import-CimXml | where Name -eq "OSName";
        Write-Output $osNameItem.Data;
    }
    catch
    {
        Write-Verbose "OS type name not found...";
    }
}

function Export-VMWithProgress($computerName, $vmName, $exportDir)
{
    # Record the supposed to be exported VHD files first
    $vmObj = Get-VM -ComputerName $computerName -Name $vmName;
    if (-not $vmObj.HardDrives -or $vmObj.HardDrives.Count -le 0)
    {
        throw "No hard drives can be found from VM '$vmName'...";
    }
    [string[]]$vmDiskFileNames = @();
    foreach ($hd in $vmObj.HardDrives)
    {
        $vmDiskFileNames += (Split-Path -Path $hd.Path -Leaf);
    }
    
    # Start the real export process
    $exportJob = Export-VM -ComputerName $computerName -Name $vmName -Path $exportDir -AsJob;
    while( $exportJob.State -eq "Running" -or $exportJob.State -eq "NotStarted") 
    {
        Write-Host ("[Export] " + $($exportJob.Progress.PercentComplete) + "% completed...");
        sleep(5);
    }

    if($exportJob.State -ne "Completed")
    {
        Write-Error ("Export-VM did not complete: " + $exportJob.State);
        throw $exportJob.Error;
    }
  
    # Construct the final VHD file paths
    [string[]]$vhdFiles = @();
    foreach ($fileName in $vmDiskFileNames)
    {
        $vhdFullName = Join-Path (Join-Path (Join-Path $exportDir $vmName) 'Virtual Hard Disks') $fileName;
        if (-not (Test-Path $vhdFullName))
        {
            throw "The VHD file '$vhdFullName' should have been exported, but it cannot be found.";
        }
        $vhdFiles += $vhdFullName;
    }
    Write-Host "Exported VHD files: '$vhdFiles'";
    return $vhdFiles;
}

function Try-GetHyperVVM($computerName, $hvvmName)
{
    if ([string]::IsNullOrEmpty($computerName))
    {
        throw "Hyper-V computer name cannot be null or empty: '$computerName'.";
    }
    if ([string]::IsNullOrEmpty($hvvmName))
    {
        throw "Hyper-V VM name cannot be null or empty: '$hvvmName'.";
    }

    try
    {
        $allVMs = Get-VM -ComputerName $computerName;
        $hvvm = $allVMs | where {$_.Name -eq $hvvmName};
        if ($hvvm -ne $null)
        {
            Write-Host ("Found Hyper-V VM by name '$hvvmName': " + $hvvm);
            return $true;
        }
        else
        {
            Write-Warning ("Cannot find Hyper-V VM by name '$hvvmName'...");
            return $false;
        }
    }
    catch
    {
        throw;
    }
}

function Try-LoginAzureRmAccount
{
    try
    {
        $st = Get-AzureRmVM;
    }
    catch
    {
        if ($_ -like "*The Azure PowerShell session has not been properly initialized.*")
        {
            Login-AzureRmAccount;
        }
        elseif ($_ -like "*No account found in the context. Please login using Login-AzureRMAccount.*")
        {
            Login-AzureRmAccount;
        }
        else
        {
            throw;
        }
    }
}

#Export-ModuleMember -Function Move-AzureRmVhdVM
