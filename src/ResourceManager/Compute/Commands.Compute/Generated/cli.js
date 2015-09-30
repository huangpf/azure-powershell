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
var jsonpatch = require('json-patch');
var util = require('util');

var profile = require('../../../util/profile');
var utils = require('../../../util/utils');

var $ = utils.getLocaleString;

function beautify(jsonText) {
    var obj = JSON.parse(jsonText);
    return JSON.stringify(obj, null, 2);
}

exports.init = function (cli) {

//virtualMachineScaleSet -> CreateOrUpdate
/*
{"provisioningState":"","sku":{"capacity":null,"name":"","tier":""},"upgradePolicy":{"mode":""},"virtualMachineProfile":{"extensionProfile":{"extensions":[{"autoUpgradeMinorVersion":false,"extensionType":"","protectedSettings":"","provisioningState":"","publisher":"","settings":"","typeHandlerVersion":"","id":"","name":"","type":"","location":"","tags":{}}]},"networkProfile":{"networkInterfaceConfigurations":[{"iPConfigurations":[{"loadBalancerBackendAddressPools":[{"referenceUri":""}],"loadBalancerInboundNatPools":[{"referenceUri":""}],"name":"","subnet":{"referenceUri":""}}],"name":"","primary":null}]},"oSProfile":{"computerNamePrefix":"","adminPassword":"","adminUsername":"","customData":"","linuxConfiguration":{"disablePasswordAuthentication":null,"sshConfiguration":{"publicKeys":[{"keyData":"","path":""}]}},"secrets":[{"sourceVault":{"referenceUri":""},"vaultCertificates":[{"certificateStore":"","certificateUrl":""}]}],"windowsConfiguration":{"additionalUnattendContents":[{"componentName":"","content":"","passName":"","settingName":""}],"enableAutomaticUpdates":null,"provisionVMAgent":null,"timeZone":"","winRMConfiguration":{"listeners":[{"certificateUrl":"","protocol":""}]}}},"storageProfile":{"imageReference":{"offer":"","publisher":"","sku":"","version":""},"oSDisk":{"caching":"","createOption":"","name":"","operatingSystemType":"","sourceImage":{"uri":""},"virtualHardDiskContainers":[""]}}},"id":"","name":"","type":"","location":"","tags":{}}
*/
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('create-or-update')
  .description($('create-or-update method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--parameters <parameters>', $('parameters'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, parameters, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('parameters = ' + options.parameters);
    if (options.parameterFile) {
      console.log("Reading file content from: \"" + options.parameterFile + "\"");
      var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
      var parametersObj = JSON.parse(fileContent);
    }
    else {
      var parametersObj = JSON.parse(options.parameters);
    }
    console.log('parametersObj = ' + JSON.stringify(parametersObj));
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.createOrUpdate(options.resourceGroupName, parametersObj, _);
    cli.output.json(result);
  });
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual machine scale set.'));
  var generate = parameters.category('generate')
  .description($('Commands to generate parameter file for your virtual machine scale set.'));
  generate.command('create-or-update')
  .description($('Generate vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (parameterFile, options, _) {
    console.log("{\"provisioningState\":\"\",\"sku\":{\"capacity\":null,\"name\":\"\",\"tier\":\"\"},\"upgradePolicy\":{\"mode\":\"\"},\"virtualMachineProfile\":{\"extensionProfile\":{\"extensions\":[{\"autoUpgradeMinorVersion\":false,\"extensionType\":\"\",\"protectedSettings\":\"\",\"provisioningState\":\"\",\"publisher\":\"\",\"settings\":\"\",\"typeHandlerVersion\":\"\",\"id\":\"\",\"name\":\"\",\"type\":\"\",\"location\":\"\",\"tags\":{}}]},\"networkProfile\":{\"networkInterfaceConfigurations\":[{\"iPConfigurations\":[{\"loadBalancerBackendAddressPools\":[{\"referenceUri\":\"\"}],\"loadBalancerInboundNatPools\":[{\"referenceUri\":\"\"}],\"name\":\"\",\"subnet\":{\"referenceUri\":\"\"}}],\"name\":\"\",\"primary\":null}]},\"oSProfile\":{\"computerNamePrefix\":\"\",\"adminPassword\":\"\",\"adminUsername\":\"\",\"customData\":\"\",\"linuxConfiguration\":{\"disablePasswordAuthentication\":null,\"sshConfiguration\":{\"publicKeys\":[{\"keyData\":\"\",\"path\":\"\"}]}},\"secrets\":[{\"sourceVault\":{\"referenceUri\":\"\"},\"vaultCertificates\":[{\"certificateStore\":\"\",\"certificateUrl\":\"\"}]}],\"windowsConfiguration\":{\"additionalUnattendContents\":[{\"componentName\":\"\",\"content\":\"\",\"passName\":\"\",\"settingName\":\"\"}],\"enableAutomaticUpdates\":null,\"provisionVMAgent\":null,\"timeZone\":\"\",\"winRMConfiguration\":{\"listeners\":[{\"certificateUrl\":\"\",\"protocol\":\"\"}]}}},\"storageProfile\":{\"imageReference\":{\"offer\":\"\",\"publisher\":\"\",\"sku\":\"\",\"version\":\"\"},\"oSDisk\":{\"caching\":\"\",\"createOption\":\"\",\"name\":\"\",\"operatingSystemType\":\"\",\"sourceImage\":{\"uri\":\"\"},\"virtualHardDiskContainers\":[\"\"]}}},\"id\":\"\",\"name\":\"\",\"type\":\"\",\"location\":\"\",\"tags\":{}}");
    var filePath = "vmss_createOrUpdate.json";
    if (options.parameterFile) { filePath = options.parameterFile; };
    fs.writeFileSync(filePath, beautify("{\r\n\"provisioningState\":\"\",\r\n\"sku\":{\r\n\"capacity\":null,\r\n\"name\":\"\",\r\n\"tier\":\"\"\r\n},\r\n\"upgradePolicy\":{\r\n\"mode\":\"\"\r\n},\r\n\"virtualMachineProfile\":{\r\n\"extensionProfile\":{\r\n\"extensions\":[\r\n{\r\n\"autoUpgradeMinorVersion\":false,\r\n\"extensionType\":\"\",\r\n\"protectedSettings\":\"\",\r\n\"provisioningState\":\"\",\r\n\"publisher\":\"\",\r\n\"settings\":\"\",\r\n\"typeHandlerVersion\":\"\",\r\n\"id\":\"\",\r\n\"name\":\"\",\r\n\"type\":\"\",\r\n\"location\":\"\",\r\n\"tags\":{\r\n\r\n}\r\n}\r\n]\r\n},\r\n\"networkProfile\":{\r\n\"networkInterfaceConfigurations\":[\r\n{\r\n\"iPConfigurations\":[\r\n{\r\n\"loadBalancerBackendAddressPools\":[\r\n{\r\n\"referenceUri\":\"\"\r\n}\r\n],\r\n\"loadBalancerInboundNatPools\":[\r\n{\r\n\"referenceUri\":\"\"\r\n}\r\n],\r\n\"name\":\"\",\r\n\"subnet\":{\r\n\"referenceUri\":\"\"\r\n}\r\n}\r\n],\r\n\"name\":\"\",\r\n\"primary\":null\r\n}\r\n]\r\n},\r\n\"oSProfile\":{\r\n\"computerNamePrefix\":\"\",\r\n\"adminPassword\":\"\",\r\n\"adminUsername\":\"\",\r\n\"customData\":\"\",\r\n\"linuxConfiguration\":{\r\n\"disablePasswordAuthentication\":null,\r\n\"sshConfiguration\":{\r\n\"publicKeys\":[\r\n{\r\n\"keyData\":\"\",\r\n\"path\":\"\"\r\n}\r\n]\r\n}\r\n},\r\n\"secrets\":[\r\n{\r\n\"sourceVault\":{\r\n\"referenceUri\":\"\"\r\n},\r\n\"vaultCertificates\":[\r\n{\r\n\"certificateStore\":\"\",\r\n\"certificateUrl\":\"\"\r\n}\r\n]\r\n}\r\n],\r\n\"windowsConfiguration\":{\r\n\"additionalUnattendContents\":[\r\n{\r\n\"componentName\":\"\",\r\n\"content\":\"\",\r\n\"passName\":\"\",\r\n\"settingName\":\"\"\r\n}\r\n],\r\n\"enableAutomaticUpdates\":null,\r\n\"provisionVMAgent\":null,\r\n\"timeZone\":\"\",\r\n\"winRMConfiguration\":{\r\n\"listeners\":[\r\n{\r\n\"certificateUrl\":\"\",\r\n\"protocol\":\"\"\r\n}\r\n]\r\n}\r\n}\r\n},\r\n\"storageProfile\":{\r\n\"imageReference\":{\r\n\"offer\":\"\",\r\n\"publisher\":\"\",\r\n\"sku\":\"\",\r\n\"version\":\"\"\r\n},\r\n\"oSDisk\":{\r\n\"caching\":\"\",\r\n\"createOption\":\"\",\r\n\"name\":\"\",\r\n\"operatingSystemType\":\"\",\r\n\"sourceImage\":{\r\n\"uri\":\"\"\r\n},\r\n\"virtualHardDiskContainers\":[\r\n\"\"\r\n]\r\n}\r\n}\r\n},\r\n\"id\":\"\",\r\n\"name\":\"\",\r\n\"type\":\"\",\r\n\"location\":\"\",\r\n\"tags\":{\r\n\r\n}\r\n}"));
    console.log("=====================================");
    console.log("Parameter file output to: " + filePath);
    console.log("=====================================");
  });

  parameters.command('patch')
  .description($('Command to patch vmss parameter JSON file.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--operation <operation>', $('The JSON patch operation: add, remove, or replace.'))
  .option('--path <path>', $('The JSON data path, e.g.: \"foo/1\".'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .execute(function (parameterFile, operation, path, value, parse, options, _) {
    console.log(options.parameterFile);
    console.log(options.operation);
    console.log(options.path);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse) {
      options.value = JSON.parse(options.value);
    }
    console.log(options.value);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    if (options.operation == 'add') {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    else if (options.operation == 'remove') {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    }
    else if (options.operation == 'replace') {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    console.log("=====================================");
    console.log("JSON object (updated):");
    console.log(JSON.stringify(parametersObj));
    console.log("=====================================");
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    console.log("=====================================");
    console.log("Parameter file updated at: " + options.parameterFile);
    console.log("=====================================");
  });

//virtualMachineScaleSet -> Deallocate
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('deallocate')
  .description($('deallocate method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.deallocate(options.resourceGroupName, options.vmScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> DeallocateInstances
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('deallocate-instances')
  .description($('deallocate-instances method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--vm-instance-i-ds <vm-instance-i-ds>', $('vm-instance-i-ds'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, vmInstanceIDs, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    console.log('vmInstanceIDs = ' + options.vmInstanceIDs);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.deallocateInstances(options.resourceGroupName, options.vmScaleSetName, options.vmInstanceIDs, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> Delete
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('delete')
  .description($('delete method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.delete(options.resourceGroupName, options.vmScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> DeleteInstances
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('delete-instances')
  .description($('delete-instances method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--vm-instance-i-ds <vm-instance-i-ds>', $('vm-instance-i-ds'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, vmInstanceIDs, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    console.log('vmInstanceIDs = ' + options.vmInstanceIDs);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.deleteInstances(options.resourceGroupName, options.vmScaleSetName, options.vmInstanceIDs, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> Get
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('get')
  .description($('get method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.get(options.resourceGroupName, options.vmScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> GetInstanceView
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('get-instance-view')
  .description($('get-instance-view method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.getInstanceView(options.resourceGroupName, options.vmScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> List
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('list')
  .description($('list method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.list(options.resourceGroupName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> ListAll
/*
{}
*/
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('list-all')
  .description($('list-all method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--parameters <parameters>', $('parameters'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (parameters, options, _) {
    console.log('parameters = ' + options.parameters);
    if (options.parameterFile) {
      console.log("Reading file content from: \"" + options.parameterFile + "\"");
      var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
      var parametersObj = JSON.parse(fileContent);
    }
    else {
      var parametersObj = JSON.parse(options.parameters);
    }
    console.log('parametersObj = ' + JSON.stringify(parametersObj));
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.listAll(parametersObj, _);
    cli.output.json(result);
  });
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual machine scale set.'));
  var generate = parameters.category('generate')
  .description($('Commands to generate parameter file for your virtual machine scale set.'));
  generate.command('list-all')
  .description($('Generate vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (parameterFile, options, _) {
    console.log("{}");
    var filePath = "vmss_listAll.json";
    if (options.parameterFile) { filePath = options.parameterFile; };
    fs.writeFileSync(filePath, beautify("{\r\n\r\n}"));
    console.log("=====================================");
    console.log("Parameter file output to: " + filePath);
    console.log("=====================================");
  });

  parameters.command('patch')
  .description($('Command to patch vmss parameter JSON file.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--operation <operation>', $('The JSON patch operation: add, remove, or replace.'))
  .option('--path <path>', $('The JSON data path, e.g.: \"foo/1\".'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .execute(function (parameterFile, operation, path, value, parse, options, _) {
    console.log(options.parameterFile);
    console.log(options.operation);
    console.log(options.path);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse) {
      options.value = JSON.parse(options.value);
    }
    console.log(options.value);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    if (options.operation == 'add') {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    else if (options.operation == 'remove') {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    }
    else if (options.operation == 'replace') {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    console.log("=====================================");
    console.log("JSON object (updated):");
    console.log(JSON.stringify(parametersObj));
    console.log("=====================================");
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    console.log("=====================================");
    console.log("Parameter file updated at: " + options.parameterFile);
    console.log("=====================================");
  });

//virtualMachineScaleSet -> ListNext
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('list-next')
  .description($('list-next method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--next-link <next-link>', $('next-link'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (nextLink, options, _) {
    console.log('nextLink = ' + options.nextLink);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.listNext(options.nextLink, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> ListSkus
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('list-skus')
  .description($('list-skus method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.listSkus(options.resourceGroupName, options.vmScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> PowerOff
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('power-off')
  .description($('power-off method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.powerOff(options.resourceGroupName, options.vmScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> PowerOffInstances
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('power-off-instances')
  .description($('power-off-instances method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--vm-instance-i-ds <vm-instance-i-ds>', $('vm-instance-i-ds'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, vmInstanceIDs, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    console.log('vmInstanceIDs = ' + options.vmInstanceIDs);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.powerOffInstances(options.resourceGroupName, options.vmScaleSetName, options.vmInstanceIDs, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> Restart
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('restart')
  .description($('restart method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.restart(options.resourceGroupName, options.vmScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> RestartInstances
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('restart-instances')
  .description($('restart-instances method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--vm-instance-i-ds <vm-instance-i-ds>', $('vm-instance-i-ds'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, vmInstanceIDs, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    console.log('vmInstanceIDs = ' + options.vmInstanceIDs);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.restartInstances(options.resourceGroupName, options.vmScaleSetName, options.vmInstanceIDs, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> Start
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('start')
  .description($('start method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.start(options.resourceGroupName, options.vmScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> StartInstances
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('start-instances')
  .description($('start-instances method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--vm-instance-i-ds <vm-instance-i-ds>', $('vm-instance-i-ds'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, vmInstanceIDs, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    console.log('vmInstanceIDs = ' + options.vmInstanceIDs);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.startInstances(options.resourceGroupName, options.vmScaleSetName, options.vmInstanceIDs, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> UpdateInstances
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('update-instances')
  .description($('update-instances method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--vm-instance-i-ds <vm-instance-i-ds>', $('vm-instance-i-ds'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, vmInstanceIDs, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    console.log('vmInstanceIDs = ' + options.vmInstanceIDs);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.updateInstances(options.resourceGroupName, options.vmScaleSetName, options.vmInstanceIDs, _);
    cli.output.json(result);
  });
//virtualMachineScaleSetVM -> Deallocate
  var vmssvm = cli.category('vmssvm').description($('Commands to manage your virtual machine scale set vm.'));
  vmssvm.command('deallocate')
  .description($('deallocate method to manage your virtual machine scale set vm.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--instance-id <instance-id>', $('instance-id'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, instanceId, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    console.log('instanceId = ' + options.instanceId);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSetVMs.deallocate(options.resourceGroupName, options.vmScaleSetName, options.instanceId, _);
    cli.output.json(result);
  });
//virtualMachineScaleSetVM -> Delete
  var vmssvm = cli.category('vmssvm').description($('Commands to manage your virtual machine scale set vm.'));
  vmssvm.command('delete')
  .description($('delete method to manage your virtual machine scale set vm.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--instance-id <instance-id>', $('instance-id'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, instanceId, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    console.log('instanceId = ' + options.instanceId);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSetVMs.delete(options.resourceGroupName, options.vmScaleSetName, options.instanceId, _);
    cli.output.json(result);
  });
//virtualMachineScaleSetVM -> Get
  var vmssvm = cli.category('vmssvm').description($('Commands to manage your virtual machine scale set vm.'));
  vmssvm.command('get')
  .description($('get method to manage your virtual machine scale set vm.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--instance-id <instance-id>', $('instance-id'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, instanceId, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    console.log('instanceId = ' + options.instanceId);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSetVMs.get(options.resourceGroupName, options.vmScaleSetName, options.instanceId, _);
    cli.output.json(result);
  });
//virtualMachineScaleSetVM -> GetInstanceView
  var vmssvm = cli.category('vmssvm').description($('Commands to manage your virtual machine scale set vm.'));
  vmssvm.command('get-instance-view')
  .description($('get-instance-view method to manage your virtual machine scale set vm.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--instance-id <instance-id>', $('instance-id'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, instanceId, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    console.log('instanceId = ' + options.instanceId);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSetVMs.getInstanceView(options.resourceGroupName, options.vmScaleSetName, options.instanceId, _);
    cli.output.json(result);
  });
//virtualMachineScaleSetVM -> List
/*
{"expandExpression":"","filterExpression":"","resourceGroupName":"","selectExpression":"","virtualMachineScaleSetName":""}
*/
  var vmssvm = cli.category('vmssvm').description($('Commands to manage your virtual machine scale set vm.'));
  vmssvm.command('list')
  .description($('list method to manage your virtual machine scale set vm.'))
  .usage('[options]')
  .option('--parameters <parameters>', $('parameters'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (parameters, options, _) {
    console.log('parameters = ' + options.parameters);
    if (options.parameterFile) {
      console.log("Reading file content from: \"" + options.parameterFile + "\"");
      var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
      var parametersObj = JSON.parse(fileContent);
    }
    else {
      var parametersObj = JSON.parse(options.parameters);
    }
    console.log('parametersObj = ' + JSON.stringify(parametersObj));
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSetVMs.list(parametersObj, _);
    cli.output.json(result);
  });
  var parameters = vmssvm.category('parameters')
  .description($('Commands to manage parameter for your virtual machine scale set vm.'));
  var generate = parameters.category('generate')
  .description($('Commands to generate parameter file for your virtual machine scale set vm.'));
  generate.command('list')
  .description($('Generate vmssvm parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (parameterFile, options, _) {
    console.log("{\"expandExpression\":\"\",\"filterExpression\":\"\",\"resourceGroupName\":\"\",\"selectExpression\":\"\",\"virtualMachineScaleSetName\":\"\"}");
    var filePath = "vmssvm_list.json";
    if (options.parameterFile) { filePath = options.parameterFile; };
    fs.writeFileSync(filePath, beautify("{\r\n\"expandExpression\":\"\",\r\n\"filterExpression\":\"\",\r\n\"resourceGroupName\":\"\",\r\n\"selectExpression\":\"\",\r\n\"virtualMachineScaleSetName\":\"\"\r\n}"));
    console.log("=====================================");
    console.log("Parameter file output to: " + filePath);
    console.log("=====================================");
  });

  parameters.command('patch')
  .description($('Command to patch vmssvm parameter JSON file.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--operation <operation>', $('The JSON patch operation: add, remove, or replace.'))
  .option('--path <path>', $('The JSON data path, e.g.: \"foo/1\".'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .execute(function (parameterFile, operation, path, value, parse, options, _) {
    console.log(options.parameterFile);
    console.log(options.operation);
    console.log(options.path);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse) {
      options.value = JSON.parse(options.value);
    }
    console.log(options.value);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    if (options.operation == 'add') {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    else if (options.operation == 'remove') {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    }
    else if (options.operation == 'replace') {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    console.log("=====================================");
    console.log("JSON object (updated):");
    console.log(JSON.stringify(parametersObj));
    console.log("=====================================");
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    console.log("=====================================");
    console.log("Parameter file updated at: " + options.parameterFile);
    console.log("=====================================");
  });

//virtualMachineScaleSetVM -> PowerOff
  var vmssvm = cli.category('vmssvm').description($('Commands to manage your virtual machine scale set vm.'));
  vmssvm.command('power-off')
  .description($('power-off method to manage your virtual machine scale set vm.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--instance-id <instance-id>', $('instance-id'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, instanceId, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    console.log('instanceId = ' + options.instanceId);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSetVMs.powerOff(options.resourceGroupName, options.vmScaleSetName, options.instanceId, _);
    cli.output.json(result);
  });
//virtualMachineScaleSetVM -> Restart
  var vmssvm = cli.category('vmssvm').description($('Commands to manage your virtual machine scale set vm.'));
  vmssvm.command('restart')
  .description($('restart method to manage your virtual machine scale set vm.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--instance-id <instance-id>', $('instance-id'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, instanceId, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    console.log('instanceId = ' + options.instanceId);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSetVMs.restart(options.resourceGroupName, options.vmScaleSetName, options.instanceId, _);
    cli.output.json(result);
  });
//virtualMachineScaleSetVM -> Start
  var vmssvm = cli.category('vmssvm').description($('Commands to manage your virtual machine scale set vm.'));
  vmssvm.command('start')
  .description($('start method to manage your virtual machine scale set vm.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--instance-id <instance-id>', $('instance-id'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, instanceId, options, _) {
    console.log('resourceGroupName = ' + options.resourceGroupName);
    console.log('vmScaleSetName = ' + options.vmScaleSetName);
    console.log('instanceId = ' + options.instanceId);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSetVMs.start(options.resourceGroupName, options.vmScaleSetName, options.instanceId, _);
    cli.output.json(result);
  });


};
