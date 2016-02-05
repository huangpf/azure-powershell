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

using Microsoft.Azure;
using Microsoft.WindowsAzure.Commands.Compute.Automation.Models;
using Microsoft.WindowsAzure.Management.Compute;
using Microsoft.WindowsAzure.Management.Compute.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation;

namespace Microsoft.WindowsAzure.Commands.Compute.Automation
{
    public partial class InvokeAzureComputeMethodCmdlet : ComputeAutomationBaseCmdlet
    {
        protected object CreateVirtualMachineDiskDeleteDataDiskDynamicParameters()
        {
            dynamicParameters = new RuntimeDefinedParameterDictionary();
            var pServiceName = new RuntimeDefinedParameter();
            pServiceName.Name = "ServiceName";
            pServiceName.ParameterType = typeof(string);
            pServiceName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 1,
                Mandatory = false
            });
            pServiceName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("ServiceName", pServiceName);

            var pDeploymentName = new RuntimeDefinedParameter();
            pDeploymentName.Name = "DeploymentName";
            pDeploymentName.ParameterType = typeof(string);
            pDeploymentName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 2,
                Mandatory = false
            });
            pDeploymentName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("DeploymentName", pDeploymentName);

            var pRoleName = new RuntimeDefinedParameter();
            pRoleName.Name = "RoleName";
            pRoleName.ParameterType = typeof(string);
            pRoleName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 3,
                Mandatory = false
            });
            pRoleName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("RoleName", pRoleName);

            var pLogicalUnitNumber = new RuntimeDefinedParameter();
            pLogicalUnitNumber.Name = "LogicalUnitNumber";
            pLogicalUnitNumber.ParameterType = typeof(int);
            pLogicalUnitNumber.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 4,
                Mandatory = false
            });
            pLogicalUnitNumber.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("LogicalUnitNumber", pLogicalUnitNumber);

            var pDeleteFromStorage = new RuntimeDefinedParameter();
            pDeleteFromStorage.Name = "DeleteFromStorage";
            pDeleteFromStorage.ParameterType = typeof(bool);
            pDeleteFromStorage.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 5,
                Mandatory = false
            });
            pDeleteFromStorage.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("DeleteFromStorage", pDeleteFromStorage);

            var pArgumentList = new RuntimeDefinedParameter();
            pArgumentList.Name = "ArgumentList";
            pArgumentList.ParameterType = typeof(object[]);
            pArgumentList.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByStaticParameters",
                Position = 6,
                Mandatory = true
            });
            pArgumentList.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("ArgumentList", pArgumentList);

            return dynamicParameters;
        }

        protected void ExecuteVirtualMachineDiskDeleteDataDiskMethod(object[] invokeMethodInputParameters)
        {
            string serviceName = (string)ParseParameter(invokeMethodInputParameters[0]);
            string deploymentName = (string)ParseParameter(invokeMethodInputParameters[1]);
            string roleName = (string)ParseParameter(invokeMethodInputParameters[2]);
            int logicalUnitNumber = (int)ParseParameter(invokeMethodInputParameters[3]);
            bool deleteFromStorage = (bool)ParseParameter(invokeMethodInputParameters[4]);

            var result = VirtualMachineDiskClient.DeleteDataDisk(serviceName, deploymentName, roleName, logicalUnitNumber, deleteFromStorage);
            WriteObject(result);
        }
    }

    public partial class NewAzureComputeArgumentListCmdlet : ComputeAutomationBaseCmdlet
    {
        protected PSArgument[] CreateVirtualMachineDiskDeleteDataDiskParameters()
        {
            string serviceName = string.Empty;
            string deploymentName = string.Empty;
            string roleName = string.Empty;
            int logicalUnitNumber = new int();
            bool deleteFromStorage = new bool();

            return ConvertFromObjectsToArguments(
                 new string[] { "ServiceName", "DeploymentName", "RoleName", "LogicalUnitNumber", "DeleteFromStorage" },
                 new object[] { serviceName, deploymentName, roleName, logicalUnitNumber, deleteFromStorage });
        }
    }
}
