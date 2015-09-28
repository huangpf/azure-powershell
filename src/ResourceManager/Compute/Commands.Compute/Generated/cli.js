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
var fs = require('fs');
var util = require('util');

var profile = require('../../../util/profile');
var utils = require('../../../util/utils');

var $ = utils.getLocaleString;

function beautify(jsonText) {
    var obj = JSON.parse(jsonText);
    return JSON.stringify(obj, null, 2);
}

exports.init = function (cli) {

  var compute = cli.category('compute')
    .description($('Commands for Azure Compute'));

//virtualMachineScaleSet -> CreateOrUpdate
/*
{"provisioningState":"","sku":{"capacity":null,"name":"","tier":""},"upgradePolicy":{"mode":""},"virtualMachineProfile":{"extensions":[{"autoUpgradeMinorVersion":false,"extensionType":"","instanceView":{"extensionType":"","name":"","subStatuses":[{"code":"","displayStatus":"","level":"","message":"","time":null}],"typeHandlerVersion":"","statuses":[{"code":"","displayStatus":"","level":"","message":"","time":null}]},"protectedSettings":"","provisioningState":"","publisher":"","settings":"","typeHandlerVersion":"","id":"","name":"","type":"","location":"","tags":{}}],"networkProfile":{"networkInterfaceConfigurations":[{"iPConfigurations":[{"loadBalancerBackendAddressPools":[{"referenceUri":""}],"name":"","subnet":{"referenceUri":""}}],"name":"","primary":null}]},"oSProfile":{"computerNamePrefix":"","adminPassword":"","adminUsername":"","customData":"","linuxConfiguration":{"disablePasswordAuthentication":null,"sshConfiguration":{"publicKeys":[{"keyData":"","path":""}]}},"secrets":[{"sourceVault":{"referenceUri":""},"vaultCertificates":[{"certificateStore":"","certificateUrl":""}]}],"windowsConfiguration":{"additionalUnattendContents":[{"componentName":"","content":"","passName":"","settingName":""}],"enableAutomaticUpdates":null,"provisionVMAgent":null,"timeZone":"","winRMConfiguration":{"listeners":[{"certificateUrl":"","protocol":""}]}}},"storageProfile":{"imageReference":{"offer":"","publisher":"","sku":"","version":""},"oSDisk":{"caching":"","createOption":"","name":"","operatingSystemType":"","sourceImage":{"uri":""},"virtualHardDiskContainers":[""]}}},"id":"","name":"","type":"","location":"","tags":{}}
*/
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('createOrUpdate')
  .description($('vmss createOrUpdate'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--Parameters <Parameters>', $('Parameters'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, Parameters, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('Parameters = ' + options.Parameters);
    if (options.ParameterFile) {
      console.log("Reading file content from: \"" + options.ParameterFile + "\"");
      var fileContent = fs.readFileSync(options.ParameterFile, 'utf8');
      var ParametersObj = JSON.parse(fileContent);
    }
    else {
      var ParametersObj = JSON.parse(options.Parameters);
    }
    console.log('ParametersObj = ' + JSON.stringify(ParametersObj));
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.createOrUpdate);
    var result = computeManagementClient.virtualMachineScaleSets.createOrUpdate(options.ResourceGroupName, ParametersObj, _);
    cli.output.json(result);
  });
  var parameters = vmss.category('parameters').description($('Generate Parameters for Azure Compute VirtualMachineScaleSet'));
  parameters.command('createOrUpdate')
  .description($('Generate vmss parameter string or files.'))
  .usage('[options]')
  .option('--generate', $('To generate parameter string/file for method: createOrUpdate.'))
  .option('--output-file <output-file>', $('The output file path.'))
  .execute(function (generate, outputFile, options, _) {
    console.log("{\"provisioningState\":\"\",\"sku\":{\"capacity\":null,\"name\":\"\",\"tier\":\"\"},\"upgradePolicy\":{\"mode\":\"\"},\"virtualMachineProfile\":{\"extensions\":[{\"autoUpgradeMinorVersion\":false,\"extensionType\":\"\",\"instanceView\":{\"extensionType\":\"\",\"name\":\"\",\"subStatuses\":[{\"code\":\"\",\"displayStatus\":\"\",\"level\":\"\",\"message\":\"\",\"time\":null}],\"typeHandlerVersion\":\"\",\"statuses\":[{\"code\":\"\",\"displayStatus\":\"\",\"level\":\"\",\"message\":\"\",\"time\":null}]},\"protectedSettings\":\"\",\"provisioningState\":\"\",\"publisher\":\"\",\"settings\":\"\",\"typeHandlerVersion\":\"\",\"id\":\"\",\"name\":\"\",\"type\":\"\",\"location\":\"\",\"tags\":{}}],\"networkProfile\":{\"networkInterfaceConfigurations\":[{\"iPConfigurations\":[{\"loadBalancerBackendAddressPools\":[{\"referenceUri\":\"\"}],\"name\":\"\",\"subnet\":{\"referenceUri\":\"\"}}],\"name\":\"\",\"primary\":null}]},\"oSProfile\":{\"computerNamePrefix\":\"\",\"adminPassword\":\"\",\"adminUsername\":\"\",\"customData\":\"\",\"linuxConfiguration\":{\"disablePasswordAuthentication\":null,\"sshConfiguration\":{\"publicKeys\":[{\"keyData\":\"\",\"path\":\"\"}]}},\"secrets\":[{\"sourceVault\":{\"referenceUri\":\"\"},\"vaultCertificates\":[{\"certificateStore\":\"\",\"certificateUrl\":\"\"}]}],\"windowsConfiguration\":{\"additionalUnattendContents\":[{\"componentName\":\"\",\"content\":\"\",\"passName\":\"\",\"settingName\":\"\"}],\"enableAutomaticUpdates\":null,\"provisionVMAgent\":null,\"timeZone\":\"\",\"winRMConfiguration\":{\"listeners\":[{\"certificateUrl\":\"\",\"protocol\":\"\"}]}}},\"storageProfile\":{\"imageReference\":{\"offer\":\"\",\"publisher\":\"\",\"sku\":\"\",\"version\":\"\"},\"oSDisk\":{\"caching\":\"\",\"createOption\":\"\",\"name\":\"\",\"operatingSystemType\":\"\",\"sourceImage\":{\"uri\":\"\"},\"virtualHardDiskContainers\":[\"\"]}}},\"id\":\"\",\"name\":\"\",\"type\":\"\",\"location\":\"\",\"tags\":{}}");
    var filePath = "vmss_createOrUpdate.json";
    if (options.outputFile) { filePath = options.outputFile; };
    fs.writeFileSync(filePath, beautify("{\r\n\"provisioningState\":\"\",\r\n\"sku\":{\r\n\"capacity\":null,\r\n\"name\":\"\",\r\n\"tier\":\"\"\r\n},\r\n\"upgradePolicy\":{\r\n\"mode\":\"\"\r\n},\r\n\"virtualMachineProfile\":{\r\n\"extensions\":[\r\n{\r\n\"autoUpgradeMinorVersion\":false,\r\n\"extensionType\":\"\",\r\n\"instanceView\":{\r\n\"extensionType\":\"\",\r\n\"name\":\"\",\r\n\"subStatuses\":[\r\n{\r\n\"code\":\"\",\r\n\"displayStatus\":\"\",\r\n\"level\":\"\",\r\n\"message\":\"\",\r\n\"time\":null\r\n}\r\n],\r\n\"typeHandlerVersion\":\"\",\r\n\"statuses\":[\r\n{\r\n\"code\":\"\",\r\n\"displayStatus\":\"\",\r\n\"level\":\"\",\r\n\"message\":\"\",\r\n\"time\":null\r\n}\r\n]\r\n},\r\n\"protectedSettings\":\"\",\r\n\"provisioningState\":\"\",\r\n\"publisher\":\"\",\r\n\"settings\":\"\",\r\n\"typeHandlerVersion\":\"\",\r\n\"id\":\"\",\r\n\"name\":\"\",\r\n\"type\":\"\",\r\n\"location\":\"\",\r\n\"tags\":{\r\n\r\n}\r\n}\r\n],\r\n\"networkProfile\":{\r\n\"networkInterfaceConfigurations\":[\r\n{\r\n\"iPConfigurations\":[\r\n{\r\n\"loadBalancerBackendAddressPools\":[\r\n{\r\n\"referenceUri\":\"\"\r\n}\r\n],\r\n\"name\":\"\",\r\n\"subnet\":{\r\n\"referenceUri\":\"\"\r\n}\r\n}\r\n],\r\n\"name\":\"\",\r\n\"primary\":null\r\n}\r\n]\r\n},\r\n\"oSProfile\":{\r\n\"computerNamePrefix\":\"\",\r\n\"adminPassword\":\"\",\r\n\"adminUsername\":\"\",\r\n\"customData\":\"\",\r\n\"linuxConfiguration\":{\r\n\"disablePasswordAuthentication\":null,\r\n\"sshConfiguration\":{\r\n\"publicKeys\":[\r\n{\r\n\"keyData\":\"\",\r\n\"path\":\"\"\r\n}\r\n]\r\n}\r\n},\r\n\"secrets\":[\r\n{\r\n\"sourceVault\":{\r\n\"referenceUri\":\"\"\r\n},\r\n\"vaultCertificates\":[\r\n{\r\n\"certificateStore\":\"\",\r\n\"certificateUrl\":\"\"\r\n}\r\n]\r\n}\r\n],\r\n\"windowsConfiguration\":{\r\n\"additionalUnattendContents\":[\r\n{\r\n\"componentName\":\"\",\r\n\"content\":\"\",\r\n\"passName\":\"\",\r\n\"settingName\":\"\"\r\n}\r\n],\r\n\"enableAutomaticUpdates\":null,\r\n\"provisionVMAgent\":null,\r\n\"timeZone\":\"\",\r\n\"winRMConfiguration\":{\r\n\"listeners\":[\r\n{\r\n\"certificateUrl\":\"\",\r\n\"protocol\":\"\"\r\n}\r\n]\r\n}\r\n}\r\n},\r\n\"storageProfile\":{\r\n\"imageReference\":{\r\n\"offer\":\"\",\r\n\"publisher\":\"\",\r\n\"sku\":\"\",\r\n\"version\":\"\"\r\n},\r\n\"oSDisk\":{\r\n\"caching\":\"\",\r\n\"createOption\":\"\",\r\n\"name\":\"\",\r\n\"operatingSystemType\":\"\",\r\n\"sourceImage\":{\r\n\"uri\":\"\"\r\n},\r\n\"virtualHardDiskContainers\":[\r\n\"\"\r\n]\r\n}\r\n}\r\n},\r\n\"id\":\"\",\r\n\"name\":\"\",\r\n\"type\":\"\",\r\n\"location\":\"\",\r\n\"tags\":{\r\n\r\n}\r\n}"));
    console.log("Parameter file output to: " + filePath);
  });
