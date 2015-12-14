package org.wso2.carbon.emm.ios.core.plist;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.wso2.carbon.emm.ios.core.exception.EMMException;
import org.wso2.carbon.emm.ios.core.util.AppConfigurations;
import org.wso2.carbon.emm.ios.core.util.CertificateAttributes;

public class PlistGenerator {

	public Map<String, Object> generateGeneralMap(String tenantName) {
		Map<String, Object> generalMap = new HashMap<String, Object>();
		// do not modify the payload version
		generalMap.put("PayloadVersion", 1);
		generalMap.put("PayloadUUID", UUID.randomUUID().toString());
		generalMap.put("PayloadOrganization", tenantName);

		return generalMap;
	}

	public String generateMobileConfigurations(String challengeToken,
			String tenantName) throws EMMException {
		PropertyList plist = new PropertyList();

		Map<String, Object> itemMap = generateGeneralMap(tenantName);

		// do not modify the payload type
		itemMap.put("PayloadType", "Profile Service");
		itemMap.put("PayloadIdentifier",
				"com.WSO2.mobileconfig.profile-service");
		itemMap.put("PayloadDisplayName", tenantName + " Profile Service");
		itemMap.put("PayloadDescription",
				"Install this profile to enroll for secure access to "
						+ tenantName);

		Map<String, Object> innnerMap = new HashMap<String, Object>();
		innnerMap
				.put("URL", AppConfigurations
						.getConfigEntry(AppConfigurations.PROFILE_URL));

		ArrayList<String> deviceAttributes = new ArrayList<String>();
		deviceAttributes.add("UDID");
		deviceAttributes.add("VERSION");
		deviceAttributes.add("SERIAL");
		deviceAttributes.add("PRODUCT");
		deviceAttributes.add("MAC_ADDRESS_EN0");
		deviceAttributes.add("DEVICE_NAME");
		deviceAttributes.add("IMEI");
		deviceAttributes.add("ICCID");
		innnerMap.put("DeviceAttributes", deviceAttributes);
		innnerMap.put("Challenge", challengeToken);

		itemMap.put("PayloadContent", innnerMap);
		String result = plist.encode(itemMap);

		return result;
	}

	public String generateMDMConfigurationPayload(String challenge,
			String tenantName, String topicId,
			CertificateAttributes certAttributes) throws EMMException {
		PropertyList plist = new PropertyList();

		Map<String, Object> itemMap = generateGeneralMap(tenantName);
		itemMap.put("PayloadIdentifier", "com.wso2.mdm");
		itemMap.put("PayloadType", "com.apple.mdm");
		itemMap.put("PayloadDisplayName", "MDM");
		itemMap.put("PayloadDescription", "Configures MDM");
		itemMap.put("Topic", topicId);
		itemMap.put("CheckInURL",
				AppConfigurations.getConfigEntry(AppConfigurations.CHECKIN_URL));
		itemMap.put("CheckOutWhenRemoved", true);
		itemMap.put("ServerURL",
				AppConfigurations.getConfigEntry(AppConfigurations.SERVER_URL));
		itemMap.put("IsRemovable", false);
		itemMap.put("Username", "");
		itemMap.put("Password", "");
		itemMap.put("PayloadRemovalDisallowed", false);
		itemMap.put("IdentityCertificateUUID",
				"45ff43d7-f0ac-40b6-94e1-ba86466b4ad3");
		itemMap.put("AccessRights", 8191);

		ArrayList<Object> compositePayload = new ArrayList<Object>();
		compositePayload.add(generateSCEPPayload(challenge, "mdm", tenantName,
				certAttributes));
		compositePayload.add(itemMap);

		String result = plist.encode(compositePayload);

		return result;
	}

	public String generateEncryptedConfigurationPayload(
			String encryptedContent, String tenantName) throws EMMException {

		PropertyList plist = new PropertyList();
		// format should be 2013-09-28T00:00:00Z
		SimpleDateFormat dateFormat = new SimpleDateFormat(
				"yyyy-MM-dd'T'00:00:00'Z'");
		plist.setDateFormat(dateFormat);

		Date targetDate = new Date();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(targetDate);
		calendar.add(Calendar.YEAR, 100);

		Map<String, Object> itemMap = generateGeneralMap(tenantName);
		itemMap.put("PayloadIdentifier", "com.wso2.intranet");
		itemMap.put("PayloadType", "Configuration");
		itemMap.put("PayloadDisplayName", tenantName + " MDM");
		itemMap.put("PayloadDescription", "Access to the " + tenantName
				+ " MDM");
		itemMap.put("PayloadExpirationDate", calendar.getTime());
		itemMap.put("EncryptedPayloadContent", encryptedContent.getBytes());

		String result = plist.encode(itemMap);

		return result;
	}

