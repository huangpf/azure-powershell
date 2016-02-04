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
        protected object CreateLoadBalancerUpdateDynamicParameters()
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

            var pLoadBalancerName = new RuntimeDefinedParameter();
            pLoadBalancerName.Name = "LoadBalancerName";
            pLoadBalancerName.ParameterType = typeof(string);
            pLoadBalancerName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 3,
                Mandatory = false
            });
            pLoadBalancerName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("LoadBalancerName", pLoadBalancerName);

            var pParameters = new RuntimeDefinedParameter();
            pParameters.Name = "LoadBalancerUpdateParameter";
            pParameters.ParameterType = typeof(LoadBalancerUpdateParameters);
            pParameters.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 4,
                Mandatory = false
            });
            pParameters.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("LoadBalancerUpdateParameter", pParameters);

            var pArgumentList = new RuntimeDefinedParameter();
            pArgumentList.Name = "ArgumentList";
            pArgumentList.ParameterType = typeof(object[]);
            pArgumentList.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByStaticParameters",
                Position = 5,
                Mandatory = true
            });
            pArgumentList.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("ArgumentList", pArgumentList);

            return dynamicParameters;
        }

        protected void ExecuteLoadBalancerUpdateMethod(object[] invokeMethodInputParameters)
        {
            string serviceName = (string)ParseParameter(invokeMethodInputParameters[0]);
            string deploymentName = (string)ParseParameter(invokeMethodInputParameters[1]);
            string loadBalancerName = (string)ParseParameter(invokeMethodInputParameters[2]);
            LoadBalancerUpdateParameters parameters = (LoadBalancerUpdateParameters)ParseParameter(invokeMethodInputParameters[3]);

            var result = LoadBalancerClient.Update(serviceName, deploymentName, loadBalancerName, parameters);
            WriteObject(result);
        }
    }

    public partial class NewAzureComputeArgumentListCmdlet : ComputeAutomationBaseCmdlet
    {
        protected PSArgument[] CreateLoadBalancerUpdateParameters()
        {
            string serviceName = string.Empty;
            string deploymentName = string.Empty;
            string loadBalancerName = string.Empty;
            LoadBalancerUpdateParameters parameters = new LoadBalancerUpdateParameters();

            return ConvertFromObjectsToArguments(
                 new string[] { "ServiceName", "DeploymentName", "LoadBalancerName", "Parameters" },
                 new object[] { serviceName, deploymentName, loadBalancerName, parameters });
        }
    }
}
