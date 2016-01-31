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

    if ($parameterType -eq $null -or $parameterType.BaseType -eq $null)
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

    if ($parameterType -eq $null -or $parameterType.BaseType -eq $null)
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


function Get-NormalizedTypeName
{
    param(
        # Sample: 'System.String' => 'string', 'System.Boolean' => bool, etc.
        [Parameter(Mandatory = $true)]
        [System.Reflection.TypeInfo]$parameter_type
    )

    if ($parameter_type.IsGenericType -and $parameter_type.GenericTypeArguments.Count -eq 1)
    {
        $generic_item_type = $parameter_type.GenericTypeArguments[0];
        if (($generic_item_type.FullName -eq 'System.String') -or ($generic_item_type.Name -eq 'string'))
        {
            return 'System.Collections.Generic.IList<string>';
        }
    }

    [string]$inputName = $parameter_type.FullName;
    
    if ([string]::IsNullOrEmpty($inputName))
    {
        return $inputName;
    }

    $outputName = $inputName;
    $client_model_namespace_prefix = $client_model_namespace + '.';

    if ($inputName -eq 'System.String')
    {
        $outputName = 'string';
    }
    elseif ($inputName -eq 'System.Boolean')
    {
        $outputName = 'bool';
    }
    elseif ($inputName -eq 'System.DateTime')
    {
        return 'DateTime';
    }
    elseif ($inputName -eq 'System.Int32')
    {
        return 'int';
    }
    elseif ($inputName -eq 'System.UInt32')
    {
        return 'uint';
    }
    elseif ($inputName -eq 'System.Char')
    {
        return 'char';
    }
    elseif ($inputName.StartsWith($client_model_namespace_prefix))
    {
        $outputName = $inputName.Substring($client_model_namespace_prefix.Length);
    }

    $outputName = $outputName.Replace('+', '.');

    return $outputName;
}

function Is-ListStringType
{
    # This function returns $true if the given property info contains only a list of strings.
    param(
        [Parameter(Mandatory = $true)]
        [System.Reflection.TypeInfo]$parameter_type
    )

    if ($parameter_type.IsGenericType -and $parameter_type.GenericTypeArguments.Count -eq 1)
    {
        $generic_item_type = $parameter_type.GenericTypeArguments[0];
        if ($generic_item_type.FullName -eq 'System.String')
        {
            return $true;
        }
        elseif ($generic_item_type.Name -eq 'string')
        {
            return $true;
        }
    }
    
    [System.Reflection.PropertyInfo[]]$property_info_array = $parameter_type.GetProperties();
    if ($property_info_array.Count -eq 1)
    {
        if ($property_info_array[0].PropertyType.FullName -like '*List*System.String*')
        {
          return $true;
        }
        elseif ($property_info_array[0].PropertyType.FullName -eq 'System.String')
        {
          return $true;
        }
        
    }

    return $false;
}

function Get-StringTypes
{
    # This function returns an array of string types, if a given property info array contains only string types.
    # It returns $null, otherwise.
    param(
        [Parameter(Mandatory = $True)]
        [System.Reflection.TypeInfo]$parameter_type
    )
    
    if ($parameter_type.IsGenericType)
    {
        return $null;
    }

    [System.Reflection.PropertyInfo[]]$property_info_array = $parameter_type.GetProperties();
    $return_string_array = @();
    foreach ($prop in $property_info_array)
    {
         if ($prop.PropertyType.FullName -eq "System.String")
         {
              $return_string_array += $prop.Name;
         }
         else
         {
              return $null;
         }
    }

    return $return_string_array;
}


function Get-ConstructorCodeByNormalizedTypeName
{
    param(
        # Sample: 'string' => 'string.Empty', 'HostedServiceCreateParameters' => 'new HostedServiceCreateParameters()', etc.
        [Parameter(Mandatory = $True)]
        [string]$inputName
    )

    if ([string]::IsNullOrEmpty($inputName))
    {
        return 'null';
    }

    if ($inputName -eq 'string')
    {
        $outputName = 'string.Empty';
    }
    else
    {
        if ($inputName.StartsWith($client_model_namespace + "."))
        {
            $inputName = $inputName.Replace($client_model_namespace + ".", '');
        }
        elseif ($inputName.StartsWith('System.Collections.Generic.'))
        {
            $inputName = $inputName.Replace('System.Collections.Generic.', '');
        }

        $outputName = 'new ' + $inputName + "()";
    }

    return $outputName;
}

# Sample: ServiceName, DeploymentName
function Is-PipingPropertyName
{
    param(
        [Parameter(Mandatory = $True)]
        [string]$parameterName
    )

    if ($parameterName.ToLower() -eq 'servicename')
    {
        return $true;
    }
    elseif ($parameterName.ToLower() -eq 'deploymentname')
    {
        return $true;
    }
    elseif ($parameterName.ToLower() -eq 'rolename')
    {
        return $true;
    }
    elseif ($parameterName.ToLower() -eq 'roleinstancename')
    {
        return $true;
    }
    elseif ($parameterName.ToLower() -eq 'vmimagename')
    {
        return $true;
    }
    elseif ($parameterName.ToLower() -eq 'imagename')
    {
        return $true;
    }
    elseif ($parameterName.ToLower() -eq 'diskname')
    {
        return $true;
    }

    return $false;
}

function Is-PipingPropertyTypeName
{
    param(
        [Parameter(Mandatory = $True)]
        [string]$parameterTypeName
    )
    
    if ($parameterTypeName.ToLower() -eq 'string')
    {
        return $true;
    }
    elseif ($parameterTypeName.ToLower() -eq 'system.string')
    {
        return $true;
    }

    return $false;
}

function Get-VerbTermNameAndSuffix
{
    param(
        [Parameter(Mandatory = $True)]
        [string]$MethodName
    )

    $verb = $MethodName;
    $suffix = $null;

    foreach ($key in $common_verb_mapping.Keys)
    {
        if ($MethodName.StartsWith($key))
        {
            $verb = $common_verb_mapping[$key];
            $suffix = $MethodName.Substring($key.Length);

            if ($MethodName.StartsWith('List'))
            {
                $suffix += 'List';
            }
            elseif ($MethodName.StartsWith('Deallocate'))
            {
                $suffix += "WithDeallocation";
            }

            break;
        }
    }

    Write-Output $verb;
    Write-Output $suffix;
}

function Get-ShortNounName
{
    param(
        [Parameter(Mandatory = $True)]
        [string]$inputNoun
    )

    $noun = $inputNoun;

    foreach ($key in $common_noun_mapping.Keys)
    {
        if ($noun -like ("*${key}*"))
        {
            $noun = $noun.Replace($key, $common_noun_mapping[$key]);
        }
    }

    Write-Output $noun;
}
