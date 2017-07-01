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
    [Obsolete("This cmdlet will be removed in an upcoming release.  Updating the image reference of a disk is not supported." +
        "To set the image reference of a disk, please use Set-AzureRmDiskImageReference command." )]
    [Cmdlet("Set", "AzureRmDiskUpdateImageReference", SupportsShouldProcess = true)]
    [OutputType(typeof(DiskUpdate))]
    public class SetAzureRmDiskUpdateImageReferenceCommand : Microsoft.Azure.Commands.ResourceManager.Common.AzureRMCmdlet
    {
        [Parameter(
            Mandatory = true,
            Position = 0,
            ValueFromPipeline = true,
            ValueFromPipelineByPropertyName = true)]
        public DiskUpdate DiskUpdate { get; set; }

        [Parameter(
            Mandatory = false,
            Position = 1,
            ValueFromPipelineByPropertyName = true)]
        public string Id { get; set; }

        [Parameter(
            Mandatory = false,
            Position = 2,
            ValueFromPipelineByPropertyName = true)]
        public int? Lun { get; set; }

        protected override void ProcessRecord()
        {
            if (ShouldProcess("DiskUpdate", "Set"))
            {
                Run();
            }
        }

        private void Run()
        {
            WriteObject(this.DiskUpdate);
        }
    }
}

