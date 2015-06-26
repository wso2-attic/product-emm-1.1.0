/*
 *  EMM uses the following date format for its operations.
 *  When the default date format of Oracle DB is set to a different format,
 *  it is required to use that format for sql queries. Therefore 'to_date()' function
 *  is used to convert EMM defined date format to Oracle DB compatible date format.
 */
var dateFormat = "YYYY-MM-DD HH24:MI:SS";

var general = {
    "select1" 	: "SELECT MAX(notifications.id) FROM notifications"
};

var devices = {
    "select1" 	: "SELECT * FROM devices WHERE id = ?",
    "select2" 	: "SELECT platforms.type_name AS label, COUNT(devices.id) AS devices, (SELECT COUNT(id) FROM devices) AS data FROM platforms, devices WHERE devices.platform_id = platforms.id AND devices.tenant_id = ? GROUP BY platforms.type, platforms.type_name",
    "select3" 	: "SELECT COUNT(id) AS count FROM devices WHERE tenant_id = ?",
    "select4" 	: "SELECT COUNT(id) AS count FROM devices WHERE byod = 1 AND tenant_id = ?",
    "select5" 	: "SELECT platforms.type_name FROM devices, platforms WHERE platforms.id = devices.platform_id AND devices.id = ?",
    "select6" 	: "SELECT reg_id, os_version, platform_id, user_id FROM devices WHERE id = ?",
    "select7" 	: "SELECT * FROM devices WHERE udid = ?",
    "select8" 	: "SELECT reg_id FROM devices WHERE id = ?",
    "select9" 	: "SELECT user_id FROM devices WHERE id = ?",
    "select10"	: "SELECT reg_id FROM devices WHERE id = ? AND tenant_id = ?",
    "select11"	: "SELECT platform_id FROM devices WHERE id = ?",
    "select12"	: "SELECT DISTINCT features.description, features.id, features.name, features.code, platformfeatures.template FROM devices, platformfeatures, features WHERE devices.platform_id = platformfeatures.platform_id AND devices.id = ? AND features.id = platformfeatures.feature_id",
    "select13"	: "SELECT id, reg_id, os_version, platform_id FROM devices WHERE user_id = ? AND tenant_id = ?",
    "select14"	: "SELECT id FROM devices WHERE user_id = ? AND tenant_id = ?",
    "select15"	: "SELECT * FROM devices WHERE tenant_id = ?",
    "select16"	: "SELECT status FROM devices WHERE id = ?",
    "select17"	: "SELECT reg_id FROM devices WHERE reg_id = ? AND deleted = 0",
    "select18"	: "SELECT udid FROM devices WHERE udid = ? AND deleted = 0",
    "select19"	: "SELECT * FROM devices WHERE reg_id = ?",
    "select20"	: "SELECT id FROM devices WHERE udid = ?",
    "select21"	: "SELECT user_id FROM devices WHERE udid = ?",
    "select22"	: "SELECT properties FROM devices WHERE id = ?",
    "select23"	: "SELECT COUNT(*) AS count FROM devices WHERE udid = ?",
    "select24"	: "SELECT DISTINCT features.description, features.id, features.name, features.code, platformfeatures.template FROM devices, platformfeatures, features WHERE devices.platform_id = platformfeatures.platform_id AND features.id = platformfeatures.feature_id AND devices.tenant_id = ?",
    "select25"	: "SELECT COUNT(id) AS device_count FROM devices WHERE user_id = ? AND tenant_id = ?",
    "select26"	: "SELECT * FROM devices WHERE user_id = ? AND tenant_id = ?",
    "select27"	: "SELECT * FROM devices WHERE platform_id = ? AND tenant_id = ?",
    "select28"	: "SELECT * FROM devices WHERE platform_id > ?",
    "select29"	: "SELECT * FROM devices WHERE devices.user_id = ?",
    "select30"	: "SELECT platforms.type_name AS platform from devices, platforms WHERE platforms.id = devices.platform_id AND devices.id = ?",
    "select31"	: "SELECT * FROM devices WHERE devices.user_id = ? AND devices.platform_id = ?",
    "select32"	: "SELECT devices.id AS id, devices.properties AS properties, devices.user_id AS user_id, platforms.name AS name, devices.os_version AS os_version, devices.created_date AS created_date FROM devices, platforms WHERE platforms.id = devices.platform_id AND devices.user_id LIKE ? AND devices.tenant_id = ? AND byod = ? AND platform_id = ?",
    "select33"	: "SELECT devices.id AS id, devices.properties AS properties, devices.user_id AS user_id, platforms.name AS name, devices.os_version AS os_version, devices.created_date AS created_date FROM devices, platforms WHERE platforms.id = devices.platform_id AND devices.user_id LIKE ? AND devices.tenant_id = ? AND byod = ?",
    "select34"	: "SELECT devices.id AS id, devices.properties AS properties, devices.user_id AS user_id, platforms.name AS name, devices.os_version AS os_version, devices.created_date AS created_date FROM devices, platforms WHERE platforms.id = devices.platform_id AND devices.user_id LIKE ? AND devices.tenant_id = ? AND platform_id = ?",
    "select35"	: "SELECT devices.id AS id, devices.properties AS properties, devices.user_id AS user_id, platforms.name AS name, devices.os_version AS os_version, devices.created_date AS created_date FROM devices, platforms WHERE platforms.id = devices.platform_id AND devices.user_id LIKE ? AND devices.tenant_id = ?",
    "select36"	: "SELECT * FROM devices WHERE user_id = ?",
    "select37"	: "SELECT devices.id AS id FROM devices JOIN platforms ON platforms.id = devices.platform_id WHERE type_name = 'iOS'",
    "select38"	: "SELECT properties, user_id FROM devices WHERE udid = ?",
    "select39"	: "SELECT push_token FROM devices WHERE id = ?",
    "select40"	: "SELECT devices.tenant_id AS tenant_id, platforms.type_name AS platform_type FROM devices JOIN platforms ON platforms.id = devices.platform_id WHERE devices.id = ? AND devices.tenant_id = ?",
    "select41"	: "SELECT id FROM devices WHERE reg_id = ?",
    "select42"	: "SELECT devices.id FROM devices JOIN platforms ON platforms.id = devices.platform_id WHERE LOWER(platforms.type_name) = LOWER(?) AND tenant_id = ?",
    "select43"	: "SELECT properties, platform_id FROM devices WHERE id = ?",
    "select44"	: "SELECT * FROM devices",
    "select45"	: "SELECT devices.user_id, devices.properties, platforms.name AS platform_name, devices.os_version, devices.created_date, devices.status FROM devices, platforms WHERE platforms.type = ? AND platforms.id = devices.platform_id AND devices.created_date BETWEEN ? AND ? AND devices.tenant_id = ?",
    "select46"	: "SELECT COUNT(*) AS count FROM devices WHERE user_id = ? AND tenant_id = ?",
    "select47"	: "SELECT devices.id AS id FROM devices JOIN platforms ON platforms.id = devices.platform_id WHERE type_name = 'Android' AND devices.tenant_id = ?",
    "select48"	: "SELECT mac FROM devices WHERE udid = ?",
    "select49"	: "SELECT devices.user_id, devices.properties, platforms.name AS platform_name, devices.os_version, devices.created_date, devices.status FROM devices, platforms WHERE devices.created_date BETWEEN ? AND ? AND devices.tenant_id = ? AND devices.platform_id = platforms.id",
    "select50"	: "SELECT devices.id, devices.properties, devices.user_id, devices.os_version, platforms.type_name AS platform_name, devices.status FROM devices, platforms WHERE devices.created_date BETWEEN ? AND ? AND devices.user_id LIKE ? AND status LIKE ? AND devices.tenant_id = ? AND devices.platform_id = platforms.id",
    "select51"  : "SELECT platforms.type_name AS platform FROM devices, platforms WHERE platforms.id = devices.platform_id AND devices.id = ?", 	

    "insert1" 	: "INSERT INTO devices(tenant_id, os_version, created_date, properties, reg_id, status, byod, deleted, user_id, platform_id, vendor, udid, mac) VALUES(?, ?, to_date(?, '" + dateFormat + "'), ?, ?, 'A', ?, '0', ?, ?, ?, '0', ?)",
    "insert2" 	: "INSERT INTO devices(tenant_id, user_id, platform_id, reg_id, properties, created_date, status, byod, deleted, vendor, udid) SELECT tenant_id, user_id, platform_id, ?, ?, created_date, status, byod, 0, vendor, udid FROM device_pending WHERE udid = ?",

    "update1" 	: "UPDATE devices SET status = ? WHERE id = ?",
    "update2" 	: "UPDATE devices SET deleted = 0 WHERE reg_id = ? AND tenant_id = ?",
    "update3" 	: "UPDATE devices SET tenant_id = ?, user_id = ?, platform_id = ?, reg_id = ?, properties = ?, status = ?, byod = ?, vendor = ?, udid = ?  WHERE udid = ?",
    "update4" 	: "UPDATE devices SET os_version = ?, properties = ?, mac = ? WHERE id = ?",
    "update5" 	: "UPDATE devices SET push_token = ? WHERE udid = ?",
    "update6" 	: "UPDATE devices SET os_version = ?, properties = ? WHERE id = ?",
    "update7" 	: "UPDATE devices SET properties = ? WHERE udid = ?",
    "update8" 	: "UPDATE devices SET properties = ?, reg_id = ? WHERE udid = ?",

    "delete1" 	: "DELETE FROM devices WHERE reg_id = ?",
    "delete2" 	: "DELETE FROM devices WHERE udid = ?",
    "delete3" 	: "DELETE FROM devices WHERE id = ?"
};

