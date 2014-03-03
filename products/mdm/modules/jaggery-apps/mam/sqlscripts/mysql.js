var general = {
    'select1' : "SELECT LAST_INSERT_ID()"
};

var devices = {
    'select1' :"SELECT * FROM devices where id = ?",
    'select2' :"SELECT platforms.type_name as label, ROUND((count(devices.id)/(select count(id) from devices))*100,0) as data from platforms, devices where devices.platform_id = platforms.id AND devices.tenant_id = ? group by type",
    'select3' :"select count(id) as count from devices where tenant_id = ?",
    'select4' :"select count(id) as count from devices where byod=1 AND tenant_id = ?",
    'select5' :"select platforms.type_name from devices,platforms where platforms.id = devices.platform_id AND devices.id = ?",
    'select6' :"SELECT reg_id, os_version, platform_id, user_id FROM devices WHERE id = ?",
    'select7' :"SELECT * FROM devices WHERE udid = ?",
    'select8' :"SELECT reg_id FROM devices WHERE id = ?",
    'select9' :"SELECT user_id FROM devices WHERE id = ?",
    'select10':"SELECT reg_id FROM devices WHERE id = ? AND tenant_id = ?",
    'select11':"SELECT platform_id FROM devices WHERE id = ?",
    'select12':"SELECT DISTINCT features.description, features.id, features.name, features.code, platformfeatures.template FROM devices, platformfeatures, features WHERE devices.platform_id = platformfeatures.platform_id AND devices.id = ? AND features.id = platformfeatures.feature_id",
    'select13':"SELECT id, reg_id, os_version, platform_id FROM devices WHERE user_id = ? AND tenant_id = ?",
    'select14':"SELECT id FROM devices WHERE user_id = ? AND tenant_id = ?",
    'select15':"SELECT * from devices",
    'select16':"select status from devices where id = ?",
    'select17':"SELECT reg_id FROM devices WHERE reg_id = ? && deleted = 0",
    'select18':"SELECT udid FROM devices WHERE udid = ? && deleted = 0",
    'select19':"SELECT * FROM devices WHERE reg_id = ?",
    'select20':"SELECT id FROM devices WHERE udid = ?",
    'select21':"SELECT user_id FROM devices WHERE udid = ?",
    'select22':"SELECT properties FROM devices WHERE id = ?",
    'select23':"SELECT COUNT(*) as count FROM devices WHERE udid = ?",
    'select24':"SELECT DISTINCT features.description, features.id, features.name, features.code, platformfeatures.template FROM devices, platformfeatures, features WHERE devices.platform_id = platformfeatures.platform_id AND features.id = platformfeatures.feature_id AND devices.tenant_id = ?",
    'select25':"SELECT COUNT(id) AS device_count FROM devices WHERE user_id = ? AND tenant_id = ?",
    'select26':"SELECT * from devices where user_id = ? AND tenant_id = ?",
    'select27':"SELECT * from devices where platform_id = ? AND tenant_id = ?",
    'select28':"SELECT * from devices where platform_id > ?",
    'select29':"select * from devices where devices.user_id = ?",
    'select30':"select platforms.type_name as platform from devices, platforms where platforms.id = devices.platform_id && devices.id = ?",
    'select31':"select * from devices where devices.user_id = ? and devices.platform_id = ?",
    'select32':"select devices.id as id, devices.properties as properties, devices.user_id as user_id, platforms.name as name, devices.os_version as os_version, devices.created_date as created_date from devices, platforms where platforms.id = devices.platform_id && devices.user_id like ? && devices.tenant_id = ? && byod = ? && platform_id = ?",
    'select33':"select devices.id as id, devices.properties as properties, devices.user_id as user_id, platforms.name as name, devices.os_version as os_version, devices.created_date as created_date from devices, platforms where platforms.id = devices.platform_id && devices.user_id like ? && devices.tenant_id = ? && byod = ?",
    'select34':"select devices.id as id, devices.properties as properties, devices.user_id as user_id, platforms.name as name, devices.os_version as os_version, devices.created_date as created_date from devices,platforms where platforms.id = devices.platform_id && devices.user_id like ? && devices.tenant_id = ? && platform_id = ?",
    'select35':"select devices.id as id, devices.properties as properties, devices.user_id as user_id, platforms.name as name, devices.os_version as os_version, devices.created_date as created_date   from devices,platforms where platforms.id = devices.platform_id && devices.user_id like ? && devices.tenant_id = ?",
    'select36':"select * from devices where user_id = ?",

    'select36':"SELECT * from devices JOIN platforms ON platforms.id = devices.platform_id WHERE type = 'Android' AND devices.tenant_id = ?",
    'select37':"SELECT * from devices JOIN platforms ON platforms.id = devices.platform_id WHERE type = 'iOS'",

    'insert1' : "INSERT INTO devices (tenant_id, os_version, created_date, properties, reg_id, status, deleted, user_id, platform_id, vendor, udid, wifi_mac) VALUES(?, ?, ?, ?, ?,'A','0', ?, ?, ?,'0', ?)",
    'insert2' : "INSERT INTO devices (tenant_id, user_id, platform_id, reg_id, properties, created_date, status, byod, deleted, vendor, udid) SELECT tenant_id, user_id, platform_id, ?, ?, created_date, status, byod, 0, vendor, udid FROM device_pending WHERE udid = ?",

    'update1' : "UPDATE devices SET status = ? WHERE id = ?",
    'update2' : "UPDATE devices SET deleted = 0 WHERE reg_id = ? AND tenant_id = ?",
    'update3' : "UPDATE devices SET tenant_id = ?, user_id = ?, platform_id = ?, reg_id =? , properties = ?, status = ?, byod = ?, vendor = ?, udid = ?  WHERE udid = ?",
    'update4' : "UPDATE devices SET os_version = ?, properties = ?, wifi_mac = ? WHERE id = ?",
    'update5' : "UPDATE devices SET push_token = ? WHERE udid = ?",
    'update6' : "UPDATE devices SET os_version = ?, properties = ? WHERE id = ?",

    'delete1' :"Delete from devices where reg_id = ?",
    'delete2' :"DELETE FROM devices WHERE udid = ?"
};

