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
 *  Description : - Device object related functions
 */

//OS
ANDROID = "ANDROID";
IOS = "IOS";

//Device Type
PHONE = "PHONE";
TABLET = "TABLET";
IPAD = "TABLET";

//Device status
var DEVICE = {};
DEVICE.ACTIVE = "A";
DEVICE.INACTIVE = "I";
DEVICE.DELETED = "D";
DEVICE.PENDING = "P";

//Notifier status
var NOTIFIER = {};
NOTIFIER.PENDING = "P";
NOTIFIER.RECEIVED = "R";
NOTIFIER.DELETED = "D";

//Device_Policy status
var DEVICEPOLICY = {};
DEVICEPOLICY.ACTIVE = "A";
DEVICEPOLICY.DELETED = "D";

//Device_Info status
var DEVICEINFO = {};
DEVICEINFO.PENDING = "P";
DEVICEINFO.RECEIVED = "R";
DEVICEINFO.DELETED = "D";

//Reponse Content Type
var CONTENTTYPE = {};
CONTENTTYPE.JSON = "application/json";
CONTENTTYPE.APPLECONFIG = "application/x-apple-aspen-config";
CONTENTTYPE.PLAINTEXT = "text/plain";
CONTENTTYPE.CACERT = "application/x-x509-ca-cert";
CONTENTTYPE.CARACERT = "application/x-x509-ca-ra-cert";
CONTENTTYPE.PKIMESSAGE = "application/x-pki-message";