package org.wso2.carbon.emm.ios.payload.generator;

public enum PayloadType {

	COMMON_PROFILE("common.plist"),
	DEVICE_LOCK("device_lock.plist"),
	CLEAR_PASSCODE("clear_passcode.plist"),
	APPLICATION_LIST("application_list.plist"),
	DEVICE_INFORMATION("device_info.plist"),
	CAMERA_SETTINGS("camera_settings.plist"),
	WIFI_SETTINGS("wifi_settings.plist"),
	APN_SETTINGS("apn_settings.plist"),
	WEBCLIP("webclip.plist"),
	PASSCODE_POLICY("passcode_policy.plist"),
	EMAIL_CONFIGURATIONS("email_configurations.plist"),
	CAL_DAV("caldav.plist"),
	CAL_SUBSCRIPTION("cal_subscription.plist"),
	VPN_CERT("vpn_cert.plist"),
	VPN_SECRET("vpn_secret.plist"),
	LDAP("ldap.plist"),
	PROFILE_LIST("profile_list.plist"),
	INSTALL_APPSTORE_APPLICATION("install_appstore_application.plist"),
	INSTALL_APPSTORE_APPLICATION_VOLUME_PURCHASE("install_appstore_application_volume_purchase.plist"),
	INSTALL_ENTERPRISE_APPLICATION("install_enterprise_application.plist"),
	CALENDAR_SUBSCRIPTION("cal_subscription.plist"),
	REMOVE_APPLICATION("remove_application.plist"),
	REMOVE_PROFILE("remove_profile.plist"),
	APPLY_REDEMPTION_CODE("apply_redemption_code.plist");

	private final String name;

	private PayloadType(String param) {
		name = param;
	}

	public boolean equalsName(String otherName) {
		return (otherName == null) ? false : name.equals(otherName);
	}

	public String toString() {
		return name;
	}
}