var device_pending = {
    'select1' : "SELECT * FROM device_pending WHERE token = ?",
    'select2' : "SELECT properties, user_id FROM device_pending WHERE udid = ?",
    'select3' : "SELECT tenant_id, user_id, platform_id, created_date, status, byod, 0, vendor, udid FROM device_pending WHERE udid = ?",
    'select4' : "SELECT tenant_id FROM device_pending WHERE udid = ?",
    'select5' : "SELECT user_id, udid FROM device_pending WHERE user_id = ? && udid IS NOT NULL && request_status = 1",
    'select6' : "SELECT id FROM device_pending WHERE token = ?",

    'insert1' : "INSERT INTO device_pending (tenant_id, user_id, platform_id, properties, created_date, status, vendor, udid, token) VALUES(?, ?, ?, ?, ?, 'A', ?, ?, ?)",
    'insert2' : "INSERT INTO device_pending (user_id, tenant_id, byod, token) VALUES(?, ?, ?, ?)",

    'update1' : "UPDATE device_pending SET tenant_id = ?, user_id = ?, platform_id = ?, properties = ?, created_date = ?, status = 'A', vendor = ?, udid = ? WHERE token = ?",
    'update2' : "UPDATE device_pending SET request_status = 1 WHERE user_id = ? && udid IS NOT NULL",
    'update3' : "UPDATE device_pending SET request_status = 1 WHERE udid = ?",
    'update4' : "UPDATE device_pending SET udid = ? WHERE token = ?",
    'update5' : "UPDATE device_pending SET user_id = ?, tenant_id= ?, byod = ? WHERE token = ?",

    'delete1' : "DELETE FROM device_pending WHERE user_id = ?"
};

var device_awake = {
    'select1' : "SELECT TIMESTAMPDIFF(SECOND, min(sent_date), CURRENT_TIMESTAMP()) as seconds FROM device_awake WHERE status = 'S' AND device_id = ?",

    'insert1' : "INSERT INTO device_awake (device_id, sent_date, call_count, status) VALUES(?,?,1,'S')",

    'update1' : "UPDATE device_awake SET status = 'E', processed_date = ? WHERE device_id = ? AND status = 'S'",
    'update2' : "UPDATE device_awake SET sent_date = ?, call_count = call_count + 1 WHERE device_id = ? AND status = 'S'",
    'update3' : "UPDATE device_awake JOIN devices ON devices.id = device_awake.device_id SET device_awake.status = 'D' WHERE devices.udid = ? AND device_awake.status = 'S'",
    'update4' : "UPDATE device_awake JOIN devices ON devices.id = device_awake.device_id SET device_awake.status = 'P', device_awake.processed_date = ? WHERE devices.udid = ? AND device_awake.status = 'S'"
};