var device_pending = {
    "select1" 	: "SELECT * FROM device_pending WHERE token = ?",
    "select2" 	: "SELECT properties, user_id FROM device_pending WHERE udid = ?",
    "select3" 	: "SELECT tenant_id, user_id, platform_id, created_date, status, byod, 0, vendor, udid FROM device_pending WHERE udid = ?",
    "select4" 	: "SELECT tenant_id FROM device_pending WHERE udid = ?",
    "select5" 	: "SELECT user_id, udid FROM device_pending WHERE user_id = ? AND udid IS NOT NULL AND request_status = 1",
    "select6" 	: "SELECT id FROM device_pending WHERE token = ?",

    "insert1" 	: "INSERT INTO device_pending(tenant_id, user_id, platform_id, properties, created_date, status, vendor, udid, token) VALUES(?, ?, ?, ?, to_date(?, '" + dateFormat + "'), 'A', ?, ?, ?)",
    "insert2" 	: "INSERT INTO device_pending(user_id, tenant_id, byod, token) VALUES(?, ?, ?, ?)",

    "update1" 	: "UPDATE device_pending SET tenant_id = ?, user_id = ?, platform_id = ?, properties = ?, created_date = to_date(?, '" + dateFormat + "'), status = 'A', vendor = ?, udid = ? WHERE token = ?",
    "update2" 	: "UPDATE device_pending SET request_status = 1 WHERE user_id = ? AND udid IS NOT NULL",
    "update3" 	: "UPDATE device_pending SET request_status = 1 WHERE udid = ?",
    "update4" 	: "UPDATE device_pending SET udid = ? WHERE token = ?",
    "update5" 	: "UPDATE device_pending SET user_id = ?, tenant_id = ?, byod = ? WHERE token = ?",

    "delete1" 	: "DELETE FROM device_pending WHERE user_id = ?"
};

