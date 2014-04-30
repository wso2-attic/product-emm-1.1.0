/**
 *  Copyright (c) 2011, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *  Description : - A message object wrapping payloads  to devices 
 */
var entity = require('entity');
var DeviceInfoModel = entity.model('Device_Info');
var complexQueries = require('/modules/queries.json');

var Message = function(device, operation, options){
	this.device = device;
	this.operation = operation;
	this.operation = operation;
	// Persist the notifier of the message to the device_info table
	this.queue = function(){
		var model = new DeviceInfoModel();
		//populate the model with data
	}
}
// figure of the eodmessage
var EODMessage = function(device){
}
EODMessage.prototype = new Message();