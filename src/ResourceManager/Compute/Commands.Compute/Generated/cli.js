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

  //parameters parameters set virtual-machine-scale-set
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('virtual-machine-scale-set')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--provisioning-state <provisioningState>', $('Set the provisioning-state value.'))
  .option('--id <id>', $('Set the id value.'))
  .option('--name <name>', $('Set the name value.'))
  .option('--type <type>', $('Set the type value.'))
  .option('--location <location>', $('Set the location value.'))
  .option('--tags <tags>', $('Set the tags value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "";
    var paramPath = options.path + "/" + "provisioningState";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.provisioningState) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.provisioningState}]);
    }
    var paramPath = options.path + "/" + "id";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.id) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.id}]);
    }
    var paramPath = options.path + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = options.path + "/" + "type";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.type) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.type}]);
    }
    var paramPath = options.path + "/" + "location";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.location) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.location}]);
    }
    var paramPath = options.path + "/" + "tags";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.tags) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.tags}]);
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

  //parameters parameters set sku
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('sku')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--capacity <capacity>', $('Set the capacity value.'))
  .option('--name <name>', $('Set the name value.'))
  .option('--tier <tier>', $('Set the tier value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/sku";
    var paramPath = options.path + "/" + "capacity";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.capacity) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.capacity}]);
    }
    var paramPath = options.path + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = options.path + "/" + "tier";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.tier) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.tier}]);
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

  //parameters parameters set upgrade-policy
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('upgrade-policy')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--mode <mode>', $('Set the mode value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/upgradePolicy";
    var paramPath = options.path + "/" + "mode";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.mode) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.mode}]);
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

  //parameters parameters set extensions
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('extensions')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--index <index>', $('Indexer: index.'))
  .option('--auto-upgrade-minor-version <autoUpgradeMinorVersion>', $('Set the auto-upgrade-minor-version value.'))
  .option('--extension-type <extensionType>', $('Set the extension-type value.'))
  .option('--protected-settings <protectedSettings>', $('Set the protected-settings value.'))
  .option('--provisioning-state <provisioningState>', $('Set the provisioning-state value.'))
  .option('--publisher <publisher>', $('Set the publisher value.'))
  .option('--settings <settings>', $('Set the settings value.'))
  .option('--type-handler-version <typeHandlerVersion>', $('Set the type-handler-version value.'))
  .option('--id <id>', $('Set the id value.'))
  .option('--name <name>', $('Set the name value.'))
  .option('--type <type>', $('Set the type value.'))
  .option('--location <location>', $('Set the location value.'))
  .option('--tags <tags>', $('Set the tags value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/extensionProfile/extensions/" + options.index;
    var paramPath = options.path + "/" + "autoUpgradeMinorVersion";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.autoUpgradeMinorVersion) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.autoUpgradeMinorVersion}]);
    }
    var paramPath = options.path + "/" + "extensionType";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.extensionType) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.extensionType}]);
    }
    var paramPath = options.path + "/" + "protectedSettings";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.protectedSettings) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.protectedSettings}]);
    }
    var paramPath = options.path + "/" + "provisioningState";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.provisioningState) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.provisioningState}]);
    }
    var paramPath = options.path + "/" + "publisher";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.publisher) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.publisher}]);
    }
    var paramPath = options.path + "/" + "settings";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.settings) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.settings}]);
    }
    var paramPath = options.path + "/" + "typeHandlerVersion";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.typeHandlerVersion) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.typeHandlerVersion}]);
    }
    var paramPath = options.path + "/" + "id";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.id) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.id}]);
    }
    var paramPath = options.path + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = options.path + "/" + "type";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.type) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.type}]);
    }
    var paramPath = options.path + "/" + "location";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.location) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.location}]);
    }
    var paramPath = options.path + "/" + "tags";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.tags) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.tags}]);
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

  //parameters parameters set network-interface-configurations
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('network-interface-configurations')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--index <index>', $('Indexer: index.'))
  .option('--name <name>', $('Set the name value.'))
  .option('--primary <primary>', $('Set the primary value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.index;
    var paramPath = options.path + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = options.path + "/" + "primary";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.primary) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.primary}]);
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

  //parameters parameters set ip-configurations
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('ip-configurations')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--index <index>', $('Indexer: index.'))
  .option('--network-interface-configurations-index <network-interface-configurations-index>', $('Indexer: network-interface-configurations-index.'))
  .option('--name <name>', $('Set the name value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations/" + options.index;
    var paramPath = options.path + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
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

  //parameters parameters set load-balancer-backend-address-pools
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('load-balancer-backend-address-pools')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--index <index>', $('Indexer: index.'))
  .option('--ip-configurations-index <ip-configurations-index>', $('Indexer: ip-configurations-index.'))
  .option('--network-interface-configurations-index <network-interface-configurations-index>', $('Indexer: network-interface-configurations-index.'))
  .option('--reference-uri <referenceUri>', $('Set the reference-uri value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations/" + options.ipConfigurationsIndex + "/loadBalancerBackendAddressPools/" + options.index;
    var paramPath = options.path + "/" + "referenceUri";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.referenceUri) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.referenceUri}]);
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

  //parameters parameters set load-balancer-inbound-nat-pools
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('load-balancer-inbound-nat-pools')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--index <index>', $('Indexer: index.'))
  .option('--ip-configurations-index <ip-configurations-index>', $('Indexer: ip-configurations-index.'))
  .option('--network-interface-configurations-index <network-interface-configurations-index>', $('Indexer: network-interface-configurations-index.'))
  .option('--reference-uri <referenceUri>', $('Set the reference-uri value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations/" + options.ipConfigurationsIndex + "/loadBalancerInboundNatPools/" + options.index;
    var paramPath = options.path + "/" + "referenceUri";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.referenceUri) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.referenceUri}]);
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

  //parameters parameters set subnet
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('subnet')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--ip-configurations-index <ip-configurations-index>', $('Indexer: ip-configurations-index.'))
  .option('--network-interface-configurations-index <network-interface-configurations-index>', $('Indexer: network-interface-configurations-index.'))
  .option('--reference-uri <referenceUri>', $('Set the reference-uri value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations/" + options.ipConfigurationsIndex + "/subnet";
    var paramPath = options.path + "/" + "referenceUri";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.referenceUri) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.referenceUri}]);
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

  //parameters parameters set os-profile
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('os-profile')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--computer-name-prefix <computerNamePrefix>', $('Set the computer-name-prefix value.'))
  .option('--admin-password <adminPassword>', $('Set the admin-password value.'))
  .option('--admin-username <adminUsername>', $('Set the admin-username value.'))
  .option('--custom-data <customData>', $('Set the custom-data value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/oSProfile";
    var paramPath = options.path + "/" + "computerNamePrefix";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.computerNamePrefix) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.computerNamePrefix}]);
    }
    var paramPath = options.path + "/" + "adminPassword";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.adminPassword) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.adminPassword}]);
    }
    var paramPath = options.path + "/" + "adminUsername";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.adminUsername) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.adminUsername}]);
    }
    var paramPath = options.path + "/" + "customData";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.customData) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.customData}]);
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

  //parameters parameters set linux-configuration
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('linux-configuration')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--disable-password-authentication <disablePasswordAuthentication>', $('Set the disable-password-authentication value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/oSProfile/linuxConfiguration";
    var paramPath = options.path + "/" + "disablePasswordAuthentication";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.disablePasswordAuthentication) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.disablePasswordAuthentication}]);
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

  //parameters parameters set public-keys
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('public-keys')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--index <index>', $('Indexer: index.'))
  .option('--key-data <keyData>', $('Set the key-data value.'))
  .option('--path <path>', $('Set the path value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration/publicKeys/" + options.index;
    var paramPath = options.path + "/" + "keyData";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.keyData) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.keyData}]);
    }
    var paramPath = options.path + "/" + "path";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.path) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.path}]);
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

  //parameters parameters set source-vault
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('source-vault')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--secrets-index <secrets-index>', $('Indexer: secrets-index.'))
  .option('--reference-uri <referenceUri>', $('Set the reference-uri value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/oSProfile/secrets/" + options.secretsIndex + "/sourceVault";
    var paramPath = options.path + "/" + "referenceUri";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.referenceUri) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.referenceUri}]);
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

  //parameters parameters set vault-certificates
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('vault-certificates')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--index <index>', $('Indexer: index.'))
  .option('--secrets-index <secrets-index>', $('Indexer: secrets-index.'))
  .option('--certificate-store <certificateStore>', $('Set the certificate-store value.'))
  .option('--certificate-url <certificateUrl>', $('Set the certificate-url value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/oSProfile/secrets/" + options.secretsIndex + "/vaultCertificates/" + options.index;
    var paramPath = options.path + "/" + "certificateStore";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.certificateStore) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.certificateStore}]);
    }
    var paramPath = options.path + "/" + "certificateUrl";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.certificateUrl) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.certificateUrl}]);
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

  //parameters parameters set windows-configuration
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('windows-configuration')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--enable-automatic-updates <enableAutomaticUpdates>', $('Set the enable-automatic-updates value.'))
  .option('--provision-vm-agent <provisionVMAgent>', $('Set the provision-vm-agent value.'))
  .option('--time-zone <timeZone>', $('Set the time-zone value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/oSProfile/windowsConfiguration";
    var paramPath = options.path + "/" + "enableAutomaticUpdates";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.enableAutomaticUpdates) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.enableAutomaticUpdates}]);
    }
    var paramPath = options.path + "/" + "provisionVMAgent";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.provisionVMAgent) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.provisionVMAgent}]);
    }
    var paramPath = options.path + "/" + "timeZone";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.timeZone) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.timeZone}]);
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

  //parameters parameters set additional-unattend-contents
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('additional-unattend-contents')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--index <index>', $('Indexer: index.'))
  .option('--component-name <componentName>', $('Set the component-name value.'))
  .option('--content <content>', $('Set the content value.'))
  .option('--pass-name <passName>', $('Set the pass-name value.'))
  .option('--setting-name <settingName>', $('Set the setting-name value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/oSProfile/windowsConfiguration/additionalUnattendContents/" + options.index;
    var paramPath = options.path + "/" + "componentName";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.componentName) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.componentName}]);
    }
    var paramPath = options.path + "/" + "content";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.content) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.content}]);
    }
    var paramPath = options.path + "/" + "passName";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.passName) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.passName}]);
    }
    var paramPath = options.path + "/" + "settingName";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.settingName) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.settingName}]);
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

  //parameters parameters set listeners
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('listeners')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--index <index>', $('Indexer: index.'))
  .option('--certificate-url <certificateUrl>', $('Set the certificate-url value.'))
  .option('--protocol <protocol>', $('Set the protocol value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration/listeners/" + options.index;
    var paramPath = options.path + "/" + "certificateUrl";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.certificateUrl) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.certificateUrl}]);
    }
    var paramPath = options.path + "/" + "protocol";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.protocol) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.protocol}]);
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

  //parameters parameters set image-reference
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('image-reference')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--offer <offer>', $('Set the offer value.'))
  .option('--publisher <publisher>', $('Set the publisher value.'))
  .option('--sku <sku>', $('Set the sku value.'))
  .option('--version <version>', $('Set the version value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/storageProfile/imageReference";
    var paramPath = options.path + "/" + "offer";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.offer) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.offer}]);
    }
    var paramPath = options.path + "/" + "publisher";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.publisher) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.publisher}]);
    }
    var paramPath = options.path + "/" + "sku";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.sku) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.sku}]);
    }
    var paramPath = options.path + "/" + "version";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.version) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.version}]);
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

  //parameters parameters set os-disk
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('os-disk')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--caching <caching>', $('Set the caching value.'))
  .option('--create-option <createOption>', $('Set the create-option value.'))
  .option('--name <name>', $('Set the name value.'))
  .option('--operating-system-type <operatingSystemType>', $('Set the operating-system-type value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/storageProfile/oSDisk";
    var paramPath = options.path + "/" + "caching";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.caching) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.caching}]);
    }
    var paramPath = options.path + "/" + "createOption";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.createOption) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.createOption}]);
    }
    var paramPath = options.path + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = options.path + "/" + "operatingSystemType";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.operatingSystemType) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.operatingSystemType}]);
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

  //parameters parameters set source-image
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('source-image')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--uri <uri>', $('Set the uri value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "/virtualMachineProfile/storageProfile/oSDisk/sourceImage";
    var paramPath = options.path + "/" + "uri";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.uri) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.uri}]);
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

  //parameters parameters set virtual-machine-scale-set-vm-list-parameters
  var parameters = vmssvm.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set-vm.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set-vm.'));
  set.command('virtual-machine-scale-set-vm-list-parameters')
  .description($('Set vmssvm parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--expand-expression <expandExpression>', $('Set the expand-expression value.'))
  .option('--filter-expression <filterExpression>', $('Set the filter-expression value.'))
  .option('--resource-group-name <resourceGroupName>', $('Set the resource-group-name value.'))
  .option('--select-expression <selectExpression>', $('Set the select-expression value.'))
  .option('--virtual-machine-scale-set-name <virtualMachineScaleSetName>', $('Set the virtual-machine-scale-set-name value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
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
    options.operation = 'replace';
    options.path = "";
    var paramPath = options.path + "/" + "expandExpression";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.expandExpression) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.expandExpression}]);
    }
    var paramPath = options.path + "/" + "filterExpression";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.filterExpression) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.filterExpression}]);
    }
    var paramPath = options.path + "/" + "resourceGroupName";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.resourceGroupName) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.resourceGroupName}]);
    }
    var paramPath = options.path + "/" + "selectExpression";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.selectExpression) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.selectExpression}]);
    }
    var paramPath = options.path + "/" + "virtualMachineScaleSetName";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.virtualMachineScaleSetName) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.virtualMachineScaleSetName}]);
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
