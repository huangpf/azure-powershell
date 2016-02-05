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
        protected object CreateVirtualNetworksGetDynamicParameters()
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

            var pVirtualNetworkName = new RuntimeDefinedParameter();
            pVirtualNetworkName.Name = "VirtualNetworkName";
            pVirtualNetworkName.ParameterType = typeof(string);
            pVirtualNetworkName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 2,
                Mandatory = true
            });
            pVirtualNetworkName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("VirtualNetworkName", pVirtualNetworkName);

            var pExpand = new RuntimeDefinedParameter();
            pExpand.Name = "Expand";
            pExpand.ParameterType = typeof(string);
            pExpand.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 3,
                Mandatory = true
            });
            pExpand.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("Expand", pExpand);

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

        protected void ExecuteVirtualNetworksGetMethod(object[] invokeMethodInputParameters)
        {
            string resourceGroupName = (string)ParseParameter(invokeMethodInputParameters[0]);
            string virtualNetworkName = (string)ParseParameter(invokeMethodInputParameters[1]);
            string expand = (string)ParseParameter(invokeMethodInputParameters[2]);

            var result = VirtualNetworksClient.Get(resourceGroupName, virtualNetworkName, expand);
            WriteObject(result);
        }
    }

    public partial class NewAzureNetworkArgumentListCmdlet : NetworkAutomationBaseCmdlet
    {
        protected PSArgument[] CreateVirtualNetworksGetParameters()
        {
            string resourceGroupName = string.Empty;
            string virtualNetworkName = string.Empty;
            string expand = string.Empty;

            return ConvertFromObjectsToArguments(
                 new string[] { "ResourceGroupName", "VirtualNetworkName", "Expand" },
                 new object[] { resourceGroupName, virtualNetworkName, expand });
        }
    }

    [Cmdlet("Get", "AzureRmVirtualNetworks", DefaultParameterSetName = "InvokeByDynamicParameters")]
    public partial class GetAzureRmVirtualNetworks : InvokeAzureNetworkMethodCmdlet
    {
        public GetAzureRmVirtualNetworks()
        {
            this.MethodName = "VirtualNetworksGet";
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

            var pVirtualNetworkName = new RuntimeDefinedParameter();
            pVirtualNetworkName.Name = "VirtualNetworkName";
            pVirtualNetworkName.ParameterType = typeof(string);
            pVirtualNetworkName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 2,
                Mandatory = true
            });
            pVirtualNetworkName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("VirtualNetworkName", pVirtualNetworkName);

            var pExpand = new RuntimeDefinedParameter();
            pExpand.Name = "Expand";
            pExpand.ParameterType = typeof(string);
            pExpand.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 3,
                Mandatory = true
            });
            pExpand.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("Expand", pExpand);

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
