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
    [string]$CmdletNounPrefix = "Azure"
)

$NEW_LINE = "`r`n";
. "$PSScriptRoot\StringProcessingHelper.ps1";

function Generate-CliFunctionCommandImpl
{
    param(
        # VirtualMachine, VirtualMachineScaleSet, etc.
        [Parameter(Mandatory = $true)]
        [string]$OperationName,

        [Parameter(Mandatory = $true)]
        [System.Reflection.MethodInfo]$MethodInfo,
    
        [Parameter(Mandatory = $true)]
        [string]$ModelClassNameSpace
    )

    $params = $MethodInfo.GetParameters();
    $client_model_namespace = $ModelClassNameSpace;
    $opShortName = $OperationName;
    $operation_method_info = $MethodInfo;
    $methodName = ($operation_method_info.Name.Replace('Async', ''));

    $param_names = @();
    foreach ($pt in $params)
    {
        $paramTypeFullName = $pt.ParameterType.FullName;
        if (-not ($paramTypeFullName.EndsWith('CancellationToken')))
        {
            $normalized_param_name = Get-NormalizedName $pt.Name;
            $param_names += $normalized_param_name;
        }
    }

    # 3. CLI Code
    # 3.1 types
    $function_comment = "";
    foreach ($pt in $params)
    {
        $param_type_full_name = $pt.ParameterType.FullName;
        if (-not ($param_type_full_name.EndsWith('CancellationToken')))
        {
            if ($pt.ParameterType.Namespace -like $client_model_namespace)
            {
                $param_object = (. $PSScriptRoot\Create-ParameterObject.ps1 -typeInfo $pt.ParameterType);
                $param_object_comment = (. $PSScriptRoot\ConvertTo-Json.ps1 -inputObject $param_object -compress $true);
                $param_object_comment_no_compress = (. $PSScriptRoot\ConvertTo-Json.ps1 -inputObject $param_object);

                $cmdlet_tree = (. $PSScriptRoot\Create-ParameterTree.ps1 -TypeInfo $pt.ParameterType -NameSpace $client_model_namespace -ParameterName $pt.ParameterType.Name);
                $cmdlet_tree_code = (. $PSScriptRoot\Generate-ParameterCommand.ps1 -CmdletTreeNode $cmdlet_tree -Operation $opShortName);
            }
        }
    }

    # 3.2 functions
    $category_name = Get-CliCategoryName $opShortName;
    $cli_method_name = Get-CliNormalizedName $methodName;
    $category_var_name = $category_name + $methodName;
    $cli_method_option_name = Get-CliOptionName $methodName;
    $cli_op_name = Get-CliNormalizedName $opShortName;
    $cli_op_description = (Get-CliOptionName $opShortName).Replace('-', ' ');

    $cli_op_code_content = "";
    $cli_op_code_content += "//" + $cli_op_name + " -> " + $methodName + $NEW_LINE;
    if ($param_object_comment -ne $null)
    {
        $cli_op_code_content += "/*" + $NEW_LINE + $param_object_comment + $NEW_LINE + "*/" + $NEW_LINE;
    }

    $cli_op_code_content += "  var $category_var_name = cli.category('${category_name}').description(`$('Commands to manage your $cli_op_description.'));" + $NEW_LINE;

    $cli_op_code_content += "  ${category_var_name}.command('${cli_method_option_name}')" + $NEW_LINE;
    $cli_op_code_content += "  .description(`$('${cli_method_option_name} method to manage your $cli_op_description.'))" + $NEW_LINE;
    $cli_op_code_content += "  .usage('[options]')" + $NEW_LINE;
    for ($index = 0; $index -lt $param_names.Count; $index++)
    {
        $cli_option_name = Get-CliOptionName $param_names[$index];
        $cli_op_code_content += "  .option('--${cli_option_name} <${cli_option_name}>', `$('${cli_option_name}'))" + $NEW_LINE;
    }
    $cli_op_code_content += "  .option('--parameter-file <parameter-file>', `$('the input parameter file'))" + $NEW_LINE;
    $cli_op_code_content += "  .option('-s, --subscription <subscription>', `$('the subscription identifier'))" + $NEW_LINE;
    $cli_op_code_content += "  .execute(function ("
    for ($index = 0; $index -lt $param_names.Count; $index++)
    {
        if ($index -gt 0) { $cli_op_code_content += ", "; }
        $cli_param_name = Get-CliNormalizedName $param_names[$index];
        $cli_op_code_content += "$cli_param_name";
    }
    $cli_op_code_content += ", options, _) {" + $NEW_LINE;
    for ($index = 0; $index -lt $param_names.Count; $index++)
    {
        $cli_param_name = Get-CliNormalizedName $param_names[$index];
        $cli_op_code_content += "    cli.output.info('${cli_param_name} = ' + options.${cli_param_name});" + $NEW_LINE;
        if ((${cli_param_name} -eq 'Parameters') -or (${cli_param_name} -like '*InstanceIds'))
        {
            $cli_op_code_content += "    var ${cli_param_name}Obj = null;" + $NEW_LINE;
            $cli_op_code_content += "    if (options.parameterFile) {" + $NEW_LINE;
            $cli_op_code_content += "      cli.output.info(`'Reading file content from: \`"`' + options.parameterFile + `'\`"`');" + $NEW_LINE;
            $cli_op_code_content += "      var fileContent = fs.readFileSync(options.parameterFile, 'utf8');" + $NEW_LINE;
            $cli_op_code_content += "      ${cli_param_name}Obj = JSON.parse(fileContent);" + $NEW_LINE;
            $cli_op_code_content += "    }" + $NEW_LINE;
            $cli_op_code_content += "    else {" + $NEW_LINE;
            $cli_op_code_content += "      ${cli_param_name}Obj = JSON.parse(options.${cli_param_name});" + $NEW_LINE;
            $cli_op_code_content += "    }" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info('${cli_param_name}Obj = ' + JSON.stringify(${cli_param_name}Obj));" + $NEW_LINE;
        }
    }
    $cli_op_code_content += "    var subscription = profile.current.getSubscription(options.subscription);" + $NEW_LINE;
    $cli_op_code_content += "    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);" + $NEW_LINE;
    $cli_op_code_content += "    var result = computeManagementClient.${cli_op_name}s.${cli_method_name}(";
    for ($index = 0; $index -lt $param_names.Count; $index++)
    {
        if ($index -gt 0) { $cli_op_code_content += ", "; }
        
        $cli_param_name = Get-CliNormalizedName $param_names[$index];
        if ((${cli_param_name} -eq 'Parameters') -or (${cli_param_name} -like '*InstanceIds'))
        {
            $cli_op_code_content += "${cli_param_name}Obj";
        }
        else
        {
            $cli_op_code_content += "options.${cli_param_name}";
        }
    }
    $cli_op_code_content += ", _);" + $NEW_LINE;
    $cli_op_code_content += "    cli.output.json(result);" + $NEW_LINE;
    $cli_op_code_content += "  });" + $NEW_LINE;

    # 3.3 Parameters
    for ($index = 0; $index -lt $param_names.Count; $index++)
    {
        $cli_param_name = Get-CliNormalizedName $param_names[$index];
        if ($cli_param_name -eq 'Parameters')
        {
            $params_category_name = 'parameters';
            $params_category_var_name = "${category_var_name}${cli_method_name}Parameters" + $index;
            $params_generate_category_name = 'generate';
            $params_generate_category_var_name = "${category_var_name}${cli_method_name}Generate" + $index;

            # 3.3.1 Parameter Generate Command
            $cli_op_code_content += "  var ${params_category_var_name} = ${category_var_name}.category('${params_category_name}')" + $NEW_LINE;
            $cli_op_code_content += "  .description(`$('Commands to manage parameter for your ${cli_op_description}.'));" + $NEW_LINE;
            $cli_op_code_content += "  var ${params_generate_category_var_name} = ${params_category_var_name}.category('${params_generate_category_name}')" + $NEW_LINE;
            $cli_op_code_content += "  .description(`$('Commands to generate parameter file for your ${cli_op_description}.'));" + $NEW_LINE;
            $cli_op_code_content += "  ${params_generate_category_var_name}.command('${cli_method_option_name}')" + $NEW_LINE;
            $cli_op_code_content += "  .description(`$('Generate ${category_var_name} parameter string or files.'))" + $NEW_LINE;
            $cli_op_code_content += "  .usage('[options]')" + $NEW_LINE;
            $cli_op_code_content += "  .option('--parameter-file <parameter-file>', `$('The parameter file path.'))" + $NEW_LINE;
            $cli_op_code_content += "  .execute(function (options) {" + $NEW_LINE;

            $output_content = $param_object_comment.Replace("`"", "\`"");
            $cli_op_code_content += "    cli.output.info(`'" + $output_content + "`');" + $NEW_LINE;

            $file_content = $param_object_comment_no_compress.Replace($NEW_LINE, "\r\n").Replace("`r", "\r").Replace("`n", "\n");
            $file_content = $file_content.Replace("`"", "\`"").Replace(' ', '');
            $cli_op_code_content += "    var filePath = `'${category_var_name}_${cli_method_name}.json`';" + $NEW_LINE;
            $cli_op_code_content += "    if (options.parameterFile) {" + $NEW_LINE;
            $cli_op_code_content += "      filePath = options.parameterFile;" + $NEW_LINE;
            $cli_op_code_content += "    }" + $NEW_LINE;
            $cli_op_code_content += "    fs.writeFileSync(filePath, beautify(`'" + $file_content + "`'));" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(`'=====================================`');" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(`'Parameter file output to: `' + filePath);" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(`'=====================================`');" + $NEW_LINE;
            $cli_op_code_content += "  });" + $NEW_LINE;
            $cli_op_code_content += $NEW_LINE;

            # 3.3.2 Parameter Patch Command
            $cli_op_code_content += "  ${params_category_var_name}.command('patch')" + $NEW_LINE;
            $cli_op_code_content += "  .description(`$('Command to patch ${category_var_name} parameter JSON file.'))" + $NEW_LINE;
            $cli_op_code_content += "  .usage('[options]')" + $NEW_LINE;
            $cli_op_code_content += "  .option('--parameter-file <parameter-file>', `$('The parameter file path.'))" + $NEW_LINE;
            $cli_op_code_content += "  .option('--operation <operation>', `$('The JSON patch operation: add, remove, or replace.'))" + $NEW_LINE;
            $cli_op_code_content += "  .option('--path <path>', `$('The JSON data path, e.g.: \`"foo/1\`".'))" + $NEW_LINE;
            $cli_op_code_content += "  .option('--value <value>', `$('The JSON value.'))" + $NEW_LINE;
            $cli_op_code_content += "  .option('--parse', `$('Parse the JSON value to object.'))" + $NEW_LINE;
            $cli_op_code_content += "  .execute(function(options) {" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(options.parameterFile);" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(options.operation);" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(options.path);" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(options.value);" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(options.parse);" + $NEW_LINE;
            $cli_op_code_content += "    if (options.parse) {" + $NEW_LINE;
            $cli_op_code_content += "      options.value = JSON.parse(options.value);" + $NEW_LINE;
            $cli_op_code_content += "    }" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(options.value);" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(`'=====================================`');" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(`'Reading file content from: \`"`' + options.parameterFile + `'\`"`');" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(`'=====================================`');" + $NEW_LINE;
            $cli_op_code_content += "    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');" + $NEW_LINE;
            $cli_op_code_content += "    var ${cli_param_name}Obj = JSON.parse(fileContent);" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(`'JSON object:`');" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(JSON.stringify(${cli_param_name}Obj));" + $NEW_LINE;
            $cli_op_code_content += "    if (options.operation == 'add') {" + $NEW_LINE;
            $cli_op_code_content += "      jsonpatch.apply(${cli_param_name}Obj, [{op: options.operation, path: options.path, value: options.value}]);" + $NEW_LINE;
            $cli_op_code_content += "    }" + $NEW_LINE;
            $cli_op_code_content += "    else if (options.operation == 'remove') {" + $NEW_LINE;
            $cli_op_code_content += "      jsonpatch.apply(${cli_param_name}Obj, [{op: options.operation, path: options.path}]);" + $NEW_LINE;
            $cli_op_code_content += "    }" + $NEW_LINE;
            $cli_op_code_content += "    else if (options.operation == 'replace') {" + $NEW_LINE;
            $cli_op_code_content += "      jsonpatch.apply(${cli_param_name}Obj, [{op: options.operation, path: options.path, value: options.value}]);" + $NEW_LINE;
            $cli_op_code_content += "    }" + $NEW_LINE;
            $cli_op_code_content += "    var updatedContent = JSON.stringify(${cli_param_name}Obj);" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(`'=====================================`');" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(`'JSON object (updated):`');" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(JSON.stringify(${cli_param_name}Obj));" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(`'=====================================`');" + $NEW_LINE;
            $cli_op_code_content += "    fs.writeFileSync(options.parameterFile, beautify(updatedContent));" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(`'=====================================`');" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(`'Parameter file updated at: `' + options.parameterFile);" + $NEW_LINE;
            $cli_op_code_content += "    cli.output.info(`'=====================================`');" + $NEW_LINE;
            $cli_op_code_content += "  });" + $NEW_LINE;
            $cli_op_code_content += $NEW_LINE;

            # 3.3.3 Parameter Commands
            $cli_op_code_content += $cmdlet_tree_code + $NEW_LINE;
            break;
        }
    }

    return $cli_op_code_content;
}

if ($ToolType -eq 'CLI')
{
    Write-Output (Generate-CliFunctionCommandImpl $OperationName $MethodInfo $ModelClassNameSpace);
}
