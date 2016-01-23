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

function Contains-OnlyStringFields
{
    param(
        [Parameter(Mandatory = $True)]
        [System.Type]$parameterType
    )

    if ($parameterType -eq $null)
    {
        return $false;
    }

    if ($parameterType.BaseType.IsEquivalentTo([System.Enum]))
    {
        return $false;
    }

    $result = $true;

    foreach ($propItem in $parameterType.GetProperties())
    {
        if (-not ($propItem.PropertyType.IsEquivalentTo([string])))
        {
            $result = $false;
        }
    }

    return $result;
}

function Contains-OnlyStringList
{
    param(
        [Parameter(Mandatory = $True)]
        [System.Type]$parameterType
    )

    if ($parameterType -eq $null)
    {
        return $false;
    }

    if ($parameterType.BaseType.IsEquivalentTo([System.Enum]))
    {
        return $false;
    }

    if ($parameterType.GetProperties().Count -ne 1)
    {
        return $false;
    }
    else
    {
        [System.Reflection.PropertyInfo]$propInfoItem = ($parameterType.GetProperties())[0];
        if ($propInfoItem.PropertyType.FullName.StartsWith("System.Collections.Generic.IList"))
        {
            [System.Type]$itemType = $propInfoItem.PropertyType.GenericTypeArguments[0];
            if ($itemType.IsEquivalentTo([string]))
            {
                return $true;
            }
        }

        return $false;
    }
}

function Contains-OnlySimpleFields
{
    param(
        [Parameter(Mandatory = $True)]
        [System.Type]$parameterType,

        [Parameter(Mandatory = $True)]
        [System.String]$namespace
    )

    if ($parameterType -eq $null)
    {
        return $false;
    }

    if ($parameterType.BaseType.IsEquivalentTo([System.Enum]))
    {
        return $false;
    }

    $result = $true;

    foreach ($propItem in $parameterType.GetProperties())
    {
        if ($propItem.PropertyType.Namespace -like "*$namespace*")
        {
            $result = $false;
        }

        if ($propItem.PropertyType.Namespace -like "System.Collections.Generic")
        {
            if ($propItem.PropertyType -like "*$namespace*")
            {
                $result = $false;
            }
        }
    }

    return $result;
}

function Get-SpecificSubNode
{
    param(
        [Parameter(Mandatory = $True)]
        $TreeNode,
        [Parameter(Mandatory = $True)]
        [System.String] $typeName
    )

    foreach ($subNode in $TreeNode.SubNodes)
    {
         if ($subNode.Name -eq $typeName)
         {
              return $subNode;
         }
    }

    return $null;
}

# This function returns the first descendant without a single comlex property.
# The returned node contains either more than one properties or single simple property.
function Get-NonSingleComplexDescendant
{
     param(
        [Parameter(Mandatory = $True)]
        $TreeNode,
        [Parameter(Mandatory = $True)]
        $chainArray
     )

     if ($TreeNode.OnlySimple)
     {
        return @{Node = $TreeNode;Chain = $chainArray};
     }

     if ($TreeNode.Properties.Count -eq 1)
     {
          $subNode = Get-SpecificSubNode $TreeNode $TreeNode.Properties[0]["Name"]

          $chainArray += $TreeNode.Name;
          $result = Get-NonSingleComplexDescendant $subNode $chainArray;

          return @{Node = $result["Node"];Chain = $result["Chain"]};
     }
     else
     {
         return @{Node = $TreeNode;Chain = $chainArray};
     }
}