var device_awake = {
    "select1" 	: "SELECT 86400*(CURRENT_TIMESTAMP - min(sent_date)) AS seconds FROM device_awake WHERE status = 'S' AND device_id = ?",

    "insert1" 	: "INSERT INTO device_awake(device_id, sent_date, call_count, status) VALUES(?, to_date(?, '" + dateFormat + "'), 1, 'S')",

    "update1" 	: "UPDATE device_awake SET status = 'E', processed_date = to_date(?, '" + dateFormat + "') WHERE device_id = ? AND status = 'S'",
    "update2" 	: "UPDATE device_awake SET sent_date = to_date(?, '" + dateFormat + "'), call_count = call_count + 1 WHERE device_id = ? AND status = 'S'",
    "update3" 	: "UPDATE device_awake JOIN devices ON devices.id = device_awake.device_id SET device_awake.status = 'D' WHERE devices.udid = ? AND device_awake.status = 'S'",
    "update4" 	: "UPDATE device_awake JOIN devices ON devices.id = device_awake.device_id SET device_awake.status = 'P', device_awake.processed_date = to_date(?, '" + dateFormat + "') WHERE devices.udid = ? AND device_awake.status = 'S'",
    "update5" 	: "UPDATE device_awake SET device_awake.status = 'D' WHERE device_awake.device_id = ? AND device_awake.status = 'S'",
    "update6" 	: "UPDATE device_awake SET status = 'P', processed_date = to_date(?, '" + dateFormat + "') WHERE device_id = ? AND status = 'S'"
};

