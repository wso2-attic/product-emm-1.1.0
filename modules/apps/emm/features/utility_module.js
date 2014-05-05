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
 * 	Description : - HTTP API Layer for Device communication
 */


var utilityModule = (function() {

    function getPlatform(req) {

        var deviceObject = {};

        deviceObject.status = true;
        deviceObject.platform = req.body.platform;
        if(returnObject.platform == null) {
            //Get platform using userAgent
            var userAgent = req.getHeader("User-Agent");
            if(userAgent.match(/iPad/i)) {
                deviceObject.platform = "IOS";
                deviceObject.platformType = "IPAD";
            }else if (userAgent.match(/iPhone/i)) {
                deviceObject.platform = "IOS";
                deviceObject.platformType = "IPHONE";
            } else {
                //Invalid Device
                deviceObject.status = false;
            }
        } else if(platform == "ANDROID") {
            deviceObject.platformType = req.body.platformType;
            deviceObject.osVersion = req.body.osVersion;
            deviceObject.udid = req.body.udid;
            deviceObject.macAddress = req.body.macAddress;
            var extraInfo = {};
            extraInfo.vendor = req.body.vendor;
            deviceObject.extraInfo = extraInfo;
            var token = {};
            token.gcmToken = req.body.regid;
            deviceObject.token = token;
        } else {
            //Invalid Device
            returnObject.status = false;
        }
        return returnObject;
    }

});