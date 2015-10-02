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
    [string]$ParameterName = $null,

    [Parameter(Mandatory = $false)]
    [string]$CmdletNounPrefix = "Azure"
)

function New-ParameterCmdletTreeNode()
{
    param ([string]$Name, [System.Type]$TypeInfo, $Parent)
    
    $node = New-Object PSObject;
    $node | Add-Member -Type NoteProperty -Name Name -Value $Name;
    $node | Add-Member -Type NoteProperty -Name Parent -Value $Parent;
    $node | Add-Member -Type NoteProperty -Name Properties -Value @();
    $node | Add-Member -Type NoteProperty -Name SubNodes -Value @();
    
    return $node;
}

function Create-ParameterCmdletTreeImpl
{
    param(
        [Parameter(Mandatory = $true)]
        [System.Type]$TypeInfo,

        [Parameter(Mandatory = $false)]
        $Parent = $null,
        
        [Parameter(Mandatory = $false)]
        [string]$ParameterName = $null,

        [Parameter(Mandatory = $false)]
        [int]$Depth = 0
    )
    
    if ([string]::IsNullOrEmpty($typeInfo.FullName))
    {
        return $null;
    }
    elseif (-not $typeInfo.FullName.StartsWith($NameSpace + "."))
    {
        return $null;
    }

    $treeNode = New-ParameterCmdletTreeNode $ParameterName $TypeInfo $Parent;
    
    $padding = ($Depth.ToString() + (' ' * (4 * ($Depth + 1))));
    Write-Verbose ($padding + $treeNode.Name);
    Write-Verbose ($padding + "T: " + $treeNode);
    Write-Verbose ($padding + "P: " + $Parent);

    foreach ($item in $TypeInfo.GetProperties())
    {
        $itemProp = [System.Reflection.PropertyInfo]$item;

        if ($itemProp.PropertyType.FullName.StartsWith($NameSpace + "."))
        {
            $subTreeNode = Create-ParameterCmdletTreeImpl $itemProp.PropertyType $treeNode $itemProp.Name ($Depth + 1);
            if ($subTreeNode -ne $null)
            {
                $treeNode.SubNodes += $subTreeNode;
            }
        }
        elseif ($itemProp.PropertyType.FullName.StartsWith("System.Collections.Generic.IList"))
        {
            $listItemType = $itemProp.PropertyType.GenericTypeArguments[0];
            
            Write-Verbose ($padding + '-' + $listItemType.Name + "List");

            $subTreeNode = Create-ParameterCmdletTreeImpl $listItemType $treeNode $itemProp.Name ($Depth + 1)
            if ($subTreeNode -ne $null)
            {
                $treeNode.SubNodes += $subTreeNode;
            }
        }
        else
        {
            $nodeProp = @{ Name = $itemProp.Name; Type = $itemProp.PropertyType };
            $treeNode.Properties += $nodeProp;
            Write-Verbose ($padding + '-' + $nodeProp["Name"] + " : " + $nodeProp["Type"]);
        }
    }

    return $treeNode;
}

Write-Output (Create-ParameterCmdletTreeImpl $TypeInfo $null $ParameterName 0);