var notifications = {
    "select1" 	: "SELECT COUNT(*) AS count FROM notifications JOIN features ON notifications.feature_code = features.code WHERE notifications.device_id = ? AND notifications.feature_code = ? AND features.monitor = 1 AND (notifications.status = 'A' OR notifications.status = 'P')",
    "select2" 	: "SELECT id, device_id FROM notifications WHERE status = 'P' AND device_id IN (SELECT id FROM devices WHERE platform_id IN (SELECT id FROM platforms WHERE type_name = 'iOS')) ORDER BY sent_date ASC",
    "select3" 	: "SELECT feature_code ,message, id, received_data FROM notifications WHERE (notifications.status = 'P' OR notifications.status = 'A') AND notifications.device_id = ? ORDER BY sent_date ASC",
    "select4" 	: "SELECT device_id, message FROM notifications WHERE id = ? ORDER BY sent_date ASC",
    "select5" 	: "SELECT * FROM (SELECT * FROM notifications WHERE device_id = ? ORDER BY id DESC) WHERE ROWNUM <= 10",
    "select6" 	: "SELECT message, feature_code, device_id FROM notifications WHERE id = ? ORDER BY sent_date ASC",
    "select7" 	: "SELECT received_data, device_id FROM notifications WHERE id = ? ORDER BY sent_date ASC",
    "select8" 	: "SELECT device_id FROM notifications WHERE id = ?",
    "select9" 	: "SELECT * FROM notifications WHERE id = ? ORDER BY sent_date ASC",
    "select10"	: "SELECT * FROM notifications WHERE ID = (SELECT MAX(ID) FROM notifications WHERE device_id = ? AND feature_code = ? AND received_data IS NOT NULL)",
    "select11"	: "SELECT received_date, device_id, feature_code, user_id FROM notifications WHERE id = ? AND feature_code != '500P' AND feature_code != '529A' ORDER BY sent_date ASC",
    "select12"	: "SELECT * FROM notifications WHERE device_id = ? AND feature_code = ? AND status = 'R' AND id = (SELECT MAX(id) FROM notifications WHERE device_id = ? AND feature_code = ? AND status = 'R') ORDER BY sent_date ASC",
    "select13"	: "SELECT * FROM notifications WHERE device_id = ? AND status = 'P' ORDER BY sent_date ASC",
    "select14"	: "SELECT COUNT(*) AS count FROM notifications WHERE device_id = ? AND feature_code = ? AND status = 'P'",
    "select15"	: "SELECT * FROM notifications WHERE device_id = ? AND feature_code = ? AND status = 'P'",
    "select16"  : "SELECT * FROM notifications WHERE feature_code = '501P' AND device_id = ? AND received_date BETWEEN ? AND ? AND tenant_id = ?",
    "select17"  : "SELECT n.id, p.type_name, n.device_id, n.received_data FROM notifications n JOIN (SELECT device_id, MAX(received_date) AS MaxTimeStamp FROM notifications WHERE feature_code = ? AND status = 'R' GROUP BY device_id) dt ON (n.device_id = dt.device_id AND n.received_date = dt.MaxTimeStamp) JOIN devices d ON (n.device_id = d.id) JOIN platforms p ON (p.id = d.platform_id) WHERE feature_code = ? ORDER BY n.id",
    "select18"  : "SELECT n.id, p.type_name, n.device_id, n.received_data FROM notifications n JOIN (SELECT device_id, MAX(received_date) AS MaxTimeStamp FROM notifications WHERE feature_code = ? AND status = 'R' GROUP BY device_id) dt ON (n.device_id = dt.device_id AND n.received_date = dt.MaxTimeStamp) JOIN devices d ON (n.device_id = d.id) JOIN platforms p ON (p.id = d.platform_id AND p.type = ?) WHERE feature_code = ? ORDER BY n.id",
    "select19"  : "SELECT n.user_id, p.type_name, d.os_version, n.device_id, n.received_data FROM notifications n JOIN (SELECT device_id, MAX(received_date) AS MaxTimeStamp FROM notifications WHERE feature_code = ? AND user_id = ? AND tenant_id = ? AND status = 'R' GROUP BY device_id) dt ON (n.device_id = dt.device_id AND n.received_date = dt.MaxTimeStamp) JOIN devices d ON (n.device_id = d.id) JOIN platforms p ON (p.id = d.platform_id) WHERE feature_code = ? ORDER BY n.user_id, n.device_id",
    "select20"  : "SELECT n.user_id, p.type_name, d.os_version, n.device_id, n.received_data FROM notifications n JOIN (SELECT device_id, MAX(received_date) AS MaxTimeStamp FROM notifications WHERE feature_code = ? AND status = 'R' GROUP BY device_id) dt ON (n.device_id = dt.device_id AND n.received_date = dt.MaxTimeStamp) JOIN devices d ON (n.device_id = d.id) JOIN platforms p ON (p.id = d.platform_id) WHERE feature_code = ? ORDER BY n.user_id, n.device_id",
    "select21"	: "SELECT DISTINCT * FROM notifications WHERE received_data IS NOT NULL AND device_id = ? AND feature_code = ? ORDER BY sent_date DESC",

    "insert1" 	: "INSERT INTO notifications(device_id, group_id, message, status, sent_date, feature_code, user_id ,feature_description, tenant_id) VALUES(?, ?, ?, 'P', to_date(?, '" + dateFormat + "'), ?, ?, ?, ?)",
    "insert2" 	: "INSERT INTO notifications(device_id, group_id, message, status, sent_date, feature_code, user_id, feature_description, tenant_id) VALUES(?, '1', ?, 'P', to_date(?, '" + dateFormat + "'), ?, ?, ?, ?)",

    "update1" 	: "UPDATE notifications SET status = 'D' WHERE device_id = ? AND feature_code = ? AND user_id = ? AND status = 'P'",
    "update2" 	: "UPDATE notifications SET received_data = ? WHERE id = ?",
    "update3" 	: "UPDATE notifications SET status = 'C' WHERE id = ?",
    "update4" 	: "UPDATE notifications SET received_data = ? , received_date = to_date(?, '" + dateFormat + "') WHERE id = ?",
    "update5" 	: "UPDATE notifications SET status = 'R' WHERE id = ?",
    "update6" 	: "UPDATE notifications SET status = 'R', received_data = ? , received_date = to_date(?, '" + dateFormat + "') WHERE id = ?",
    "update7" 	: "UPDATE notifications SET status = 'D' WHERE device_id = ? AND status = 'P'",
    "update8" 	: "UPDATE notifications SET received_data = ?, received_date = to_date(?, '" + dateFormat + "'), status = 'R' WHERE id = ?",

    "delete1" 	: "DELETE FROM notifications WHERE device_id = ? AND status = 'P' AND feature_code = ?",
    "delete2" 	: "DELETE FROM notifications WHERE device_id = ? AND status = 'R' AND feature_code = ?"
};

