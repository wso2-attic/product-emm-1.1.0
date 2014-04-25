DROP TABLE IF EXISTS operations;
CREATE TABLE operations(ID INT PRIMARY KEY auto_increment, CODE VARCHAR(8), NAME VARCHAR(32), DESCRIPTION VARCHAR(128), STATUS VARCHAR(128), MONITOR INT);

DROP TABLE IF EXISTS platform_operations;
CREATE TABLE platform_operations(ID INT PRIMARY KEY auto_increment, PLATFORM_ID INT, OPERATION_ID INT, MIN_OS VARCHAR(8), MAX_OS VARCHAR(8), CLOUD VARCHAR(8), UI_TEMPLATE VARCHAR(32));

DROP TABLE IF EXISTS platforms;
CREATE TABLE platforms(ID INT PRIMARY KEY auto_increment, OS VARCHAR(16), TYPE VARCHAR(16), DESCRIPTION VARCHAR(128));

DROP TABLE IF EXISTS devices;
CREATE TABLE devices(ID INT PRIMARY KEY auto_increment, TENANT_ID INT, USER_ID VARCHAR(128), PLATFORM_ID INT, UDID VARCHAR(4096), OS_VERSION VARCHAR(64), OWNERSHIP VARCHAR(8), TOKEN TEXT, MAC_ADDRESS VARCHAR(256), STATUS VARCHAR(1), CREATED_DATE DATETIME, MODIFIED_DATE DATETIME);

DROP TABLE IF EXISTS policies;
CREATE TABLE policies(ID INT PRIMARY KEY auto_increment, TENANT_ID INT, NAME VARCHAR(32), TYPE VARCHAR(1), PAYLOAD TEXT, STATUS VARCHAR(1), CREATED_DATE DATETIME, MODIFIED_DATE DATETIME);

DROP TABLE IF EXISTS policy_category;
CREATE TABLE policy_category(ID INT, TENANT_ID INT, NAME VARCHAR(16), PRIORITY INT);

DROP TABLE IF EXISTS device_policy;
CREATE TABLE device_policy(ID INT PRIMARY KEY auto_increment, TENANT_ID INT, DEVICE_ID INT, POLICY_ID INT, POLICY_CATEGORY_ID INT, FILTERED_PAYLOAD TEXT, RESULT_PAYLOAD TEXT, STATUS VARCHAR(1), POLICY_COMPLIANCE VARCHAR(1), DATETIME DATETIME);

DROP TABLE IF EXISTS policy_mapping_user;
CREATE TABLE policy_mapping_user(POLICY_ID INT, TENANT_ID INT, USER_ID VARCHAR(128));

DROP TABLE IF EXISTS policy_mapping_ownership;
CREATE TABLE policy_mapping_ownership(POLICY_ID INT, TENANT_ID INT, OWNERSHIP VARCHAR(8));

DROP TABLE IF EXISTS policy_mapping_platform;
CREATE TABLE policy_mapping_platform(POLICY_ID INT, TENANT_ID INT, PLATFORM_ID INT);

DROP TABLE IF EXISTS device_info;
CREATE TABLE device_info(ID INT PRIMARY KEY auto_increment, DEVICE_ID INT, TENANT_ID INT, USER_ID VARCHAR(128), EOM INT, OPERATION_CODE VARCHAR(8), SENT_MESSAGE TEXT, RECEIVED_MESSAGE TEXT, STATUS VARCHAR(1), SENT_DATE DATETIME, RECEIVED_DATE DATETIME);

DROP TABLE IF EXISTS device_app;
CREATE TABLE device_app(DEVICE_INFO_ID INT, DEVICE_ID INT, PACKAGE_NAME TEXT, STATUS VARCHAR(1));

DROP TABLE IF EXISTS notification;
CREATE TABLE notification(ID INT PRIMARY KEY auto_increment, TENANT_ID INT, DEVICE_ID INT, NOTIFY_COUNT INT, STATUS VARCHAR(1), SENT_DATE DATETIME, RECEIVED_DATE DATETIME);

