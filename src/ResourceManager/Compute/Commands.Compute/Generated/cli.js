/**
 * Copyright (c) Microsoft.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var __ = require('underscore');
var util = require('util');

var profile = require('../../../util/profile');
var utils = require('../../../util/utils');

var $ = utils.getLocaleString;

exports.init = function (cli) {

  var compute = cli.category('compute')
    .description($('Commands for Azure Compute'));

//VirtualMachineScaleSet.CreateOrUpdate
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('CreateOrUpdate')
.description($('VirtualMachineScaleSet CreateOrUpdate'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--Parameters <Parameters>', $('Parameters'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, Parameters, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.createOrUpdate(ResourceGroupName, Parameters, _);
  cli.output.json(result);
});
//VirtualMachineScaleSet.Deallocate
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('Deallocate')
.description($('VirtualMachineScaleSet Deallocate'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.deallocate(ResourceGroupName, VMScaleSetName, _);
  cli.output.json(result);
});
//VirtualMachineScaleSet.DeallocateInstances
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('DeallocateInstances')
.description($('VirtualMachineScaleSet DeallocateInstances'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('--VMInstanceIDs <VMInstanceIDs>', $('VMInstanceIDs'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, VMInstanceIDs, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.deallocateInstances(ResourceGroupName, VMScaleSetName, VMInstanceIDs, _);
  cli.output.json(result);
});
//VirtualMachineScaleSet.Delete
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('Delete')
.description($('VirtualMachineScaleSet Delete'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.delete(ResourceGroupName, VMScaleSetName, _);
  cli.output.json(result);
});
//VirtualMachineScaleSet.DeleteInstances
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('DeleteInstances')
.description($('VirtualMachineScaleSet DeleteInstances'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('--VMInstanceIDs <VMInstanceIDs>', $('VMInstanceIDs'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, VMInstanceIDs, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.deleteInstances(ResourceGroupName, VMScaleSetName, VMInstanceIDs, _);
  cli.output.json(result);
});
//VirtualMachineScaleSet.Get
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('Get')
.description($('VirtualMachineScaleSet Get'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.get(ResourceGroupName, VMScaleSetName, _);
  cli.output.json(result);
});
//VirtualMachineScaleSet.List
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('List')
.description($('VirtualMachineScaleSet List'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.list(ResourceGroupName, _);
  cli.output.json(result);
});
//VirtualMachineScaleSet.ListAll
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('ListAll')
.description($('VirtualMachineScaleSet ListAll'))
.usage('[options]')
.option('--Parameters <Parameters>', $('Parameters'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (Parameters, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.listAll(Parameters, _);
  cli.output.json(result);
});
//VirtualMachineScaleSet.ListNext
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('ListNext')
.description($('VirtualMachineScaleSet ListNext'))
.usage('[options]')
.option('--NextLink <NextLink>', $('NextLink'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (NextLink, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.listNext(NextLink, _);
  cli.output.json(result);
});
//VirtualMachineScaleSet.ListSkus
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('ListSkus')
.description($('VirtualMachineScaleSet ListSkus'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.listSkus(ResourceGroupName, VMScaleSetName, _);
  cli.output.json(result);
});
//VirtualMachineScaleSet.PowerOff
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('PowerOff')
.description($('VirtualMachineScaleSet PowerOff'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.powerOff(ResourceGroupName, VMScaleSetName, _);
  cli.output.json(result);
});
//VirtualMachineScaleSet.PowerOffInstances
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('PowerOffInstances')
.description($('VirtualMachineScaleSet PowerOffInstances'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('--VMInstanceIDs <VMInstanceIDs>', $('VMInstanceIDs'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, VMInstanceIDs, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.powerOffInstances(ResourceGroupName, VMScaleSetName, VMInstanceIDs, _);
  cli.output.json(result);
});
//VirtualMachineScaleSet.Restart
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('Restart')
.description($('VirtualMachineScaleSet Restart'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.restart(ResourceGroupName, VMScaleSetName, _);
  cli.output.json(result);
});
//VirtualMachineScaleSet.RestartInstances
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('RestartInstances')
.description($('VirtualMachineScaleSet RestartInstances'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('--VMInstanceIDs <VMInstanceIDs>', $('VMInstanceIDs'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, VMInstanceIDs, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.restartInstances(ResourceGroupName, VMScaleSetName, VMInstanceIDs, _);
  cli.output.json(result);
});
//VirtualMachineScaleSet.Start
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('Start')
.description($('VirtualMachineScaleSet Start'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.start(ResourceGroupName, VMScaleSetName, _);
  cli.output.json(result);
});
//VirtualMachineScaleSet.StartInstances
var VirtualMachineScaleSet = compute.category('virtualMachineScaleSet').description($('Commands for Azure Compute'));VirtualMachineScaleSet.command('StartInstances')
.description($('VirtualMachineScaleSet StartInstances'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('--VMInstanceIDs <VMInstanceIDs>', $('VMInstanceIDs'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, VMInstanceIDs, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSets.startInstances(ResourceGroupName, VMScaleSetName, VMInstanceIDs, _);
  cli.output.json(result);
});
//VirtualMachineScaleSetVM.Deallocate
var VirtualMachineScaleSetVM = compute.category('virtualMachineScaleSetVM').description($('Commands for Azure Compute'));VirtualMachineScaleSetVM.command('Deallocate')
.description($('VirtualMachineScaleSetVM Deallocate'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('--InstanceId <InstanceId>', $('InstanceId'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, InstanceId, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSetVMs.deallocate(ResourceGroupName, VMScaleSetName, InstanceId, _);
  cli.output.json(result);
});
//VirtualMachineScaleSetVM.Delete
var VirtualMachineScaleSetVM = compute.category('virtualMachineScaleSetVM').description($('Commands for Azure Compute'));VirtualMachineScaleSetVM.command('Delete')
.description($('VirtualMachineScaleSetVM Delete'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('--InstanceId <InstanceId>', $('InstanceId'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, InstanceId, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSetVMs.delete(ResourceGroupName, VMScaleSetName, InstanceId, _);
  cli.output.json(result);
});
//VirtualMachineScaleSetVM.Get
var VirtualMachineScaleSetVM = compute.category('virtualMachineScaleSetVM').description($('Commands for Azure Compute'));VirtualMachineScaleSetVM.command('Get')
.description($('VirtualMachineScaleSetVM Get'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('--InstanceId <InstanceId>', $('InstanceId'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, InstanceId, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSetVMs.get(ResourceGroupName, VMScaleSetName, InstanceId, _);
  cli.output.json(result);
});
//VirtualMachineScaleSetVM.GetInstanceView
var VirtualMachineScaleSetVM = compute.category('virtualMachineScaleSetVM').description($('Commands for Azure Compute'));VirtualMachineScaleSetVM.command('GetInstanceView')
.description($('VirtualMachineScaleSetVM GetInstanceView'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('--InstanceId <InstanceId>', $('InstanceId'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, InstanceId, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSetVMs.getInstanceView(ResourceGroupName, VMScaleSetName, InstanceId, _);
  cli.output.json(result);
});
//VirtualMachineScaleSetVM.List
var VirtualMachineScaleSetVM = compute.category('virtualMachineScaleSetVM').description($('Commands for Azure Compute'));VirtualMachineScaleSetVM.command('List')
.description($('VirtualMachineScaleSetVM List'))
.usage('[options]')
.option('--Parameters <Parameters>', $('Parameters'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (Parameters, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSetVMs.list(Parameters, _);
  cli.output.json(result);
});
//VirtualMachineScaleSetVM.PowerOff
var VirtualMachineScaleSetVM = compute.category('virtualMachineScaleSetVM').description($('Commands for Azure Compute'));VirtualMachineScaleSetVM.command('PowerOff')
.description($('VirtualMachineScaleSetVM PowerOff'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('--InstanceId <InstanceId>', $('InstanceId'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, InstanceId, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSetVMs.powerOff(ResourceGroupName, VMScaleSetName, InstanceId, _);
  cli.output.json(result);
});
//VirtualMachineScaleSetVM.Restart
var VirtualMachineScaleSetVM = compute.category('virtualMachineScaleSetVM').description($('Commands for Azure Compute'));VirtualMachineScaleSetVM.command('Restart')
.description($('VirtualMachineScaleSetVM Restart'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('--InstanceId <InstanceId>', $('InstanceId'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, InstanceId, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSetVMs.restart(ResourceGroupName, VMScaleSetName, InstanceId, _);
  cli.output.json(result);
});
//VirtualMachineScaleSetVM.Start
var VirtualMachineScaleSetVM = compute.category('virtualMachineScaleSetVM').description($('Commands for Azure Compute'));VirtualMachineScaleSetVM.command('Start')
.description($('VirtualMachineScaleSetVM Start'))
.usage('[options]')
.option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
.option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
.option('--InstanceId <InstanceId>', $('InstanceId'))
.option('-s, --subscription <subscription>', $('the subscription identifier'))
.execute(function (ResourceGroupName, VMScaleSetName, InstanceId, options, _) {
  var subscription = profile.current.getSubscription(options.subscription);
  var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
  var result = computeManagementClient.virtualMachineScaleSetVMs.start(ResourceGroupName, VMScaleSetName, InstanceId, _);
  cli.output.json(result);
});

};