var features = {
    "select1" 	: "SELECT * FROM features WHERE name LIKE ?",
    "select2" 	: "SELECT id, code, description FROM features WHERE name LIKE ?",
    "select3" 	: "SELECT name AS value, description AS title FROM features WHERE group_id = ?",
    "select4" 	: "SELECT name FROM features WHERE code = ?",
    "select5" 	: "SELECT code FROM features WHERE name = ?",
    "select6" 	: "SELECT * FROM features WHERE code = ?",
    "select7" 	: "SELECT * FROM features WHERE permission_type = 1",
    "select8" 	: "SELECT * FROM features WHERE permission_type = 2",
    "select9" 	: "SELECT * FROM features WHERE permission_type = 3"
};

var policies = {
    "select1" 	: "SELECT policies.content AS data, policies.type FROM policies, user_policy_mapping WHERE policies.category = ? AND policies.id = user_policy_mapping.policy_id AND user_policy_mapping.user_id = ?",
    "select2" 	: "SELECT policies.id AS policyid, policies.content AS data, policies.mam_content AS mam_data, policies.type FROM policies, platform_policy_mapping WHERE policies.category = ? AND policies.id = platform_policy_mapping.policy_id AND platform_policy_mapping.platform_id = ? AND policies.tenant_id = ? ORDER BY policies.id DESC",
    "select3" 	: "SELECT policies.id AS policyid, policies.content AS data, policies.mam_content AS mam_data, policies.type FROM policies, group_policy_mapping WHERE policies.category = ? AND policies.id = group_policy_mapping.policy_id AND group_policy_mapping.group_id = ? AND policies.tenant_id = ? ORDER BY policies.id DESC",
    "select4" 	: "SELECT policies.id AS id FROM policies, user_policy_mapping WHERE policies.id = user_policy_mapping.policy_id AND user_policy_mapping.user_id = ?",
    "select5" 	: "SELECT policies.id AS id FROM policies, platform_policy_mapping WHERE policies.id = platform_policy_mapping.policy_id AND platform_policy_mapping.platform_id = ?",
    "select6" 	: "SELECT policies.id AS id FROM policies, group_policy_mapping WHERE policies.id = group_policy_mapping.policy_id AND group_policy_mapping.group_id = ?",
    "select7" 	: "SELECT * FROM policies WHERE name = ?",
    "select8" 	: "SELECT * FROM policies WHERE category = 1 AND tenant_id = ?",
    "select9" 	: "SELECT * FROM policies WHERE category = 2 AND tenant_id = ?",
    "select10"	: "SELECT * FROM policies WHERE id = ? AND tenant_id = ?",
    "select11"	: "SELECT policies.content AS data, policies.type FROM policies, user_policy_mapping WHERE category = ? AND policies.id = user_policy_mapping.policy_id AND user_policy_mapping.user_id = ?",
    "select12"	: "SELECT policies.content AS data, policies.type FROM policies, platform_policy_mapping WHERE category = ? AND policies.id = platform_policy_mapping.policy_id AND platform_policy_mapping.platform_id = ?",
    "select13"	: "SELECT policies.content AS data, policies.type FROM policies, group_policy_mapping WHERE category = ? AND policies.id = group_policy_mapping.policy_id AND group_policy_mapping.group_id = ?",
    "select14"	: "SELECT * FROM policies WHERE name = ? AND tenant_id = ?",
    "select15"	: "SELECT policies.id AS policyid, policies.content AS data, policies.mam_content AS mam_data, policies.type FROM policies, user_policy_mapping WHERE policies.category = ? AND policies.id = user_policy_mapping.policy_id AND user_policy_mapping.user_id = ? AND policies.tenant_id = ? ORDER BY policies.id DESC",
    "select16"	: "SELECT policies.id AS policyid, policies.content AS data, policies.mam_content AS mam_data, policies.type AS type, policy_priority.type AS policytype FROM policies JOIN device_policy ON device_policy.policy_id = policies.id JOIN policy_priority ON policy_priority.id = device_policy.policy_priority_id WHERE device_policy.device_id = ? AND device_policy.tenant_id = ? AND device_policy.status = 'A' ORDER BY datetime DESC",

    "insert1" 	: "INSERT INTO policies(name, content, type, category, tenant_id, mam_content) VALUES(?, ?, ?, ?, ?, ?)",
    "insert2" 	: "INSERT INTO policies(name, content, type, category, tenant_id, mam_content) VALUES(?, '[]', 1, 1, ?, '[]')",

    "update1" 	: "UPDATE policies SET content = ?, type = ?, mam_content = ? WHERE name = ? AND tenant_id = ?",

    "delete1" 	: "DELETE FROM policies WHERE id = ? AND tenant_id = ?"
};