var notifications = {
    'select1' : "SELECT count(*) as count FROM notifications JOIN features ON notifications.feature_code = features.code WHERE notifications.device_id = ? AND notifications.feature_code = ? AND features.monitor = 1 AND (notifications.status = 'A' OR notifications.status = 'P')",
    'select2' : "SELECT id, device_id FROM notifications WHERE status = 'P' AND device_id IN (SELECT id FROM devices WHERE platform_id IN (SELECT id FROM platforms WHERE type_name = 'iOS')) ORDER BY sent_date DESC",
    'select3' : "SELECT feature_code ,message, id, received_data FROM notifications WHERE (notifications.status='P' OR notifications.status = 'A') AND notifications.device_id = ? ORDER BY sent_date DESC",
    'select4' : "SELECT device_id, message FROM notifications WHERE id = ?",
    'select5' : "SELECT * FROM notifications WHERE device_id = ? ORDER BY id DESC LIMIT 10",
    'select6' : "SELECT message, feature_code, device_id FROM notifications WHERE id = ?",
    'select7' : "SELECT received_data, device_id FROM notifications WHERE id = ?",
    'select8' : "SELECT device_id FROM notifications WHERE id = ?",
    'select9' : "select * from notifications where id = ?",
    'select10': "SELECT DISTINCT * FROM notifications WHERE received_data IS NOT NULL && device_id = ? && feature_code= ?",
    'select11': "SELECT received_date, device_id, feature_code, user_id FROM notifications WHERE id = ? AND feature_code != '500P' AND feature_code != '529A'",
    'select12': "select * from notifications where `device_id`=? and `feature_code`= ? and `status`='R' and `id` = (select MAX(`id`) from notifications where `device_id`=? and `feature_code`= ? and `status`='R')",

    'insert1' : "INSERT INTO notifications (device_id, group_id, message, status, sent_date, feature_code, user_id ,feature_description, tenant_id) values(?, ?, ?, 'P', ?, ?, ?, ?, ?)",
    'insert2' : "INSERT INTO notifications (device_id, group_id, message, status, sent_date, feature_code, user_id, feature_description, tenant_id) values( ?, '1', ?, 'P', ?, ?, ?, ?, ?)",

    'update1' : "UPDATE notifications SET status = 'D' WHERE device_id = ? AND feature_code = ? AND user_id = ? AND status = 'P'",
    'update2' : "UPDATE notifications SET received_data = ? WHERE id = ?",
    'update3' : "UPDATE notifications SET status='C' WHERE id = ?",
    'update4' : "UPDATE notifications SET received_data= ? , received_date = ? WHERE id = ?",
    'update5' : "UPDATE notifications SET status='R' WHERE id = ?",
    'update6' : "UPDATE notifications SET status='R', received_data = ? , received_date = ? WHERE id = ?",

    'delete1' : "DELETE FROM notifications WHERE device_id = ? AND status='P' AND feature_code = ?",
    'delete2' : "DELETE FROM notifications WHERE device_id = ? AND status='R' AND feature_code = ?"
};

var features = {
    'select1' : "SELECT * FROM features WHERE name LIKE ?",
    'select2' : "SELECT id, code, description FROM features WHERE name LIKE ?",
    'select3' : "SELECT name as value, description as title from features where group_id = ?",
    'select4' : "SELECT name FROM features WHERE code = ?",
    'select5' : "SELECT code FROM features WHERE name = ?",
    'select6' : "SELECT * FROM features WHERE code = ?"
};

