---
external help file: Microsoft.Azure.Commands.Compute.ManagedService.dll-Help.xml
Module Name: AzureRM.Compute.ManagedService
online version: 
schema: 2.0.0
---

# New-AzureRmVhdVM

## SYNOPSIS
Fill in the Synopsis

## SYNTAX

### DiskLink (Default)
```
New-AzureRmVhdVM [-ResourceGroupName] <String> [-Location] <String> [-OSType] <String> [-DiskLink] <String[]>
 [[-VMName] <String>] [[-VMSize] <String>]
 [[-SecurityRules] <System.Collections.Generic.List`1[Microsoft.Azure.Management.Network.Models.SecurityRule]>]
 [[-DefaultVNetAddressSpace] <String>] [[-DefaultSubnetAddressSpace] <String>]
 [[-NumberOfUploaderThreads] <Int32>] [-DefaultProfile <IAzureContextContainer>] [-WhatIf] [-Confirm]
 [<CommonParameters>]
```

### DiskFile
```
New-AzureRmVhdVM [-ResourceGroupName] <String> [-Location] <String> [-OSType] <String> [-DiskFile] <String[]>
 [[-VMName] <String>] [[-VMSize] <String>]
 [[-SecurityRules] <System.Collections.Generic.List`1[Microsoft.Azure.Management.Network.Models.SecurityRule]>]
 [[-DefaultVNetAddressSpace] <String>] [[-DefaultSubnetAddressSpace] <String>]
 [[-NumberOfUploaderThreads] <Int32>] [-DefaultProfile <IAzureContextContainer>] [-WhatIf] [-Confirm]
 [<CommonParameters>]
```

## DESCRIPTION
Fill in the Description

## EXAMPLES

### Example 1
```
PS C:\>  Add example code here
```

 Add example description here 

## PARAMETERS

### -DefaultProfile
The credentials, account, tenant, and subscription used for communication with azure.

```yaml
Type: IAzureContextContainer
Parameter Sets: (All)
Aliases: AzureRmContext, AzureCredential

Required: False
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -DefaultSubnetAddressSpace
Fill DefaultSubnetAddressSpace Description

```yaml
Type: String
Parameter Sets: (All)
Aliases: 

Required: False
Position: 8
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```

### -DefaultVNetAddressSpace
Fill DefaultVNetAddressSpace Description

```yaml
Type: String
Parameter Sets: (All)
Aliases: 

Required: False
Position: 7
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```

### -DiskFile
Fill DiskFile Description

```yaml
Type: String[]
Parameter Sets: DiskFile
Aliases: 

Required: True
Position: 3
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```

### -DiskLink
Fill DiskLink Description

```yaml
Type: String[]
Parameter Sets: DiskLink
Aliases: 

Required: True
Position: 3
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```

### -Location
Fill Location Description

```yaml
Type: String
Parameter Sets: (All)
Aliases: 

Required: True
Position: 1
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```

### -NumberOfUploaderThreads
Fill NumberOfUploaderThreads Description

```yaml
Type: Int32
Parameter Sets: (All)
Aliases: 

Required: False
Position: 9
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```

### -OSType
Fill OSType Description

```yaml
Type: String
Parameter Sets: (All)
Aliases: 
Accepted values: Windows, Linux

Required: True
Position: 2
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```

### -ResourceGroupName
Fill ResourceGroupName Description

```yaml
Type: String
Parameter Sets: (All)
Aliases: 

Required: True
Position: 0
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```

### -SecurityRules
Fill SecurityRules Description

```yaml
Type: System.Collections.Generic.List`1[Microsoft.Azure.Management.Network.Models.SecurityRule]
Parameter Sets: (All)
Aliases: 

Required: False
Position: 6
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```

### -VMName
Fill VMName Description

```yaml
Type: String
Parameter Sets: (All)
Aliases: 

Required: False
Position: 4
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```

### -VMSize
Fill VMSize Description

```yaml
Type: String
Parameter Sets: (All)
Aliases: 

Required: False
Position: 5
Default value: None
Accept pipeline input: True (ByPropertyName)
Accept wildcard characters: False
```

### -Confirm
Prompts you for confirmation before running the cmdlet.

```yaml
Type: SwitchParameter
Parameter Sets: (All)
Aliases: cf

Required: False
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### -WhatIf
Shows what would happen if the cmdlet runs.
The cmdlet is not run.

```yaml
Type: SwitchParameter
Parameter Sets: (All)
Aliases: wi

Required: False
Position: Named
Default value: None
Accept pipeline input: False
Accept wildcard characters: False
```

### CommonParameters
This cmdlet supports the common parameters: -Debug, -ErrorAction, -ErrorVariable, -InformationAction, -InformationVariable, -OutVariable, -OutBuffer, -PipelineVariable, -Verbose, -WarningAction, and -WarningVariable. For more information, see about_CommonParameters (http://go.microsoft.com/fwlink/?LinkID=113216).

## INPUTS

### System.String
System.String[]
System.Collections.Generic.List`1[[Microsoft.Azure.Management.Network.Models.SecurityRule, Microsoft.Azure.Management.Network, Version=15.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35]]
System.Nullable`1[[System.Int32, mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089]]

## OUTPUTS

### Microsoft.Azure.Commands.Compute.Models.PSAzureOperationResponse

## NOTES

## RELATED LINKS