var user_policy_mapping = {
    "select1" 	: "SELECT * FROM user_policy_mapping WHERE user_policy_mapping.policy_id = ?",
    "select2" 	: "SELECT * FROM user_policy_mapping WHERE policy_id = ? AND user_id = ?",
    "select3" 	: "SELECT user_id FROM user_policy_mapping WHERE policy_id = ?",

    "insert1" 	: "INSERT INTO user_policy_mapping(user_id, policy_id) VALUES(?, ?)",

    "delete1" 	: "DELETE FROM user_policy_mapping WHERE user_policy_mapping.policy_id = ? AND user_policy_mapping.user_id = ?",
    "delete2" 	: "DELETE FROM user_policy_mapping WHERE user_policy_mapping.policy_id = ?"
};

var platformfeatures = {
    "select1" 	: "SELECT id, template, min_version FROM platformfeatures WHERE platform_id = ? AND feature_id = ?",
    "select2" 	: "SELECT COUNT(*) AS count FROM platformfeatures JOIN devices ON platformfeatures.platform_id = devices.platform_id JOIN features ON platformfeatures.feature_id = features.id WHERE devices.id = ? AND features.code = ?"
};

var featuretype = {
    "select1" 	: "SELECT featuretype.name FROM featuretype, features WHERE features.type_id = featuretype.id AND features.id= ?",
    "select2" 	: "SELECT DISTINCT featuretype.name FROM featuretype, features WHERE features.type_id = featuretype.id AND features.id = ?"
};