var policies = {
    'select1' : "SELECT policies.content as data, policies.type FROM policies, user_policy_mapping where policies.category = ? && policies.id = user_policy_mapping.policy_id && user_policy_mapping.user_id = ?",
    'select2' : "SELECT policies.content as data, policies.type FROM policies,platform_policy_mapping where policies.category = ? && policies.id = platform_policy_mapping.policy_id && platform_policy_mapping.platform_id = ? && policies.tenant_id = ?",
    'select3' : "SELECT policies.content as data, policies.type FROM policies,group_policy_mapping where policies.category = ? && policies.id = group_policy_mapping.policy_id && group_policy_mapping.group_id = ? && policies.tenant_id = ?",
    'select4' : "SELECT policies.id as id FROM policies, user_policy_mapping where policies.id = user_policy_mapping.policy_id && user_policy_mapping.user_id = ?",
    'select5' : "SELECT policies.id as id FROM policies,platform_policy_mapping where policies.id = platform_policy_mapping.policy_id && platform_policy_mapping.platform_id = ?",
    'select6' : "SELECT policies.id as id FROM policies,group_policy_mapping where policies.id = group_policy_mapping.policy_id && group_policy_mapping.group_id = ?",
    'select7' : "SELECT * FROM policies where name = ?",
    'select8' : "SELECT * FROM policies where category = 1 AND tenant_id = ?",
    'select9' : "SELECT * FROM policies where category = 2 AND tenant_id = ?",
    'select10': "SELECT * FROM policies where id = ? AND tenant_id = ?",
    'select11': "SELECT policies.content as data, policies.type FROM policies, user_policy_mapping where category = ? && policies.id = user_policy_mapping.policy_id && user_policy_mapping.user_id = ?",
    'select12': "SELECT policies.content as data, policies.type FROM policies,platform_policy_mapping where category = ? && policies.id = platform_policy_mapping.policy_id && platform_policy_mapping.platform_id = ?",
    'select13': "SELECT policies.content as data, policies.type FROM policies,group_policy_mapping where category = ? && policies.id = group_policy_mapping.policy_id && group_policy_mapping.group_id = ?",
    'select14': "SELECT * from  policies WHERE name = ? AND tenant_id = ?",
    'select15': "SELECT policies.content as data, policies.type FROM policies, user_policy_mapping where policies.category = ? && policies.id = user_policy_mapping.policy_id && user_policy_mapping.user_id = ? && policies.tenant_id = ?",

    'insert1' : "insert into policies (name,content,type,category, tenant_id) values (?,?,?,?,?)",
    'insert2' : "insert into policies (name,content,type,category, tenant_id) values (?,'[]', 1, 1,?)",

    'update1' : "UPDATE policies SET content= ?,type = ? WHERE name = ? AND tenant_id = ?",
    'update2' : "UPDATE policies SET mam_content= ?,type = ? WHERE name = ? AND tenant_id = ?",

    'delete1' : "DELETE FROM policies where id = ? AND tenant_id = ?"
};

var user_policy_mapping = {
    'select1' : "SELECT * FROM user_policy_mapping WHERE user_policy_mapping.policy_id = ?",

    'insert1' : "INSERT INTO user_policy_mapping (user_id,policy_id) VALUES (?,?)",

    'delete1' : "DELETE FROM user_policy_mapping WHERE user_policy_mapping.policy_id = ? && user_policy_mapping.user_id = ?"
};

var platformfeatures = {
    'select1' : "SELECT id, template, min_version FROM platformfeatures WHERE (platform_id = ? AND feature_id = ?)",
    'select2' : "SELECT count(*) as count FROM platformfeatures JOIN devices ON platformfeatures.platform_id = devices.platform_id JOIN features ON platformfeatures.feature_id = features.id WHERE devices.id = ? AND features.code = ?"
};

var featuretype = {
    'select1' : "SELECT featuretype.name FROM featuretype, features WHERE features.type_id=featuretype.id AND features.id= ?",
    'select2' : "SELECT DISTINCT featuretype.name FROM featuretype, features WHERE features.type_id=featuretype.id AND features.id = ?"
};

var platforms = {
    'select1' : "SELECT id FROM platforms WHERE name = ?",
    'select2' : "select * from platforms where type_name = ?"
};

var featuregroup = {
    'select1' : "SELECT * from featuregroup where name IN ('MDM_OPERATION','MDM_CONFIGURATION','MMM')"
};

var policy_device_profiles = {
    'select1' : "SELECT id, feature_code FROM policy_device_profiles WHERE device_id = ?",

    'insert1' : "INSERT INTO policy_device_profiles (device_id, feature_code) VALUES (?, ?)",

    'delete1' : "DELETE FROM policy_device_profiles WHERE id = ?"
};

var group_policy_mapping = {
    'select1' : "SELECT * FROM group_policy_mapping WHERE group_policy_mapping.policy_id = ?",

    'insert1' : "INSERT INTO group_policy_mapping (group_id,policy_id) VALUES (?,?)",

    'delete1' : "DELETE FROM group_policy_mapping where policy_id = ?",
    'delete2' : "DELETE FROM group_policy_mapping WHERE group_policy_mapping.policy_id = ? && group_policy_mapping.group_id = ?"
};

var platform_policy_mapping = {
    'select1' : "SELECT * FROM platform_policy_mapping WHERE platform_policy_mapping.policy_id = ?",

    'insert1' : "INSERT INTO platform_policy_mapping (platform_id,policy_id) VALUES (?,?)",

    'delete1' : "DELETE FROM platform_policy_mapping WHERE platform_policy_mapping.policy_id = ? && platform_policy_mapping.platform_id = ?"
};

var tenantplatformfeatures = {
    'select1' : "SELECT COUNT(id) AS record_count FROM tenantplatformfeatures WHERE tenant_id = ?",

    'insert1' : "INSERT INTO tenantplatformfeatures (tenant_id, platformFeature_Id) VALUES (?, ?)"
};