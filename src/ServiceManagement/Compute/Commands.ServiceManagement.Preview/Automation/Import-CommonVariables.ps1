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

$VerbosePreference='Continue';
$ErrorActionPreference = "Stop";

$NEW_LINE = "`r`n";
$BAR_LINE = "=============================================";
$SEC_LINE = "---------------------------------------------";
$verbs_common_new = "VerbsCommon.New";
$verbs_lifecycle_invoke = "VerbsLifecycle.Invoke";

$common_verb_mapping =
@{
"CreateOrUpdate" = "New";
"Get" = "Get";
"List" = "Get";
"Delete" = "Remove";
"Deallocate" = "Stop";
"PowerOff" = "Stop";
"Start" = "Start";
"Restart" = "Restart";
"Capture" = "Save";
"Update" = "Update";
};

$common_noun_mapping =
@{
"VirtualMachine" = "VM";
"ScaleSet" = "SS";
};

$code_common_usings = @(
    'System',
    'System.Collections.Generic',
    'System.Linq',
    'System.Management.Automation',
    'Microsoft.Azure'
);

$code_common_header =
@"
// 
// Copyright (c) Microsoft and contributors.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
// 

// Warning: This code was generated by a tool.
// 
// Changes to this file may cause incorrect behavior and will be lost if the
// code is regenerated.
"@;

. "$PSScriptRoot\Import-AssemblyFunction.ps1";

# Load Assembly and get the Azure namespace for the client,
# e.g. Microsoft.Azure.Management.Compute
$clientNameSpace = Get-AzureNameSpace $dllFileFullPath;
$clientModelNameSpace = $clientNameSpace + '.Models';

$is_hyak_mode = $clientNameSpace -like "Microsoft.WindowsAzure.*.*";
$component_name = $clientNameSpace.Substring($clientNameSpace.LastIndexOf('.') + 1);

# The base cmdlet from which all automation cmdlets derive
[string]$baseCmdletFullName = "Microsoft.Azure.Commands.${component_name}.${component_name}ClientBaseCmdlet";
if ($clientNameSpace -like "Microsoft.WindowsAzure.Management.${component_name}")
{
    # Overwrite RDFE base cmdlet name
    $baseCmdletFullName = "Microsoft.WindowsAzure.Commands.Utilities.Common.ServiceManagementBaseCmdlet";
}

# The property field to access the client wrapper class from the base cmdlet
[string]$baseClientFullName = "${component_name}Client.${component_name}ManagementClient";
if ($clientNameSpace -like "Microsoft.WindowsAzure.Management.${component_name}")
{
    # Overwrite RDFE base cmdlet name
    $baseClientFullName = "${component_name}Client";
}

# Initialize other variables
$all_return_type_names = @();

$SKIP_VERB_NOUN_CMDLET_LIST = @('PowerOff', 'ListNext', 'ListAllNext', 'ListSkusNext', 'GetInstanceView', 'List', 'ListAll');

Write-Verbose $BAR_LINE;
Write-Verbose "Input Parameters:";
Write-Verbose "DLL File              = $dllFileFullPath";
Write-Verbose "Out Folder            = $outFolder";
Write-Verbose "Client NameSpace      = $clientNameSpace";
Write-Verbose "Model NameSpace       = $clientModelNameSpace";
Write-Verbose "Component Name        = $component_name";
Write-Verbose "Base Cmdlet Full Name = $baseCmdletFullName";
Write-Verbose "Base Client Full Name = $baseClientFullName";
Write-Verbose "Cmdlet Flavor         = $cmdletFlavor";
Write-Verbose "Operation Name Filter = $operationNameFilter";
Write-Verbose $BAR_LINE;
Write-Verbose "${new_line_str}";

$code_common_namespace = ($clientNameSpace.Replace('.Management.', '.Commands.')) + '.Automation';
$code_model_namespace = ($clientNameSpace.Replace('.Management.', '.Commands.')) + '.Automation.Models';

function Get-SortedUsingsCode
{
    $list_of_usings = @() + $code_common_usings + $clientNameSpace + $clientModelNameSpace + $code_model_namespace;
    $sorted_usings = $list_of_usings | Sort-Object -Unique | foreach { "using ${_};" };
    $text = [string]::Join($NEW_LINE, $sorted_usings);
    return $text;
}

$code_using_strs = Get-SortedUsingsCode;

function Get-RomanNumeral
{
    param
    (
        [Parameter(Mandatory = $true)]
        $number
    )

    if ($number -ge 1000) { return "M"  + (Get-RomanNumeral ($number - 1000)); }
    if ($number -ge  900) { return "CM" + (Get-RomanNumeral ($number -  900)); }
    if ($number -ge  500) { return "D"  + (Get-RomanNumeral ($number -  500)); }
    if ($number -ge  400) { return "CD" + (Get-RomanNumeral ($number -  400)); }
    if ($number -ge  100) { return "C"  + (Get-RomanNumeral ($number -  100)); }
    if ($number -ge   90) { return "XC" + (Get-RomanNumeral ($number -   90)); }
    if ($number -ge   50) { return "L"  + (Get-RomanNumeral ($number -   50)); }
    if ($number -ge   40) { return "XL" + (Get-RomanNumeral ($number -   40)); }
    if ($number -ge   10) { return "X"  + (Get-RomanNumeral ($number -   10)); }
    if ($number -ge    9) { return "IX" + (Get-RomanNumeral ($number -    9)); }
    if ($number -ge    5) { return "V"  + (Get-RomanNumeral ($number -    5)); }
    if ($number -ge    4) { return "IV" + (Get-RomanNumeral ($number -    4)); }
    if ($number -ge    1) { return "I"  + (Get-RomanNumeral ($number -    1)); }
    return "";
}
