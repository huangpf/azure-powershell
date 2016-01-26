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

param(
    # VirtualMachine, VirtualMachineScaleSet, etc.
    [Parameter(Mandatory = $true)]
    [string]$OperationName,

    [Parameter(Mandatory = $true)]
    [System.Reflection.MethodInfo]$MethodInfo,
    
    [Parameter(Mandatory = $true)]
    [string]$ModelClassNameSpace,

    # CLI commands or PS cmdlets
    [Parameter(Mandatory = $false)]
    [string]$ToolType = "CLI",
    
    [Parameter(Mandatory = $false)]
    [string]$CmdletNounPrefix = "Azure",

    [Parameter(Mandatory = $false)]
    [string]$fileOutputFolder = $null
)

$NEW_LINE = "`r`n";
$BAR_LINE = "=============================================";
$SEC_LINE = "---------------------------------------------";
. "$PSScriptRoot\StringProcessingHelper.ps1";
. "$PSScriptRoot\ParameterTypeHelper.ps1";

$CLI_HELP_MSG = "         There are two sets of commands:\r\n" `
              + "           1) function commands that are used to manage Azure resources in the cloud, and \r\n" `
              + "           2) parameter commands that generate & edit input files for the other set of commands.\r\n" `
              + "         For example, \'vmss get/list/stop\' are the function commands that call get, list and stop operations of \r\n" `
              + "         virtual machine scale set, whereas \'vmss create-or-update-parameters generate/set/remove/add\' commands \r\n" `
              + "         are used to configure the input parameter file. The \'vmss create-or-update\' command takes a parameter \r\n" `
              + "         file as for the VM scale set configuration, and creates it online.";

function Generate-CliFunctionCommandImpl
{
    param(
        # VirtualMachine, VirtualMachineScaleSet, etc.
        [Parameter(Mandatory = $true)]
        [string]$OperationName,

        [Parameter(Mandatory = $true)]
        [System.Reflection.MethodInfo]$MethodInfo,
    
        [Parameter(Mandatory = $true)]
        [string]$ModelNameSpace,

        [Parameter(Mandatory = $false)]
        [string]$fileOutputFolder = $null
    )

    $methodParameters = $MethodInfo.GetParameters();
    $methodName = ($MethodInfo.Name.Replace('Async', ''));
    $methodParamNameList = @();
    $methodParamTypeDict = @{};
    $allStringFieldCheck = @{};
    $oneStringListCheck = @{};

    # 3. CLI Code
    # 3.1 Types
    foreach ($paramItem in $methodParameters)
    {
        [System.Type]$paramType = $paramItem.ParameterType;
        if (-not ($paramType.FullName.EndsWith('CancellationToken')))
        {
            # Record the Normalized Parameter Name, i.e. 'vmName' => 'VMName', 'resourceGroup' => 'ResourceGroup', etc.
            $methodParamNameList += (Get-NormalizedName $paramItem.Name);
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
                $cmdlet_tree_code = (. $PSScriptRoot\Generate-ParameterCommand.ps1 -CmdletTreeNode $cmdlet_tree -Operation $opShortName -ModelNameSpace $ModelNameSpace -MethodName $methodName -OutputFolder $fileOutputFolder);
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
    $desc_text = "Commands to manage your ${cliOperationDescription}.\r\n${CLI_HELP_MSG}";
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
                    $code += "      ${cli_param_name}Obj = {};" + $NEW_LINE;
                    $code += "      ${cli_param_name}Obj.instanceIDs = ${cli_param_name}ValArr;" + $NEW_LINE;
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
        $code += "    var computeManagementClient = utils.createComputeClient(subscription);" + $NEW_LINE;
    }
    else
    {
        $code += "    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);" + $NEW_LINE;
    }

    if ($cliMethodName -eq 'delete')
    {
        $cliMethodFuncName = $cliMethodName + 'Method';
    }
    else
    {
        $cliMethodFuncName = $cliMethodName;
    }

    $code += "    var result = computeManagementClient.${cliOperationName}s.${cliMethodFuncName}(";

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

if ($ToolType -eq 'CLI')
{
    Write-Output (Generate-CliFunctionCommandImpl $OperationName $ModelClassNameSpace $MethodInfo $fileOutputFolder);
}
