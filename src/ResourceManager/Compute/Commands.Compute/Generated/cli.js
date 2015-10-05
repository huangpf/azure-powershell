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

  //parameters set virtual-machine-scale-set
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
    if (options.parse && options.value) {
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
      if (options.parse && options.provisioningState) {
        options.provisioningState = JSON.parse(options.provisioningState);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.provisioningState}]);
    }
    var paramPath = options.path + "/" + "id";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.id) {
      if (options.parse && options.id) {
        options.id = JSON.parse(options.id);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.id}]);
    }
    var paramPath = options.path + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = options.path + "/" + "type";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.type) {
      if (options.parse && options.type) {
        options.type = JSON.parse(options.type);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.type}]);
    }
    var paramPath = options.path + "/" + "location";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.location) {
      if (options.parse && options.location) {
        options.location = JSON.parse(options.location);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.location}]);
    }
    var paramPath = options.path + "/" + "tags";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.tags) {
      if (options.parse && options.tags) {
        options.tags = JSON.parse(options.tags);
      }
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

  //parameters remove virtual-machine-scale-set
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('virtual-machine-scale-set')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add virtual-machine-scale-set
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('virtual-machine-scale-set')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--provisioning-state <provisioningState>', $('Add the provisioning-state value.'))
  .option('--id <id>', $('Add the id value.'))
  .option('--name <name>', $('Add the name value.'))
  .option('--type <type>', $('Add the type value.'))
  .option('--location <location>', $('Add the location value.'))
  .option('--tags <tags>', $('Add the tags value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "" + "/" + "provisioningState";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.provisioningState) {
      if (options.parse && options.provisioningState) {
        options.provisioningState = JSON.parse(options.provisioningState);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.provisioningState}]);
    }
    var paramPath = "" + "/" + "id";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.id) {
      if (options.parse && options.id) {
        options.id = JSON.parse(options.id);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.id}]);
    }
    var paramPath = "" + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = "" + "/" + "type";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.type) {
      if (options.parse && options.type) {
        options.type = JSON.parse(options.type);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.type}]);
    }
    var paramPath = "" + "/" + "location";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.location) {
      if (options.parse && options.location) {
        options.location = JSON.parse(options.location);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.location}]);
    }
    var paramPath = "" + "/" + "tags";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.tags) {
      if (options.parse && options.tags) {
        options.tags = JSON.parse(options.tags);
      }
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

  //parameters set sku
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
    if (options.parse && options.value) {
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
      if (options.parse && options.capacity) {
        options.capacity = JSON.parse(options.capacity);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.capacity}]);
    }
    var paramPath = options.path + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = options.path + "/" + "tier";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.tier) {
      if (options.parse && options.tier) {
        options.tier = JSON.parse(options.tier);
      }
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

  //parameters remove sku
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('sku')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/sku";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add sku
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('sku')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--capacity <capacity>', $('Add the capacity value.'))
  .option('--name <name>', $('Add the name value.'))
  .option('--tier <tier>', $('Add the tier value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/sku" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/sku" + "/" + "capacity";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.capacity) {
      if (options.parse && options.capacity) {
        options.capacity = JSON.parse(options.capacity);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.capacity}]);
    }
    var paramPath = "/sku" + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = "/sku" + "/" + "tier";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.tier) {
      if (options.parse && options.tier) {
        options.tier = JSON.parse(options.tier);
      }
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

  //parameters set upgrade-policy
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
    if (options.parse && options.value) {
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
      if (options.parse && options.mode) {
        options.mode = JSON.parse(options.mode);
      }
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

  //parameters remove upgrade-policy
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('upgrade-policy')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/upgradePolicy";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add upgrade-policy
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('upgrade-policy')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--mode <mode>', $('Add the mode value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/upgradePolicy" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/upgradePolicy" + "/" + "mode";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.mode) {
      if (options.parse && options.mode) {
        options.mode = JSON.parse(options.mode);
      }
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

  //parameters remove virtual-machine-profile
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('virtual-machine-profile')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add virtual-machine-profile
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('virtual-machine-profile')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
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

  //parameters remove extension-profile
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('extension-profile')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/extensionProfile";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add extension-profile
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('extension-profile')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/extensionProfile" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
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

  //parameters set extensions
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
    if (options.parse && options.value) {
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
    options.path = "/virtualMachineProfile/extensionProfile/extensions" + (options.index ? ('/' + options.index) : '');
    var paramPath = options.path + "/" + "autoUpgradeMinorVersion";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.autoUpgradeMinorVersion) {
      if (options.parse && options.autoUpgradeMinorVersion) {
        options.autoUpgradeMinorVersion = JSON.parse(options.autoUpgradeMinorVersion);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.autoUpgradeMinorVersion}]);
    }
    var paramPath = options.path + "/" + "extensionType";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.extensionType) {
      if (options.parse && options.extensionType) {
        options.extensionType = JSON.parse(options.extensionType);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.extensionType}]);
    }
    var paramPath = options.path + "/" + "protectedSettings";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.protectedSettings) {
      if (options.parse && options.protectedSettings) {
        options.protectedSettings = JSON.parse(options.protectedSettings);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.protectedSettings}]);
    }
    var paramPath = options.path + "/" + "provisioningState";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.provisioningState) {
      if (options.parse && options.provisioningState) {
        options.provisioningState = JSON.parse(options.provisioningState);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.provisioningState}]);
    }
    var paramPath = options.path + "/" + "publisher";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.publisher) {
      if (options.parse && options.publisher) {
        options.publisher = JSON.parse(options.publisher);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.publisher}]);
    }
    var paramPath = options.path + "/" + "settings";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.settings) {
      if (options.parse && options.settings) {
        options.settings = JSON.parse(options.settings);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.settings}]);
    }
    var paramPath = options.path + "/" + "typeHandlerVersion";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.typeHandlerVersion) {
      if (options.parse && options.typeHandlerVersion) {
        options.typeHandlerVersion = JSON.parse(options.typeHandlerVersion);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.typeHandlerVersion}]);
    }
    var paramPath = options.path + "/" + "id";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.id) {
      if (options.parse && options.id) {
        options.id = JSON.parse(options.id);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.id}]);
    }
    var paramPath = options.path + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = options.path + "/" + "type";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.type) {
      if (options.parse && options.type) {
        options.type = JSON.parse(options.type);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.type}]);
    }
    var paramPath = options.path + "/" + "location";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.location) {
      if (options.parse && options.location) {
        options.location = JSON.parse(options.location);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.location}]);
    }
    var paramPath = options.path + "/" + "tags";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.tags) {
      if (options.parse && options.tags) {
        options.tags = JSON.parse(options.tags);
      }
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

  //parameters remove extensions
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('extensions')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--index <index>', $('Indexer: index.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/extensionProfile/extensions" + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add extensions
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('extensions')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--auto-upgrade-minor-version <autoUpgradeMinorVersion>', $('Add the auto-upgrade-minor-version value.'))
  .option('--extension-type <extensionType>', $('Add the extension-type value.'))
  .option('--protected-settings <protectedSettings>', $('Add the protected-settings value.'))
  .option('--provisioning-state <provisioningState>', $('Add the provisioning-state value.'))
  .option('--publisher <publisher>', $('Add the publisher value.'))
  .option('--settings <settings>', $('Add the settings value.'))
  .option('--type-handler-version <typeHandlerVersion>', $('Add the type-handler-version value.'))
  .option('--id <id>', $('Add the id value.'))
  .option('--name <name>', $('Add the name value.'))
  .option('--type <type>', $('Add the type value.'))
  .option('--location <location>', $('Add the location value.'))
  .option('--tags <tags>', $('Add the tags value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/extensionProfile/extensions" + (options.index ? ('/' + options.index) : '') + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/extensionProfile/extensions" + (options.index ? ('/' + options.index) : '') + "/" + "autoUpgradeMinorVersion";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.autoUpgradeMinorVersion) {
      if (options.parse && options.autoUpgradeMinorVersion) {
        options.autoUpgradeMinorVersion = JSON.parse(options.autoUpgradeMinorVersion);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.autoUpgradeMinorVersion}]);
    }
    var paramPath = "/virtualMachineProfile/extensionProfile/extensions" + (options.index ? ('/' + options.index) : '') + "/" + "extensionType";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.extensionType) {
      if (options.parse && options.extensionType) {
        options.extensionType = JSON.parse(options.extensionType);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.extensionType}]);
    }
    var paramPath = "/virtualMachineProfile/extensionProfile/extensions" + (options.index ? ('/' + options.index) : '') + "/" + "protectedSettings";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.protectedSettings) {
      if (options.parse && options.protectedSettings) {
        options.protectedSettings = JSON.parse(options.protectedSettings);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.protectedSettings}]);
    }
    var paramPath = "/virtualMachineProfile/extensionProfile/extensions" + (options.index ? ('/' + options.index) : '') + "/" + "provisioningState";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.provisioningState) {
      if (options.parse && options.provisioningState) {
        options.provisioningState = JSON.parse(options.provisioningState);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.provisioningState}]);
    }
    var paramPath = "/virtualMachineProfile/extensionProfile/extensions" + (options.index ? ('/' + options.index) : '') + "/" + "publisher";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.publisher) {
      if (options.parse && options.publisher) {
        options.publisher = JSON.parse(options.publisher);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.publisher}]);
    }
    var paramPath = "/virtualMachineProfile/extensionProfile/extensions" + (options.index ? ('/' + options.index) : '') + "/" + "settings";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.settings) {
      if (options.parse && options.settings) {
        options.settings = JSON.parse(options.settings);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.settings}]);
    }
    var paramPath = "/virtualMachineProfile/extensionProfile/extensions" + (options.index ? ('/' + options.index) : '') + "/" + "typeHandlerVersion";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.typeHandlerVersion) {
      if (options.parse && options.typeHandlerVersion) {
        options.typeHandlerVersion = JSON.parse(options.typeHandlerVersion);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.typeHandlerVersion}]);
    }
    var paramPath = "/virtualMachineProfile/extensionProfile/extensions" + (options.index ? ('/' + options.index) : '') + "/" + "id";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.id) {
      if (options.parse && options.id) {
        options.id = JSON.parse(options.id);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.id}]);
    }
    var paramPath = "/virtualMachineProfile/extensionProfile/extensions" + (options.index ? ('/' + options.index) : '') + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = "/virtualMachineProfile/extensionProfile/extensions" + (options.index ? ('/' + options.index) : '') + "/" + "type";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.type) {
      if (options.parse && options.type) {
        options.type = JSON.parse(options.type);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.type}]);
    }
    var paramPath = "/virtualMachineProfile/extensionProfile/extensions" + (options.index ? ('/' + options.index) : '') + "/" + "location";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.location) {
      if (options.parse && options.location) {
        options.location = JSON.parse(options.location);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.location}]);
    }
    var paramPath = "/virtualMachineProfile/extensionProfile/extensions" + (options.index ? ('/' + options.index) : '') + "/" + "tags";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.tags) {
      if (options.parse && options.tags) {
        options.tags = JSON.parse(options.tags);
      }
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

  //parameters remove network-profile
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('network-profile')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/networkProfile";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add network-profile
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('network-profile')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/networkProfile" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
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

  //parameters set network-interface-configurations
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
    if (options.parse && options.value) {
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
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations" + (options.index ? ('/' + options.index) : '');
    var paramPath = options.path + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = options.path + "/" + "primary";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.primary) {
      if (options.parse && options.primary) {
        options.primary = JSON.parse(options.primary);
      }
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

  //parameters remove network-interface-configurations
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('network-interface-configurations')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--index <index>', $('Indexer: index.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations" + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add network-interface-configurations
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('network-interface-configurations')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--name <name>', $('Add the name value.'))
  .option('--primary <primary>', $('Add the primary value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations" + (options.index ? ('/' + options.index) : '') + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations" + (options.index ? ('/' + options.index) : '') + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations" + (options.index ? ('/' + options.index) : '') + "/" + "primary";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.primary) {
      if (options.parse && options.primary) {
        options.primary = JSON.parse(options.primary);
      }
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

  //parameters set ip-configurations
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
    if (options.parse && options.value) {
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
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations" + (options.index ? ('/' + options.index) : '');
    var paramPath = options.path + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
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

  //parameters remove ip-configurations
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('ip-configurations')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--index <index>', $('Indexer: index.'))
  .option('--network-interface-configurations-index <network-interface-configurations-index>', $('Indexer: network-interface-configurations-index.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations" + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add ip-configurations
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('ip-configurations')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--name <name>', $('Add the name value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations" + (options.index ? ('/' + options.index) : '') + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations" + (options.index ? ('/' + options.index) : '') + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
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

  //parameters set load-balancer-backend-address-pools
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
    if (options.parse && options.value) {
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
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations/" + options.ipConfigurationsIndex + "/loadBalancerBackendAddressPools" + (options.index ? ('/' + options.index) : '');
    var paramPath = options.path + "/" + "referenceUri";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.referenceUri) {
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
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

  //parameters remove load-balancer-backend-address-pools
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('load-balancer-backend-address-pools')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--index <index>', $('Indexer: index.'))
  .option('--ip-configurations-index <ip-configurations-index>', $('Indexer: ip-configurations-index.'))
  .option('--network-interface-configurations-index <network-interface-configurations-index>', $('Indexer: network-interface-configurations-index.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations/" + options.ipConfigurationsIndex + "/loadBalancerBackendAddressPools" + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add load-balancer-backend-address-pools
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('load-balancer-backend-address-pools')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--reference-uri <referenceUri>', $('Add the reference-uri value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations/" + options.ipConfigurationsIndex + "/loadBalancerBackendAddressPools" + (options.index ? ('/' + options.index) : '') + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations/" + options.ipConfigurationsIndex + "/loadBalancerBackendAddressPools" + (options.index ? ('/' + options.index) : '') + "/" + "referenceUri";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.referenceUri) {
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
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

  //parameters set load-balancer-inbound-nat-pools
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
    if (options.parse && options.value) {
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
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations/" + options.ipConfigurationsIndex + "/loadBalancerInboundNatPools" + (options.index ? ('/' + options.index) : '');
    var paramPath = options.path + "/" + "referenceUri";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.referenceUri) {
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
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

  //parameters remove load-balancer-inbound-nat-pools
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('load-balancer-inbound-nat-pools')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--index <index>', $('Indexer: index.'))
  .option('--ip-configurations-index <ip-configurations-index>', $('Indexer: ip-configurations-index.'))
  .option('--network-interface-configurations-index <network-interface-configurations-index>', $('Indexer: network-interface-configurations-index.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations/" + options.ipConfigurationsIndex + "/loadBalancerInboundNatPools" + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add load-balancer-inbound-nat-pools
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('load-balancer-inbound-nat-pools')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--reference-uri <referenceUri>', $('Add the reference-uri value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations/" + options.ipConfigurationsIndex + "/loadBalancerInboundNatPools" + (options.index ? ('/' + options.index) : '') + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations/" + options.ipConfigurationsIndex + "/loadBalancerInboundNatPools" + (options.index ? ('/' + options.index) : '') + "/" + "referenceUri";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.referenceUri) {
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
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

  //parameters set subnet
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
    if (options.parse && options.value) {
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
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
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

  //parameters remove subnet
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('subnet')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--ip-configurations-index <ip-configurations-index>', $('Indexer: ip-configurations-index.'))
  .option('--network-interface-configurations-index <network-interface-configurations-index>', $('Indexer: network-interface-configurations-index.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations/" + options.ipConfigurationsIndex + "/subnet";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add subnet
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('subnet')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--reference-uri <referenceUri>', $('Add the reference-uri value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations/" + options.ipConfigurationsIndex + "/subnet" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/" + options.networkInterfaceConfigurationsIndex + "/iPConfigurations/" + options.ipConfigurationsIndex + "/subnet" + "/" + "referenceUri";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.referenceUri) {
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
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

  //parameters set os-profile
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
    if (options.parse && options.value) {
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
      if (options.parse && options.computerNamePrefix) {
        options.computerNamePrefix = JSON.parse(options.computerNamePrefix);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.computerNamePrefix}]);
    }
    var paramPath = options.path + "/" + "adminPassword";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.adminPassword) {
      if (options.parse && options.adminPassword) {
        options.adminPassword = JSON.parse(options.adminPassword);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.adminPassword}]);
    }
    var paramPath = options.path + "/" + "adminUsername";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.adminUsername) {
      if (options.parse && options.adminUsername) {
        options.adminUsername = JSON.parse(options.adminUsername);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.adminUsername}]);
    }
    var paramPath = options.path + "/" + "customData";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.customData) {
      if (options.parse && options.customData) {
        options.customData = JSON.parse(options.customData);
      }
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

  //parameters remove os-profile
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('os-profile')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/oSProfile";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add os-profile
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('os-profile')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--computer-name-prefix <computerNamePrefix>', $('Add the computer-name-prefix value.'))
  .option('--admin-password <adminPassword>', $('Add the admin-password value.'))
  .option('--admin-username <adminUsername>', $('Add the admin-username value.'))
  .option('--custom-data <customData>', $('Add the custom-data value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/oSProfile" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/oSProfile" + "/" + "computerNamePrefix";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.computerNamePrefix) {
      if (options.parse && options.computerNamePrefix) {
        options.computerNamePrefix = JSON.parse(options.computerNamePrefix);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.computerNamePrefix}]);
    }
    var paramPath = "/virtualMachineProfile/oSProfile" + "/" + "adminPassword";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.adminPassword) {
      if (options.parse && options.adminPassword) {
        options.adminPassword = JSON.parse(options.adminPassword);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.adminPassword}]);
    }
    var paramPath = "/virtualMachineProfile/oSProfile" + "/" + "adminUsername";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.adminUsername) {
      if (options.parse && options.adminUsername) {
        options.adminUsername = JSON.parse(options.adminUsername);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.adminUsername}]);
    }
    var paramPath = "/virtualMachineProfile/oSProfile" + "/" + "customData";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.customData) {
      if (options.parse && options.customData) {
        options.customData = JSON.parse(options.customData);
      }
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

  //parameters set linux-configuration
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
    if (options.parse && options.value) {
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
      if (options.parse && options.disablePasswordAuthentication) {
        options.disablePasswordAuthentication = JSON.parse(options.disablePasswordAuthentication);
      }
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

  //parameters remove linux-configuration
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('linux-configuration')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/oSProfile/linuxConfiguration";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add linux-configuration
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('linux-configuration')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--disable-password-authentication <disablePasswordAuthentication>', $('Add the disable-password-authentication value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/oSProfile/linuxConfiguration" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/oSProfile/linuxConfiguration" + "/" + "disablePasswordAuthentication";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.disablePasswordAuthentication) {
      if (options.parse && options.disablePasswordAuthentication) {
        options.disablePasswordAuthentication = JSON.parse(options.disablePasswordAuthentication);
      }
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

  //parameters remove ssh-configuration
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('ssh-configuration')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add ssh-configuration
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('ssh-configuration')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
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

  //parameters set public-keys
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
    if (options.parse && options.value) {
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
    options.path = "/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration/publicKeys" + (options.index ? ('/' + options.index) : '');
    var paramPath = options.path + "/" + "keyData";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.keyData) {
      if (options.parse && options.keyData) {
        options.keyData = JSON.parse(options.keyData);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.keyData}]);
    }
    var paramPath = options.path + "/" + "path";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.path) {
      if (options.parse && options.path) {
        options.path = JSON.parse(options.path);
      }
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

  //parameters remove public-keys
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('public-keys')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--index <index>', $('Indexer: index.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration/publicKeys" + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add public-keys
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('public-keys')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--key-data <keyData>', $('Add the key-data value.'))
  .option('--path <path>', $('Add the path value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration/publicKeys" + (options.index ? ('/' + options.index) : '') + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration/publicKeys" + (options.index ? ('/' + options.index) : '') + "/" + "keyData";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.keyData) {
      if (options.parse && options.keyData) {
        options.keyData = JSON.parse(options.keyData);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.keyData}]);
    }
    var paramPath = "/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration/publicKeys" + (options.index ? ('/' + options.index) : '') + "/" + "path";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.path) {
      if (options.parse && options.path) {
        options.path = JSON.parse(options.path);
      }
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

  //parameters remove secrets
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('secrets')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--index <index>', $('Indexer: index.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/oSProfile/secrets" + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add secrets
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('secrets')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/oSProfile/secrets" + (options.index ? ('/' + options.index) : '') + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
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

  //parameters set source-vault
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
    if (options.parse && options.value) {
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
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
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

  //parameters remove source-vault
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('source-vault')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--secrets-index <secrets-index>', $('Indexer: secrets-index.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/oSProfile/secrets/" + options.secretsIndex + "/sourceVault";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add source-vault
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('source-vault')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--reference-uri <referenceUri>', $('Add the reference-uri value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/oSProfile/secrets/" + options.secretsIndex + "/sourceVault" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/oSProfile/secrets/" + options.secretsIndex + "/sourceVault" + "/" + "referenceUri";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.referenceUri) {
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
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

  //parameters set vault-certificates
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
    if (options.parse && options.value) {
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
    options.path = "/virtualMachineProfile/oSProfile/secrets/" + options.secretsIndex + "/vaultCertificates" + (options.index ? ('/' + options.index) : '');
    var paramPath = options.path + "/" + "certificateStore";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.certificateStore) {
      if (options.parse && options.certificateStore) {
        options.certificateStore = JSON.parse(options.certificateStore);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.certificateStore}]);
    }
    var paramPath = options.path + "/" + "certificateUrl";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.certificateUrl) {
      if (options.parse && options.certificateUrl) {
        options.certificateUrl = JSON.parse(options.certificateUrl);
      }
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

  //parameters remove vault-certificates
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('vault-certificates')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--index <index>', $('Indexer: index.'))
  .option('--secrets-index <secrets-index>', $('Indexer: secrets-index.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/oSProfile/secrets/" + options.secretsIndex + "/vaultCertificates" + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add vault-certificates
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('vault-certificates')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--certificate-store <certificateStore>', $('Add the certificate-store value.'))
  .option('--certificate-url <certificateUrl>', $('Add the certificate-url value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/oSProfile/secrets/" + options.secretsIndex + "/vaultCertificates" + (options.index ? ('/' + options.index) : '') + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/oSProfile/secrets/" + options.secretsIndex + "/vaultCertificates" + (options.index ? ('/' + options.index) : '') + "/" + "certificateStore";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.certificateStore) {
      if (options.parse && options.certificateStore) {
        options.certificateStore = JSON.parse(options.certificateStore);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.certificateStore}]);
    }
    var paramPath = "/virtualMachineProfile/oSProfile/secrets/" + options.secretsIndex + "/vaultCertificates" + (options.index ? ('/' + options.index) : '') + "/" + "certificateUrl";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.certificateUrl) {
      if (options.parse && options.certificateUrl) {
        options.certificateUrl = JSON.parse(options.certificateUrl);
      }
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

  //parameters set windows-configuration
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
    if (options.parse && options.value) {
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
      if (options.parse && options.enableAutomaticUpdates) {
        options.enableAutomaticUpdates = JSON.parse(options.enableAutomaticUpdates);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.enableAutomaticUpdates}]);
    }
    var paramPath = options.path + "/" + "provisionVMAgent";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.provisionVMAgent) {
      if (options.parse && options.provisionVMAgent) {
        options.provisionVMAgent = JSON.parse(options.provisionVMAgent);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.provisionVMAgent}]);
    }
    var paramPath = options.path + "/" + "timeZone";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.timeZone) {
      if (options.parse && options.timeZone) {
        options.timeZone = JSON.parse(options.timeZone);
      }
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

  //parameters remove windows-configuration
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('windows-configuration')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/oSProfile/windowsConfiguration";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add windows-configuration
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('windows-configuration')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--enable-automatic-updates <enableAutomaticUpdates>', $('Add the enable-automatic-updates value.'))
  .option('--provision-vm-agent <provisionVMAgent>', $('Add the provision-vm-agent value.'))
  .option('--time-zone <timeZone>', $('Add the time-zone value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/oSProfile/windowsConfiguration" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/oSProfile/windowsConfiguration" + "/" + "enableAutomaticUpdates";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.enableAutomaticUpdates) {
      if (options.parse && options.enableAutomaticUpdates) {
        options.enableAutomaticUpdates = JSON.parse(options.enableAutomaticUpdates);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.enableAutomaticUpdates}]);
    }
    var paramPath = "/virtualMachineProfile/oSProfile/windowsConfiguration" + "/" + "provisionVMAgent";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.provisionVMAgent) {
      if (options.parse && options.provisionVMAgent) {
        options.provisionVMAgent = JSON.parse(options.provisionVMAgent);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.provisionVMAgent}]);
    }
    var paramPath = "/virtualMachineProfile/oSProfile/windowsConfiguration" + "/" + "timeZone";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.timeZone) {
      if (options.parse && options.timeZone) {
        options.timeZone = JSON.parse(options.timeZone);
      }
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

  //parameters set additional-unattend-contents
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
    if (options.parse && options.value) {
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
    options.path = "/virtualMachineProfile/oSProfile/windowsConfiguration/additionalUnattendContents" + (options.index ? ('/' + options.index) : '');
    var paramPath = options.path + "/" + "componentName";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.componentName) {
      if (options.parse && options.componentName) {
        options.componentName = JSON.parse(options.componentName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.componentName}]);
    }
    var paramPath = options.path + "/" + "content";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.content) {
      if (options.parse && options.content) {
        options.content = JSON.parse(options.content);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.content}]);
    }
    var paramPath = options.path + "/" + "passName";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.passName) {
      if (options.parse && options.passName) {
        options.passName = JSON.parse(options.passName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.passName}]);
    }
    var paramPath = options.path + "/" + "settingName";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.settingName) {
      if (options.parse && options.settingName) {
        options.settingName = JSON.parse(options.settingName);
      }
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

  //parameters remove additional-unattend-contents
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('additional-unattend-contents')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--index <index>', $('Indexer: index.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/oSProfile/windowsConfiguration/additionalUnattendContents" + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add additional-unattend-contents
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('additional-unattend-contents')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--component-name <componentName>', $('Add the component-name value.'))
  .option('--content <content>', $('Add the content value.'))
  .option('--pass-name <passName>', $('Add the pass-name value.'))
  .option('--setting-name <settingName>', $('Add the setting-name value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/oSProfile/windowsConfiguration/additionalUnattendContents" + (options.index ? ('/' + options.index) : '') + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/oSProfile/windowsConfiguration/additionalUnattendContents" + (options.index ? ('/' + options.index) : '') + "/" + "componentName";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.componentName) {
      if (options.parse && options.componentName) {
        options.componentName = JSON.parse(options.componentName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.componentName}]);
    }
    var paramPath = "/virtualMachineProfile/oSProfile/windowsConfiguration/additionalUnattendContents" + (options.index ? ('/' + options.index) : '') + "/" + "content";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.content) {
      if (options.parse && options.content) {
        options.content = JSON.parse(options.content);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.content}]);
    }
    var paramPath = "/virtualMachineProfile/oSProfile/windowsConfiguration/additionalUnattendContents" + (options.index ? ('/' + options.index) : '') + "/" + "passName";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.passName) {
      if (options.parse && options.passName) {
        options.passName = JSON.parse(options.passName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.passName}]);
    }
    var paramPath = "/virtualMachineProfile/oSProfile/windowsConfiguration/additionalUnattendContents" + (options.index ? ('/' + options.index) : '') + "/" + "settingName";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.settingName) {
      if (options.parse && options.settingName) {
        options.settingName = JSON.parse(options.settingName);
      }
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

  //parameters remove win-rm-configuration
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('win-rm-configuration')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add win-rm-configuration
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('win-rm-configuration')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
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

  //parameters set listeners
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
    if (options.parse && options.value) {
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
    options.path = "/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration/listeners" + (options.index ? ('/' + options.index) : '');
    var paramPath = options.path + "/" + "certificateUrl";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.certificateUrl) {
      if (options.parse && options.certificateUrl) {
        options.certificateUrl = JSON.parse(options.certificateUrl);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.certificateUrl}]);
    }
    var paramPath = options.path + "/" + "protocol";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.protocol) {
      if (options.parse && options.protocol) {
        options.protocol = JSON.parse(options.protocol);
      }
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

  //parameters remove listeners
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('listeners')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--index <index>', $('Indexer: index.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration/listeners" + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add listeners
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('listeners')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--certificate-url <certificateUrl>', $('Add the certificate-url value.'))
  .option('--protocol <protocol>', $('Add the protocol value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration/listeners" + (options.index ? ('/' + options.index) : '') + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration/listeners" + (options.index ? ('/' + options.index) : '') + "/" + "certificateUrl";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.certificateUrl) {
      if (options.parse && options.certificateUrl) {
        options.certificateUrl = JSON.parse(options.certificateUrl);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.certificateUrl}]);
    }
    var paramPath = "/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration/listeners" + (options.index ? ('/' + options.index) : '') + "/" + "protocol";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.protocol) {
      if (options.parse && options.protocol) {
        options.protocol = JSON.parse(options.protocol);
      }
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

  //parameters remove storage-profile
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('storage-profile')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/storageProfile";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add storage-profile
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('storage-profile')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/storageProfile" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
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

  //parameters set image-reference
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
    if (options.parse && options.value) {
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
      if (options.parse && options.offer) {
        options.offer = JSON.parse(options.offer);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.offer}]);
    }
    var paramPath = options.path + "/" + "publisher";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.publisher) {
      if (options.parse && options.publisher) {
        options.publisher = JSON.parse(options.publisher);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.publisher}]);
    }
    var paramPath = options.path + "/" + "sku";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.sku) {
      if (options.parse && options.sku) {
        options.sku = JSON.parse(options.sku);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.sku}]);
    }
    var paramPath = options.path + "/" + "version";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.version) {
      if (options.parse && options.version) {
        options.version = JSON.parse(options.version);
      }
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

  //parameters remove image-reference
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('image-reference')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/storageProfile/imageReference";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add image-reference
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('image-reference')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--offer <offer>', $('Add the offer value.'))
  .option('--publisher <publisher>', $('Add the publisher value.'))
  .option('--sku <sku>', $('Add the sku value.'))
  .option('--version <version>', $('Add the version value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/storageProfile/imageReference" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/storageProfile/imageReference" + "/" + "offer";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.offer) {
      if (options.parse && options.offer) {
        options.offer = JSON.parse(options.offer);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.offer}]);
    }
    var paramPath = "/virtualMachineProfile/storageProfile/imageReference" + "/" + "publisher";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.publisher) {
      if (options.parse && options.publisher) {
        options.publisher = JSON.parse(options.publisher);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.publisher}]);
    }
    var paramPath = "/virtualMachineProfile/storageProfile/imageReference" + "/" + "sku";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.sku) {
      if (options.parse && options.sku) {
        options.sku = JSON.parse(options.sku);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.sku}]);
    }
    var paramPath = "/virtualMachineProfile/storageProfile/imageReference" + "/" + "version";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.version) {
      if (options.parse && options.version) {
        options.version = JSON.parse(options.version);
      }
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

  //parameters set os-disk
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
    if (options.parse && options.value) {
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
      if (options.parse && options.caching) {
        options.caching = JSON.parse(options.caching);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.caching}]);
    }
    var paramPath = options.path + "/" + "createOption";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.createOption) {
      if (options.parse && options.createOption) {
        options.createOption = JSON.parse(options.createOption);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.createOption}]);
    }
    var paramPath = options.path + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = options.path + "/" + "operatingSystemType";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.operatingSystemType) {
      if (options.parse && options.operatingSystemType) {
        options.operatingSystemType = JSON.parse(options.operatingSystemType);
      }
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

  //parameters remove os-disk
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('os-disk')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/storageProfile/oSDisk";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add os-disk
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('os-disk')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--caching <caching>', $('Add the caching value.'))
  .option('--create-option <createOption>', $('Add the create-option value.'))
  .option('--name <name>', $('Add the name value.'))
  .option('--operating-system-type <operatingSystemType>', $('Add the operating-system-type value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/storageProfile/oSDisk" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/storageProfile/oSDisk" + "/" + "caching";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.caching) {
      if (options.parse && options.caching) {
        options.caching = JSON.parse(options.caching);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.caching}]);
    }
    var paramPath = "/virtualMachineProfile/storageProfile/oSDisk" + "/" + "createOption";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.createOption) {
      if (options.parse && options.createOption) {
        options.createOption = JSON.parse(options.createOption);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.createOption}]);
    }
    var paramPath = "/virtualMachineProfile/storageProfile/oSDisk" + "/" + "name";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = "/virtualMachineProfile/storageProfile/oSDisk" + "/" + "operatingSystemType";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.operatingSystemType) {
      if (options.parse && options.operatingSystemType) {
        options.operatingSystemType = JSON.parse(options.operatingSystemType);
      }
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

  //parameters set source-image
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
    if (options.parse && options.value) {
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
      if (options.parse && options.uri) {
        options.uri = JSON.parse(options.uri);
      }
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

  //parameters remove source-image
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('source-image')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "/virtualMachineProfile/storageProfile/oSDisk/sourceImage";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add source-image
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('source-image')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--uri <uri>', $('Add the uri value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "/virtualMachineProfile/storageProfile/oSDisk/sourceImage" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "/virtualMachineProfile/storageProfile/oSDisk/sourceImage" + "/" + "uri";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.uri) {
      if (options.parse && options.uri) {
        options.uri = JSON.parse(options.uri);
      }
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

  //parameters remove list-parameters
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('list-parameters')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add list-parameters
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('list-parameters')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
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

  //parameters set virtual-machine-scale-set-vm-list-parameters
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
    if (options.parse && options.value) {
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
      if (options.parse && options.expandExpression) {
        options.expandExpression = JSON.parse(options.expandExpression);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.expandExpression}]);
    }
    var paramPath = options.path + "/" + "filterExpression";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.filterExpression) {
      if (options.parse && options.filterExpression) {
        options.filterExpression = JSON.parse(options.filterExpression);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.filterExpression}]);
    }
    var paramPath = options.path + "/" + "resourceGroupName";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.resourceGroupName) {
      if (options.parse && options.resourceGroupName) {
        options.resourceGroupName = JSON.parse(options.resourceGroupName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.resourceGroupName}]);
    }
    var paramPath = options.path + "/" + "selectExpression";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.selectExpression) {
      if (options.parse && options.selectExpression) {
        options.selectExpression = JSON.parse(options.selectExpression);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.selectExpression}]);
    }
    var paramPath = options.path + "/" + "virtualMachineScaleSetName";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.virtualMachineScaleSetName) {
      if (options.parse && options.virtualMachineScaleSetName) {
        options.virtualMachineScaleSetName = JSON.parse(options.virtualMachineScaleSetName);
      }
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

  //parameters remove virtual-machine-scale-set-vm-list-parameters
  var parameters = vmssvm.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set-vm.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set-vm.'));
  remove.command('virtual-machine-scale-set-vm-list-parameters')
  .description($('Remove vmssvm parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log("=====================================");
    console.log("Reading file content from: \"" + options.parameterFile + "\"");
    console.log("=====================================");
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    console.log("JSON object:");
    console.log(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = "";
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
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
  //parameters add virtual-machine-scale-set-vm-list-parameters
  var parameters = vmssvm.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set-vm.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set-vm.'));
  add.command('virtual-machine-scale-set-vm-list-parameters')
  .description($('Remove vmssvm parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--expand-expression <expandExpression>', $('Add the expand-expression value.'))
  .option('--filter-expression <filterExpression>', $('Add the filter-expression value.'))
  .option('--resource-group-name <resourceGroupName>', $('Add the resource-group-name value.'))
  .option('--select-expression <selectExpression>', $('Add the select-expression value.'))
  .option('--virtual-machine-scale-set-name <virtualMachineScaleSetName>', $('Add the virtual-machine-scale-set-name value.'))
  .execute(function (  parameterFile  , options, _) {
    console.log(options);
    console.log(options.parameterFile);
    console.log(options.key);
    console.log(options.value);
    console.log(options.parse);
    if (options.parse && options.value) {
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
    options.operation = 'add';
    options.path = "" + "/" + options.key;
    console.log("options.path = " + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = "" + "/" + "expandExpression";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.expandExpression) {
      if (options.parse && options.expandExpression) {
        options.expandExpression = JSON.parse(options.expandExpression);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.expandExpression}]);
    }
    var paramPath = "" + "/" + "filterExpression";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.filterExpression) {
      if (options.parse && options.filterExpression) {
        options.filterExpression = JSON.parse(options.filterExpression);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.filterExpression}]);
    }
    var paramPath = "" + "/" + "resourceGroupName";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.resourceGroupName) {
      if (options.parse && options.resourceGroupName) {
        options.resourceGroupName = JSON.parse(options.resourceGroupName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.resourceGroupName}]);
    }
    var paramPath = "" + "/" + "selectExpression";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.selectExpression) {
      if (options.parse && options.selectExpression) {
        options.selectExpression = JSON.parse(options.selectExpression);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.selectExpression}]);
    }
    var paramPath = "" + "/" + "virtualMachineScaleSetName";
    console.log("================================================");
    console.log("JSON Parameters Path:" + paramPath);
    console.log("================================================");
    if (options.virtualMachineScaleSetName) {
      if (options.parse && options.virtualMachineScaleSetName) {
        options.virtualMachineScaleSetName = JSON.parse(options.virtualMachineScaleSetName);
      }
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
