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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('parameters = ' + options.parameters);
    if (options.parameterFile) {
      cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
      var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
      var parametersObj = JSON.parse(fileContent);
    }
    else {
      var parametersObj = JSON.parse(options.parameters);
    }
    cli.output.info('parametersObj = ' + JSON.stringify(parametersObj));
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
    cli.output.info('{\"provisioningState\":\"\",\"sku\":{\"capacity\":null,\"name\":\"\",\"tier\":\"\"},\"upgradePolicy\":{\"mode\":\"\"},\"virtualMachineProfile\":{\"extensionProfile\":{\"extensions\":[{\"autoUpgradeMinorVersion\":false,\"extensionType\":\"\",\"protectedSettings\":\"\",\"provisioningState\":\"\",\"publisher\":\"\",\"settings\":\"\",\"typeHandlerVersion\":\"\",\"id\":\"\",\"name\":\"\",\"type\":\"\",\"location\":\"\",\"tags\":{}}]},\"networkProfile\":{\"networkInterfaceConfigurations\":[{\"iPConfigurations\":[{\"loadBalancerBackendAddressPools\":[{\"referenceUri\":\"\"}],\"loadBalancerInboundNatPools\":[{\"referenceUri\":\"\"}],\"name\":\"\",\"subnet\":{\"referenceUri\":\"\"}}],\"name\":\"\",\"primary\":null}]},\"oSProfile\":{\"computerNamePrefix\":\"\",\"adminPassword\":\"\",\"adminUsername\":\"\",\"customData\":\"\",\"linuxConfiguration\":{\"disablePasswordAuthentication\":null,\"sshConfiguration\":{\"publicKeys\":[{\"keyData\":\"\",\"path\":\"\"}]}},\"secrets\":[{\"sourceVault\":{\"referenceUri\":\"\"},\"vaultCertificates\":[{\"certificateStore\":\"\",\"certificateUrl\":\"\"}]}],\"windowsConfiguration\":{\"additionalUnattendContents\":[{\"componentName\":\"\",\"content\":\"\",\"passName\":\"\",\"settingName\":\"\"}],\"enableAutomaticUpdates\":null,\"provisionVMAgent\":null,\"timeZone\":\"\",\"winRMConfiguration\":{\"listeners\":[{\"certificateUrl\":\"\",\"protocol\":\"\"}]}}},\"storageProfile\":{\"imageReference\":{\"offer\":\"\",\"publisher\":\"\",\"sku\":\"\",\"version\":\"\"},\"oSDisk\":{\"caching\":\"\",\"createOption\":\"\",\"name\":\"\",\"operatingSystemType\":\"\",\"sourceImage\":{\"uri\":\"\"},\"virtualHardDiskContainers\":[\"\"]}}},\"id\":\"\",\"name\":\"\",\"type\":\"\",\"location\":\"\",\"tags\":{}}');
    var filePath = 'vmss_createOrUpdate.json';
    if (options.parameterFile) {
      filePath = options.parameterFile;
    }
    fs.writeFileSync(filePath, beautify('{\r\n\"provisioningState\":\"\",\r\n\"sku\":{\r\n\"capacity\":null,\r\n\"name\":\"\",\r\n\"tier\":\"\"\r\n},\r\n\"upgradePolicy\":{\r\n\"mode\":\"\"\r\n},\r\n\"virtualMachineProfile\":{\r\n\"extensionProfile\":{\r\n\"extensions\":[\r\n{\r\n\"autoUpgradeMinorVersion\":false,\r\n\"extensionType\":\"\",\r\n\"protectedSettings\":\"\",\r\n\"provisioningState\":\"\",\r\n\"publisher\":\"\",\r\n\"settings\":\"\",\r\n\"typeHandlerVersion\":\"\",\r\n\"id\":\"\",\r\n\"name\":\"\",\r\n\"type\":\"\",\r\n\"location\":\"\",\r\n\"tags\":{\r\n\r\n}\r\n}\r\n]\r\n},\r\n\"networkProfile\":{\r\n\"networkInterfaceConfigurations\":[\r\n{\r\n\"iPConfigurations\":[\r\n{\r\n\"loadBalancerBackendAddressPools\":[\r\n{\r\n\"referenceUri\":\"\"\r\n}\r\n],\r\n\"loadBalancerInboundNatPools\":[\r\n{\r\n\"referenceUri\":\"\"\r\n}\r\n],\r\n\"name\":\"\",\r\n\"subnet\":{\r\n\"referenceUri\":\"\"\r\n}\r\n}\r\n],\r\n\"name\":\"\",\r\n\"primary\":null\r\n}\r\n]\r\n},\r\n\"oSProfile\":{\r\n\"computerNamePrefix\":\"\",\r\n\"adminPassword\":\"\",\r\n\"adminUsername\":\"\",\r\n\"customData\":\"\",\r\n\"linuxConfiguration\":{\r\n\"disablePasswordAuthentication\":null,\r\n\"sshConfiguration\":{\r\n\"publicKeys\":[\r\n{\r\n\"keyData\":\"\",\r\n\"path\":\"\"\r\n}\r\n]\r\n}\r\n},\r\n\"secrets\":[\r\n{\r\n\"sourceVault\":{\r\n\"referenceUri\":\"\"\r\n},\r\n\"vaultCertificates\":[\r\n{\r\n\"certificateStore\":\"\",\r\n\"certificateUrl\":\"\"\r\n}\r\n]\r\n}\r\n],\r\n\"windowsConfiguration\":{\r\n\"additionalUnattendContents\":[\r\n{\r\n\"componentName\":\"\",\r\n\"content\":\"\",\r\n\"passName\":\"\",\r\n\"settingName\":\"\"\r\n}\r\n],\r\n\"enableAutomaticUpdates\":null,\r\n\"provisionVMAgent\":null,\r\n\"timeZone\":\"\",\r\n\"winRMConfiguration\":{\r\n\"listeners\":[\r\n{\r\n\"certificateUrl\":\"\",\r\n\"protocol\":\"\"\r\n}\r\n]\r\n}\r\n}\r\n},\r\n\"storageProfile\":{\r\n\"imageReference\":{\r\n\"offer\":\"\",\r\n\"publisher\":\"\",\r\n\"sku\":\"\",\r\n\"version\":\"\"\r\n},\r\n\"oSDisk\":{\r\n\"caching\":\"\",\r\n\"createOption\":\"\",\r\n\"name\":\"\",\r\n\"operatingSystemType\":\"\",\r\n\"sourceImage\":{\r\n\"uri\":\"\"\r\n},\r\n\"virtualHardDiskContainers\":[\r\n\"\"\r\n]\r\n}\r\n}\r\n},\r\n\"id\":\"\",\r\n\"name\":\"\",\r\n\"type\":\"\",\r\n\"location\":\"\",\r\n\"tags\":{\r\n\r\n}\r\n}'));
    cli.output.info('=====================================');
    cli.output.info('Parameter file output to: ' + filePath);
    cli.output.info('=====================================');
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
    cli.output.info(options.parameterFile);
    cli.output.info(options.operation);
    cli.output.info(options.path);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
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
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--sku <sku>', $('Set the sku value.'))
  .option('--upgrade-policy <upgradePolicy>', $('Set the upgrade-policy value.'))
  .option('--virtual-machine-profile <virtualMachineProfile>', $('Set the virtual-machine-profile value.'))
  .option('--id <id>', $('Set the id value.'))
  .option('--name <name>', $('Set the name value.'))
  .option('--type <type>', $('Set the type value.'))
  .option('--location <location>', $('Set the location value.'))
  .option('--tags <tags>', $('Set the tags value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '';
    var paramPath = options.path + '/' + 'provisioningState';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.provisioningState) {
      if (options.parse && options.provisioningState) {
        options.provisioningState = JSON.parse(options.provisioningState);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.provisioningState}]);
    }
    paramPath = options.path + '/' + 'sku';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.sku) {
      if (options.parse && options.sku) {
        options.sku = JSON.parse(options.sku);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.sku}]);
    }
    paramPath = options.path + '/' + 'upgradePolicy';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.upgradePolicy) {
      if (options.parse && options.upgradePolicy) {
        options.upgradePolicy = JSON.parse(options.upgradePolicy);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.upgradePolicy}]);
    }
    paramPath = options.path + '/' + 'virtualMachineProfile';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.virtualMachineProfile) {
      if (options.parse && options.virtualMachineProfile) {
        options.virtualMachineProfile = JSON.parse(options.virtualMachineProfile);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.virtualMachineProfile}]);
    }
    paramPath = options.path + '/' + 'id';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.id) {
      if (options.parse && options.id) {
        options.id = JSON.parse(options.id);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.id}]);
    }
    paramPath = options.path + '/' + 'name';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    paramPath = options.path + '/' + 'type';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.type) {
      if (options.parse && options.type) {
        options.type = JSON.parse(options.type);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.type}]);
    }
    paramPath = options.path + '/' + 'location';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.location) {
      if (options.parse && options.location) {
        options.location = JSON.parse(options.location);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.location}]);
    }
    paramPath = options.path + '/' + 'tags';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.tags) {
      if (options.parse && options.tags) {
        options.tags = JSON.parse(options.tags);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.tags}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--sku <sku>', $('Add the sku value.'))
  .option('--upgrade-policy <upgradePolicy>', $('Add the upgrade-policy value.'))
  .option('--virtual-machine-profile <virtualMachineProfile>', $('Add the virtual-machine-profile value.'))
  .option('--id <id>', $('Add the id value.'))
  .option('--name <name>', $('Add the name value.'))
  .option('--type <type>', $('Add the type value.'))
  .option('--location <location>', $('Add the location value.'))
  .option('--tags <tags>', $('Add the tags value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '' + '/' + 'provisioningState';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.provisioningState) {
      if (options.parse && options.provisioningState) {
        options.provisioningState = JSON.parse(options.provisioningState);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.provisioningState}]);
    }
    var paramPath = '' + '/' + 'sku';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.sku) {
      if (options.parse && options.sku) {
        options.sku = JSON.parse(options.sku);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.sku}]);
    }
    var paramPath = '' + '/' + 'upgradePolicy';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.upgradePolicy) {
      if (options.parse && options.upgradePolicy) {
        options.upgradePolicy = JSON.parse(options.upgradePolicy);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.upgradePolicy}]);
    }
    var paramPath = '' + '/' + 'virtualMachineProfile';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.virtualMachineProfile) {
      if (options.parse && options.virtualMachineProfile) {
        options.virtualMachineProfile = JSON.parse(options.virtualMachineProfile);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.virtualMachineProfile}]);
    }
    var paramPath = '' + '/' + 'id';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.id) {
      if (options.parse && options.id) {
        options.id = JSON.parse(options.id);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.id}]);
    }
    var paramPath = '' + '/' + 'name';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = '' + '/' + 'type';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.type) {
      if (options.parse && options.type) {
        options.type = JSON.parse(options.type);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.type}]);
    }
    var paramPath = '' + '/' + 'location';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.location) {
      if (options.parse && options.location) {
        options.location = JSON.parse(options.location);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.location}]);
    }
    var paramPath = '' + '/' + 'tags';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.tags) {
      if (options.parse && options.tags) {
        options.tags = JSON.parse(options.tags);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.tags}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/sku';
    var paramPath = options.path + '/' + 'capacity';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.capacity) {
      if (options.parse && options.capacity) {
        options.capacity = JSON.parse(options.capacity);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.capacity}]);
    }
    paramPath = options.path + '/' + 'name';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    paramPath = options.path + '/' + 'tier';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.tier) {
      if (options.parse && options.tier) {
        options.tier = JSON.parse(options.tier);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.tier}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/sku';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/sku' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/sku' + '/' + 'capacity';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.capacity) {
      if (options.parse && options.capacity) {
        options.capacity = JSON.parse(options.capacity);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.capacity}]);
    }
    var paramPath = '/sku' + '/' + 'name';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = '/sku' + '/' + 'tier';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.tier) {
      if (options.parse && options.tier) {
        options.tier = JSON.parse(options.tier);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.tier}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/upgradePolicy';
    var paramPath = options.path + '/' + 'mode';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.mode) {
      if (options.parse && options.mode) {
        options.mode = JSON.parse(options.mode);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.mode}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/upgradePolicy';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/upgradePolicy' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/upgradePolicy' + '/' + 'mode';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.mode) {
      if (options.parse && options.mode) {
        options.mode = JSON.parse(options.mode);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.mode}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
  });

  //parameters set virtual-machine-profile
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('virtual-machine-profile')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--extension-profile <extensionProfile>', $('Set the extension-profile value.'))
  .option('--network-profile <networkProfile>', $('Set the network-profile value.'))
  .option('--os-profile <oSProfile>', $('Set the os-profile value.'))
  .option('--storage-profile <storageProfile>', $('Set the storage-profile value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile';
    var paramPath = options.path + '/' + 'extensionProfile';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.extensionProfile) {
      if (options.parse && options.extensionProfile) {
        options.extensionProfile = JSON.parse(options.extensionProfile);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.extensionProfile}]);
    }
    paramPath = options.path + '/' + 'networkProfile';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.networkProfile) {
      if (options.parse && options.networkProfile) {
        options.networkProfile = JSON.parse(options.networkProfile);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.networkProfile}]);
    }
    paramPath = options.path + '/' + 'oSProfile';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.oSProfile) {
      if (options.parse && options.oSProfile) {
        options.oSProfile = JSON.parse(options.oSProfile);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.oSProfile}]);
    }
    paramPath = options.path + '/' + 'storageProfile';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.storageProfile) {
      if (options.parse && options.storageProfile) {
        options.storageProfile = JSON.parse(options.storageProfile);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.storageProfile}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--extension-profile <extensionProfile>', $('Add the extension-profile value.'))
  .option('--network-profile <networkProfile>', $('Add the network-profile value.'))
  .option('--os-profile <oSProfile>', $('Add the os-profile value.'))
  .option('--storage-profile <storageProfile>', $('Add the storage-profile value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile' + '/' + 'extensionProfile';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.extensionProfile) {
      if (options.parse && options.extensionProfile) {
        options.extensionProfile = JSON.parse(options.extensionProfile);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.extensionProfile}]);
    }
    var paramPath = '/virtualMachineProfile' + '/' + 'networkProfile';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.networkProfile) {
      if (options.parse && options.networkProfile) {
        options.networkProfile = JSON.parse(options.networkProfile);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.networkProfile}]);
    }
    var paramPath = '/virtualMachineProfile' + '/' + 'oSProfile';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.oSProfile) {
      if (options.parse && options.oSProfile) {
        options.oSProfile = JSON.parse(options.oSProfile);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.oSProfile}]);
    }
    var paramPath = '/virtualMachineProfile' + '/' + 'storageProfile';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.storageProfile) {
      if (options.parse && options.storageProfile) {
        options.storageProfile = JSON.parse(options.storageProfile);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.storageProfile}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
  });

  //parameters set extension-profile
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('extension-profile')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--extensions <extensions>', $('Set the extensions value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/extensionProfile';
    var paramPath = options.path + '/' + 'extensions';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.extensions) {
      if (options.parse && options.extensions) {
        options.extensions = JSON.parse(options.extensions);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.extensions}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/extensionProfile';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--extensions <extensions>', $('Add the extensions value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/extensionProfile' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/extensionProfile' + '/' + 'extensions';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.extensions) {
      if (options.parse && options.extensions) {
        options.extensions = JSON.parse(options.extensions);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.extensions}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/extensionProfile/extensions' + (options.index ? ('/' + options.index) : '');
    if (options.value) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    var paramPath = options.path + '/' + 'autoUpgradeMinorVersion';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.autoUpgradeMinorVersion) {
      if (options.parse && options.autoUpgradeMinorVersion) {
        options.autoUpgradeMinorVersion = JSON.parse(options.autoUpgradeMinorVersion);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.autoUpgradeMinorVersion}]);
    }
    paramPath = options.path + '/' + 'extensionType';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.extensionType) {
      if (options.parse && options.extensionType) {
        options.extensionType = JSON.parse(options.extensionType);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.extensionType}]);
    }
    paramPath = options.path + '/' + 'protectedSettings';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.protectedSettings) {
      if (options.parse && options.protectedSettings) {
        options.protectedSettings = JSON.parse(options.protectedSettings);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.protectedSettings}]);
    }
    paramPath = options.path + '/' + 'provisioningState';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.provisioningState) {
      if (options.parse && options.provisioningState) {
        options.provisioningState = JSON.parse(options.provisioningState);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.provisioningState}]);
    }
    paramPath = options.path + '/' + 'publisher';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.publisher) {
      if (options.parse && options.publisher) {
        options.publisher = JSON.parse(options.publisher);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.publisher}]);
    }
    paramPath = options.path + '/' + 'settings';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.settings) {
      if (options.parse && options.settings) {
        options.settings = JSON.parse(options.settings);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.settings}]);
    }
    paramPath = options.path + '/' + 'typeHandlerVersion';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.typeHandlerVersion) {
      if (options.parse && options.typeHandlerVersion) {
        options.typeHandlerVersion = JSON.parse(options.typeHandlerVersion);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.typeHandlerVersion}]);
    }
    paramPath = options.path + '/' + 'id';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.id) {
      if (options.parse && options.id) {
        options.id = JSON.parse(options.id);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.id}]);
    }
    paramPath = options.path + '/' + 'name';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    paramPath = options.path + '/' + 'type';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.type) {
      if (options.parse && options.type) {
        options.type = JSON.parse(options.type);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.type}]);
    }
    paramPath = options.path + '/' + 'location';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.location) {
      if (options.parse && options.location) {
        options.location = JSON.parse(options.location);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.location}]);
    }
    paramPath = options.path + '/' + 'tags';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.tags) {
      if (options.parse && options.tags) {
        options.tags = JSON.parse(options.tags);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.tags}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/extensionProfile/extensions' + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/extensionProfile/extensions' + (options.index ? ('/' + options.index) : '') + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/extensionProfile/extensions' + (options.index ? ('/' + options.index) : '') + '/' + 'autoUpgradeMinorVersion';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.autoUpgradeMinorVersion) {
      if (options.parse && options.autoUpgradeMinorVersion) {
        options.autoUpgradeMinorVersion = JSON.parse(options.autoUpgradeMinorVersion);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.autoUpgradeMinorVersion}]);
    }
    var paramPath = '/virtualMachineProfile/extensionProfile/extensions' + (options.index ? ('/' + options.index) : '') + '/' + 'extensionType';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.extensionType) {
      if (options.parse && options.extensionType) {
        options.extensionType = JSON.parse(options.extensionType);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.extensionType}]);
    }
    var paramPath = '/virtualMachineProfile/extensionProfile/extensions' + (options.index ? ('/' + options.index) : '') + '/' + 'protectedSettings';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.protectedSettings) {
      if (options.parse && options.protectedSettings) {
        options.protectedSettings = JSON.parse(options.protectedSettings);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.protectedSettings}]);
    }
    var paramPath = '/virtualMachineProfile/extensionProfile/extensions' + (options.index ? ('/' + options.index) : '') + '/' + 'provisioningState';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.provisioningState) {
      if (options.parse && options.provisioningState) {
        options.provisioningState = JSON.parse(options.provisioningState);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.provisioningState}]);
    }
    var paramPath = '/virtualMachineProfile/extensionProfile/extensions' + (options.index ? ('/' + options.index) : '') + '/' + 'publisher';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.publisher) {
      if (options.parse && options.publisher) {
        options.publisher = JSON.parse(options.publisher);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.publisher}]);
    }
    var paramPath = '/virtualMachineProfile/extensionProfile/extensions' + (options.index ? ('/' + options.index) : '') + '/' + 'settings';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.settings) {
      if (options.parse && options.settings) {
        options.settings = JSON.parse(options.settings);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.settings}]);
    }
    var paramPath = '/virtualMachineProfile/extensionProfile/extensions' + (options.index ? ('/' + options.index) : '') + '/' + 'typeHandlerVersion';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.typeHandlerVersion) {
      if (options.parse && options.typeHandlerVersion) {
        options.typeHandlerVersion = JSON.parse(options.typeHandlerVersion);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.typeHandlerVersion}]);
    }
    var paramPath = '/virtualMachineProfile/extensionProfile/extensions' + (options.index ? ('/' + options.index) : '') + '/' + 'id';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.id) {
      if (options.parse && options.id) {
        options.id = JSON.parse(options.id);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.id}]);
    }
    var paramPath = '/virtualMachineProfile/extensionProfile/extensions' + (options.index ? ('/' + options.index) : '') + '/' + 'name';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = '/virtualMachineProfile/extensionProfile/extensions' + (options.index ? ('/' + options.index) : '') + '/' + 'type';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.type) {
      if (options.parse && options.type) {
        options.type = JSON.parse(options.type);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.type}]);
    }
    var paramPath = '/virtualMachineProfile/extensionProfile/extensions' + (options.index ? ('/' + options.index) : '') + '/' + 'location';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.location) {
      if (options.parse && options.location) {
        options.location = JSON.parse(options.location);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.location}]);
    }
    var paramPath = '/virtualMachineProfile/extensionProfile/extensions' + (options.index ? ('/' + options.index) : '') + '/' + 'tags';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.tags) {
      if (options.parse && options.tags) {
        options.tags = JSON.parse(options.tags);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.tags}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
  });

  //parameters set network-profile
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('network-profile')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--network-interface-configurations <networkInterfaceConfigurations>', $('Set the network-interface-configurations value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/networkProfile';
    var paramPath = options.path + '/' + 'networkInterfaceConfigurations';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.networkInterfaceConfigurations) {
      if (options.parse && options.networkInterfaceConfigurations) {
        options.networkInterfaceConfigurations = JSON.parse(options.networkInterfaceConfigurations);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.networkInterfaceConfigurations}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/networkProfile';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--network-interface-configurations <networkInterfaceConfigurations>', $('Add the network-interface-configurations value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/networkProfile' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/networkProfile' + '/' + 'networkInterfaceConfigurations';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.networkInterfaceConfigurations) {
      if (options.parse && options.networkInterfaceConfigurations) {
        options.networkInterfaceConfigurations = JSON.parse(options.networkInterfaceConfigurations);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.networkInterfaceConfigurations}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--ip-configurations <ipConfigurations>', $('Set the ip-configurations value.'))
  .option('--name <name>', $('Set the name value.'))
  .option('--primary <primary>', $('Set the primary value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations' + (options.index ? ('/' + options.index) : '');
    if (options.value) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    var paramPath = options.path + '/' + 'ipConfigurations';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.ipConfigurations) {
      if (options.parse && options.ipConfigurations) {
        options.ipConfigurations = JSON.parse(options.ipConfigurations);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.ipConfigurations}]);
    }
    paramPath = options.path + '/' + 'name';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    paramPath = options.path + '/' + 'primary';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.primary) {
      if (options.parse && options.primary) {
        options.primary = JSON.parse(options.primary);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.primary}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations' + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--ip-configurations <ipConfigurations>', $('Add the ip-configurations value.'))
  .option('--name <name>', $('Add the name value.'))
  .option('--primary <primary>', $('Add the primary value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations' + (options.index ? ('/' + options.index) : '') + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations' + (options.index ? ('/' + options.index) : '') + '/' + 'ipConfigurations';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.ipConfigurations) {
      if (options.parse && options.ipConfigurations) {
        options.ipConfigurations = JSON.parse(options.ipConfigurations);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.ipConfigurations}]);
    }
    var paramPath = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations' + (options.index ? ('/' + options.index) : '') + '/' + 'name';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations' + (options.index ? ('/' + options.index) : '') + '/' + 'primary';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.primary) {
      if (options.parse && options.primary) {
        options.primary = JSON.parse(options.primary);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.primary}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--load-balancer-backend-address-pools <loadBalancerBackendAddressPools>', $('Set the load-balancer-backend-address-pools value.'))
  .option('--load-balancer-inbound-nat-pools <loadBalancerInboundNatPools>', $('Set the load-balancer-inbound-nat-pools value.'))
  .option('--name <name>', $('Set the name value.'))
  .option('--subnet <subnet>', $('Set the subnet value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations' + (options.index ? ('/' + options.index) : '');
    if (options.value) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    var paramPath = options.path + '/' + 'loadBalancerBackendAddressPools';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.loadBalancerBackendAddressPools) {
      if (options.parse && options.loadBalancerBackendAddressPools) {
        options.loadBalancerBackendAddressPools = JSON.parse(options.loadBalancerBackendAddressPools);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.loadBalancerBackendAddressPools}]);
    }
    paramPath = options.path + '/' + 'loadBalancerInboundNatPools';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.loadBalancerInboundNatPools) {
      if (options.parse && options.loadBalancerInboundNatPools) {
        options.loadBalancerInboundNatPools = JSON.parse(options.loadBalancerInboundNatPools);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.loadBalancerInboundNatPools}]);
    }
    paramPath = options.path + '/' + 'name';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    paramPath = options.path + '/' + 'subnet';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.subnet) {
      if (options.parse && options.subnet) {
        options.subnet = JSON.parse(options.subnet);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.subnet}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations' + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--load-balancer-backend-address-pools <loadBalancerBackendAddressPools>', $('Add the load-balancer-backend-address-pools value.'))
  .option('--load-balancer-inbound-nat-pools <loadBalancerInboundNatPools>', $('Add the load-balancer-inbound-nat-pools value.'))
  .option('--name <name>', $('Add the name value.'))
  .option('--subnet <subnet>', $('Add the subnet value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations' + (options.index ? ('/' + options.index) : '') + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations' + (options.index ? ('/' + options.index) : '') + '/' + 'loadBalancerBackendAddressPools';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.loadBalancerBackendAddressPools) {
      if (options.parse && options.loadBalancerBackendAddressPools) {
        options.loadBalancerBackendAddressPools = JSON.parse(options.loadBalancerBackendAddressPools);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.loadBalancerBackendAddressPools}]);
    }
    var paramPath = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations' + (options.index ? ('/' + options.index) : '') + '/' + 'loadBalancerInboundNatPools';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.loadBalancerInboundNatPools) {
      if (options.parse && options.loadBalancerInboundNatPools) {
        options.loadBalancerInboundNatPools = JSON.parse(options.loadBalancerInboundNatPools);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.loadBalancerInboundNatPools}]);
    }
    var paramPath = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations' + (options.index ? ('/' + options.index) : '') + '/' + 'name';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations' + (options.index ? ('/' + options.index) : '') + '/' + 'subnet';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.subnet) {
      if (options.parse && options.subnet) {
        options.subnet = JSON.parse(options.subnet);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.subnet}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations/' + options.ipConfigurationsIndex + '/loadBalancerBackendAddressPools' + (options.index ? ('/' + options.index) : '');
    if (options.value) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    var paramPath = options.path + '/' + 'referenceUri';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.referenceUri) {
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.referenceUri}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations/' + options.ipConfigurationsIndex + '/loadBalancerBackendAddressPools' + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations/' + options.ipConfigurationsIndex + '/loadBalancerBackendAddressPools' + (options.index ? ('/' + options.index) : '') + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations/' + options.ipConfigurationsIndex + '/loadBalancerBackendAddressPools' + (options.index ? ('/' + options.index) : '') + '/' + 'referenceUri';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.referenceUri) {
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.referenceUri}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations/' + options.ipConfigurationsIndex + '/loadBalancerInboundNatPools' + (options.index ? ('/' + options.index) : '');
    if (options.value) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    var paramPath = options.path + '/' + 'referenceUri';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.referenceUri) {
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.referenceUri}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations/' + options.ipConfigurationsIndex + '/loadBalancerInboundNatPools' + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations/' + options.ipConfigurationsIndex + '/loadBalancerInboundNatPools' + (options.index ? ('/' + options.index) : '') + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations/' + options.ipConfigurationsIndex + '/loadBalancerInboundNatPools' + (options.index ? ('/' + options.index) : '') + '/' + 'referenceUri';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.referenceUri) {
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.referenceUri}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations/' + options.ipConfigurationsIndex + '/subnet';
    var paramPath = options.path + '/' + 'referenceUri';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.referenceUri) {
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.referenceUri}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations/' + options.ipConfigurationsIndex + '/subnet';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations/' + options.ipConfigurationsIndex + '/subnet' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/networkProfile/networkInterfaceConfigurations/' + options.networkInterfaceConfigurationsIndex + '/iPConfigurations/' + options.ipConfigurationsIndex + '/subnet' + '/' + 'referenceUri';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.referenceUri) {
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.referenceUri}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--linux-configuration <linuxConfiguration>', $('Set the linux-configuration value.'))
  .option('--secrets <secrets>', $('Set the secrets value.'))
  .option('--windows-configuration <windowsConfiguration>', $('Set the windows-configuration value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/oSProfile';
    var paramPath = options.path + '/' + 'computerNamePrefix';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.computerNamePrefix) {
      if (options.parse && options.computerNamePrefix) {
        options.computerNamePrefix = JSON.parse(options.computerNamePrefix);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.computerNamePrefix}]);
    }
    paramPath = options.path + '/' + 'adminPassword';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.adminPassword) {
      if (options.parse && options.adminPassword) {
        options.adminPassword = JSON.parse(options.adminPassword);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.adminPassword}]);
    }
    paramPath = options.path + '/' + 'adminUsername';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.adminUsername) {
      if (options.parse && options.adminUsername) {
        options.adminUsername = JSON.parse(options.adminUsername);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.adminUsername}]);
    }
    paramPath = options.path + '/' + 'customData';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.customData) {
      if (options.parse && options.customData) {
        options.customData = JSON.parse(options.customData);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.customData}]);
    }
    paramPath = options.path + '/' + 'linuxConfiguration';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.linuxConfiguration) {
      if (options.parse && options.linuxConfiguration) {
        options.linuxConfiguration = JSON.parse(options.linuxConfiguration);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.linuxConfiguration}]);
    }
    paramPath = options.path + '/' + 'secrets';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.secrets) {
      if (options.parse && options.secrets) {
        options.secrets = JSON.parse(options.secrets);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.secrets}]);
    }
    paramPath = options.path + '/' + 'windowsConfiguration';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.windowsConfiguration) {
      if (options.parse && options.windowsConfiguration) {
        options.windowsConfiguration = JSON.parse(options.windowsConfiguration);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.windowsConfiguration}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/oSProfile';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--linux-configuration <linuxConfiguration>', $('Add the linux-configuration value.'))
  .option('--secrets <secrets>', $('Add the secrets value.'))
  .option('--windows-configuration <windowsConfiguration>', $('Add the windows-configuration value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/oSProfile' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/oSProfile' + '/' + 'computerNamePrefix';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.computerNamePrefix) {
      if (options.parse && options.computerNamePrefix) {
        options.computerNamePrefix = JSON.parse(options.computerNamePrefix);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.computerNamePrefix}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile' + '/' + 'adminPassword';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.adminPassword) {
      if (options.parse && options.adminPassword) {
        options.adminPassword = JSON.parse(options.adminPassword);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.adminPassword}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile' + '/' + 'adminUsername';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.adminUsername) {
      if (options.parse && options.adminUsername) {
        options.adminUsername = JSON.parse(options.adminUsername);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.adminUsername}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile' + '/' + 'customData';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.customData) {
      if (options.parse && options.customData) {
        options.customData = JSON.parse(options.customData);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.customData}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile' + '/' + 'linuxConfiguration';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.linuxConfiguration) {
      if (options.parse && options.linuxConfiguration) {
        options.linuxConfiguration = JSON.parse(options.linuxConfiguration);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.linuxConfiguration}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile' + '/' + 'secrets';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.secrets) {
      if (options.parse && options.secrets) {
        options.secrets = JSON.parse(options.secrets);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.secrets}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile' + '/' + 'windowsConfiguration';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.windowsConfiguration) {
      if (options.parse && options.windowsConfiguration) {
        options.windowsConfiguration = JSON.parse(options.windowsConfiguration);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.windowsConfiguration}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--ssh-configuration <sshConfiguration>', $('Set the ssh-configuration value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/oSProfile/linuxConfiguration';
    var paramPath = options.path + '/' + 'disablePasswordAuthentication';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.disablePasswordAuthentication) {
      if (options.parse && options.disablePasswordAuthentication) {
        options.disablePasswordAuthentication = JSON.parse(options.disablePasswordAuthentication);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.disablePasswordAuthentication}]);
    }
    paramPath = options.path + '/' + 'sshConfiguration';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.sshConfiguration) {
      if (options.parse && options.sshConfiguration) {
        options.sshConfiguration = JSON.parse(options.sshConfiguration);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.sshConfiguration}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/oSProfile/linuxConfiguration';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--ssh-configuration <sshConfiguration>', $('Add the ssh-configuration value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/oSProfile/linuxConfiguration' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/oSProfile/linuxConfiguration' + '/' + 'disablePasswordAuthentication';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.disablePasswordAuthentication) {
      if (options.parse && options.disablePasswordAuthentication) {
        options.disablePasswordAuthentication = JSON.parse(options.disablePasswordAuthentication);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.disablePasswordAuthentication}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile/linuxConfiguration' + '/' + 'sshConfiguration';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.sshConfiguration) {
      if (options.parse && options.sshConfiguration) {
        options.sshConfiguration = JSON.parse(options.sshConfiguration);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.sshConfiguration}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
  });

  //parameters set ssh-configuration
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('ssh-configuration')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--public-keys <publicKeys>', $('Set the public-keys value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration';
    var paramPath = options.path + '/' + 'publicKeys';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.publicKeys) {
      if (options.parse && options.publicKeys) {
        options.publicKeys = JSON.parse(options.publicKeys);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.publicKeys}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--public-keys <publicKeys>', $('Add the public-keys value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration' + '/' + 'publicKeys';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.publicKeys) {
      if (options.parse && options.publicKeys) {
        options.publicKeys = JSON.parse(options.publicKeys);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.publicKeys}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration/publicKeys' + (options.index ? ('/' + options.index) : '');
    if (options.value) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    var paramPath = options.path + '/' + 'keyData';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.keyData) {
      if (options.parse && options.keyData) {
        options.keyData = JSON.parse(options.keyData);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.keyData}]);
    }
    paramPath = options.path + '/' + 'path';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.path) {
      if (options.parse && options.path) {
        options.path = JSON.parse(options.path);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.path}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration/publicKeys' + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration/publicKeys' + (options.index ? ('/' + options.index) : '') + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration/publicKeys' + (options.index ? ('/' + options.index) : '') + '/' + 'keyData';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.keyData) {
      if (options.parse && options.keyData) {
        options.keyData = JSON.parse(options.keyData);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.keyData}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile/linuxConfiguration/sshConfiguration/publicKeys' + (options.index ? ('/' + options.index) : '') + '/' + 'path';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.path) {
      if (options.parse && options.path) {
        options.path = JSON.parse(options.path);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.path}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
  });

  //parameters set secrets
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('secrets')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--index <index>', $('Indexer: index.'))
  .option('--source-vault <sourceVault>', $('Set the source-vault value.'))
  .option('--vault-certificates <vaultCertificates>', $('Set the vault-certificates value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/oSProfile/secrets' + (options.index ? ('/' + options.index) : '');
    if (options.value) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    var paramPath = options.path + '/' + 'sourceVault';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.sourceVault) {
      if (options.parse && options.sourceVault) {
        options.sourceVault = JSON.parse(options.sourceVault);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.sourceVault}]);
    }
    paramPath = options.path + '/' + 'vaultCertificates';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.vaultCertificates) {
      if (options.parse && options.vaultCertificates) {
        options.vaultCertificates = JSON.parse(options.vaultCertificates);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.vaultCertificates}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/oSProfile/secrets' + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--source-vault <sourceVault>', $('Add the source-vault value.'))
  .option('--vault-certificates <vaultCertificates>', $('Add the vault-certificates value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/oSProfile/secrets' + (options.index ? ('/' + options.index) : '') + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/oSProfile/secrets' + (options.index ? ('/' + options.index) : '') + '/' + 'sourceVault';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.sourceVault) {
      if (options.parse && options.sourceVault) {
        options.sourceVault = JSON.parse(options.sourceVault);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.sourceVault}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile/secrets' + (options.index ? ('/' + options.index) : '') + '/' + 'vaultCertificates';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.vaultCertificates) {
      if (options.parse && options.vaultCertificates) {
        options.vaultCertificates = JSON.parse(options.vaultCertificates);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.vaultCertificates}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/oSProfile/secrets/' + options.secretsIndex + '/sourceVault';
    var paramPath = options.path + '/' + 'referenceUri';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.referenceUri) {
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.referenceUri}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/oSProfile/secrets/' + options.secretsIndex + '/sourceVault';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/oSProfile/secrets/' + options.secretsIndex + '/sourceVault' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/oSProfile/secrets/' + options.secretsIndex + '/sourceVault' + '/' + 'referenceUri';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.referenceUri) {
      if (options.parse && options.referenceUri) {
        options.referenceUri = JSON.parse(options.referenceUri);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.referenceUri}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/oSProfile/secrets/' + options.secretsIndex + '/vaultCertificates' + (options.index ? ('/' + options.index) : '');
    if (options.value) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    var paramPath = options.path + '/' + 'certificateStore';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.certificateStore) {
      if (options.parse && options.certificateStore) {
        options.certificateStore = JSON.parse(options.certificateStore);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.certificateStore}]);
    }
    paramPath = options.path + '/' + 'certificateUrl';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.certificateUrl) {
      if (options.parse && options.certificateUrl) {
        options.certificateUrl = JSON.parse(options.certificateUrl);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.certificateUrl}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/oSProfile/secrets/' + options.secretsIndex + '/vaultCertificates' + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/oSProfile/secrets/' + options.secretsIndex + '/vaultCertificates' + (options.index ? ('/' + options.index) : '') + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/oSProfile/secrets/' + options.secretsIndex + '/vaultCertificates' + (options.index ? ('/' + options.index) : '') + '/' + 'certificateStore';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.certificateStore) {
      if (options.parse && options.certificateStore) {
        options.certificateStore = JSON.parse(options.certificateStore);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.certificateStore}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile/secrets/' + options.secretsIndex + '/vaultCertificates' + (options.index ? ('/' + options.index) : '') + '/' + 'certificateUrl';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.certificateUrl) {
      if (options.parse && options.certificateUrl) {
        options.certificateUrl = JSON.parse(options.certificateUrl);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.certificateUrl}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--additional-unattend-contents <additionalUnattendContents>', $('Set the additional-unattend-contents value.'))
  .option('--enable-automatic-updates <enableAutomaticUpdates>', $('Set the enable-automatic-updates value.'))
  .option('--provision-vm-agent <provisionVMAgent>', $('Set the provision-vm-agent value.'))
  .option('--time-zone <timeZone>', $('Set the time-zone value.'))
  .option('--win-rm-configuration <winRMConfiguration>', $('Set the win-rm-configuration value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/oSProfile/windowsConfiguration';
    var paramPath = options.path + '/' + 'additionalUnattendContents';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.additionalUnattendContents) {
      if (options.parse && options.additionalUnattendContents) {
        options.additionalUnattendContents = JSON.parse(options.additionalUnattendContents);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.additionalUnattendContents}]);
    }
    paramPath = options.path + '/' + 'enableAutomaticUpdates';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.enableAutomaticUpdates) {
      if (options.parse && options.enableAutomaticUpdates) {
        options.enableAutomaticUpdates = JSON.parse(options.enableAutomaticUpdates);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.enableAutomaticUpdates}]);
    }
    paramPath = options.path + '/' + 'provisionVMAgent';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.provisionVMAgent) {
      if (options.parse && options.provisionVMAgent) {
        options.provisionVMAgent = JSON.parse(options.provisionVMAgent);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.provisionVMAgent}]);
    }
    paramPath = options.path + '/' + 'timeZone';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.timeZone) {
      if (options.parse && options.timeZone) {
        options.timeZone = JSON.parse(options.timeZone);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.timeZone}]);
    }
    paramPath = options.path + '/' + 'winRMConfiguration';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.winRMConfiguration) {
      if (options.parse && options.winRMConfiguration) {
        options.winRMConfiguration = JSON.parse(options.winRMConfiguration);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.winRMConfiguration}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/oSProfile/windowsConfiguration';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--additional-unattend-contents <additionalUnattendContents>', $('Add the additional-unattend-contents value.'))
  .option('--enable-automatic-updates <enableAutomaticUpdates>', $('Add the enable-automatic-updates value.'))
  .option('--provision-vm-agent <provisionVMAgent>', $('Add the provision-vm-agent value.'))
  .option('--time-zone <timeZone>', $('Add the time-zone value.'))
  .option('--win-rm-configuration <winRMConfiguration>', $('Add the win-rm-configuration value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/oSProfile/windowsConfiguration' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/oSProfile/windowsConfiguration' + '/' + 'additionalUnattendContents';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.additionalUnattendContents) {
      if (options.parse && options.additionalUnattendContents) {
        options.additionalUnattendContents = JSON.parse(options.additionalUnattendContents);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.additionalUnattendContents}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile/windowsConfiguration' + '/' + 'enableAutomaticUpdates';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.enableAutomaticUpdates) {
      if (options.parse && options.enableAutomaticUpdates) {
        options.enableAutomaticUpdates = JSON.parse(options.enableAutomaticUpdates);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.enableAutomaticUpdates}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile/windowsConfiguration' + '/' + 'provisionVMAgent';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.provisionVMAgent) {
      if (options.parse && options.provisionVMAgent) {
        options.provisionVMAgent = JSON.parse(options.provisionVMAgent);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.provisionVMAgent}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile/windowsConfiguration' + '/' + 'timeZone';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.timeZone) {
      if (options.parse && options.timeZone) {
        options.timeZone = JSON.parse(options.timeZone);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.timeZone}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile/windowsConfiguration' + '/' + 'winRMConfiguration';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.winRMConfiguration) {
      if (options.parse && options.winRMConfiguration) {
        options.winRMConfiguration = JSON.parse(options.winRMConfiguration);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.winRMConfiguration}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/oSProfile/windowsConfiguration/additionalUnattendContents' + (options.index ? ('/' + options.index) : '');
    if (options.value) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    var paramPath = options.path + '/' + 'componentName';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.componentName) {
      if (options.parse && options.componentName) {
        options.componentName = JSON.parse(options.componentName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.componentName}]);
    }
    paramPath = options.path + '/' + 'content';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.content) {
      if (options.parse && options.content) {
        options.content = JSON.parse(options.content);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.content}]);
    }
    paramPath = options.path + '/' + 'passName';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.passName) {
      if (options.parse && options.passName) {
        options.passName = JSON.parse(options.passName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.passName}]);
    }
    paramPath = options.path + '/' + 'settingName';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.settingName) {
      if (options.parse && options.settingName) {
        options.settingName = JSON.parse(options.settingName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.settingName}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/oSProfile/windowsConfiguration/additionalUnattendContents' + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/oSProfile/windowsConfiguration/additionalUnattendContents' + (options.index ? ('/' + options.index) : '') + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/oSProfile/windowsConfiguration/additionalUnattendContents' + (options.index ? ('/' + options.index) : '') + '/' + 'componentName';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.componentName) {
      if (options.parse && options.componentName) {
        options.componentName = JSON.parse(options.componentName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.componentName}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile/windowsConfiguration/additionalUnattendContents' + (options.index ? ('/' + options.index) : '') + '/' + 'content';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.content) {
      if (options.parse && options.content) {
        options.content = JSON.parse(options.content);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.content}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile/windowsConfiguration/additionalUnattendContents' + (options.index ? ('/' + options.index) : '') + '/' + 'passName';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.passName) {
      if (options.parse && options.passName) {
        options.passName = JSON.parse(options.passName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.passName}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile/windowsConfiguration/additionalUnattendContents' + (options.index ? ('/' + options.index) : '') + '/' + 'settingName';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.settingName) {
      if (options.parse && options.settingName) {
        options.settingName = JSON.parse(options.settingName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.settingName}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
  });

  //parameters set win-rm-configuration
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('win-rm-configuration')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--listeners <listeners>', $('Set the listeners value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration';
    var paramPath = options.path + '/' + 'listeners';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.listeners) {
      if (options.parse && options.listeners) {
        options.listeners = JSON.parse(options.listeners);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.listeners}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--listeners <listeners>', $('Add the listeners value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration' + '/' + 'listeners';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.listeners) {
      if (options.parse && options.listeners) {
        options.listeners = JSON.parse(options.listeners);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.listeners}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration/listeners' + (options.index ? ('/' + options.index) : '');
    if (options.value) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    var paramPath = options.path + '/' + 'certificateUrl';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.certificateUrl) {
      if (options.parse && options.certificateUrl) {
        options.certificateUrl = JSON.parse(options.certificateUrl);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.certificateUrl}]);
    }
    paramPath = options.path + '/' + 'protocol';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.protocol) {
      if (options.parse && options.protocol) {
        options.protocol = JSON.parse(options.protocol);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.protocol}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration/listeners' + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration/listeners' + (options.index ? ('/' + options.index) : '') + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration/listeners' + (options.index ? ('/' + options.index) : '') + '/' + 'certificateUrl';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.certificateUrl) {
      if (options.parse && options.certificateUrl) {
        options.certificateUrl = JSON.parse(options.certificateUrl);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.certificateUrl}]);
    }
    var paramPath = '/virtualMachineProfile/oSProfile/windowsConfiguration/winRMConfiguration/listeners' + (options.index ? ('/' + options.index) : '') + '/' + 'protocol';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.protocol) {
      if (options.parse && options.protocol) {
        options.protocol = JSON.parse(options.protocol);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.protocol}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
  });

  //parameters set storage-profile
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('storage-profile')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--image-reference <imageReference>', $('Set the image-reference value.'))
  .option('--os-disk <oSDisk>', $('Set the os-disk value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/storageProfile';
    var paramPath = options.path + '/' + 'imageReference';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.imageReference) {
      if (options.parse && options.imageReference) {
        options.imageReference = JSON.parse(options.imageReference);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.imageReference}]);
    }
    paramPath = options.path + '/' + 'oSDisk';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.oSDisk) {
      if (options.parse && options.oSDisk) {
        options.oSDisk = JSON.parse(options.oSDisk);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.oSDisk}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/storageProfile';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--image-reference <imageReference>', $('Add the image-reference value.'))
  .option('--os-disk <oSDisk>', $('Add the os-disk value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/storageProfile' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/storageProfile' + '/' + 'imageReference';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.imageReference) {
      if (options.parse && options.imageReference) {
        options.imageReference = JSON.parse(options.imageReference);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.imageReference}]);
    }
    var paramPath = '/virtualMachineProfile/storageProfile' + '/' + 'oSDisk';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.oSDisk) {
      if (options.parse && options.oSDisk) {
        options.oSDisk = JSON.parse(options.oSDisk);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.oSDisk}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/storageProfile/imageReference';
    var paramPath = options.path + '/' + 'offer';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.offer) {
      if (options.parse && options.offer) {
        options.offer = JSON.parse(options.offer);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.offer}]);
    }
    paramPath = options.path + '/' + 'publisher';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.publisher) {
      if (options.parse && options.publisher) {
        options.publisher = JSON.parse(options.publisher);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.publisher}]);
    }
    paramPath = options.path + '/' + 'sku';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.sku) {
      if (options.parse && options.sku) {
        options.sku = JSON.parse(options.sku);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.sku}]);
    }
    paramPath = options.path + '/' + 'version';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.version) {
      if (options.parse && options.version) {
        options.version = JSON.parse(options.version);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.version}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/storageProfile/imageReference';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/storageProfile/imageReference' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/storageProfile/imageReference' + '/' + 'offer';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.offer) {
      if (options.parse && options.offer) {
        options.offer = JSON.parse(options.offer);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.offer}]);
    }
    var paramPath = '/virtualMachineProfile/storageProfile/imageReference' + '/' + 'publisher';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.publisher) {
      if (options.parse && options.publisher) {
        options.publisher = JSON.parse(options.publisher);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.publisher}]);
    }
    var paramPath = '/virtualMachineProfile/storageProfile/imageReference' + '/' + 'sku';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.sku) {
      if (options.parse && options.sku) {
        options.sku = JSON.parse(options.sku);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.sku}]);
    }
    var paramPath = '/virtualMachineProfile/storageProfile/imageReference' + '/' + 'version';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.version) {
      if (options.parse && options.version) {
        options.version = JSON.parse(options.version);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.version}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--source-image <sourceImage>', $('Set the source-image value.'))
  .option('--virtual-hard-disk-containers <virtualHardDiskContainers>', $('Set the virtual-hard-disk-containers value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/storageProfile/oSDisk';
    var paramPath = options.path + '/' + 'caching';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.caching) {
      if (options.parse && options.caching) {
        options.caching = JSON.parse(options.caching);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.caching}]);
    }
    paramPath = options.path + '/' + 'createOption';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.createOption) {
      if (options.parse && options.createOption) {
        options.createOption = JSON.parse(options.createOption);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.createOption}]);
    }
    paramPath = options.path + '/' + 'name';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    paramPath = options.path + '/' + 'operatingSystemType';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.operatingSystemType) {
      if (options.parse && options.operatingSystemType) {
        options.operatingSystemType = JSON.parse(options.operatingSystemType);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.operatingSystemType}]);
    }
    paramPath = options.path + '/' + 'sourceImage';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.sourceImage) {
      if (options.parse && options.sourceImage) {
        options.sourceImage = JSON.parse(options.sourceImage);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.sourceImage}]);
    }
    paramPath = options.path + '/' + 'virtualHardDiskContainers';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.virtualHardDiskContainers) {
      if (options.parse && options.virtualHardDiskContainers) {
        options.virtualHardDiskContainers = JSON.parse(options.virtualHardDiskContainers);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.virtualHardDiskContainers}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/storageProfile/oSDisk';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
  .option('--source-image <sourceImage>', $('Add the source-image value.'))
  .option('--virtual-hard-disk-containers <virtualHardDiskContainers>', $('Add the virtual-hard-disk-containers value.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/storageProfile/oSDisk' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/storageProfile/oSDisk' + '/' + 'caching';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.caching) {
      if (options.parse && options.caching) {
        options.caching = JSON.parse(options.caching);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.caching}]);
    }
    var paramPath = '/virtualMachineProfile/storageProfile/oSDisk' + '/' + 'createOption';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.createOption) {
      if (options.parse && options.createOption) {
        options.createOption = JSON.parse(options.createOption);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.createOption}]);
    }
    var paramPath = '/virtualMachineProfile/storageProfile/oSDisk' + '/' + 'name';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.name) {
      if (options.parse && options.name) {
        options.name = JSON.parse(options.name);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.name}]);
    }
    var paramPath = '/virtualMachineProfile/storageProfile/oSDisk' + '/' + 'operatingSystemType';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.operatingSystemType) {
      if (options.parse && options.operatingSystemType) {
        options.operatingSystemType = JSON.parse(options.operatingSystemType);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.operatingSystemType}]);
    }
    var paramPath = '/virtualMachineProfile/storageProfile/oSDisk' + '/' + 'sourceImage';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.sourceImage) {
      if (options.parse && options.sourceImage) {
        options.sourceImage = JSON.parse(options.sourceImage);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.sourceImage}]);
    }
    var paramPath = '/virtualMachineProfile/storageProfile/oSDisk' + '/' + 'virtualHardDiskContainers';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.virtualHardDiskContainers) {
      if (options.parse && options.virtualHardDiskContainers) {
        options.virtualHardDiskContainers = JSON.parse(options.virtualHardDiskContainers);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.virtualHardDiskContainers}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/storageProfile/oSDisk/sourceImage';
    var paramPath = options.path + '/' + 'uri';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.uri) {
      if (options.parse && options.uri) {
        options.uri = JSON.parse(options.uri);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.uri}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/storageProfile/oSDisk/sourceImage';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/storageProfile/oSDisk/sourceImage' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '/virtualMachineProfile/storageProfile/oSDisk/sourceImage' + '/' + 'uri';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.uri) {
      if (options.parse && options.uri) {
        options.uri = JSON.parse(options.uri);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.uri}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
  });

  //parameters set virtual-hard-disk-containers
  var parameters = vmss.category('parameters')
  .description($('Commands to manage parameter for your virtual-machine-scale-set.'));
  var set = parameters.category('set')
  .description($('Commands to set parameter file for your virtual-machine-scale-set.'));
  set.command('virtual-hard-disk-containers')
  .description($('Set vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .option('--index <index>', $('Indexer: index.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '/virtualMachineProfile/storageProfile/oSDisk/virtualHardDiskContainers' + (options.index ? ('/' + options.index) : '');
    if (options.value) {
      jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
  });

  //parameters remove virtual-hard-disk-containers
  var parameters = vmss.category('parameters')
  .description($('Commands to remove parameter for your virtual-machine-scale-set.'));
  var remove = parameters.category('remove')
  .description($('Commands to remove values in the parameter file for your virtual-machine-scale-set.'));
  remove.command('virtual-hard-disk-containers')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--index <index>', $('Indexer: index.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '/virtualMachineProfile/storageProfile/oSDisk/virtualHardDiskContainers' + (options.index ? ('/' + options.index) : '');
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
  });
  //parameters add virtual-hard-disk-containers
  var parameters = vmss.category('parameters')
  .description($('Commands to add parameter for your virtual-machine-scale-set.'));
  var add = parameters.category('add')
  .description($('Commands to add values in the parameter file for your virtual-machine-scale-set.'));
  add.command('virtual-hard-disk-containers')
  .description($('Remove vmss parameter string or files.'))
  .usage('[options]')
  .option('--parameter-file <parameter-file>', $('The parameter file path.'))
  .option('--key <key>', $('The JSON key.'))
  .option('--value <value>', $('The JSON value.'))
  .option('--parse', $('Parse the JSON value to object.'))
  .execute(function (  parameterFile  , options, _) {
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '/virtualMachineProfile/storageProfile/oSDisk/virtualHardDiskContainers' + (options.index ? ('/' + options.index) : '') + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.deallocate(options.resourceGroupName, options.vmScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> DeallocateInstances
/*
{"instanceIDs":[""]}
*/
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('deallocate-instances')
  .description($('deallocate-instances method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--vm-instance-ids <vm-instance-ids>', $('vm-instance-ids'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, vmInstanceIds, options, _) {
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    cli.output.info('vmInstanceIds = ' + options.vmInstanceIds);
    if (options.parameterFile) {
      cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
      var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
      var vmInstanceIdsObj = JSON.parse(fileContent);
    }
    else {
      var vmInstanceIdsObj = JSON.parse(options.vmInstanceIds);
    }
    cli.output.info('vmInstanceIdsObj = ' + JSON.stringify(vmInstanceIdsObj));
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.deallocateInstances(options.resourceGroupName, options.vmScaleSetName, vmInstanceIdsObj, _);
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.delete(options.resourceGroupName, options.vmScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> DeleteInstances
/*
{"instanceIDs":[""]}
*/
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('delete-instances')
  .description($('delete-instances method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--vm-instance-ids <vm-instance-ids>', $('vm-instance-ids'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, vmInstanceIds, options, _) {
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    cli.output.info('vmInstanceIds = ' + options.vmInstanceIds);
    if (options.parameterFile) {
      cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
      var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
      var vmInstanceIdsObj = JSON.parse(fileContent);
    }
    else {
      var vmInstanceIdsObj = JSON.parse(options.vmInstanceIds);
    }
    cli.output.info('vmInstanceIdsObj = ' + JSON.stringify(vmInstanceIdsObj));
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.deleteInstances(options.resourceGroupName, options.vmScaleSetName, vmInstanceIdsObj, _);
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
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
    cli.output.info('parameters = ' + options.parameters);
    if (options.parameterFile) {
      cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
      var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
      var parametersObj = JSON.parse(fileContent);
    }
    else {
      var parametersObj = JSON.parse(options.parameters);
    }
    cli.output.info('parametersObj = ' + JSON.stringify(parametersObj));
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
    cli.output.info('{}');
    var filePath = 'vmss_listAll.json';
    if (options.parameterFile) {
      filePath = options.parameterFile;
    }
    fs.writeFileSync(filePath, beautify('{\r\n\r\n}'));
    cli.output.info('=====================================');
    cli.output.info('Parameter file output to: ' + filePath);
    cli.output.info('=====================================');
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
    cli.output.info(options.parameterFile);
    cli.output.info(options.operation);
    cli.output.info(options.path);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
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
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info('nextLink = ' + options.nextLink);
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.powerOff(options.resourceGroupName, options.vmScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> PowerOffInstances
/*
{"instanceIDs":[""]}
*/
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('power-off-instances')
  .description($('power-off-instances method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--vm-instance-ids <vm-instance-ids>', $('vm-instance-ids'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, vmInstanceIds, options, _) {
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    cli.output.info('vmInstanceIds = ' + options.vmInstanceIds);
    if (options.parameterFile) {
      cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
      var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
      var vmInstanceIdsObj = JSON.parse(fileContent);
    }
    else {
      var vmInstanceIdsObj = JSON.parse(options.vmInstanceIds);
    }
    cli.output.info('vmInstanceIdsObj = ' + JSON.stringify(vmInstanceIdsObj));
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.powerOffInstances(options.resourceGroupName, options.vmScaleSetName, vmInstanceIdsObj, _);
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.restart(options.resourceGroupName, options.vmScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> RestartInstances
/*
{"instanceIDs":[""]}
*/
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('restart-instances')
  .description($('restart-instances method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--vm-instance-ids <vm-instance-ids>', $('vm-instance-ids'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, vmInstanceIds, options, _) {
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    cli.output.info('vmInstanceIds = ' + options.vmInstanceIds);
    if (options.parameterFile) {
      cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
      var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
      var vmInstanceIdsObj = JSON.parse(fileContent);
    }
    else {
      var vmInstanceIdsObj = JSON.parse(options.vmInstanceIds);
    }
    cli.output.info('vmInstanceIdsObj = ' + JSON.stringify(vmInstanceIdsObj));
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.restartInstances(options.resourceGroupName, options.vmScaleSetName, vmInstanceIdsObj, _);
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.start(options.resourceGroupName, options.vmScaleSetName, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> StartInstances
/*
{"instanceIDs":[""]}
*/
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('start-instances')
  .description($('start-instances method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--vm-instance-ids <vm-instance-ids>', $('vm-instance-ids'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, vmInstanceIds, options, _) {
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    cli.output.info('vmInstanceIds = ' + options.vmInstanceIds);
    if (options.parameterFile) {
      cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
      var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
      var vmInstanceIdsObj = JSON.parse(fileContent);
    }
    else {
      var vmInstanceIdsObj = JSON.parse(options.vmInstanceIds);
    }
    cli.output.info('vmInstanceIdsObj = ' + JSON.stringify(vmInstanceIdsObj));
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.startInstances(options.resourceGroupName, options.vmScaleSetName, vmInstanceIdsObj, _);
    cli.output.json(result);
  });
//virtualMachineScaleSet -> UpdateInstances
/*
{"instanceIDs":[""]}
*/
  var vmss = cli.category('vmss').description($('Commands to manage your virtual machine scale set.'));
  vmss.command('update-instances')
  .description($('update-instances method to manage your virtual machine scale set.'))
  .usage('[options]')
  .option('--resource-group-name <resource-group-name>', $('resource-group-name'))
  .option('--vm-scale-set-name <vm-scale-set-name>', $('vm-scale-set-name'))
  .option('--vm-instance-ids <vm-instance-ids>', $('vm-instance-ids'))
  .option('--parameter-file <parameter-file>', $('the input parameter file'))
  .option('-s, --subscription <subscription>', $('the subscription identifier'))
  .execute(function (resourceGroupName, vmScaleSetName, vmInstanceIds, options, _) {
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    cli.output.info('vmInstanceIds = ' + options.vmInstanceIds);
    if (options.parameterFile) {
      cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
      var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
      var vmInstanceIdsObj = JSON.parse(fileContent);
    }
    else {
      var vmInstanceIdsObj = JSON.parse(options.vmInstanceIds);
    }
    cli.output.info('vmInstanceIdsObj = ' + JSON.stringify(vmInstanceIdsObj));
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSets.updateInstances(options.resourceGroupName, options.vmScaleSetName, vmInstanceIdsObj, _);
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    cli.output.info('instanceId = ' + options.instanceId);
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    cli.output.info('instanceId = ' + options.instanceId);
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    cli.output.info('instanceId = ' + options.instanceId);
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    cli.output.info('instanceId = ' + options.instanceId);
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
    cli.output.info('parameters = ' + options.parameters);
    if (options.parameterFile) {
      cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
      var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
      var parametersObj = JSON.parse(fileContent);
    }
    else {
      var parametersObj = JSON.parse(options.parameters);
    }
    cli.output.info('parametersObj = ' + JSON.stringify(parametersObj));
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
    cli.output.info('{\"expandExpression\":\"\",\"filterExpression\":\"\",\"resourceGroupName\":\"\",\"selectExpression\":\"\",\"virtualMachineScaleSetName\":\"\"}');
    var filePath = 'vmssvm_list.json';
    if (options.parameterFile) {
      filePath = options.parameterFile;
    }
    fs.writeFileSync(filePath, beautify('{\r\n\"expandExpression\":\"\",\r\n\"filterExpression\":\"\",\r\n\"resourceGroupName\":\"\",\r\n\"selectExpression\":\"\",\r\n\"virtualMachineScaleSetName\":\"\"\r\n}'));
    cli.output.info('=====================================');
    cli.output.info('Parameter file output to: ' + filePath);
    cli.output.info('=====================================');
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
    cli.output.info(options.parameterFile);
    cli.output.info(options.operation);
    cli.output.info(options.path);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
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
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'replace';
    options.path = '';
    var paramPath = options.path + '/' + 'expandExpression';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.expandExpression) {
      if (options.parse && options.expandExpression) {
        options.expandExpression = JSON.parse(options.expandExpression);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.expandExpression}]);
    }
    paramPath = options.path + '/' + 'filterExpression';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.filterExpression) {
      if (options.parse && options.filterExpression) {
        options.filterExpression = JSON.parse(options.filterExpression);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.filterExpression}]);
    }
    paramPath = options.path + '/' + 'resourceGroupName';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.resourceGroupName) {
      if (options.parse && options.resourceGroupName) {
        options.resourceGroupName = JSON.parse(options.resourceGroupName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.resourceGroupName}]);
    }
    paramPath = options.path + '/' + 'selectExpression';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.selectExpression) {
      if (options.parse && options.selectExpression) {
        options.selectExpression = JSON.parse(options.selectExpression);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.selectExpression}]);
    }
    paramPath = options.path + '/' + 'virtualMachineScaleSetName';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.virtualMachineScaleSetName) {
      if (options.parse && options.virtualMachineScaleSetName) {
        options.virtualMachineScaleSetName = JSON.parse(options.virtualMachineScaleSetName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.virtualMachineScaleSetName}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'remove';
    options.path = '';
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path}]);
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info(options);
    cli.output.info(options.parameterFile);
    cli.output.info(options.key);
    cli.output.info(options.value);
    cli.output.info(options.parse);
    if (options.parse && options.value) {
      options.value = JSON.parse(options.value);
    }
    cli.output.info(options.value);
    cli.output.info('=====================================');
    cli.output.info('Reading file content from: \"' + options.parameterFile + '\"');
    cli.output.info('=====================================');
    var fileContent = fs.readFileSync(options.parameterFile, 'utf8');
    var parametersObj = JSON.parse(fileContent);
    cli.output.info('JSON object:');
    cli.output.info(JSON.stringify(parametersObj));
    options.operation = 'add';
    options.path = '' + '/' + options.key;
    cli.output.info('options.path = ' + options.path);
    jsonpatch.apply(parametersObj, [{op: options.operation, path: options.path, value: options.value}]);
    var paramPath = '' + '/' + 'expandExpression';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.expandExpression) {
      if (options.parse && options.expandExpression) {
        options.expandExpression = JSON.parse(options.expandExpression);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.expandExpression}]);
    }
    var paramPath = '' + '/' + 'filterExpression';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.filterExpression) {
      if (options.parse && options.filterExpression) {
        options.filterExpression = JSON.parse(options.filterExpression);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.filterExpression}]);
    }
    var paramPath = '' + '/' + 'resourceGroupName';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.resourceGroupName) {
      if (options.parse && options.resourceGroupName) {
        options.resourceGroupName = JSON.parse(options.resourceGroupName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.resourceGroupName}]);
    }
    var paramPath = '' + '/' + 'selectExpression';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.selectExpression) {
      if (options.parse && options.selectExpression) {
        options.selectExpression = JSON.parse(options.selectExpression);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.selectExpression}]);
    }
    var paramPath = '' + '/' + 'virtualMachineScaleSetName';
    cli.output.info('================================================');
    cli.output.info('JSON Parameters Path:' + paramPath);
    cli.output.info('================================================');
    if (options.virtualMachineScaleSetName) {
      if (options.parse && options.virtualMachineScaleSetName) {
        options.virtualMachineScaleSetName = JSON.parse(options.virtualMachineScaleSetName);
      }
      jsonpatch.apply(parametersObj, [{op: options.operation, path: paramPath, value: options.virtualMachineScaleSetName}]);
    }
    var updatedContent = JSON.stringify(parametersObj);
    cli.output.info('=====================================');
    cli.output.info('JSON object (updated):');
    cli.output.info(JSON.stringify(parametersObj));
    cli.output.info('=====================================');
    fs.writeFileSync(options.parameterFile, beautify(updatedContent));
    cli.output.info('=====================================');
    cli.output.info('Parameter file updated at: ' + options.parameterFile);
    cli.output.info('=====================================');
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    cli.output.info('instanceId = ' + options.instanceId);
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    cli.output.info('instanceId = ' + options.instanceId);
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
    cli.output.info('resourceGroupName = ' + options.resourceGroupName);
    cli.output.info('vmScaleSetName = ' + options.vmScaleSetName);
    cli.output.info('instanceId = ' + options.instanceId);
    var subscription = profile.current.getSubscription(options.subscription);
    var computeManagementClient = utils.createComputeResourceProviderClient(subscription);
    var result = computeManagementClient.virtualMachineScaleSetVMs.start(options.resourceGroupName, options.vmScaleSetName, options.instanceId, _);
    cli.output.json(result);
  });


};
