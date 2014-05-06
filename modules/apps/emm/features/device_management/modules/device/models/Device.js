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
 *  Description : - Device object that wraps the functionality of a Device
 */
var entity = require('entity');
var Device = function() {
    var DeviceModel = entity.model('Device');
    var deviceModel;
    var user;

    /*
        This is overwritten by the platform specific device module
     */
    this.registerNewDevice = function() {
    }

    /*
        Removes the device from EMM
    */
    this.unRegister = function() {

    }

    /*
		Performs operation 
        Accept feature code and options
	*/
    this.operate = function(operation, options) {
        // get the valid operation object
        var operation = DeviceModule.getOperations(this, operation);
        // check if operation is valid for device
        if(operation.valid(this)){
            try{
                var message = new Message(this, operation, options);
                message.queue();
                this.notify(operation);
            }catch(e){
                // Handle if wakeup manager has issues
                // for example ports are not open
            }

        }else{
            //handle if not valid
        }
        // create the notification object
        // create the message object
    }
    this.notify = function(operation){
        var notification = new Notification(this, operation);
        DeviceModule.notify(notification);
    }
    /* 
		Returns info about object in an options object
	*/
    this.info = function() {}

    this.enforce = function(){

    }
    //pass the policy object
    this.updatePolicy = function(policy){
        //return a json array
        var filteredPolicy = policy.getPayload(this);
        //write to the device_policy table
        // here we figure out if the policy can be applied or not 
        // we also write the filteredPolicy if decided
        var operation = policy_module.getPolicyOperation();
        for (var i = filteredPolicy.length - 1; i >= 0; i--) {
            var rule = filteredPolicy[i];
            var message = new Message(this, operation, rule);
            message.queue();
        };
        // create end of message
        var eod_message = new EODMessage(this);
        eod_message.queue();
        this.notify(operation);
    }
    // returns the payload that needs to be sent to the device
    this.getPendingPayload = function(){
        // platform dependant method
    }
    this.consumeResult = function(){};
};