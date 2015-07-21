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
using Microsoft.WindowsAzure.Management.Compute;
using Microsoft.WindowsAzure.Management.Compute.Models;
using System;
using System.Collections.Generic;
using System.Management.Automation;

namespace Microsoft.WindowsAzure.Commands.Compute.Automation
{
    public partial class InvokeAzureComputeMethodCmdlet : ComputeAutomationBaseCmdlet
    {
        protected object CreateDNSServerUpdateDNSServerDynamicParameters()
        {
            dynamicParameters = new RuntimeDefinedParameterDictionary();
            var pServiceName = new RuntimeDefinedParameter();
            pServiceName.Name = "ServiceName";
            pServiceName.ParameterType = typeof(System.String);
            pServiceName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 1,
                Mandatory = true
            });
            pServiceName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("ServiceName", pServiceName);

            var pDeploymentName = new RuntimeDefinedParameter();
            pDeploymentName.Name = "DeploymentName";
            pDeploymentName.ParameterType = typeof(System.String);
            pDeploymentName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 2,
                Mandatory = true
            });
            pDeploymentName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("DeploymentName", pDeploymentName);

            var pDnsServerName = new RuntimeDefinedParameter();
            pDnsServerName.Name = "DnsServerName";
            pDnsServerName.ParameterType = typeof(System.String);
            pDnsServerName.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 3,
                Mandatory = true
            });
            pDnsServerName.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("DnsServerName", pDnsServerName);

            var pParameters = new RuntimeDefinedParameter();
            pParameters.Name = "DNSServerUpdateDNSServerParameters";
            pParameters.ParameterType = typeof(Microsoft.WindowsAzure.Management.Compute.Models.DNSUpdateParameters);
            pParameters.Attributes.Add(new ParameterAttribute
            {
                ParameterSetName = "InvokeByDynamicParameters",
                Position = 4,
                Mandatory = true
            });
            pParameters.Attributes.Add(new AllowNullAttribute());
            dynamicParameters.Add("DNSServerUpdateDNSServerParameters", pParameters);

            return dynamicParameters;
        }

        protected void ExecuteDNSServerUpdateDNSServerMethod(object[] invokeMethodInputParameters)
        {
            string serviceName = (string)ParseParameter(invokeMethodInputParameters[0]);
            string deploymentName = (string)ParseParameter(invokeMethodInputParameters[1]);
            string dnsServerName = (string)ParseParameter(invokeMethodInputParameters[2]);
            DNSUpdateParameters parameters = (DNSUpdateParameters)ParseParameter(invokeMethodInputParameters[3]);

            var result = DNSServerClient.UpdateDNSServer(serviceName, deploymentName, dnsServerName, parameters);
            WriteObject(result);
        }
    }

    public partial class NewAzureComputeParameterCmdlet : ComputeAutomationBaseCmdlet
    {
        protected object[] CreateDNSServerUpdateDNSServerParameters()
        {
            string serviceName = string.Empty;
            string deploymentName = string.Empty;
            string dnsServerName = string.Empty;
            DNSUpdateParameters parameters = new DNSUpdateParameters();

            return new object[] { serviceName, deploymentName, dnsServerName, parameters };
        }
    }
}