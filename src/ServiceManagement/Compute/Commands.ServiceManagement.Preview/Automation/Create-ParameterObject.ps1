param(
  [Parameter(Mandatory = $true)]
  [System.Type]$typeInfo = $null
)

function Create-ParameterObjectImpl
{
    param(
        [Parameter(Mandatory = $True)]
        [System.Type]$typeInfo
    )

    if ([string]::IsNullOrEmpty($typeInfo.FullName))
    {
        return $null;
    }

    if ($typeInfo.FullName -eq 'System.String' -or $typeInfo.FullName -eq 'string')
    {
        return '';
    }
    if ($typeInfo.FullName -eq 'System.Uri')
    {
        return '' -as 'System.Uri';
    }
    elseif ($typeInfo.FullName -eq 'System.Boolean')
    {
        return $false;
    }
    elseif ($typeInfo.FullName -eq 'System.Int32')
    {
        return 0;
    }
    elseif ($typeInfo.FullName -eq 'System.UInt32')
    {
        return 0;
    }
    elseif ($typeInfo.FullName -like 'System.Collections.Generic.IList*' -or $typeInfo.FullName -like 'System.Collections.Generic.List*')
    {
        [System.Type]$itemType = $typeInfo.GetGenericArguments()[0];
        $itemObj = Create-ParameterObjectImpl $itemType;

        $typeName = "System.Collections.Generic.List[" + $itemType.FullName + "]";
        $listObj = New-Object -TypeName $typeName;
        $listObj.Add($itemObj);

        return $listObj;
    }
    elseif ($typeInfo.FullName -like 'System.Collections.Generic.IDictionary*')
    {
        # Dictionary in client library always consists of string key & values.
        return New-Object 'System.Collections.Generic.Dictionary[string,string]';
    }
    elseif ($typeInfo.FullName -like 'System.Nullable*')
    {
        return $null;
    }
    elseif ($typeInfo.Namespace -eq $client_model_namespace)
    {
        $obj = New-Object $typeInfo.FullName;

        $properties = $typeInfo.GetProperties();
        foreach ($item in $properties)
        {
            $prop = [System.Reflection.PropertyInfo]$item;

            if ($prop.PropertyType.IsGenericType -and $prop.PropertyType.FullName -like 'System.Collections.Generic.*List*')
            {
                [System.Type]$itemType = $prop.PropertyType.GetGenericArguments()[0];
                $itemObj = Create-ParameterObjectImpl $itemType;
                $listTypeName = "System.Collections.Generic.List[" + $itemType.FullName + "]";

                $propObjList = New-Object -TypeName $listTypeName;
                $propObjList.Add($itemObj);

                $prop.SetValue($obj, $propObjList -as $listTypeName);
            }
            else
            {
                $propObj = Create-ParameterObjectImpl $prop.PropertyType;
                $prop.SetValue($obj, $propObj);
            }
        }
    }
    else
    {
        $obj = New-Object $typeInfo.FullName;
    }

    return $obj;
}

Write-Output (Create-ParameterObjectImpl $typeInfo);
