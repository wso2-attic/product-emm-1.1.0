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
 * 	Description : - Operation object is command that can be applied to a device
 */
var entity = require('entity');
var OperationModel = entity.model('Operation');
var complexQueries = require('/modules/queries.json');
/*
	Constructor accepts OperationModel object
*/
var Operation = function(operation){
	this.operation = operation;
    /*
    	Usage:- Check if the operation is valid for the device object. 
    		This method checks with the device platform 
    */
    this.valid = function(device){
	    var operations = OperationModel.query(complexQueries.operation.getOperationsForDevice, function(complexObject, model){
	        // Handle cases for queries 
	        // This can be provided via the sql-crud later
	        model.id = complexObject.id;
	        model.code = complexObject.code;
	        model.name = complexObject.name;
	        model.description = complexObject.description;
	        model.monitor = complexObject.monitor;
	        return model;
	    });    
	    if(operations.length==0){
	        return false;
	    }
	    return true;
    }
}