	public String generateEncryptionCertificatePayload(String challenge,
			String tenantName, CertificateAttributes certAttributes)
			throws EMMException {

		PropertyList plist = new PropertyList();

		Map<String, Object> itemMap = generateGeneralMap(tenantName);
		itemMap.put("PayloadIdentifier", "com.wso2.encrypted-profile-service");
		// do not modify
		itemMap.put("PayloadType", "Configuration");
		itemMap.put("PayloadDisplayName", tenantName
				+ " Profile Service Enroll");
		itemMap.put("PayloadDescription",
				"Enrolls identity for the encrypted profile service");

		ArrayList<Object> scepPayload = new ArrayList<Object>();
		scepPayload.add(generateSCEPPayload(challenge, "Profile Service",
				tenantName, certAttributes));
		itemMap.put("PayloadContent", scepPayload);

		String result = plist.encode(itemMap);

		return result;
	}

	public Map<String, Object> generateSCEPPayload(String challengeToken,
			String purpose, String tenantName,
			CertificateAttributes certAttributes) throws EMMException {

		Map<String, Object> itemMap = new HashMap<String, Object>();
		itemMap.put("PayloadUUID", "45ff43d7-f0ac-40b6-94e1-ba86466b4ad3");
		itemMap.put("PayloadIdentifier",
				"com.WSO2Mobile.encryption-cert-request");
		itemMap.put("PayloadType", "com.apple.security.scep");
		itemMap.put("PayloadVersion", 1);
		itemMap.put("PayloadDisplayName", tenantName + " Profile Service");
		itemMap.put("PayloadDescription", "Provides device encryption identity");
		itemMap.put("PayloadOrganization", tenantName);

		Map<String, Object> innnerMap = new HashMap<String, Object>();
		innnerMap.put("URL",
				AppConfigurations.getConfigEntry(AppConfigurations.ENROLL_URL));
		// MS SCEP servers need Name property
		innnerMap.put("Name", "EnrollmentCAInstance");

		ArrayList<Object> outerList = new ArrayList<Object>();

		ArrayList<Object> outerAttribute1 = new ArrayList<Object>();
		ArrayList<String> attribute1 = new ArrayList<String>();
		attribute1.add("C");
		attribute1.add(certAttributes.getCountry());
		outerAttribute1.add(attribute1);

		ArrayList<Object> outerAttribute2 = new ArrayList<Object>();
		ArrayList<String> attribute2 = new ArrayList<String>();
		attribute2.add("L");
		attribute2.add(certAttributes.getLocality());
		outerAttribute2.add(attribute2);

		ArrayList<Object> outerAttribute3 = new ArrayList<Object>();
		ArrayList<String> attribute3 = new ArrayList<String>();
		attribute3.add("S");
		attribute3.add(certAttributes.getState());
		outerAttribute3.add(attribute3);

		ArrayList<Object> outerAttribute4 = new ArrayList<Object>();
		ArrayList<String> attribute4 = new ArrayList<String>();
		attribute4.add("O");
		attribute4.add(certAttributes.getOrganization());
		outerAttribute4.add(attribute4);

		ArrayList<Object> outerAttribute5 = new ArrayList<Object>();
		ArrayList<String> attribute5 = new ArrayList<String>();
		attribute5.add("OU");
		attribute5.add(certAttributes.getOrganizationUnit());
		outerAttribute5.add(attribute5);

		ArrayList<Object> outerAttribute6 = new ArrayList<Object>();
		ArrayList<String> attribute6 = new ArrayList<String>();
		attribute6.add("E");
		attribute6.add(certAttributes.getEmail());
		outerAttribute6.add(attribute6);

		ArrayList<Object> outerAttribute7 = new ArrayList<Object>();
		ArrayList<String> attribute7 = new ArrayList<String>();
		attribute7.add("CN");
		attribute7.add(String.format("%s (%s)", purpose, UUID.randomUUID()
				.toString()));
		outerAttribute7.add(attribute7);

		outerList.add(outerAttribute1);
		outerList.add(outerAttribute2);
		outerList.add(outerAttribute3);
		outerList.add(outerAttribute4);
		outerList.add(outerAttribute5);
		outerList.add(outerAttribute6);
		outerList.add(outerAttribute7);

		innnerMap.put("Subject", outerList);

		innnerMap.put("Challenge", challengeToken);
		innnerMap.put("Keysize", 1024);
		innnerMap.put("Key Type", "RSA");
		innnerMap.put("Key Usage", 5);
		// innnerMap.put("CAFingerprint", "");

		itemMap.put("PayloadContent", innnerMap);

		return itemMap;
	}
}
