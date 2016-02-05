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
using Microsoft.Azure.Commands.Network.Automation.Models;
using Microsoft.Azure.Management.Network;
using Microsoft.Azure.Management.Network.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation;

namespace Microsoft.Azure.Commands.Network.Automation
{
    public partial class InvokeAzureNetworkMethodCmdlet : NetworkAutomationBaseCmdlet
    {
        protected object CreateVirtualNetworkGatewaysGeneratevpnclientpackageDynamicParameters()
        {
            dynamicParameters = new RuntimeDefinedParameterDictionary();
            var pResourceGroupName = new RuntimeDefinedParameter();
            pResourceGroupName.Name = "ResourceGroupName";
            pResourceGroupName.ParameterType = typeof(string);
            pResourceGroupName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 1,
                Mandatory = true
            });
            pResourceGroupName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("ResourceGroupName", pResourceGroupName);

            var pVirtualNetworkGatewayName = new RuntimeDefinedParameter();
            pVirtualNetworkGatewayName.Name = "VirtualNetworkGatewayName";
            pVirtualNetworkGatewayName.ParameterType = typeof(string);
            pVirtualNetworkGatewayName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 2,
                Mandatory = true
            });
            pVirtualNetworkGatewayName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("VirtualNetworkGatewayName", pVirtualNetworkGatewayName);

            var pProcessorArchitecture = new RuntimeDefinedParameter();
            pProcessorArchitecture.Name = "ProcessorArchitecture";
            pProcessorArchitecture.ParameterType = typeof(string);
            pProcessorArchitecture.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 3,
                Mandatory = false
            });
            pProcessorArchitecture.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("ProcessorArchitecture", pProcessorArchitecture);

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

        protected void ExecuteVirtualNetworkGatewaysGeneratevpnclientpackageMethod(object[] invokeMethodInputParameters)
        {
            string resourceGroupName = (string)ParseParameter(invokeMethodInputParameters[0]);
            string virtualNetworkGatewayName = (string)ParseParameter(invokeMethodInputParameters[1]);
            var parameters = new VpnClientParameters();
            var pProcessorArchitecture = (string) ParseParameter(invokeMethodInputParameters[2]);
            parameters.ProcessorArchitecture = string.IsNullOrEmpty(pProcessorArchitecture) ? null : pProcessorArchitecture;

            var result = VirtualNetworkGatewaysClient.Generatevpnclientpackage(resourceGroupName, virtualNetworkGatewayName, parameters);
            WriteObject(result);
        }
    }

    public partial class NewAzureNetworkArgumentListCmdlet : NetworkAutomationBaseCmdlet
    {
        protected PSArgument[] CreateVirtualNetworkGatewaysGeneratevpnclientpackageParameters()
        {
            string resourceGroupName = string.Empty;
            string virtualNetworkGatewayName = string.Empty;
            var pProcessorArchitecture = string.Empty;

            return ConvertFromObjectsToArguments(
                 new string[] { "ResourceGroupName", "VirtualNetworkGatewayName", "ProcessorArchitecture" },
                 new object[] { resourceGroupName, virtualNetworkGatewayName, pProcessorArchitecture });
        }
    }

    [Cmdlet("Generatevpnclientpackage", "AzureRmVirtualNetworkGateways", DefaultParameterSetName = "InvokeByDynamicParameters")]
    public partial class GeneratevpnclientpackageAzureRmVirtualNetworkGateways : InvokeAzureNetworkMethodCmdlet
    {
        public GeneratevpnclientpackageAzureRmVirtualNetworkGateways()
        {
            this.MethodName = "VirtualNetworkGatewaysGeneratevpnclientpackage";
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
            pResourceGroupName.ParameterType = typeof(string);
            pResourceGroupName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 1,
                Mandatory = true
            });
            pResourceGroupName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("ResourceGroupName", pResourceGroupName);

            var pVirtualNetworkGatewayName = new RuntimeDefinedParameter();
            pVirtualNetworkGatewayName.Name = "VirtualNetworkGatewayName";
            pVirtualNetworkGatewayName.ParameterType = typeof(string);
            pVirtualNetworkGatewayName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 2,
                Mandatory = true
            });
            pVirtualNetworkGatewayName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("VirtualNetworkGatewayName", pVirtualNetworkGatewayName);

            var pProcessorArchitecture = new RuntimeDefinedParameter();
            pProcessorArchitecture.Name = "ProcessorArchitecture";
            pProcessorArchitecture.ParameterType = typeof(string);
            pProcessorArchitecture.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 3,
                Mandatory = false
            });
            pProcessorArchitecture.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("ProcessorArchitecture", pProcessorArchitecture);

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