INSERT INTO operations VALUES (1, '500A', 'INFO', 'Device Information', 'A', 1), (2, '501A', 'LOCATION', 'Location', 'A', 0), (3, '502A', 'APPLIST', 'Get all Applications', 'A', 1), (4, '503A', 'LOCK', 'Device Lock', 'A', 0), (5, '504A', 'WIPE', 'Wipe', 'A', 0), (6, '505A', 'CLEARPASSCODE', 'Clear', 'A', 0), (7, '506A', 'NOTIFICATION', 'Message', 'A', 0), (8, '507A', 'WIFI', 'Wifi', 'A', 0), (9, '508A', 'CAMERA', 'Camera', 'A', 0), (10, '509A', 'INSTALLAPP', 'Install Application', 'A', 0), (11, '510A', 'UNINSTALLAPP', 'Uninstall Application', 'A', 0), (12, '511A', 'ENCRYPT', 'Encrypt Storage', 'A', 0), (13, '512A', 'APN', 'APN', 'A', 0), (14, '513A', 'MUTE', 'Mute Device', 'A', 0), (15, '518A', 'WEBCLIP', 'Create Webclips', 'A', 0), (16, '519A', 'PASSWORDPOLICY', 'Passcode Policy', 'A', 0), (17, '520A', 'EMAIL', 'Email Configuration', 'A', 0), (18, '521A', 'GOOGLECALENDAR', 'Calender Subscription', 'A', 0), (19, '523A', 'VPN', 'VPN', 'A', 0), (20, '524A', 'LDAP', 'LDAP', 'A', 0), (21, '526A', 'CHANGEPASSWORD', 'Set Passcode', 'A', 0), (22, '527A', 'ENTERPRISEWIPE', 'Enterprise Wipe', 'A', 0), (23, '528B', 'BLACKLISTAPPS', 'Blacklist Apps', 'A', 0), (24, '500P', 'POLICY', 'Policy Enforcement', 'A', 0), (25, '501P', 'MONITORING', 'Policy Monitoring', 'A', 1), (26, '502P', 'REVOKEPOLICY', 'Revoke Policy', 'A', 0);

