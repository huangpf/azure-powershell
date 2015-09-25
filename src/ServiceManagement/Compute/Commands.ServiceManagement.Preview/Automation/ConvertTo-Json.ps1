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
  $inputObject = $null,

  [Parameter(Mandatory = $false)]
  [bool]$compress = $false,

  [Parameter(Mandatory = $false)]
  [int]$depth = 1000
)

if ($compress)
{
    $jsonText = ConvertTo-Json -Depth $depth -InputObject $inputObject -Compress;
}
else
{
    $jsonText = ConvertTo-Json -Depth $depth -InputObject $inputObject;
}

$lowerCaseJsonText = $jsonText;

# Change the JSON fields to use lower cases, e.g. {"Say":"Hello World!"} => {"say":"Hello World!"}
$letterA = [int]([char]'A');
for ($i = 0; $i -lt 26; $i++)
{
    $ch = [char]($letterA + $i);
    $lowerCaseJsonText = $lowerCaseJsonText.Replace("`"" + $ch, "`"" + "$ch".ToLower());
}

Write-Output $lowerCaseJsonText;
