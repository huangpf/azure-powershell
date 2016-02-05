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

function Get-NormalizedName
{
    param(
        # Sample: 'vmName' => 'VMName', 'resourceGroup' => 'ResourceGroup', etc.
        [Parameter(Mandatory = $True)]
        [string]$inputName
    )

    if ([string]::IsNullOrEmpty($inputName))
    {
        return $inputName;
    }

    if ($inputName.StartsWith('vm'))
    {
        $outputName = 'VM' + $inputName.Substring(2);
    }
    else
    {
        [char]$firstChar = $inputName[0];
        $firstChar = [System.Char]::ToUpper($firstChar);
        $outputName = $firstChar + $inputName.Substring(1);
    }

    return $outputName;
}

function Get-CliNormalizedName
{
    # Sample: 'VMName' to 'vmName', 'VirtualMachine' => 'virtualMachine', 'ResourceGroup' => 'resourceGroup', etc.
    param(
        [Parameter(Mandatory = $True)]
        [string]$inName
    )

    if ([string]::IsNullOrEmpty($inName))
    {
        return $inName;
    }

    if ($inName.StartsWith('VM'))
    {
        $outName = 'vm' + $inName.Substring(2);
    }
    elseif ($inName.StartsWith('IP'))
    {
        $outName = 'ip' + $inName.Substring(2);
    }
    elseif ($inName.StartsWith('DNS'))
    {
        $outName = 'dns' + $inName.Substring(3);
    }
    else
    {
        [char]$firstChar = $inName[0];
        $firstChar = [System.Char]::ToLower($firstChar);
        $outName = $firstChar + $inName.Substring(1);
    }

    if ($outName.EndsWith('IDs'))
    {
        $outName = $outName.Substring(0, $outName.Length - 3) + 'Ids';
    }

    return $outName;
}


function Get-CliCategoryName
{
    # Sample: 'VirtualMachineScaleSetVM' => 'vmssvm', 'VirtualMachineScaleSet' => 'vmss', etc.
    param(
        [Parameter(Mandatory = $True)]
        [string]$inName
    )

    if ($inName -eq 'VirtualMachineScaleSet')
    {
        $outName = 'vmss';
    }
    elseif ($inName -eq 'VirtualMachineScaleSetVM')
    {
        $outName = 'vmssvm';
    }
    if ($inName -eq 'VirtualMachineScaleSets')
    {
        $outName = 'vmss';
    }
    elseif ($inName -eq 'VirtualMachineScaleSetVMs')
    {
        $outName = 'vmssvm';
    }
    else
    {
        $outName = Get-CliOptionName $inName;
    }

    return $outName;
}

function Get-PowershellCategoryName
{
    # Sample: 'VirtualMachineScaleSetVM' => 'VmssVm', 'VirtualMachineScaleSet' => 'Vmss', etc.
    param(
        [Parameter(Mandatory = $True)]
        [string]$inName
    )

    if ($inName -eq 'VirtualMachineScaleSet')
    {
        $outName = 'Vmss';
    }
    elseif ($inName -eq 'VirtualMachineScaleSetVM')
    {
        $outName = 'VmssVm';
    }
    else
    {
        $outName = Get-CliOptionName $inName;
    }

    return $outName;
}


function Get-CliOptionName
{
    # Sample: 'VMName' to 'vmName', 'VirtualMachine' => 'virtual-machine', 'ResourceGroup' => 'resource-group', etc.
    param(
        [Parameter(Mandatory = $True)]
        [string]$inName
    )

    if ([string]::IsNullOrEmpty($inName))
    {
        return $inName;
    }

    [string]$varName = Get-CliNormalizedName $inName;
    [string]$outName = $null;

    $i = 0;
    while ($i -lt $varName.Length)
    {
        if ($i -eq 0 -or [char]::IsUpper($varName[$i]))
        {
            if ($i -gt 0)
            {
                # Sample: "parameter-..."
                $outName += '-';
            }

            [string[]]$abbrWords = @('VM', 'IP', 'RM', 'OS', 'NAT', 'IDs', 'DNS');
            $matched = $false;
            foreach ($matchedAbbr in $abbrWords)
            {
                if ($varName.Substring($i) -like ("${matchedAbbr}*"))
                {
                    $matched = $true;
                    break;
                }
            }

            if ($matched)
            {
                $outName += $matchedAbbr.ToLower();
                $i = $i + $matchedAbbr.Length;
            }
            else
            {
                $j = $i + 1;
                while (($j -lt $varName.Length) -and [char]::IsLower($varName[$j]))
                {
                    $j++;
                }

                $outName += $varName.Substring($i, $j - $i).ToLower();
                $i = $j;
            }
        }
        else
        {
            $i++;
        }
    }

    return $outName;
}

function Get-CliShorthandName
{
    # Sample: 'ResourceGroupName' => '-g', 'Name' => '-n', etc.
    param(
        [Parameter(Mandatory = $True)]
        [string]$inName
    )

    if ($inName -eq 'ResourceGroupName')
    {
        $outName = 'g';
    }
    elseif ($inName -eq 'Name')
    {
        $outName = 'n';
    }
    elseif ($inName -eq 'VMName')
    {
        $outName = 'n';
    }
    elseif ($inName -eq 'VMScaleSetName')
    {
        $outName = 'n';
    }
    elseif ($inName -eq 'VirtualMachineScaleSetName')
    {
        $outName = 'n';
    }
    elseif ($inName -eq 'instanceId')
    {
        $outName = 'd';
    }
    elseif ($inName -eq 'vmInstanceIDs')
    {
        $outName = 'D';
    }
    elseif ($inName -eq 'parameters')
    {
        $outName = 'p';
    }
    elseif ($inName -eq 'ExpandExpression')
    {
        $outName = 'e';
    }
    elseif ($inName -eq 'FilterExpression')
    {
        $outName = 't';
    }
    elseif ($inName -eq 'SelectExpression')
    {
        $outName = 'c';
    }
    else
    {
        $outName = '';
    }

    return $outName;
}

function Get-SplitTextLines
{
    # Sample: 'A Very Long Text.' => @('A Very ', 'Long Text.');
    param(
        [Parameter(Mandatory = $true)]
        [string]$text,
        
        [Parameter(Mandatory = $false)]
        [int]$lineWidth
    )

    if ($text -eq '' -or $text -eq $null -or $text.Length -le $lineWidth)
    {
        return $text;
    }

    $lines = @();

    while ($text.Length -gt $lineWidth)
    {
        $lines += $text.Substring(0, $lineWidth);
        $text = $text.Substring($lineWidth);
    }
    
    if ($text -ne '' -and $text -ne $null)
    {
        $lines += $text;
    }

    return $lines;
}

function Get-SingularNoun
{
    param(
        [Parameter(Mandatory = $true)]
        [string]$noun
    )

    if ($noun -eq $null)
    {
        return $noun;
    }

    if ($noun.ToLower().EndsWith("address"))
    {
        return $noun;
    }

    if ($noun.EndsWith("s"))
    {
        return $noun.Substring(0, $noun.Length - 1);
    }
    else
    {
        return $noun;
    }
}

function Get-ComponentName
{
    # Sample: "Microsoft.Azure.Management.Compute";
    param
    (
        [Parameter(Mandatory = $true)]
        [string]$clientNS
    )
    
    if ($clientNS.EndsWith('.Model') -or $clientNS.EndsWith('.Models'))
    {
        $clientNS = $clientNS.Substring(0, $clientNS.LastIndexOf('.'));
    }
    
    return $clientNS.Substring($clientNS.LastIndexOf('.') + 1);
}
