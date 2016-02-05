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

param(
    [Parameter(Mandatory = $true)]
    [System.Type]$TypeInfo,
    
    [Parameter(Mandatory = $true)]
    [string]$NameSpace,
    
    [Parameter(Mandatory = $false)]
    [string]$ParameterName = $null
)

. "$PSScriptRoot\ParameterTypeHelper.ps1";

function New-ParameterTreeNode
{
    param ([string]$Name, [System.Type]$TypeInfo, $Parent)
    
    $node = New-Object PSObject;
    $node | Add-Member -Type NoteProperty -Name Name -Value $Name;
    $node | Add-Member -Type NoteProperty -Name TypeInfo -Value $TypeInfo;
    $node | Add-Member -Type NoteProperty -Name Parent -Value $Parent;
    $node | Add-Member -Type NoteProperty -Name IsListItem -Value $false;
    $node | Add-Member -Type NoteProperty -Name AllStrings -Value $false;
    $node | Add-Member -Type NoteProperty -Name OneStringList -Value $false;
    $node | Add-Member -Type NoteProperty -Name OnlySimple -Value $false;
    $node | Add-Member -Type NoteProperty -Name Properties -Value @();
    $node | Add-Member -Type NoteProperty -Name SubNodes -Value @();
    $node | Add-Member -Type NoteProperty -Name IsPrimitive -Value $false;
    $node | Add-Member -Type NoteProperty -Name IsReference -Value $false;
    
    return $node;
}

function Create-ParameterTreeImpl
{
    param(
        [Parameter(Mandatory = $false)]
        [string]$ParameterName = $null,

        [Parameter(Mandatory = $true)]
        [System.Type]$TypeInfo,

        [Parameter(Mandatory = $true)]
        [System.Collections.Hashtable]$TypeList,
        
        [Parameter(Mandatory = $false)]
        $Parent = $null,

        [Parameter(Mandatory = $false)]
        [int]$Depth = 0
    )

    if ([string]::IsNullOrEmpty($TypeInfo.FullName))
    {
        return $null;
    }

    if (-not $TypeInfo.FullName.StartsWith($NameSpace + "."))
    {
        $node = New-ParameterTreeNode $ParameterName $TypeInfo $Parent;
        return $node;
    }
    else
    {
        if ($TypeList.ContainsKey($TypeInfo.FullName))
        {
            $treeNode = New-ParameterTreeNode $ParameterName $TypeInfo $Parent;
            $treeNode.IsReference = $true;
            return $treeNode;
        }
        else
        {
            if ($TypeInfo.FullName -like "Microsoft.*Azure.Management.*.*")
            {
                $TypeList.Add($TypeInfo.FullName, $TypeInfo);
            }
        
            $treeNode = New-ParameterTreeNode $ParameterName $TypeInfo $Parent;
            if (Contains-OnlyStringFields $TypeInfo)
            {
                $treeNode.AllStrings = $true;
            }
            elseif (Contains-OnlyStringList $TypeInfo)
            {
                $treeNode.OneStringList = $true;
            }

            if (Contains-OnlySimpleFields $TypeInfo $NameSpace)
            {
                $treeNode.OnlySimple = $true;
            }

            $padding = ($Depth.ToString() + (' ' * (4 * ($Depth + 1))));
            if ($Depth -gt 0)
            {
                Write-Verbose ($padding + "-----------------------------------------------------------");
            }

            if ($treeNode.AllStrings)
            {
                $annotation = " *";
            }
            elseif ($treeNode.OneStringList)
            {
                $annotation = " ^";
            }

            Write-Verbose ($padding + "[ Node ] " + $treeNode.Name + $annotation);
            Write-Verbose ($padding + "[Parent] " + $Parent.Name);

            foreach ($item in $TypeInfo.GetProperties())
            {
                $itemProp = [System.Reflection.PropertyInfo]$item;
                $nodeProp = @{ Name = $itemProp.Name; Type = $itemProp.PropertyType };
                $treeNode.Properties += $nodeProp;

                if ($itemProp.PropertyType.FullName.StartsWith($NameSpace + "."))
                {
                    # Model Class Type - Recursive Call
                    $subTreeNode = Create-ParameterTreeImpl $itemProp.Name $itemProp.PropertyType $TypeList $treeNode ($Depth + 1);
                    if ($subTreeNode -ne $null)
                    {
                        $treeNode.SubNodes += $subTreeNode;
                    }
                }
                elseif ($itemProp.PropertyType.FullName.StartsWith("System.Collections.Generic.IList"))
                {
                    # List Type
                    $listItemType = $itemProp.PropertyType.GenericTypeArguments[0];
                    if ($TypeList.ContainsKey($listItemType.FullName))
                    {
                      $refSuffix = "`'";
                    }
                    Write-Verbose ($padding + '-' + $itemProp.Name + ' : [List] ' + $listItemType.Name + $refSuffix);

                    # ListItem is Model Class Type - Recursive Call
                    $subTreeNode = Create-ParameterTreeImpl $itemProp.Name $listItemType $TypeList $treeNode ($Depth + 1)
                    if ($subTreeNode -ne $null)
                    {
                        $subTreeNode.IsListItem = $true;
                        $treeNode.SubNodes += $subTreeNode;
                    }
                }
                else
                {
                    if ($nodeProp["Type"].IsEquivalentTo([System.Nullable[long]]) -or
                        $nodeProp["Type"].IsEquivalentTo([System.Nullable[bool]]))
                    {
                        $nodeProp["IsPrimitive"] = $true;
                    }

                    # Primitive Type, e.g. int, string, Dictionary<string, string>, etc.
                    Write-Verbose ($padding + '-' + $nodeProp["Name"] + " : " + $nodeProp["Type"]);
                }
            }

            return $treeNode;
        }
    }
}

Write-Output (Create-ParameterTreeImpl $ParameterName $TypeInfo @{});
