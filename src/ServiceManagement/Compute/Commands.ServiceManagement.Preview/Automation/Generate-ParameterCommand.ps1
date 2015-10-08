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
    [Parameter(Mandatory = $true)]
    $CmdletTreeNode,
    
    # VirtualMachine, VirtualMachineScaleSet, etc.
    [Parameter(Mandatory = $true)]
    [string]$OperationName,

    # CLI commands or PS cmdlets
    [Parameter(Mandatory = $false)]
    [string]$ToolType = "CLI",
    
    [Parameter(Mandatory = $false)]
    [string]$CmdletNounPrefix = "Azure"
)

$NEW_LINE = "`r`n";
. "$PSScriptRoot\StringProcessingHelper.ps1";

function Generate-ParameterCommandImpl
{
    param(
        [Parameter(Mandatory = $true)]
        $TreeNode
    )

    if ($TreeNode -eq $null)
    {
        return $null;
    }

    $cli_method_option_name = Get-CliOptionName $TreeNode.Name;
    $cli_op_description = Get-CliOptionName $OperationName;
    $category_name = Get-CliCategoryName $OperationName;
    $params_category_name = 'parameters';
    $cli_param_name = $params_category_name;

    # 0. Construct Path to Node
    $pathToTreeNode = "";
    $parentNode = $TreeNode;
    $indexerParamList = @();
    while ($parentNode -ne $null)
    {
        [string]$nodeName = Get-CliNormalizedName $parentNode.Name.Trim();
        [string]$pathName = $nodeName;
        if ($pathName.ToLower().StartsWith('ip'))
        {
            $pathName = 'iP' + $pathName.Substring(2);
        }

        if ($parentNode.Parent -ne $null)
        {
            if ($parentNode.IsListItem)
            {
                if ($nodeName -eq $TreeNode.Name)
                {
                    $indexerName = "index";
                    $pathToTreeNode = "/$pathName`" + (options.${indexerName} ? ('/' + options.${indexerName}) : '')";
                }
                else
                {
                    $indexerName = "${nodeName}Index";
                    $pathToTreeNode = "/$pathName/`" + options.${indexerName} + `"" + $pathToTreeNode;
                }
                    
                $indexerParamList += $indexerName;
            }
            else
            {
                $pathToTreeNode = "/$pathName" + $pathToTreeNode;
            }
        }

        $parentNode = $parentNode.Parent;
    }

    if ($TreeNode.IsListItem)
    {
        $pathToTreeNode = "`"${pathToTreeNode}";
    }
    else
    {
        $pathToTreeNode = "`"${pathToTreeNode}`"";
    }
    
    if ($TreeNode.Properties.Count -gt 0 -or ($TreeNode.IsListItem))
    {
        # 1. Parameter Set Command
        $params_generate_category_name = 'set';
        $code = "  //$params_category_name set ${cli_method_option_name}" + $NEW_LINE;
        $code += "  var ${params_category_name} = ${category_name}.category('${params_category_name}')" + $NEW_LINE;
        $code += "  .description(`$('Commands to manage parameter for your ${cli_op_description}.'));" + $NEW_LINE;
        $code += "  var ${params_generate_category_name} = ${params_category_name}.category('${params_generate_category_name}')" + $NEW_LINE;
        $code += "  .description(`$('Commands to set parameter file for your ${cli_op_description}.'));" + $NEW_LINE;
        $code += "  ${params_generate_category_name}.command('${cli_method_option_name}')" + $NEW_LINE;
        $code += "  .description(`$('Set ${category_name} parameter string or files.'))" + $NEW_LINE;
        $code += "  .usage('[options]')" + $NEW_LINE;
        $code += "  .option('--parameter-file <parameter-file>', `$('The parameter file path.'))" + $NEW_LINE;
        $code += "  .option('--value <value>', `$('The JSON value.'))" + $NEW_LINE;
        $code += "  .option('--parse', `$('Parse the JSON value to object.'))" + $NEW_LINE;

        # 1.1 For List Item
        if ($indexerParamList.Count -gt 0)
        {
            foreach ($indexerParamName in $indexerParamList)
            {
                $indexerOptionName = Get-CliOptionName $indexerParamName;
                $code += "  .option('--$indexerOptionName <$indexerOptionName>', `$('Indexer: $indexerOptionName.'))" + $NEW_LINE;
            }
        }

        # 1.2 For Each Property, Set the Option
        foreach ($propertyItem in $TreeNode.Properties)
        {
            $code += "  .option('--" + (Get-CliOptionName $propertyItem["Name"]);
            $code += " <" + (Get-CliNormalizedName $propertyItem["Name"]);
            $code += ">', `$('Set the " + (Get-CliOptionName $propertyItem["Name"]);
            $code += " value.'))" + $NEW_LINE;
        }

        $code += "  .execute(function (";
        $code += "  parameterFile";
        $code += "  , options, _) {" + $NEW_LINE;
        $code += "    cli.output.info(options);" + $NEW_LINE;
        $code += "    cli.output.info(options.parameterFile);" + $NEW_LINE;
        $code += "    cli.output.info(options.value);" + $NEW_LINE;
        $code += "    cli.output.info(options.parse);" + $NEW_LINE;
        $code += "    if (options.parse && options.value) {" + $NEW_LINE;
        $code += "      options.value = JSON.parse(options.value);" + $NEW_LINE;
        $code += "    }" + $NEW_LINE;
        $code += "    cli.output.info(options.value);" + $NEW_LINE;
        $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
        $code += "    cli.output.info(`"Reading file content from: \`"`" + options.parameterFile + `"\`"`");" + $NEW_LINE;
        $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
        $code += "    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');" + $NEW_LINE;
        $code += "    var ${cli_param_name}Obj = JSON.parse(fileContent);" + $NEW_LINE;
        $code += "    cli.output.info(`"JSON object:`");" + $NEW_LINE;
        $code += "    cli.output.info(JSON.stringify(${cli_param_name}Obj));" + $NEW_LINE;
    
        $code += "    options.operation = 'replace';" + $NEW_LINE;
        $code += "    options.path = ${pathToTreeNode};" + $NEW_LINE;
            
        # 1.3 For List Item
        if ($TreeNode.IsListItem)
        {
            $code += "    if (options.value) {" + $NEW_LINE;
            $code += "      jsonpatch.apply(${cli_param_name}Obj, [{op: options.operation, path: options.path, value: options.value}]);" + $NEW_LINE;
            $code += "    }" + $NEW_LINE;
        }
        
        # 1.4 For Each Property, Apply the Change if Any
        foreach ($propertyItem in $TreeNode.Properties)
        {
            $paramName = (Get-CliNormalizedName $propertyItem["Name"]);
            $code += "    var paramPath = " + "options.path" + " + `"/`" + " + "`"" + ${paramName} + "`";" + $NEW_LINE;
            $code += "    cli.output.info(`"================================================`");" + $NEW_LINE;
            $code += "    cli.output.info(`"JSON Parameters Path:`" + paramPath);" + $NEW_LINE;
            $code += "    cli.output.info(`"================================================`");" + $NEW_LINE;
            $code += "    if (options.${paramName}) {" + $NEW_LINE;
            $code += "      if (options.parse && options.${paramName}) {" + $NEW_LINE;
            $code += "        options.${paramName} = JSON.parse(options.${paramName});" + $NEW_LINE;
            $code += "      }" + $NEW_LINE;
            $code += "      jsonpatch.apply(${cli_param_name}Obj, [{op: options.operation, path: paramPath, value: options.${paramName}}]);" + $NEW_LINE;
            $code += "    }" + $NEW_LINE;
        }

        $code += "    var updatedContent = JSON.stringify(${cli_param_name}Obj);" + $NEW_LINE;
        $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
        $code += "    cli.output.info(`"JSON object (updated):`");" + $NEW_LINE;
        $code += "    cli.output.info(JSON.stringify(${cli_param_name}Obj));" + $NEW_LINE;
        $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
        $code += "    fs.writeFileSync(options.parameterFile, beautify(updatedContent));" + $NEW_LINE;
        $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
        $code += "    cli.output.info(`"Parameter file updated at: `" + options.parameterFile);" + $NEW_LINE;
        $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;

        $code += "  });" + $NEW_LINE;
        $code += "" + $NEW_LINE;
    }

    # 2. Parameter Remove Command
    $params_generate_category_name = 'remove';
    $code += "  //$params_category_name ${params_generate_category_name} ${cli_method_option_name}" + $NEW_LINE;
    $code += "  var ${params_category_name} = ${category_name}.category('${params_category_name}')" + $NEW_LINE;
    $code += "  .description(`$('Commands to remove parameter for your ${cli_op_description}.'));" + $NEW_LINE;
    $code += "  var ${params_generate_category_name} = ${params_category_name}.category('${params_generate_category_name}')" + $NEW_LINE;
    $code += "  .description(`$('Commands to remove values in the parameter file for your ${cli_op_description}.'));" + $NEW_LINE;
    $code += "  ${params_generate_category_name}.command('${cli_method_option_name}')" + $NEW_LINE;
    $code += "  .description(`$('Remove ${category_name} parameter string or files.'))" + $NEW_LINE;
    $code += "  .usage('[options]')" + $NEW_LINE;
    $code += "  .option('--parameter-file <parameter-file>', `$('The parameter file path.'))" + $NEW_LINE;

    # 2.1 For List Item
    if ($indexerParamList.Count -gt 0)
    {
        foreach ($indexerParamName in $indexerParamList)
        {
            $indexerOptionName = Get-CliOptionName $indexerParamName;
            $code += "  .option('--$indexerOptionName <$indexerOptionName>', `$('Indexer: $indexerOptionName.'))" + $NEW_LINE;
        }
    }

    # 2.2 Function Definition
    $code += "  .execute(function (";
    $code += "  parameterFile";
    $code += "  , options, _) {" + $NEW_LINE;
    $code += "    cli.output.info(options);" + $NEW_LINE;
    $code += "    cli.output.info(options.parameterFile);" + $NEW_LINE;
    $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
    $code += "    cli.output.info(`"Reading file content from: \`"`" + options.parameterFile + `"\`"`");" + $NEW_LINE;
    $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
    $code += "    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');" + $NEW_LINE;
    $code += "    var ${cli_param_name}Obj = JSON.parse(fileContent);" + $NEW_LINE;
    $code += "    cli.output.info(`"JSON object:`");" + $NEW_LINE;
    $code += "    cli.output.info(JSON.stringify(${cli_param_name}Obj));" + $NEW_LINE;
    $code += "    options.operation = 'remove';" + $NEW_LINE;
    $code += "    options.path = ${pathToTreeNode};" + $NEW_LINE;
    $code += "    jsonpatch.apply(${cli_param_name}Obj, [{op: options.operation, path: options.path}]);" + $NEW_LINE;
    $code += "    var updatedContent = JSON.stringify(${cli_param_name}Obj);" + $NEW_LINE;
    $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
    $code += "    cli.output.info(`"JSON object (updated):`");" + $NEW_LINE;
    $code += "    cli.output.info(JSON.stringify(${cli_param_name}Obj));" + $NEW_LINE;
    $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
    $code += "    fs.writeFileSync(options.parameterFile, beautify(updatedContent));" + $NEW_LINE;
    $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
    $code += "    cli.output.info(`"Parameter file updated at: `" + options.parameterFile);" + $NEW_LINE;
    $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
    $code += "  });" + $NEW_LINE;
    
    # 3. Parameter Add Command
    $params_generate_category_name = 'add';
    $code += "  //$params_category_name ${params_generate_category_name} ${cli_method_option_name}" + $NEW_LINE;
    $code += "  var ${params_category_name} = ${category_name}.category('${params_category_name}')" + $NEW_LINE;
    $code += "  .description(`$('Commands to add parameter for your ${cli_op_description}.'));" + $NEW_LINE;
    $code += "  var ${params_generate_category_name} = ${params_category_name}.category('${params_generate_category_name}')" + $NEW_LINE;
    $code += "  .description(`$('Commands to add values in the parameter file for your ${cli_op_description}.'));" + $NEW_LINE;
    $code += "  ${params_generate_category_name}.command('${cli_method_option_name}')" + $NEW_LINE;
    $code += "  .description(`$('Remove ${category_name} parameter string or files.'))" + $NEW_LINE;
    $code += "  .usage('[options]')" + $NEW_LINE;
    $code += "  .option('--parameter-file <parameter-file>', `$('The parameter file path.'))" + $NEW_LINE;
    $code += "  .option('--key <key>', `$('The JSON key.'))" + $NEW_LINE;
    $code += "  .option('--value <value>', `$('The JSON value.'))" + $NEW_LINE;
    $code += "  .option('--parse', `$('Parse the JSON value to object.'))" + $NEW_LINE;

    # For Each Property, Add the Option
    foreach ($propertyItem in $TreeNode.Properties)
    {
        $code += "  .option('--" + (Get-CliOptionName $propertyItem["Name"]);
        $code += " <" + (Get-CliNormalizedName $propertyItem["Name"]);
        $code += ">', `$('Add the " + (Get-CliOptionName $propertyItem["Name"]);
        $code += " value.'))" + $NEW_LINE;
    }

    $code += "  .execute(function (";
    $code += "  parameterFile";
    $code += "  , options, _) {" + $NEW_LINE;
    $code += "    cli.output.info(options);" + $NEW_LINE;
    $code += "    cli.output.info(options.parameterFile);" + $NEW_LINE;
    $code += "    cli.output.info(options.key);" + $NEW_LINE;
    $code += "    cli.output.info(options.value);" + $NEW_LINE;
    $code += "    cli.output.info(options.parse);" + $NEW_LINE;
    $code += "    if (options.parse && options.value) {" + $NEW_LINE;
    $code += "      options.value = JSON.parse(options.value);" + $NEW_LINE;
    $code += "    }" + $NEW_LINE;
    $code += "    cli.output.info(options.value);" + $NEW_LINE;
    $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
    $code += "    cli.output.info(`"Reading file content from: \`"`" + options.parameterFile + `"\`"`");" + $NEW_LINE;
    $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
    $code += "    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');" + $NEW_LINE;
    $code += "    var ${cli_param_name}Obj = JSON.parse(fileContent);" + $NEW_LINE;
    $code += "    cli.output.info(`"JSON object:`");" + $NEW_LINE;
    $code += "    cli.output.info(JSON.stringify(${cli_param_name}Obj));" + $NEW_LINE;
    
    $code += "    options.operation = 'add';" + $NEW_LINE;
    $code += "    options.path = ${pathToTreeNode} + `"/`" + options.key;" + $NEW_LINE;
    $code += "    cli.output.info(`"options.path = `" + options.path);" + $NEW_LINE;
    $code += "    jsonpatch.apply(${cli_param_name}Obj, [{op: options.operation, path: options.path, value: options.value}]);" + $NEW_LINE;

    # For Each Property, Apply the Change if Any
    foreach ($propertyItem in $TreeNode.Properties)
    {
        $paramName = (Get-CliNormalizedName $propertyItem["Name"]);
        $code += "    var paramPath = ${pathToTreeNode} + `"/`" + `"${paramName}`";" + $NEW_LINE;
        $code += "    cli.output.info(`"================================================`");" + $NEW_LINE;
        $code += "    cli.output.info(`"JSON Parameters Path:`" + paramPath);" + $NEW_LINE;
        $code += "    cli.output.info(`"================================================`");" + $NEW_LINE;
        $code += "    if (options.${paramName}) {" + $NEW_LINE;
        $code += "      if (options.parse && options.${paramName}) {" + $NEW_LINE;
        $code += "        options.${paramName} = JSON.parse(options.${paramName});" + $NEW_LINE;
        $code += "      }" + $NEW_LINE;
        $code += "      jsonpatch.apply(${cli_param_name}Obj, [{op: options.operation, path: paramPath, value: options.${paramName}}]);" + $NEW_LINE;
        $code += "    }" + $NEW_LINE;
    }

    $code += "    var updatedContent = JSON.stringify(${cli_param_name}Obj);" + $NEW_LINE;
    $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
    $code += "    cli.output.info(`"JSON object (updated):`");" + $NEW_LINE;
    $code += "    cli.output.info(JSON.stringify(${cli_param_name}Obj));" + $NEW_LINE;
    $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
    $code += "    fs.writeFileSync(options.parameterFile, beautify(updatedContent));" + $NEW_LINE;
    $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;
    $code += "    cli.output.info(`"Parameter file updated at: `" + options.parameterFile);" + $NEW_LINE;
    $code += "    cli.output.info(`"=====================================`");" + $NEW_LINE;

    $code += "  });" + $NEW_LINE;
    $code += "" + $NEW_LINE;

    # 4. Recursive Calls for All Sub-Nodes
    foreach ($subNode in $TreeNode.SubNodes)
    {
        if ($null -ne $subNode)
        {
            $code += Generate-ParameterCommandImpl $subNode;
        }
    }

    return $code;
}

Write-Output (Generate-ParameterCommandImpl $CmdletTreeNode);