var platforms = {
    "select1" 	: "SELECT id FROM platforms WHERE name = ?",
    "select2" 	: "SELECT * FROM platforms WHERE type_name = ?",
    "select3" 	: "SELECT type FROM platforms WHERE id = ?",
    "select4" 	: "SELECT COUNT(*) AS count FROM platforms JOIN devices ON platforms.id = devices.platform_id WHERE devices.id = ? AND LOWER(platforms.type_name) = ?"
};

var featuregroup = {
    "select1" 	: "SELECT * FROM featuregroup WHERE name IN ('MDM_OPERATION', 'MDM_CONFIGURATION', 'MMM')"
};

var policy_device_profiles = {
    "select1" 	: "SELECT id, feature_code FROM policy_device_profiles WHERE device_id = ?",   
    "insert1" 	: "INSERT INTO policy_device_profiles(device_id, feature_code) VALUES(?, ?)",   
    "delete1" 	: "DELETE FROM policy_device_profiles WHERE id = ?"
};

var group_policy_mapping = {
    "select1" 	: "SELECT * FROM group_policy_mapping WHERE group_policy_mapping.policy_id = ?",
    "select2" 	: "SELECT * FROM group_policy_mapping WHERE policy_id = ? AND group_id = ?",
    "select3" 	: "SELECT group_id FROM group_policy_mapping WHERE policy_id = ?",

    "insert1" 	: "INSERT INTO group_policy_mapping(group_id, policy_id) VALUES(?, ?)",

    "delete1" 	: "DELETE FROM group_policy_mapping WHERE policy_id = ?",
    "delete2" 	: "DELETE FROM group_policy_mapping WHERE group_policy_mapping.policy_id = ? AND group_policy_mapping.group_id = ?"
};

