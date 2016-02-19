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

param
(
    # VirtualMachine, VirtualMachineScaleSet, etc.
    [Parameter(Mandatory = $true)]
    [string]$OperationName,

    [Parameter(Mandatory = $true)]
    [System.Reflection.MethodInfo]$MethodInfo,
    
    [Parameter(Mandatory = $true)]
    [string]$ModelClassNameSpace,
    
    [Parameter(Mandatory = $true)]
    [string]$FileOutputFolder,

    [Parameter(Mandatory = $false)]
    [System.Reflection.MethodInfo]$FriendMethodInfo = $null
)

. "$PSScriptRoot\Import-StringFunction.ps1";
. "$PSScriptRoot\Import-TypeFunction.ps1";


# Sample: VirtualMachineGetMethod.cs
function Generate-PsFunctionCommandImpl
{
    param
    (
        [Parameter(Mandatory = $true)]
        [string]$opShortName,

        [Parameter(Mandatory = $true)]
        [System.Reflection.MethodInfo]$operation_method_info,

        [Parameter(Mandatory = $true)]
        [string]$fileOutputFolder,

        [Parameter(Mandatory = $false)]
        [System.Reflection.MethodInfo]$FriendMethodInfo = $null
    )

    $componentName = Get-ComponentName $ModelClassNameSpace;
    $invoke_cmdlet_class_name = 'InvokeAzure' + $componentName + 'MethodCmdlet';
    $parameter_cmdlet_class_name = 'NewAzure' + $componentName + 'ArgumentListCmdlet';

    $methodName = ($operation_method_info.Name.Replace('Async', ''));

    $return_type_info = $operation_method_info.ReturnType;
    $normalized_output_type_name = Get-NormalizedTypeName $return_type_info;
    $cmdlet_verb = "Invoke";
    $cmdlet_verb_code = $verbs_lifecycle_invoke;
    $cmdlet_noun_prefix = 'Azure';
    $cmdlet_noun_suffix = 'Method';
    $cmdlet_op_short_name = $opShortName;
    if ($cmdlet_op_short_name.EndsWith("ScaleSets"))
    {
        $cmdlet_op_short_name = $cmdlet_op_short_name.Replace("ScaleSets", "ScaleSet");
    }
    elseif ($cmdlet_op_short_name.EndsWith("ScaleSetVMs"))
    {
        $cmdlet_op_short_name = $cmdlet_op_short_name.Replace("ScaleSetVMs", "ScaleSetVM");
    }
    $cmdlet_noun = $cmdlet_noun_prefix + $cmdlet_op_short_name + $methodName + $cmdlet_noun_suffix;
    $cmdlet_class_name = $cmdlet_verb + $cmdlet_noun;

    $invoke_param_set_name = $cmdlet_op_short_name + $methodName;

    # Process Friend Parameter Set and Method Names
    if ($FriendMethodInfo -ne $null -and $FriendMethodInfo.Name -ne $null)
    {
        $friendMethodName = ($FriendMethodInfo.Name.Replace('Async', ''));
        $friend_param_set_name = $cmdlet_op_short_name + $friendMethodName;
    }

    $file_full_path = $fileOutputFolder + '/' + $cmdlet_class_name + '.cs';
    if (Test-Path $file_full_path)
    {
        return;
    }

    $indents = " " * 8;
    $get_set_block = '{ get; set; }';
    $invoke_input_params_name = 'invokeMethodInputParameters';
    $cmdlet_generated_code = '';

    $method_param_list = $operation_method_info.GetParameters();
    $method_return_type = $operation_method_info.ReturnType;
    [System.Collections.ArrayList]$param_names = @();
    [System.Collections.ArrayList]$pruned_params = @();
    [System.Collections.ArrayList]$invoke_param_names = @();
    [System.Collections.ArrayList]$invoke_local_param_names = @();
    [System.Collections.ArrayList]$create_local_param_names = @();
    [System.Collections.ArrayList]$cli_command_param_names = @();
    $position_index = 1;
    $has_properties = $false;
    foreach ($pt in $method_param_list)
    {
        if (($pt.ParameterType.Name -like "I*Operations") -and ($pt.Name -eq 'operations'))
        {
            continue;
        }
        elseif ($pt.ParameterType.Name.EndsWith('CancellationToken'))
        {
            continue;
        }
        else
        {
            $paramTypeFullName = $pt.ParameterType.FullName;
            $normalized_param_name = Get-CamelCaseName $pt.Name;

            #Write-Verbose ('    ' + $paramTypeFullName + ' ' + $normalized_param_name);

            $paramTypeNormalizedName = Get-NormalizedTypeName $pt.ParameterType;
            $param_constructor_code = Get-ConstructorCodeByNormalizedTypeName -inputName $paramTypeNormalizedName;

            $has_properties = $true;
            $is_string_list = Is-ListStringType $pt.ParameterType;
            $does_contain_only_strings = Get-StringTypes $pt.ParameterType;
            $only_strings = (($does_contain_only_strings -ne $null) -and ($does_contain_only_strings.Count -ne 0));

            $param_attributes = $indents + "[Parameter(Mandatory = true";
            $invoke_param_attributes = $indents + "[Parameter(ParameterSetName = `"${invoke_param_set_name}`", Position = ${position_index}, Mandatory = true";
            if ((Is-PipingPropertyName $normalized_param_name) -and (Is-PipingPropertyTypeName $paramTypeNormalizedName))
            {
                $piping_from_property_name_code = ", ValueFromPipelineByPropertyName = true";
                $param_attributes += $piping_from_property_name_code;

                $invoke_param_attributes += $piping_from_property_name_code;
            }
            $param_attributes += ")]" + $NEW_LINE;
            $invoke_param_attributes += ")]" + $NEW_LINE;
            $param_definition = $indents + "public ${paramTypeNormalizedName} ${normalized_param_name} " + $get_set_block + $NEW_LINE;
            $invoke_param_definition = $indents + "public ${paramTypeNormalizedName} ${invoke_param_set_name}${normalized_param_name} " + $get_set_block + $NEW_LINE;
            $param_index = $position_index - 1;
            if ($only_strings)
            {
                 # Case 1: the parameter type contains only string types.
                 $invoke_local_param_definition = $indents + (' ' * 4) + "var " + $pt.Name + " = new ${paramTypeNormalizedName}();" + $NEW_LINE;

                 foreach ($param in $does_contain_only_strings)
                 {
                      $invoke_local_param_definition += $indents + (' ' * 4) + "var p${param} = (string) ParseParameter(${invoke_input_params_name}[${param_index}]);" + $NEW_LINE;
                      $invoke_local_param_definition += $indents + (' ' * 4) + $pt.Name + ".${param} = string.IsNullOrEmpty(p${param}) ? null : p${param};" + $NEW_LINE;
                      $param_index += 1;
                      $position_index += 1;
                 }
            }
            elseif ($is_string_list)
            {
                # Case 2: the parameter type contains only a list of strings.
                $list_of_strings_property = ($pt.ParameterType.GetProperties())[0].Name;

                $invoke_local_param_definition = $indents + (' ' * 4) + "${paramTypeNormalizedName} " + $pt.Name + " = null;"+ $NEW_LINE;
                $invoke_local_param_definition += $indents + (' ' * 4) + "if (${invoke_input_params_name}[${param_index}] != null)" + $NEW_LINE;
                $invoke_local_param_definition += $indents + (' ' * 4) + "{" + $NEW_LINE;
                $invoke_local_param_definition += $indents + (' ' * 8) + "var inputArray${param_index} = Array.ConvertAll((object[]) ParseParameter(${invoke_input_params_name}[${param_index}]), e => e.ToString());" + $NEW_LINE;                
                if ($paramTypeNormalizedName -like 'System.Collections.Generic.IList*')
                {
                    $invoke_local_param_definition += $indents + (' ' * 8) + $pt.Name + " = inputArray${param_index}.ToList();" + $NEW_LINE;
                }
                else
                {
                    $invoke_local_param_definition += $indents + (' ' * 8) + $pt.Name + " = new ${paramTypeNormalizedName}();" + $NEW_LINE;
                    $invoke_local_param_definition += $indents + (' ' * 8) + $pt.Name + ".${list_of_strings_property} = inputArray${param_index}.ToList();" + $NEW_LINE;
                }
                $invoke_local_param_definition += $indents + (' ' * 4) + "}" + $NEW_LINE;
            }
            else
            {
                # Case 3: this is the most general case.
                if ($normalized_param_name -eq 'ODataQuery')
                {
                    $paramTypeNormalizedName = "Microsoft.Rest.Azure.OData.ODataQuery<VirtualMachineScaleSetVM>";
                    $invoke_local_param_definition = $indents + (' ' * 4) + "${paramTypeNormalizedName} " + $pt.Name + " = (${paramTypeNormalizedName})ParseParameter(${invoke_input_params_name}[${param_index}]);" + $NEW_LINE;
                }
                else
                {
                    $invoke_local_param_definition = $indents + (' ' * 4) + "${paramTypeNormalizedName} " + $pt.Name + " = (${paramTypeNormalizedName})ParseParameter(${invoke_input_params_name}[${param_index}]);" + $NEW_LINE;
                }
            }

            if ($only_strings)
            {
                 $create_local_param_definition = "";
                 # Case 1: the parameter type contains only string types.
                 foreach ($param in $does_contain_only_strings)
                 {
                      $create_local_param_definition += $indents + (' ' * 4) + "var p${param} = string.Empty;" + $NEW_LINE;
                      $param_index += 1;
                      $position_index += 1;
                      $param_names += ${param};
                      $invoke_local_param_names += "p${param}";
                 }
            }
            elseif ($is_string_list)
            {
                 # Case 2: the parameter type contains only a list of strings.
                 $create_local_param_definition = $indents + (' ' * 4) + "var " + $pt.Name + " = new string[0];" + $NEW_LINE;
            }
            elseif ($normalized_param_name -eq 'ODataQuery')
            {
                 # Case 4: Odata, skip for now.
                 $paramTypeNormalizedName = "Microsoft.Rest.Azure.OData.ODataQuery<VirtualMachineScaleSetVM>";
                 $create_local_param_definition = $indents + (' ' * 4) + "$paramTypeNormalizedName " + $pt.Name + " = new ${paramTypeNormalizedName}();" + $NEW_LINE;
            }
            else
            {
                 # Case 4: this is the most general case.
                 $create_local_param_definition = $indents + (' ' * 4) + "${paramTypeNormalizedName} " + $pt.Name + " = ${param_constructor_code};" + $NEW_LINE;
            }

            $param_code_content = $param_attributes + $param_definition;

            # For Invoke Method
            $invoke_param_definition = $indents + "public ${paramTypeNormalizedName} ${invoke_param_set_name}${normalized_param_name} " + $get_set_block + $NEW_LINE;
            $invoke_param_code_content += $invoke_param_attributes + $invoke_param_definition + $NEW_LINE;
            $invoke_local_param_code_content += $invoke_local_param_definition;
            $create_local_param_code_content += $create_local_param_definition;

            $cmdlet_generated_code += $param_code_content + $NEW_LINE;
            
            if ($normalized_param_name -eq 'ODataQuery')
            {
                 $st = $param_names.Add($normalized_param_name);
                 $st = $invoke_local_param_names.Add($pt.Name);
            }
            elseif (-not $only_strings)
            {
                 $st = $param_names.Add($normalized_param_name);
                 $st = $invoke_local_param_names.Add($pt.Name);
            }
            $st = $invoke_param_names.Add($pt.Name);

            $position_index += 1;
            if (-not ($normalized_param_name -eq 'ODataQuery'))
            {
                 $pruned_params.Add($pt);
            }
        }
    }

    $params_join_str = [string]::Join(', ', $param_names.ToArray());
    $invoke_params_join_str = [string]::Join(', ', $invoke_param_names.ToArray());
    $invoke_local_params_join_str = [string]::Join(', ', $invoke_local_param_names.ToArray());

    $invoke_local_param_names_join_str = "`"" + [string]::Join('", "', $param_names.ToArray()) + "`"";

    $cmdlet_client_call_template = '';
    if ($method_return_type.FullName -eq 'System.Void')
    {
      $cmdlet_client_call_template =
@"
        protected override void ProcessRecord()
        {
            base.ProcessRecord();
            ExecuteClientAction(() =>
            {
                ${opShortName}Client.${methodName}(${params_join_str});
            });
        }
"@;
    }
    else
    {
      $cmdlet_client_call_template =
@"
        protected override void ProcessRecord()
        {
            base.ProcessRecord();
            ExecuteClientAction(() =>
            {
                var result = ${opShortName}Client.${methodName}(${params_join_str});
                WriteObject(result);
            });
        }
"@;
    }
    
    $cmdlet_generated_code += $cmdlet_client_call_template;

    $dynamic_param_assignment_code_lines = @();
    $param_index = 1;
    foreach ($pt in $pruned_params)
    {
        $param_type_full_name = $pt.ParameterType.FullName;
        if (($param_type_full_name -like "I*Operations") -and ($param_type_full_name -eq 'operations'))
        {
            continue;
        }
        elseif ($param_type_full_name.EndsWith('CancellationToken'))
        {
            continue;
        }

        $is_string_list = Is-ListStringType $pt.ParameterType;
        $does_contain_only_strings = Get-StringTypes $pt.ParameterType;

        $param_name = Get-CamelCaseName $pt.Name;
        $expose_param_name = $param_name;

        $param_type_full_name = Get-NormalizedTypeName $pt.ParameterType;

        if ($expose_param_name -like '*Parameters')
        {
            $expose_param_name = $invoke_param_set_name + $expose_param_name;
        }

        $expose_param_name = Get-SingularNoun $expose_param_name;

        if (($does_contain_only_strings -eq $null) -or ($does_contain_only_strings.Count -eq 0))
        {
             $dynamic_param_assignment_code_lines +=
@"
            var p${param_name} = new RuntimeDefinedParameter();
            p${param_name}.Name = `"${expose_param_name}`";
"@;

             if ($is_string_list)
             {
                  $dynamic_param_assignment_code_lines += "            p${param_name}.ParameterType = typeof(string[]);";
             }
             else
             {
                  $dynamic_param_assignment_code_lines += "            p${param_name}.ParameterType = typeof($param_type_full_name);";
             }

             $dynamic_param_assignment_code_lines +=
@"
            p${param_name}.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = $param_index,
                Mandatory = false
            });
            p${param_name}.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add(`"${expose_param_name}`", p${param_name});

"@;
            $param_index += 1;
        }
        else
        {
             foreach ($s in $does_contain_only_strings)
             {
                  $s = Get-SingularNoun $s;
                  $dynamic_param_assignment_code_lines +=
@"
            var p${s} = new RuntimeDefinedParameter();
            p${s}.Name = `"${s}`";
            p${s}.ParameterType = typeof(string);
            p${s}.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = $param_index,
                Mandatory = false
            });
            p${s}.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add(`"${s}`", p${s});

"@;
                  $param_index += 1;
             }
        }
    }

    $param_name = $expose_param_name = 'ArgumentList';
    $param_type_full_name = 'object[]';
    $dynamic_param_assignment_code_lines +=
@"
            var p${param_name} = new RuntimeDefinedParameter();
            p${param_name}.Name = `"${expose_param_name}`";
            p${param_name}.ParameterType = typeof($param_type_full_name);
            p${param_name}.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByStaticParameters",
                Position = $param_index,
                Mandatory = true
            });
            p${param_name}.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add(`"${expose_param_name}`", p${param_name});

"@;

    $dynamic_param_assignment_code = [string]::Join($NEW_LINE, $dynamic_param_assignment_code_lines);

    $dynamic_param_source_template =
@"
        protected object Create${invoke_param_set_name}DynamicParameters()
        {
            dynamicParameters = new RuntimeDefinedParameterDictionary();
$dynamic_param_assignment_code
            return dynamicParameters;
        }
"@;

    $invoke_cmdlt_source_template = '';
    if ($method_return_type.FullName -eq 'System.Void')
    {
        $invoke_cmdlt_source_template =
@"
        protected void Execute${invoke_param_set_name}Method(object[] ${invoke_input_params_name})
        {
${invoke_local_param_code_content}
            ${opShortName}Client.${methodName}(${invoke_params_join_str});
        }
"@;
    }
    else
    {
        $invoke_cmdlt_source_template =
@"
        protected void Execute${invoke_param_set_name}Method(object[] ${invoke_input_params_name})
        {
${invoke_local_param_code_content}
            var result = ${opShortName}Client.${methodName}(${invoke_params_join_str});
            WriteObject(result);
        }
"@;
    }

    if ($has_properties)
    {
         $parameter_cmdlt_source_template =
@"
        protected PSArgument[] Create${invoke_param_set_name}Parameters()
        {
${create_local_param_code_content}
            return ConvertFromObjectsToArguments(
                 new string[] { $invoke_local_param_names_join_str },
                 new object[] { ${invoke_local_params_join_str} });
        }
"@;
    }
    else
    {
         $parameter_cmdlt_source_template =
@"
        protected PSArgument[] Create${invoke_param_set_name}Parameters()
        {
            return ConvertFromObjectsToArguments(new string[0], new object[0]);
        }
"@;
    }


    # 1. Invoke Cmdlet Partial Code
    # 2. Param Cmdlet Partial Code
    # 3. Verb Cmdlet Partial Code
    $return_vals = Get-VerbTermNameAndSuffix $methodName;
    $mapped_verb_name = $return_vals[0];
    $mapped_verb_term_suffix = $return_vals[1];
    $shortNounName = Get-ShortNounName $cmdlet_op_short_name;

    $mapped_noun_str = 'AzureRm' + $shortNounName + $mapped_verb_term_suffix;
    $verb_cmdlet_name = $mapped_verb_name + $mapped_noun_str;

    # Construct the Individual Cmdlet Code Content
    $cmdlet_partial_class_code =
@"
    public partial class ${invoke_cmdlet_class_name} : ${component_name}AutomationBaseCmdlet
    {
$dynamic_param_source_template

$invoke_cmdlt_source_template
    }

    public partial class ${parameter_cmdlet_class_name} : ${component_name}AutomationBaseCmdlet
    {
$parameter_cmdlt_source_template
    }
"@;

    if ($cmdletFlavor -eq 'Verb')
    {
        # If the Cmdlet Flavor is 'Verb', generate the Verb-based cmdlet code
        $mapped_noun_str = $mapped_noun_str.Replace("VMSS", "Vmss");
        $cmdlet_partial_class_code +=
@"


    [Cmdlet(`"${mapped_verb_name}`", `"${mapped_noun_str}`", DefaultParameterSetName = `"InvokeByDynamicParameters`")]
    public partial class $verb_cmdlet_name : ${invoke_cmdlet_class_name}
    {
        public $verb_cmdlet_name()
        {
            this.MethodName = `"$invoke_param_set_name`";
        }

        public override string MethodName { get; set; }

        protected override void ProcessRecord()
        {
            base.ProcessRecord();
        }

        public override object GetDynamicParameters()
        {
            dynamicParameters = new RuntimeDefinedParameterDictionary();
$dynamic_param_assignment_code
            return dynamicParameters;
        }
    }
"@;
    }

    $cmdlt_source_template =
@"
${code_common_header}

$code_using_strs

namespace ${code_common_namespace}
{
    [Cmdlet(${cmdlet_verb_code}, `"${cmdlet_noun}`")]
    [OutputType(typeof(${normalized_output_type_name}))]
    public class ${cmdlet_class_name} : ${component_name}AutomationBaseCmdlet
    {
${cmdlet_generated_code}
    }

${cmdlet_partial_class_code}
}
"@;

    $cmdlt_partial_class_source_template =
@"
${code_common_header}

$code_using_strs

namespace ${code_common_namespace}
{
${cmdlet_partial_class_code}
}
"@;

    #$st = Set-Content -Path $file_full_path -Value $cmdlt_source_template -Force;
    $partial_class_file_path = ($file_full_path.Replace('InvokeAzure', ''));
    $st = Set-Content -Path $partial_class_file_path -Value $cmdlt_partial_class_source_template -Force;

    Write-Output $dynamic_param_source_template;
    Write-Output $invoke_cmdlt_source_template;
    Write-Output $parameter_cmdlt_source_template;
}

# azure vm get
function Generate-CliFunctionCommandImpl
{
    param
    (
        # VirtualMachine, VirtualMachineScaleSet, etc.
        [Parameter(Mandatory = $true)]
        [string]$OperationName,

        [Parameter(Mandatory = $true)]
        [System.Reflection.MethodInfo]$MethodInfo,
    
        [Parameter(Mandatory = $true)]
        [string]$ModelNameSpace,

        [Parameter(Mandatory = $false)]
        [string]$FileOutputFolder = $null
    )

    $methodParameters = $MethodInfo.GetParameters();
    $methodName = ($MethodInfo.Name.Replace('Async', ''));
    $methodParamNameList = @();
    $methodParamTypeDict = @{};
    $allStringFieldCheck = @{};
    $oneStringListCheck = @{};

    $componentName = Get-ComponentName $ModelClassNameSpace;
    $componentNameInLowerCase = $componentName.ToLower();

    # 3. CLI Code
    # 3.1 Types
    foreach ($paramItem in $methodParameters)
    {
        [System.Type]$paramType = $paramItem.ParameterType;
        if (($paramType.Name -like "I*Operations") -and ($paramItem.Name -eq 'operations'))
        {
            continue;
        }
        elseif ($paramType.FullName.EndsWith('CancellationToken'))
        {
            continue;
        }
        else
        {
            # Record the Normalized Parameter Name, i.e. 'vmName' => 'VMName', 'resourceGroup' => 'ResourceGroup', etc.
            $methodParamNameList += (Get-CamelCaseName $paramItem.Name);
            $methodParamTypeDict.Add($paramItem.Name, $paramType);
            $allStringFields = Contains-OnlyStringFields $paramType;
            $allStringFieldCheck.Add($paramItem.Name, $allStringFields);
            $oneStringList = Contains-OnlyStringList $paramType;
            $oneStringListCheck.Add($paramItem.Name, $oneStringList);

            if ($paramType.Namespace -like $ModelNameSpace)
            {
                # If the namespace is like 'Microsoft.Azure.Management.*.Models', generate commands for the complex parameter
                
                # 3.1.1 Create the Parameter Object, and convert it to JSON code text format
                $param_object = (. $PSScriptRoot\Create-ParameterObject.ps1 -typeInfo $paramType);
                $param_object_comment = (. $PSScriptRoot\ConvertTo-Json.ps1 -inputObject $param_object -compress $true);
                $param_object_comment_no_compress = (. $PSScriptRoot\ConvertTo-Json.ps1 -inputObject $param_object);
                
                # 3.1.2 Create a parameter tree that represents the complext object
                $cmdlet_tree = (. $PSScriptRoot\Create-ParameterTree.ps1 -TypeInfo $paramType -NameSpace $ModelNameSpace -ParameterName $paramType.Name);

                # 3.1.3 Generate the parameter command according to the parameter tree
                $cmdlet_tree_code = (. $PSScriptRoot\Generate-ParameterCommand.ps1 -CmdletTreeNode $cmdlet_tree -Operation $opShortName -ModelNameSpace $ModelNameSpace -MethodName $methodName -OutputFolder $FileOutputFolder);
            }
        }
    }
    
    # 3.2 Functions
    
    # 3.2.1 Compute the CLI Category Name, i.e. VirtualMachineScaleSet => vmss, VirtualMachineScaleSetVM => vmssvm
    $cliCategoryName = Get-CliCategoryName $OperationName;
    
    # 3.2.2 Compute the CLI Operation Name, i.e. VirtualMachineScaleSets => virtualMachineScaleSets, VirtualMachineScaleSetVM => virtualMachineScaleSetVMs
    $cliOperationName = Get-CliNormalizedName $OperationName;
    
    # 3.2.3 Normalize the CLI Method Name, i.e. CreateOrUpdate => createOrUpdate, ListAll => listAll
    $cliMethodName = Get-CliNormalizedName $methodName;
    $cliCategoryVarName = $cliOperationName + $methodName;
    $cliMethodOption = Get-CliOptionName $methodName;

    # 3.2.4 Compute the CLI Command Description, i.e. VirtualMachineScaleSet => virtual machine scale set
    $cliOperationDescription = (Get-CliOptionName $OperationName).Replace('-', ' ');
    
    # 3.2.5 Generate the CLI Command Comment
    $cliOperationComment = "/*" + $NEW_LINE;
    $cliOperationComment += "  " + $OperationName + " " + $methodName + $NEW_LINE;
    for ($index = 0; $index -lt $methodParamNameList.Count; $index++)
    {
        $cli_option_name = Get-CliOptionName $methodParamNameList[$index];
        $cliOperationComment += "  --" + (Get-CliOptionName $methodParamNameList[$index]) + $NEW_LINE;
    }

    if ($param_object_comment_no_compress -ne $null -and $param_object_comment_no_compress.Trim() -ne '')
    {
        $cliOperationComment += $BAR_LINE + $NEW_LINE;
        $cliOperationComment += $param_object_comment_no_compress + $NEW_LINE;
    }

    $cliOperationComment += "*/" + $NEW_LINE;
    
    # 3.2.6 Generate the CLI Command Code
    $code = "";
    $code += $cliOperationComment;

    if ($ModelNameSpace -like "*.WindowsAzure.*")
    {
        # Use Invoke Category for RDFE APIs
        $invoke_category_desc = "Commands to invoke service management operations.";
        $invoke_category_code = ".category('invoke').description('${invoke_category_desc}')";
    }
    
    $code += "  var $cliCategoryVarName = cli${invoke_category_code}.category('${cliCategoryName}')" + $NEW_LINE;

    # 3.2.7 Description Text
    $desc_text = "Commands to manage your ${cliOperationDescription}.";
    $desc_text_lines = Get-SplitTextLines $desc_text 80;
    $code += "  .description(`$('";
    $code += [string]::Join("'" + $NEW_LINE + "  + '", $desc_text_lines);
    $code += "  '));" + $NEW_LINE;

    # Set Required Parameters
    $requireParams = @();
    $requireParamNormalizedNames = @();
    for ($index = 0; $index -lt $methodParamNameList.Count; $index++)
    {
        # Parameter Declaration - For Each Method Parameter
        [string]$optionParamName = $methodParamNameList[$index];
        if ($allStringFieldCheck[$optionParamName])
        {
            [System.Type]$optionParamType = $methodParamTypeDict[$optionParamName];
            foreach ($propItem in $optionParamType.GetProperties())
            {
                [System.Reflection.PropertyInfo]$propInfoItem = $propItem;
                $cli_option_name = Get-CliOptionName $propInfoItem.Name;
                $requireParams += $cli_option_name;
                $requireParamNormalizedNames += (Get-CliNormalizedName $propInfoItem.Name);
            }
        }
        else
        {
            $cli_option_name = Get-CliOptionName $optionParamName;
            $requireParams += $cli_option_name;
            $requireParamNormalizedNames += (Get-CliNormalizedName $optionParamName);
        }
    }

    $requireParamsString = $null;
    $usageParamsString = $null;
    $optionParamString = $null;
    if ($requireParams.Count -gt 0)
    {
        $requireParamsJoinStr = "] [";
        $requireParamsString = " [" + ([string]::Join($requireParamsJoinStr, $requireParams)) + "]";
        $usageParamsJoinStr = "> <";
        $usageParamsString = " <" + ([string]::Join($usageParamsJoinStr, $requireParams)) + ">";
        $optionParamString = ([string]::Join(", ", $requireParamNormalizedNames)) + ", ";
    }


    $code += "  ${cliCategoryVarName}.command('${cliMethodOption}${requireParamsString}')" + $NEW_LINE;
    $code += "  .description(`$('Commands to manage your $cliOperationDescription by the ${cliMethodOption} method.'))" + $NEW_LINE;
    $code += "  .usage('[options]${usageParamsString}')" + $NEW_LINE;
    for ($index = 0; $index -lt $methodParamNameList.Count; $index++)
    {
        # Parameter Declaration - For Each Method Parameter
        [string]$optionParamName = $methodParamNameList[$index];
        $optionShorthandStr = $null;
        if ($allStringFieldCheck[$optionParamName])
        {
            [System.Type]$optionParamType = $methodParamTypeDict[$optionParamName];
            foreach ($propItem in $optionParamType.GetProperties())
            {
                [System.Reflection.PropertyInfo]$propInfoItem = $propItem;
                $cli_option_name = Get-CliOptionName $propInfoItem.Name;
                $cli_shorthand_str = Get-CliShorthandName $propInfoItem.Name;
                if ($cli_shorthand_str -ne '')
                {
                    $cli_shorthand_str = "-" + $cli_shorthand_str + ", ";
                }
                $code += "  .option('${cli_shorthand_str}--${cli_option_name} <${cli_option_name}>', `$('${cli_option_name}'))" + $NEW_LINE;
            }
        }
        else
        {
            $cli_option_name = Get-CliOptionName $optionParamName;
            $cli_shorthand_str = Get-CliShorthandName $optionParamName;
            if ($cli_shorthand_str -ne '')
            {
                $cli_shorthand_str = "-" + $cli_shorthand_str + ", ";
            }
            $code += "  .option('${cli_shorthand_str}--${cli_option_name} <${cli_option_name}>', `$('${cli_option_name}'))" + $NEW_LINE;
        }
    }
    $code += "  .option('--parameter-file <parameter-file>', `$('the input parameter file'))" + $NEW_LINE;
    $code += "  .option('-s, --subscription <subscription>', `$('the subscription identifier'))" + $NEW_LINE;
    $code += "  .execute(function(${optionParamString}options, _) {" + $NEW_LINE;
    for ($index = 0; $index -lt $methodParamNameList.Count; $index++)
    {
        # Parameter Assignment - For Each Method Parameter
        [string]$optionParamName = $methodParamNameList[$index];
        if ($allStringFieldCheck[$optionParamName])
        {
            [System.Type]$optionParamType = $methodParamTypeDict[$optionParamName];
            $cli_param_name = Get-CliNormalizedName $optionParamName;

            $code += "    var ${cli_param_name}Obj = null;" + $NEW_LINE;
            $code += "    if (options.parameterFile) {" + $NEW_LINE;
            $code += "      cli.output.verbose(`'Reading file content from: \`"`' + options.parameterFile + `'\`"`');" + $NEW_LINE;
            $code += "      var ${cli_param_name}FileContent = fs.readFileSync(options.parameterFile, 'utf8');" + $NEW_LINE;
            $code += "      ${cli_param_name}Obj = JSON.parse(${cli_param_name}FileContent);" + $NEW_LINE;
            $code += "    }" + $NEW_LINE;
            $code += "    else {" + $NEW_LINE;
            $code += "      ${cli_param_name}Obj = {};" + $NEW_LINE;
            
            foreach ($propItem in $optionParamType.GetProperties())
            {
                [System.Reflection.PropertyInfo]$propInfoItem = $propItem;
                $cli_op_param_name = Get-CliNormalizedName $propInfoItem.Name;
                $code += "      cli.output.verbose('${cli_op_param_name} = ' + ${cli_op_param_name});" + $NEW_LINE;
                $code += "      ${cli_param_name}Obj.${cli_op_param_name} = ${cli_op_param_name};" + $NEW_LINE;
            }

            $code += "    }" + $NEW_LINE;
            $code += "    cli.output.verbose('${cli_param_name}Obj = ' + JSON.stringify(${cli_param_name}Obj));" + $NEW_LINE;
        }
        else
        {
            $cli_param_name = Get-CliNormalizedName $optionParamName;
            $code += "    cli.output.verbose('${cli_param_name} = ' + ${cli_param_name});" + $NEW_LINE;
            if ((${cli_param_name} -eq 'Parameters') -or (${cli_param_name} -like '*InstanceIds'))
            {
                $code += "    var ${cli_param_name}Obj = null;" + $NEW_LINE;
                $code += "    if (options.parameterFile) {" + $NEW_LINE;
                $code += "      cli.output.verbose(`'Reading file content from: \`"`' + options.parameterFile + `'\`"`');" + $NEW_LINE;
                $code += "      var fileContent = fs.readFileSync(options.parameterFile, 'utf8');" + $NEW_LINE;
                $code += "      ${cli_param_name}Obj = JSON.parse(fileContent);" + $NEW_LINE;
                $code += "    }" + $NEW_LINE;
                $code += "    else {" + $NEW_LINE;
                    
                if ($oneStringListCheck[$optionParamName])
                {
                    $code += "      var ${cli_param_name}ValArr = ${cli_param_name}.split(',');" + $NEW_LINE;
                    $code += "      cli.output.verbose(`'${cli_param_name}ValArr : `' + ${cli_param_name}ValArr);" + $NEW_LINE;
                    #$code += "      ${cli_param_name}Obj = {};" + $NEW_LINE;
                    #$code += "      ${cli_param_name}Obj.instanceIDs = ${cli_param_name}ValArr;" + $NEW_LINE;
                    $code += "      ${cli_param_name}Obj = [];" + $NEW_LINE;
                    $code += "      for (var item in ${cli_param_name}ValArr) {" + $NEW_LINE;
                    $code += "        ${cli_param_name}Obj.push(item);" + $NEW_LINE;
                    $code += "      }" + $NEW_LINE;
                }
                else
                {
                    $code += "      ${cli_param_name}Obj = JSON.parse(${cli_param_name});" + $NEW_LINE;
                }

                $code += "    }" + $NEW_LINE;
                $code += "    cli.output.verbose('${cli_param_name}Obj = ' + JSON.stringify(${cli_param_name}Obj));" + $NEW_LINE;
            }
        }
    }
    $code += "    var subscription = profile.current.getSubscription(options.subscription);" + $NEW_LINE;

    if ($ModelNameSpace.Contains(".WindowsAzure."))
    {
        $code += "    var ${componentNameInLowerCase}ManagementClient = utils.create${componentName}Client(subscription);" + $NEW_LINE;
    }
    else
    {
        $code += "    var ${componentNameInLowerCase}ManagementClient = utils.create${componentName}ManagementClient(subscription);" + $NEW_LINE;
    }

    if ($cliMethodName -eq 'delete')
    {
        $cliMethodFuncName = $cliMethodName + 'Method';
    }
    else
    {
        $cliMethodFuncName = $cliMethodName;
    }

    $code += "    var result = ${componentNameInLowerCase}ManagementClient.${cliOperationName}.${cliMethodFuncName}(";

    for ($index = 0; $index -lt $methodParamNameList.Count; $index++)
    {
        # Function Call - For Each Method Parameter
        $cli_param_name = Get-CliNormalizedName $methodParamNameList[$index];
        if ((${cli_param_name} -eq 'Parameters') -or (${cli_param_name} -like '*InstanceIds'))
        {
            $code += "${cli_param_name}Obj";
        }
        else
        {
            $code += "${cli_param_name}";
        }

        $code += ", ";
    }

    $code += "_);" + $NEW_LINE;
    $code += "    cli.output.json(result);" + $NEW_LINE;
    $code += "  });" + $NEW_LINE;

    # 3.3 Parameters
    for ($index = 0; $index -lt $methodParamNameList.Count; $index++)
    {
        [string]$optionParamName = $methodParamNameList[$index];
        if ($allStringFieldCheck[$optionParamName])
        {
            # Skip all-string parameters that are already handled in the function command.
            continue;
        }

        $cli_param_name = Get-CliNormalizedName $methodParamNameList[$index];
        if ($cli_param_name -eq 'Parameters')
        {
            $params_category_name = $cliMethodOption + '-parameters';
            $params_category_var_name = "${cliCategoryVarName}${cliMethodName}Parameters" + $index;
            $params_generate_category_name = 'generate';
            $params_generate_category_var_name = "${cliCategoryVarName}${cliMethodName}Generate" + $index;

            # 3.3.1 Parameter Generate Command
            $code += "  var ${params_category_var_name} = ${cliCategoryVarName}.category('${params_category_name}')" + $NEW_LINE;
            $code += "  .description(`$('Commands to generate parameter input file for your ${cliOperationDescription}.'));" + $NEW_LINE;
            $code += "  ${params_category_var_name}.command('generate')" + $NEW_LINE;
            $code += "  .description(`$('Generate ${cliCategoryVarName} parameter string or files.'))" + $NEW_LINE;
            $code += "  .usage('[options]')" + $NEW_LINE;
            $code += "  .option('--parameter-file <parameter-file>', `$('The parameter file path.'))" + $NEW_LINE;
            $code += "  .execute(function(options, _) {" + $NEW_LINE;

            $output_content = $param_object_comment.Replace("`"", "\`"");
            $code += "    cli.output.verbose(`'" + $output_content + "`', _);" + $NEW_LINE;

            $file_content = $param_object_comment_no_compress.Replace($NEW_LINE, "\r\n").Replace("`r", "\r").Replace("`n", "\n");
            $file_content = $file_content.Replace("`"", "\`"").Replace(' ', '');
            $code += "    var filePath = `'${cliCategoryVarName}_${cliMethodName}.json`';" + $NEW_LINE;
            $code += "    if (options.parameterFile) {" + $NEW_LINE;
            $code += "      filePath = options.parameterFile;" + $NEW_LINE;
            $code += "    }" + $NEW_LINE;
            $code += "    fs.writeFileSync(filePath, beautify(`'" + $file_content + "`'));" + $NEW_LINE;
            $code += "    cli.output.verbose(`'=====================================`');" + $NEW_LINE;
            $code += "    cli.output.verbose(`'Parameter file output to: `' + filePath);" + $NEW_LINE;
            $code += "    cli.output.verbose(`'=====================================`');" + $NEW_LINE;
            $code += "  });" + $NEW_LINE;
            $code += $NEW_LINE;

            # 3.3.2 Parameter Patch Command
            $code += "  ${params_category_var_name}.command('patch')" + $NEW_LINE;
            $code += "  .description(`$('Command to patch ${cliCategoryVarName} parameter JSON file.'))" + $NEW_LINE;
            $code += "  .usage('[options]')" + $NEW_LINE;
            $code += "  .option('--parameter-file <parameter-file>', `$('The parameter file path.'))" + $NEW_LINE;
            $code += "  .option('--operation <operation>', `$('The JSON patch operation: add, remove, or replace.'))" + $NEW_LINE;
            $code += "  .option('--path <path>', `$('The JSON data path, e.g.: \`"foo/1\`".'))" + $NEW_LINE;
            $code += "  .option('--value <value>', `$('The JSON value.'))" + $NEW_LINE;
            $code += "  .option('--parse', `$('Parse the JSON value to object.'))" + $NEW_LINE;
            $code += "  .execute(function(options, _) {" + $NEW_LINE;
            $code += "    cli.output.verbose(options.parameterFile, _);" + $NEW_LINE;
            $code += "    cli.output.verbose(options.operation);" + $NEW_LINE;
            $code += "    cli.output.verbose(options.path);" + $NEW_LINE;
            $code += "    cli.output.verbose(options.value);" + $NEW_LINE;
            $code += "    cli.output.verbose(options.parse);" + $NEW_LINE;
            $code += "    if (options.parse) {" + $NEW_LINE;
            $code += "      options.value = JSON.parse(options.value);" + $NEW_LINE;
            $code += "    }" + $NEW_LINE;
            $code += "    cli.output.verbose(options.value);" + $NEW_LINE;
            $code += "    cli.output.verbose(`'=====================================`');" + $NEW_LINE;
            $code += "    cli.output.verbose(`'Reading file content from: \`"`' + options.parameterFile + `'\`"`');" + $NEW_LINE;
            $code += "    cli.output.verbose(`'=====================================`');" + $NEW_LINE;
            $code += "    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');" + $NEW_LINE;
            $code += "    var ${cli_param_name}Obj = JSON.parse(fileContent);" + $NEW_LINE;
            $code += "    cli.output.verbose(`'JSON object:`');" + $NEW_LINE;
            $code += "    cli.output.verbose(JSON.stringify(${cli_param_name}Obj));" + $NEW_LINE;
            $code += "    if (options.operation == 'add') {" + $NEW_LINE;
            $code += "      jsonpatch.apply(${cli_param_name}Obj, [{op: options.operation, path: options.path, value: options.value}]);" + $NEW_LINE;
            $code += "    }" + $NEW_LINE;
            $code += "    else if (options.operation == 'remove') {" + $NEW_LINE;
            $code += "      jsonpatch.apply(${cli_param_name}Obj, [{op: options.operation, path: options.path}]);" + $NEW_LINE;
            $code += "    }" + $NEW_LINE;
            $code += "    else if (options.operation == 'replace') {" + $NEW_LINE;
            $code += "      jsonpatch.apply(${cli_param_name}Obj, [{op: options.operation, path: options.path, value: options.value}]);" + $NEW_LINE;
            $code += "    }" + $NEW_LINE;
            $code += "    var updatedContent = JSON.stringify(${cli_param_name}Obj);" + $NEW_LINE;
            $code += "    cli.output.verbose(`'=====================================`');" + $NEW_LINE;
            $code += "    cli.output.verbose(`'JSON object (updated):`');" + $NEW_LINE;
            $code += "    cli.output.verbose(JSON.stringify(${cli_param_name}Obj));" + $NEW_LINE;
            $code += "    cli.output.verbose(`'=====================================`');" + $NEW_LINE;
            $code += "    fs.writeFileSync(options.parameterFile, beautify(updatedContent));" + $NEW_LINE;
            $code += "    cli.output.verbose(`'=====================================`');" + $NEW_LINE;
            $code += "    cli.output.verbose(`'Parameter file updated at: `' + options.parameterFile);" + $NEW_LINE;
            $code += "    cli.output.verbose(`'=====================================`');" + $NEW_LINE;
            $code += "  });" + $NEW_LINE;
            $code += $NEW_LINE;

            # 3.3.3 Parameter Commands
            $code += $cmdlet_tree_code + $NEW_LINE;

            break;
        }
    }

    return $code;
}

Generate-PsFunctionCommandImpl $OperationName $MethodInfo $FileOutputFolder $FriendMethodInfo;

# CLI Function Command Code
Generate-CliFunctionCommandImpl $OperationName $MethodInfo $ModelClassNameSpace $FileOutputFolder;
