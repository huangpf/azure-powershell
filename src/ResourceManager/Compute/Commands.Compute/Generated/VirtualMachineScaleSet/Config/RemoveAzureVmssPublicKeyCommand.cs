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

using Microsoft.Azure.Management.Compute.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation;

namespace Microsoft.Azure.Commands.Compute.Automation
{
    [Cmdlet("Remove", "AzureVmssPublicKey")]
    [OutputType(typeof(VirtualMachineScaleSet))]
    public class RemoveAzureVmssPublicKeyCommand : Microsoft.Azure.Commands.ResourceManager.Common.AzureRMCmdlet
    {
        [Parameter(
            Mandatory = false,
            Position = 0,
            ValueFromPipeline = true,
            ValueFromPipelineByPropertyName = true)]
        public VirtualMachineScaleSet VirtualMachineScaleSet { get; set; }

        [Parameter(
            Mandatory = false,
            Position = 1,
            ValueFromPipelineByPropertyName = true)]
        public string Path { get; set; }

        [Parameter(
            Mandatory = false,
            Position = 2,
            ValueFromPipelineByPropertyName = true)]
        public string KeyData { get; set; }

        protected override void ProcessRecord()
        {
            // VirtualMachineProfile
            if (this.VirtualMachineScaleSet.VirtualMachineProfile == null)
            {
                WriteObject(this.VirtualMachineScaleSet);
                return;
            }

            // OsProfile
            if (this.VirtualMachineScaleSet.VirtualMachineProfile.OsProfile == null)
            {
                WriteObject(this.VirtualMachineScaleSet);
                return;
            }

            // LinuxConfiguration
            if (this.VirtualMachineScaleSet.VirtualMachineProfile.OsProfile.LinuxConfiguration == null)
            {
                WriteObject(this.VirtualMachineScaleSet);
                return;
            }

            // Ssh
            if (this.VirtualMachineScaleSet.VirtualMachineProfile.OsProfile.LinuxConfiguration.Ssh == null)
            {
                WriteObject(this.VirtualMachineScaleSet);
                return;
            }

            // PublicKeys
            if (this.VirtualMachineScaleSet.VirtualMachineProfile.OsProfile.LinuxConfiguration.Ssh.PublicKeys == null)
            {
                WriteObject(this.VirtualMachineScaleSet);
                return;
            }
            var vPublicKeys = this.VirtualMachineScaleSet.VirtualMachineProfile.OsProfile.LinuxConfiguration.Ssh.PublicKeys.First
                (e =>
                    (this.Path == null || e.Path == this.Path)
                    && (this.KeyData == null || e.KeyData == this.KeyData)
                );

            if (vPublicKeys != null)
            {
                this.VirtualMachineScaleSet.VirtualMachineProfile.OsProfile.LinuxConfiguration.Ssh.PublicKeys.Remove(vPublicKeys);
            }

            if (this.VirtualMachineScaleSet.VirtualMachineProfile.OsProfile.LinuxConfiguration.Ssh.PublicKeys.Count == 0)
            {
                this.VirtualMachineScaleSet.VirtualMachineProfile.OsProfile.LinuxConfiguration.Ssh.PublicKeys = null;
            }
            WriteObject(this.VirtualMachineScaleSet);
        }
    }
}

