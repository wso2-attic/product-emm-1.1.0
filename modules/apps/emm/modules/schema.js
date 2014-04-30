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
 */

var entity = require('entity');
var sql_crud = require('/modules/sql-crud.js').sqlCRUD;

var DriverModule = require('/modules/driver_module.js').DriverModule;
var db = DriverModule.getConnection();
DriverModule.createDB();


var DeviceSchema = new entity.Schema("Device", {
    id: Number,
    tenant_id: Number,
    user_id: String,
    platform_id: String,
    udid: String,
    os_version: String,
    ownership: Number,
    challenge_token: String,
    token: String,
    mac_address: String,
    status: String,
    created_date: Date,
    updated_date: Date
}, {
    tablename: "devices"
});

// Need to know the database
DeviceSchema.plugin(sql_crud, {
    db: db
});

var OperationSchema = new entity.Schema("Operation", {
    id: Number,
    code: String,
    name: String,
    description: String,
    monitor: Number
}, {
    tablename: "operations"
});

OperationSchema.plugin(sql_crud, {
    db: db
});

var PlatformOperationScheme = new entity.Schema("PlatformOperation", {
    id: Number,
    platform_id: Number,
    operation_id: Number,
    min_os: String,
    max_os: String,
    NOTIFIER: String,
    ui_template: String
}, {
    tablename: "platform_operations"
});

PlatformOperationScheme.plugin(sql_crud, {
    db: db
});


var PlatformSchema = new entity.Schema("Platform", {
    id: Number,
    os: String,
    type: String,
    description: String
}, {
    tablename: "platforms"
});

PlatformSchema.plugin(sql_crud, {
    db: db
});

var PolicySchema = new entity.Schema("Policy", {
    id: Number,
    tenant_id: Number,
    name: String,
    type: String,
    payload: String,
    status: String,
    created_date: Date,
    modified_date: Date
}, {
    tablename: "policies"
});

PolicySchema.plugin(sql_crud, {
    db: db
});


var PolicyCategorySchema = new entity.Schema("PolicyCategory", {
    id: Number,
    tenant_id: Number,
    name: String,
    priority: Number
}, {
    tablename: "policy_category"
});

PolicyCategorySchema.plugin(sql_crud, {
    db: db
});


var DevicePolicySchema = new entity.Schema("DevicePolicy", {
    id: Number,
    tenant_id: Number,
    policy_id: Number,
    policy_category_id: Number,
    flitered_payload: String,
    result_payload: String,
    status: String,
    datetime: Date
}, {
    tablename: "device_policy"
});

DevicePolicySchema.plugin(sql_crud, {
    db: db
});

var PolicyMappingUserSchema = new entity.Schema("PolicyMappingUser", {
    policy_id: Number,
    tenant_id: Number,
    user_id: String
}, {
    tablename: "policy_mapping_user"
});

PolicyMappingUserSchema.plugin(sql_crud, {
    db: db
});

var PolicyMappingPlatformSchema = new entity.Schema("PolicyMappingPlatform", {
    policy_id: Number,
    tenant_id: Number,
    platform: String
}, {
    tablename: "policy_mapping_platform"
});

PolicyMappingPlatformSchema.plugin(sql_crud, {
    db: db
});

var PolicyMappingOwnershipSchema = new entity.Schema("PolicyMappingOwnership", {
    policy_id: Number,
    tenant_id: Number,
    ownership: String
}, {
    tablename: "policy_mapping_ownership"
});

PolicyMappingOwnershipSchema.plugin(sql_crud, {
    db: db
});

var DeviceInfoSchema = new entity.Schema("Device_Info", {
    id: Number,
    device_id: Number,
    tenant_id: Number,
    user_id: String,
    operation_code: String,
    eom: Number,
    NOTIFIER: String,
    send_message: String,
    received_message: String,
    status: String,
    send_date: Date,
    received_date: Date
}, {
    tablename: "device_info"
});

DeviceInfoSchema.plugin(sql_crud, {
    db: db
});

var DeviceAppSchema = new entity.Schema("device_app", {
    device_info_id: Number,
    device_id: Number,
    tenant_id: Number,
    package_name: String,
    status: String
}, {
    tablename: "device_app"
});

DeviceAppSchema.plugin(sql_crud, {
    db: db
});

var NotificationSchema = new entity.Schema("notification", {
    id: Number,
    tenant_id: Number,
    device_id: Number,
    notify_count: Number,
    NOTIFIER: String,
    status: String,
    sent_date: Date,
    received_date: Date
},{
    tablename:"notification"
});

NotificationSchema.plugin(sql_crud, {
    db: db
});