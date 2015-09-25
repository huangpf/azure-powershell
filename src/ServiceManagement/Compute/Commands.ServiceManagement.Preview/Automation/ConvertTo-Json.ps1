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
