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
using Microsoft.Azure.Commands.Compute.Automation.Models;
using Microsoft.Azure.Management.Compute;
using Microsoft.Azure.Management.Compute.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation;

namespace Microsoft.Azure.Commands.Compute.Automation
{
    public partial class InvokeAzureComputeMethodCmdlet : ComputeAutomationBaseCmdlet
    {
        protected object CreateVirtualMachineScaleSetDeallocateInstancesDynamicParameters()
        {
            dynamicParameters = new RuntimeDefinedParameterDictionary();
            var pResourceGroupName = new RuntimeDefinedParameter();
            pResourceGroupName.Name = "ResourceGroupName";
            pResourceGroupName.ParameterType = typeof(System.String);
            pResourceGroupName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 1,
                Mandatory = true
            });
            pResourceGroupName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("ResourceGroupName", pResourceGroupName);

            var pVMScaleSetName = new RuntimeDefinedParameter();
            pVMScaleSetName.Name = "VMScaleSetName";
            pVMScaleSetName.ParameterType = typeof(System.String);
            pVMScaleSetName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 2,
                Mandatory = true
            });
            pVMScaleSetName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("VMScaleSetName", pVMScaleSetName);

            var pVMInstanceIDs = new RuntimeDefinedParameter();
            pVMInstanceIDs.Name = "VMInstanceIDs";
            pVMInstanceIDs.ParameterType = typeof(Microsoft.Azure.Management.Compute.Models.VirtualMachineScaleSetVMInstanceIDs);
            pVMInstanceIDs.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 3,
                Mandatory = true
            });
            pVMInstanceIDs.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("VMInstanceIDs", pVMInstanceIDs);

            var pArgumentList = new RuntimeDefinedParameter();
            pArgumentList.Name = "ArgumentList";
            pArgumentList.ParameterType = typeof(object[]);
            pArgumentList.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByStaticParameters",
                Position = 4,
                Mandatory = true
            });
            pArgumentList.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("ArgumentList", pArgumentList);

            return dynamicParameters;
        }

        protected void ExecuteVirtualMachineScaleSetDeallocateInstancesMethod(object[] invokeMethodInputParameters)
        {
            string resourceGroupName = (string)ParseParameter(invokeMethodInputParameters[0]);
            string vmScaleSetName = (string)ParseParameter(invokeMethodInputParameters[1]);
            VirtualMachineScaleSetVMInstanceIDs vmInstanceIDs = (VirtualMachineScaleSetVMInstanceIDs)ParseParameter(invokeMethodInputParameters[2]);

            var result = VirtualMachineScaleSetClient.DeallocateInstances(resourceGroupName, vmScaleSetName, vmInstanceIDs);
            WriteObject(result);
        }
    }

    public partial class NewAzureComputeArgumentListCmdlet : ComputeAutomationBaseCmdlet
    {
        protected PSArgument[] CreateVirtualMachineScaleSetDeallocateInstancesParameters()
        {
            string resourceGroupName = string.Empty;
            string vmScaleSetName = string.Empty;
            VirtualMachineScaleSetVMInstanceIDs vmInstanceIDs = new VirtualMachineScaleSetVMInstanceIDs();

            return ConvertFromObjectsToArguments(new string[] { "ResourceGroupName", "VMScaleSetName", "VMInstanceIDs" }, new object[] { resourceGroupName, vmScaleSetName, vmInstanceIDs });
        }
    }

    [Cmdlet("Stop", "AzureVirtualMachineScaleSetInstancesWithDeallocation")]
    public partial class StopAzureVirtualMachineScaleSetInstancesWithDeallocation : InvokeAzureComputeMethodCmdlet
    {
        public StopAzureVirtualMachineScaleSetInstancesWithDeallocation()
        {
            this.MethodName = "VirtualMachineScaleSetDeallocateInstances";
        }

        public override string MethodName { get; set; }

        protected override void ProcessRecord()
        {
            base.ProcessRecord();
        }

        public override object GetDynamicParameters()
        {
            dynamicParameters = new RuntimeDefinedParameterDictionary();
            var pResourceGroupName = new RuntimeDefinedParameter();
            pResourceGroupName.Name = "ResourceGroupName";
            pResourceGroupName.ParameterType = typeof(System.String);
            pResourceGroupName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 1,
                Mandatory = true
            });
            pResourceGroupName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("ResourceGroupName", pResourceGroupName);

            var pVMScaleSetName = new RuntimeDefinedParameter();
            pVMScaleSetName.Name = "VMScaleSetName";
            pVMScaleSetName.ParameterType = typeof(System.String);
            pVMScaleSetName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 2,
                Mandatory = true
            });
            pVMScaleSetName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("VMScaleSetName", pVMScaleSetName);

            var pVMInstanceIDs = new RuntimeDefinedParameter();
            pVMInstanceIDs.Name = "VMInstanceIDs";
            pVMInstanceIDs.ParameterType = typeof(Microsoft.Azure.Management.Compute.Models.VirtualMachineScaleSetVMInstanceIDs);
            pVMInstanceIDs.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 3,
                Mandatory = true
            });
            pVMInstanceIDs.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("VMInstanceIDs", pVMInstanceIDs);

            var pArgumentList = new RuntimeDefinedParameter();
            pArgumentList.Name = "ArgumentList";
            pArgumentList.ParameterType = typeof(object[]);
            pArgumentList.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByStaticParameters",
                Position = 4,
                Mandatory = true
            });
            pArgumentList.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("ArgumentList", pArgumentList);

            return dynamicParameters;
        }
    }
}