//virtualMachineScaleSet -> Deallocate
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('deallocate')
  .description($('vmss deallocate'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.deallocate);
    var result = computeManagementClient.virtualMachineScaleSets.deallocate(options.ResourceGroupName, options.VMScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> DeallocateInstances
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('deallocateInstances')
  .description($('vmss deallocateInstances'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--VMInstanceIDs <VMInstanceIDs>', $('VMInstanceIDs'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, VMInstanceIDs, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    console.log('VMInstanceIDs = ' + options.VMInstanceIDs);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.deallocateInstances);
    var result = computeManagementClient.virtualMachineScaleSets.deallocateInstances(options.ResourceGroupName, options.VMScaleSetName, options.VMInstanceIDs, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> Delete
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('delete')
  .description($('vmss delete'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.delete);
    var result = computeManagementClient.virtualMachineScaleSets.delete(options.ResourceGroupName, options.VMScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> DeleteInstances
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('deleteInstances')
  .description($('vmss deleteInstances'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--VMInstanceIDs <VMInstanceIDs>', $('VMInstanceIDs'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, VMInstanceIDs, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    console.log('VMInstanceIDs = ' + options.VMInstanceIDs);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.deleteInstances);
    var result = computeManagementClient.virtualMachineScaleSets.deleteInstances(options.ResourceGroupName, options.VMScaleSetName, options.VMInstanceIDs, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> Get
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('get')
  .description($('vmss get'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.get);
    var result = computeManagementClient.virtualMachineScaleSets.get(options.ResourceGroupName, options.VMScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> List
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('list')
  .description($('vmss list'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.list);
    var result = computeManagementClient.virtualMachineScaleSets.list(options.ResourceGroupName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> ListAll
/*
{}
*/
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('listAll')
  .description($('vmss listAll'))
  .usage('[options]')
  .option('--Parameters <Parameters>', $('Parameters'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (Parameters, options, _) {
    console.log('Parameters = ' + options.Parameters);
    if (options.ParameterFile) {
      console.log("Reading file content from: \"" + options.ParameterFile + "\"");
      var fileContent = fs.readFileSync(options.ParameterFile, 'utf8');
      var ParametersObj = JSON.parse(fileContent);
    }
    else {
      var ParametersObj = JSON.parse(options.Parameters);
    }
    console.log('ParametersObj = ' + JSON.stringify(ParametersObj));
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.listAll);
    var result = computeManagementClient.virtualMachineScaleSets.listAll(ParametersObj, _);
    cli.output.json(result);
  });
  var parameters = vmss.category('parameters').description($('Generate Parameters for Azure Compute VirtualMachineScaleSet'));
  parameters.command('listAll')
  .description($('Generate vmss parameter string or files.'))
  .usage('[options]')
  .option('--generate', $('To generate parameter string/file for method: listAll.'))
  .option('--output-file <output-file>', $('The output file path.'))
  .execute(function (generate, outputFile, options, _) {
    console.log("{}");
    var filePath = "vmss_listAll.json";
    if (options.outputFile) { filePath = options.outputFile; };
    fs.writeFileSync(filePath, beautify("{\r\n\r\n}"));
    console.log("Parameter file output to: " + filePath);
  });
//virtualMachineScaleSet -> ListNext
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('listNext')
  .description($('vmss listNext'))
  .usage('[options]')
  .option('--NextLink <NextLink>', $('NextLink'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (NextLink, options, _) {
    console.log('NextLink = ' + options.NextLink);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.listNext);
    var result = computeManagementClient.virtualMachineScaleSets.listNext(options.NextLink, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> ListSkus
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('listSkus')
  .description($('vmss listSkus'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.listSkus);
    var result = computeManagementClient.virtualMachineScaleSets.listSkus(options.ResourceGroupName, options.VMScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> PowerOff
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('powerOff')
  .description($('vmss powerOff'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.powerOff);
    var result = computeManagementClient.virtualMachineScaleSets.powerOff(options.ResourceGroupName, options.VMScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> PowerOffInstances
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('powerOffInstances')
  .description($('vmss powerOffInstances'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--VMInstanceIDs <VMInstanceIDs>', $('VMInstanceIDs'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, VMInstanceIDs, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    console.log('VMInstanceIDs = ' + options.VMInstanceIDs);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.powerOffInstances);
    var result = computeManagementClient.virtualMachineScaleSets.powerOffInstances(options.ResourceGroupName, options.VMScaleSetName, options.VMInstanceIDs, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> Restart
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('restart')
  .description($('vmss restart'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.restart);
    var result = computeManagementClient.virtualMachineScaleSets.restart(options.ResourceGroupName, options.VMScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> RestartInstances
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('restartInstances')
  .description($('vmss restartInstances'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--VMInstanceIDs <VMInstanceIDs>', $('VMInstanceIDs'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, VMInstanceIDs, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    console.log('VMInstanceIDs = ' + options.VMInstanceIDs);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.restartInstances);
    var result = computeManagementClient.virtualMachineScaleSets.restartInstances(options.ResourceGroupName, options.VMScaleSetName, options.VMInstanceIDs, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> Start
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('start')
  .description($('vmss start'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.start);
    var result = computeManagementClient.virtualMachineScaleSets.start(options.ResourceGroupName, options.VMScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> StartInstances
  var vmss = compute.category('vmss').description($('Commands for Azure Compute VirtualMachineScaleSet'));
  vmss.command('startInstances')
  .description($('vmss startInstances'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--VMInstanceIDs <VMInstanceIDs>', $('VMInstanceIDs'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, VMInstanceIDs, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    console.log('VMInstanceIDs = ' + options.VMInstanceIDs);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSets.startInstances);
    var result = computeManagementClient.virtualMachineScaleSets.startInstances(options.ResourceGroupName, options.VMScaleSetName, options.VMInstanceIDs, _);
    cli.output.json(result);
  });
//virtualMachineScaleSetVM -> Deallocate
  var vmssvm = compute.category('vmssvm').description($('Commands for Azure Compute VirtualMachineScaleSetVM'));
  vmssvm.command('deallocate')
  .description($('vmssvm deallocate'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--InstanceId <InstanceId>', $('InstanceId'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, InstanceId, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    console.log('InstanceId = ' + options.InstanceId);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSetVMs.deallocate);
    var result = computeManagementClient.virtualMachineScaleSetVMs.deallocate(options.ResourceGroupName, options.VMScaleSetName, options.InstanceId, _);
    cli.output.json(result);
  });
//virtualMachineScaleSetVM -> Delete
  var vmssvm = compute.category('vmssvm').description($('Commands for Azure Compute VirtualMachineScaleSetVM'));
  vmssvm.command('delete')
  .description($('vmssvm delete'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--InstanceId <InstanceId>', $('InstanceId'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, InstanceId, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    console.log('InstanceId = ' + options.InstanceId);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSetVMs.delete);
    var result = computeManagementClient.virtualMachineScaleSetVMs.delete(options.ResourceGroupName, options.VMScaleSetName, options.InstanceId, _);
    cli.output.json(result);
  });
//virtualMachineScaleSetVM -> Get
  var vmssvm = compute.category('vmssvm').description($('Commands for Azure Compute VirtualMachineScaleSetVM'));
  vmssvm.command('get')
  .description($('vmssvm get'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--InstanceId <InstanceId>', $('InstanceId'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, InstanceId, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    console.log('InstanceId = ' + options.InstanceId);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSetVMs.get);
    var result = computeManagementClient.virtualMachineScaleSetVMs.get(options.ResourceGroupName, options.VMScaleSetName, options.InstanceId, _);
    cli.output.json(result);
  });
//virtualMachineScaleSetVM -> GetInstanceView
  var vmssvm = compute.category('vmssvm').description($('Commands for Azure Compute VirtualMachineScaleSetVM'));
  vmssvm.command('getInstanceView')
  .description($('vmssvm getInstanceView'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--InstanceId <InstanceId>', $('InstanceId'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, InstanceId, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    console.log('InstanceId = ' + options.InstanceId);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSetVMs.getInstanceView);
    var result = computeManagementClient.virtualMachineScaleSetVMs.getInstanceView(options.ResourceGroupName, options.VMScaleSetName, options.InstanceId, _);
    cli.output.json(result);
  });
//virtualMachineScaleSetVM -> List
/*
{"expandExpression":"","filterExpression":"","resourceGroupName":"","selectExpression":"","virtualMachineScaleSetName":""}
*/
  var vmssvm = compute.category('vmssvm').description($('Commands for Azure Compute VirtualMachineScaleSetVM'));
  vmssvm.command('list')
  .description($('vmssvm list'))
  .usage('[options]')
  .option('--Parameters <Parameters>', $('Parameters'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (Parameters, options, _) {
    console.log('Parameters = ' + options.Parameters);
    if (options.ParameterFile) {
      console.log("Reading file content from: \"" + options.ParameterFile + "\"");
      var fileContent = fs.readFileSync(options.ParameterFile, 'utf8');
      var ParametersObj = JSON.parse(fileContent);
    }
    else {
      var ParametersObj = JSON.parse(options.Parameters);
    }
    console.log('ParametersObj = ' + JSON.stringify(ParametersObj));
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSetVMs.list);
    var result = computeManagementClient.virtualMachineScaleSetVMs.list(ParametersObj, _);
    cli.output.json(result);
  });
  var parameters = vmssvm.category('parameters').description($('Generate Parameters for Azure Compute VirtualMachineScaleSetVM'));
  parameters.command('list')
  .description($('Generate vmssvm parameter string or files.'))
  .usage('[options]')
  .option('--generate', $('To generate parameter string/file for method: list.'))
  .option('--output-file <output-file>', $('The output file path.'))
  .execute(function (generate, outputFile, options, _) {
    console.log("{\"expandExpression\":\"\",\"filterExpression\":\"\",\"resourceGroupName\":\"\",\"selectExpression\":\"\",\"virtualMachineScaleSetName\":\"\"}");
    var filePath = "vmssvm_list.json";
    if (options.outputFile) { filePath = options.outputFile; };
    fs.writeFileSync(filePath, beautify("{\r\n\"expandExpression\":\"\",\r\n\"filterExpression\":\"\",\r\n\"resourceGroupName\":\"\",\r\n\"selectExpression\":\"\",\r\n\"virtualMachineScaleSetName\":\"\"\r\n}"));
    console.log("Parameter file output to: " + filePath);
  });
//virtualMachineScaleSetVM -> PowerOff
  var vmssvm = compute.category('vmssvm').description($('Commands for Azure Compute VirtualMachineScaleSetVM'));
  vmssvm.command('powerOff')
  .description($('vmssvm powerOff'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--InstanceId <InstanceId>', $('InstanceId'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, InstanceId, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    console.log('InstanceId = ' + options.InstanceId);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSetVMs.powerOff);
    var result = computeManagementClient.virtualMachineScaleSetVMs.powerOff(options.ResourceGroupName, options.VMScaleSetName, options.InstanceId, _);
    cli.output.json(result);
  });
//virtualMachineScaleSetVM -> Restart
  var vmssvm = compute.category('vmssvm').description($('Commands for Azure Compute VirtualMachineScaleSetVM'));
  vmssvm.command('restart')
  .description($('vmssvm restart'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--InstanceId <InstanceId>', $('InstanceId'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, InstanceId, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    console.log('InstanceId = ' + options.InstanceId);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSetVMs.restart);
    var result = computeManagementClient.virtualMachineScaleSetVMs.restart(options.ResourceGroupName, options.VMScaleSetName, options.InstanceId, _);
    cli.output.json(result);
  });
//virtualMachineScaleSetVM -> Start
  var vmssvm = compute.category('vmssvm').description($('Commands for Azure Compute VirtualMachineScaleSetVM'));
  vmssvm.command('start')
  .description($('vmssvm start'))
  .usage('[options]')
  .option('--ResourceGroupName <ResourceGroupName>', $('ResourceGroupName'))
  .option('--VMScaleSetName <VMScaleSetName>', $('VMScaleSetName'))
  .option('--InstanceId <InstanceId>', $('InstanceId'))
  .option('--ParameterFile <ParameterFile>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (ResourceGroupName, VMScaleSetName, InstanceId, options, _) {
    console.log('ResourceGroupName = ' + options.ResourceGroupName);
    console.log('VMScaleSetName = ' + options.VMScaleSetName);
    console.log('InstanceId = ' + options.InstanceId);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    console.log(computeManagementClient.virtualMachineScaleSetVMs.start);
    var result = computeManagementClient.virtualMachineScaleSetVMs.start(options.ResourceGroupName, options.VMScaleSetName, options.InstanceId, _);
    cli.output.json(result);
  });

};