var platform_policy_mapping = {
    "select1" 	: "SELECT * FROM platform_policy_mapping WHERE platform_policy_mapping.policy_id = ?",
    "select2" 	: "SELECT * FROM platform_policy_mapping WHERE policy_id = ? AND platform_id = ?",
    "select3" 	: "SELECT platform_id FROM platform_policy_mapping WHERE policy_id = ?",

    "insert1" 	: "INSERT INTO platform_policy_mapping(platform_id, policy_id) VALUES(?, ?)",

    "delete1" 	: "DELETE FROM platform_policy_mapping WHERE platform_policy_mapping.policy_id = ? AND platform_policy_mapping.platform_id = ?",
    "delete2" 	: "DELETE FROM platform_policy_mapping WHERE platform_policy_mapping.policy_id = ?"
};

var tenantplatformfeatures = {
    "select1" 	: "SELECT COUNT(id) AS record_count FROM tenantplatformfeatures WHERE tenant_id = ?"
};

var policy_priority = {
    "select1" 	: "SELECT id, priority FROM policy_priority WHERE policy_priority.type = ?"
};

var device_policy = {
    "select1" 	: "SELECT device_policy.id, device_policy.device_id, device_policy.tenant_id, device_policy.policy_id, device_policy.payload_uids FROM device_policy JOIN policy_priority ON policy_priority.id = device_policy.policy_priority_id WHERE device_policy.device_id = ? AND device_policy.tenant_id = ? AND device_policy.status = 'A' AND policy_priority.priority <= ?",
    "select2" 	: "SELECT device_policy.id, device_policy.device_id, device_policy.tenant_id, device_policy.policy_id, device_policy.payload_uids FROM device_policy JOIN policy_priority ON policy_priority.id = device_policy.policy_priority_id WHERE device_policy.device_id = ? AND device_policy.tenant_id = ? AND device_policy.policy_id = ? AND device_policy.status = 'A' AND policy_priority.priority <= ?",
    "select3" 	: "SELECT device_policy.id AS id, device_policy.device_id AS device_id, device_policy.tenant_id AS tenant_id, device_policy.policy_id AS policy_id, device_policy.payload_uids AS payload_uids, policy_priority.priority FROM device_policy JOIN policy_priority ON policy_priority.id = device_policy.policy_priority_id WHERE device_policy.device_id = ? AND device_policy.tenant_id = ? AND device_policy.status = 'A'",
    "select4" 	: "SELECT id FROM device_policy WHERE device_id = ? AND tenant_id = ? AND status = 'A'",

    "insert1" 	: "INSERT INTO device_policy(device_id, tenant_id, policy_id, policy_priority_id, payload_uids, status, datetime) VALUES(?, ?, ?, ?, ?, 'A', to_date(?, '" + dateFormat + "'))",
    "insert2" 	: "INSERT INTO device_policy(device_id, tenant_id, policy_id, policy_priority_id, status, datetime) VALUES(?, ?, ?, ?, 'A', to_date(?, '" + dateFormat + "'))",

    "update1" 	: "UPDATE device_policy SET status = 'D' WHERE id = ? AND status = 'A'",
    "update2" 	: "UPDATE device_policy SET status = 'D' WHERE device_id = ? AND status = 'A'",
    "update3" 	: "UPDATE device_policy SET status = 'D' WHERE policy_id = ?"
};

var platform = {
    "select1" 	: "SELECT * FROM platforms"
};

var permissions = {
    "select1" 	: "SELECT content FROM permissions WHERE role = ? AND tenant_id = ?",
    "update1" 	: "UPDATE permissions SET content = ? WHERE role = ? AND tenant_id = ?",
    "insert1" 	: "INSERT INTO permissions(role, content, tenant_id) VALUES(?, ?, ?)"
};

var settings = {
    "select1" 	: "SELECT properties FROM settings WHERE tenant_id = ?",
    "update1" 	: "UPDATE settings SET properties = ? WHERE tenant_id = ?",
    "insert1" 	: "INSERT INTO settings(tenant_id, properties) VALUES(?, ?)"
};
