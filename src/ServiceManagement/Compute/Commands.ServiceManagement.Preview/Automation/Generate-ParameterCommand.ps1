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

    if ($TreeNode.Properties.Count -gt 0)
    {
        $cli_method_option_name = Get-CliOptionName $TreeNode.Name;
        $cli_op_description = Get-CliOptionName $OperationName;
        $category_name = Get-CliCategoryName $OperationName;
        $params_category_name = 'parameters';
        $params_generate_category_name = 'set';
        $cli_param_name = $params_category_name;

        # Path to Node
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
                        $pathToTreeNode = "/$pathName/`" + options.${indexerName}";
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

        # 1. Parameter Set Command
        $code = "  //$params_category_name parameters set ${cli_method_option_name}" + $NEW_LINE;
        $code += "  var ${params_category_name} = ${category_name}.category('${params_category_name}')" + $NEW_LINE;
        $code += "  .description(`$('Commands to manage parameter for your ${cli_op_description}.'));" + $NEW_LINE;
        $code += "  var ${params_generate_category_name} = ${params_category_name}.category('${params_generate_category_name}')" + $NEW_LINE;
        $code += "  .description(`$('Commands to set parameter file for your ${cli_op_description}.'));" + $NEW_LINE;
        $code += "  ${params_generate_category_name}.command('${cli_method_option_name}')" + $NEW_LINE;
        $code += "  .description(`$('Set ${category_name} parameter string or files.'))" + $NEW_LINE;
        $code += "  .usage('[options]')" + $NEW_LINE;
        $code += "  .option('--parameter-file <parameter-file>', `$('The parameter file path.'))" + $NEW_LINE;
        $code += "  .option('--value <value>', `$('The JSON value.'))" + $new_line_str;
        $code += "  .option('--parse', `$('Parse the JSON value to object.'))" + $new_line_str;

        # For List Item
        if ($indexerParamList.Count -gt 0)
        {
            foreach ($indexerParamName in $indexerParamList)
            {
                $indexerOptionName = Get-CliOptionName $indexerParamName;
                $code += "  .option('--$indexerOptionName <$indexerOptionName>', `$('Indexer: $indexerOptionName.'))" + $new_line_str;
            }
        }

        # For Each Property, Set the Option
        foreach ($propertyItem in $TreeNode.Properties)
        {
            $code += "  .option('--" + (Get-CliOptionName $propertyItem["Name"]);
            $code += " <" + (Get-CliNormalizedName $propertyItem["Name"]);
            $code += ">', `$('Set the " + (Get-CliOptionName $propertyItem["Name"]);
            $code += " value.'))" + $new_line_str;
        }

        $code += "  .execute(function (";
        $code += "  parameterFile";
        $code += "  , options, _) {" + $NEW_LINE;
        $code += "    console.log(options);" + $new_line_str;
        $code += "    console.log(options.parameterFile);" + $new_line_str;
        $code += "    console.log(options.value);" + $new_line_str;
        $code += "    console.log(options.parse);" + $new_line_str;
        $code += "    if (options.parse) {" + $new_line_str;
        $code += "      options.value = JSON.parse(options.value);" + $new_line_str;
        $code += "    }" + $new_line_str;
        $code += "    console.log(options.value);" + $new_line_str;
        $code += "    console.log(`"=====================================`");" + $new_line_str;
        $code += "    console.log(`"Reading file content from: \`"`" + options.parameterFile + `"\`"`");" + $new_line_str;
        $code += "    console.log(`"=====================================`");" + $new_line_str;
        $code += "    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');" + $new_line_str;
        $code += "    var ${cli_param_name}Obj = JSON.parse(fileContent);" + $new_line_str;
        $code += "    console.log(`"JSON object:`");" + $new_line_str;
        $code += "    console.log(JSON.stringify(${cli_param_name}Obj));" + $new_line_str;
    
        $code += "    options.operation = 'replace';" + $new_line_str;
        $code += "    options.path = ${pathToTreeNode};" + $new_line_str;
        # $code += "    jsonpatch.apply(${cli_param_name}Obj, [{op: options.operation, path: options.path, value: options.value}]);" + $new_line_str;
        
        # For Each Property, Apply the Change if Any
        foreach ($propertyItem in $TreeNode.Properties)
        {
            $paramName = (Get-CliNormalizedName $propertyItem["Name"]);
            $code += "    var paramPath = " + "options.path" + " + `"/`" + " + "`"" + ${paramName} + "`";" + $new_line_str;
            $code += "    console.log(`"================================================`");" + $new_line_str;
            $code += "    console.log(`"JSON Parameters Path:`" + paramPath);" + $new_line_str;
            $code += "    console.log(`"================================================`");" + $new_line_str;
            $code += "    if (options.${paramName}) {" + $new_line_str;
            $code += "      jsonpatch.apply(${cli_param_name}Obj, [{op: options.operation, path: paramPath, value: options.${paramName}}]);" + $new_line_str;
            $code += "    }" + $new_line_str;
        }

        $code += "    var updatedContent = JSON.stringify(${cli_param_name}Obj);" + $new_line_str;
        $code += "    console.log(`"=====================================`");" + $new_line_str;
        $code += "    console.log(`"JSON object (updated):`");" + $new_line_str;
        $code += "    console.log(JSON.stringify(${cli_param_name}Obj));" + $new_line_str;
        $code += "    console.log(`"=====================================`");" + $new_line_str;
        $code += "    fs.writeFileSync(options.parameterFile, beautify(updatedContent));" + $new_line_str;
        $code += "    console.log(`"=====================================`");" + $new_line_str;
        $code += "    console.log(`"Parameter file updated at: `" + options.parameterFile);" + $new_line_str;
        $code += "    console.log(`"=====================================`");" + $new_line_str;

        $code += "  });" + $NEW_LINE;
        $code += "" + $NEW_LINE;
    }

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