INSERT INTO platform_operations VALUES (1, 1, 1, '4.0.3', '', 'GCM', ''), (2, 2, 1, '4.0.3', '', 'GCM', ''), (3, 3, 1, '5.0', '', 'MAPNS', ''), (4, 4, 1, '5.0', '', 'MAPNS', ''), (5, 5, 1, '5.0', '', 'MAPNS', ''), (6, 1, 2, '4.0.3', '', 'GCM', ''), (7, 2, 2, '4.0.3', '', 'GCM', ''), (8, 3, 2, '5.0', '6.1.6', 'NAPNS', ''), (9, 3, 2, '7.0', '', 'NAPNS', ''), (10, 4, 2, '5.0', '6.1.6', 'NAPNS', ''), (11, 4, 2, '7.0', '', 'NAPNS', ''), (12, 5, 2, '5.0', '6.1.6', 'NAPNS', ''), (13, 5, 2, '7.0', '', 'NAPNS', ''), (14, 1, 3, '4.0.3', '', 'GCM', ''), (15, 2, 3, '4.0.3', '', 'GCM', ''), (16, 3, 3, '5.0', '', 'MAPNS', ''), (17, 4, 3, '5.0', '', 'MAPNS', ''), (18, 5, 3, '5.0', '', 'MAPNS', ''),
(19, 1, 4, '4.0.3', '', 'GCM', ''), (20, 2, 4, '4.0.3', '', 'GCM', ''), (21, 3, 4, '5.0', '', 'MAPNS', ''), (22, 4, 4, '5.0', '', 'MAPNS', ''), (23, 5, 4, '5.0', '', 'MAPNS', ''), (24, 1, 5, '4.0.3', '', 'GCM', 'wipe'), (25, 2, 5, '4.0.3', '', 'GCM', 'wipe'), (26, 1, 6, '4.0.3', '', 'GCM', ''), (27, 2, 6, '4.0.3', '', 'GCM', ''), (28, 3, 6, '5.0', '', 'MAPNS', ''), (29, 4, 6, '5.0', '', 'MAPNS', ''), (30, 5, 6, '5.0', '', 'MAPNS', ''), (31, 1, 7, '4.0.3', '', 'GCM', 'notifications'), (32, 2, 7, '4.0.3', '', 'GCM', 'notifications'), (33, 3, 7, '5.0', '6.1.6', 'NAPNS', 'notifications'), (34, 3, 7, '7.0', '', 'NAPNS', 'notifications'), (35, 4, 7, '5.0', '6.1.6', 'NAPNS', 'notifications'), (36, 4, 7, '7.0', '', 'NAPNS', 'notifications'), (37, 5, 7, '5.0', '6.1.6', 'NAPNS', 'notifications'), (38, 5, 7, '7.0', '', 'NAPNS', 'notifications'), (39, 1, 8, '4.0.3', '', 'GCM', 'wifi'), (40, 2, 8, '4.0.3', '', 'GCM', 'wifi'), (41, 3, 8, '5.0', '', 'MAPNS', 'wifi'), (42, 4, 8, '5.0', '', 'MAPNS', 'wifi'), (43, 5, 8, '5.0', '', 'MAPNS', 'wifi'), (44, 1, 9, '4.0.3', '', 'GCM', 'camera'), (45, 2, 9, '4.0.3', '', 'GCM', 'camera'), (46, 3, 9, '5.0', '', 'MAPNS', 'camera'), (47, 4, 9, '5.0', '', 'MAPNS', 'camera'), (48, 5, 9, '5.0', '', 'MAPNS', 'camera'), (49, 1, 12, '4.0.3', '', 'GCM', 'encrypt'), (50, 2, 12, '4.0.3', '', 'GCM', 'encrypt'), (51, 3, 13, '5.0', '', 'MAPNS', 'apn'), (52, 4, 13, '5.0', '', 'MAPNS', 'apn'), (53, 5, 13, '5.0', '', 'MAPNS', 'apn'), (54, 1, 14, '4.0.3', '', 'GCM', ''), (55, 2, 14, '4.0.3', '', 'GCM', ''), (56, 3, 14, '5.0', '6.1.6', 'NAPNS', ''), (57, 3, 14, '7.0', '', 'NAPNS', ''), (58, 4, 14, '5.0', '6.1.6', 'NAPNS', ''), (59, 3, 14, '7.0', '', 'NAPNS', ''), (60, 5, 14, '5.0', '6.1.6', 'NAPNS', ''), (61, 3, 14, '7.0', '', 'NAPNS', ''), (62, 1, 15, '4.0.3', '', 'GCM', 'webclip'), (63, 2, 15, '4.0.3', '', 'GCM', 'webclip'), (64, 3, 15, '5.0', '', 'MAPNS', 'webclip'), (65, 4, 15, '5.0', '', 'MAPNS', 'webclip'), (66, 5, 15, '5.0', '', 'MAPNS', 'webclip'), (67, 1, 16, '4.0.3', '', 'GCM', 'password_policy'), (68, 2, 16, '4.0.3', '', 'GCM', 'password_policy'), (69, 3, 16, '5.0', '', 'MAPNS', 'password_policy'), (70, 4, 16, '5.0', '', 'MAPNS', 'password_policy'), (71, 5, 16, '5.0', '', 'MAPNS', 'password_policy'), (72, 1, 17, '4.0.3', '', 'GCM', 'email'), (73, 2, 17, '4.0.3', '', 'GCM', 'email'), (74, 3, 17, '5.0', '', 'MAPNS', 'email'), (75, 4, 17, '5.0', '', 'MAPNS', 'email'), (76, 5, 17, '5.0', '', 'MAPNS', 'email'), (77, 3, 18, '5.0', '', 'MAPNS', 'google_calendar'), (78, 4, 18, '5.0', '', 'MAPNS', 'google_calendar'), (79, 5, 18, '5.0', '', 'MAPNS', 'google_calendar'), (80, 3, 20, '5.0', '', 'MAPNS', 'ldap'), (81, 4, 20, '5.0', '', 'MAPNS', 'ldap'), (82, 5, 20, '5.0', '', 'MAPNS', 'ldap'), (83, 1, 21, '4.0.3', '', 'GCM', 'change-password'), (84, 2, 21, '4.0.3', '', 'GCM', 'change-password'), (85, 3, 22, '5.0', '', 'MAPNS', ''), (86, 4, 22, '5.0', '', 'MAPNS', ''), (87, 5, 22, '5.0', '', 'MAPNS', ''), (88, 1, 24, '4.0.3', '', 'GCM', ''), (89, 2, 24, '4.0.3', '', 'GCM', ''), (90, 3, 24, '5.0', '', 'MAPNS', ''), (91, 4, 24, '5.0', '', 'MAPNS', ''), (92, 5, 24, '5.0', '', 'MAPNS', ''), (93, 1, 25, '4.0.3', '', 'GCM', ''), (94, 2, 25, '4.0.3', '', 'GCM', ''), (95, 3, 25, '5.0', '', 'MAPNS', ''), (96, 4, 25, '5.0', '', 'MAPNS', ''), (97, 5, 25, '5.0', '', 'MAPNS', ''), (98, 1, 23, '4.0.3', '', 'GCM', ''), (99, 2, 23, '4.0.3', '', 'GCM', '');

INSERT INTO platforms VALUES (1, 'ANDROID', 'PHONE', 'Android phone'), (2, 'IOS', 'PHONE', 'iPhone'), (3, 'IOS', 'TABLET', 'iPad'), (4, 'IOS', 'IPOD', 'iPod');

INSERT INTO policy_category VALUES (1, 0, 'USERS', 1), (2, 0, 'PLATFORMS', 2), (3, 0, 'OWNERSHIP', 3);
