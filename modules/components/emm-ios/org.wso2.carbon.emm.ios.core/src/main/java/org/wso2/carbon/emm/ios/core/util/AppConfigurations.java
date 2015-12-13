package org.wso2.carbon.emm.ios.core.util;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.wso2.carbon.emm.ios.core.exception.EMMException;

public class AppConfigurations {

	public static final String PROFILE_URL = "iOSProfileURL";
	public static final String CHECKIN_URL = "iOSCheckinURL";
	public static final String SERVER_URL = "iOSServerURL";
	public static final String ENROLL_URL = "iOSEnrollURL";
	public static final String PATH_KEYSTORE = "Location";
	public static final String PATH_EMM_KEYSTORE = "EMMKeystoreLocation";
	public static final String KEY_ALIAS_KEYSTORE = "KeyAlias";
	public static final String KEYSTORE_PASSWORD = "Password";
	public static final String EMM_KEYSTORE_PASSWORD = "EMMKeystorePassword";
	public static final String KEYSTORE_KEY_PASSWORD = "KeyPassword";
	public static final String KEYSTORE_CA_CERT_PRIV_PASSWORD = "EMMCAPrivateKeyPassword";
	public static final String KEYSTORE_RA_CERT_PRIV_PASSWORD = "EMMRAPrivateKeyPassword";
	public static final String CA_CERT_ALIAS = "EMMCACertAlias";
	public static final String RA_CERT_ALIAS = "EMMRACertAlias";
	public static final String CARBON_KEY_STORE_PARENT = "KeyStore";
	public static final String MODE_STATUS = "true";
	public static final String SIGNATUREALGO = "SHA1withRSA";
	public static final String PROVIDER = "BC";
	public static final String KEYSTORE = "Type";
	public static final String EMM_KEYSTORE = "EMMKeystoreType";
	public static final String RSA = "RSA";
	public static final String UTF8 = "UTF-8";
	public static final String X_APPLE_ASPEN_CONFIG = "application/x-apple-aspen-config";
	public static final String X509_CA_CERT = "application/x-x509-ca-cert";
	public static final String TEXT_PLAIN = "text/plain";
	public static final String APPLICATION_JSON = "application/json";
	public static final String X509_CA_RA_CERT = "application/x-x509-ca-ra-cert";
	public static final String SHA256_RSA = "SHA256WithRSAEncryption";
	public static final String X_509 = "X.509";
	public static final String POST_BODY_CA_CAPS = "POSTPKIOperation/nSHA-1/nDES3/n";
	public static final String DES_EDE = "DESede";
	public static final String PKI_MESSAGE = "application/x-pki-message";
	public static final String DEVICE_TOKEN = "devicetoken";
	public static final String I_PAD = "iPad";
	public static final String I_POD = "iPod";
	public static final String I_PHONE = "iPhone";
	public static final String TOKEN_URL = "TokenURL";
	public static final String CONF_LOCATION = "conf.location";
	public static final String CARBON_HOME = "carbon.home";
	public static final String EMM_CONFIG_XML = "emm-config.xml";
	public static final String CARBON_HOME_ENTRY = "${carbon.home}";
	public static final String CARBON_XML = "carbon.xml";
	public static final int RSA_KEY_LENGTH = 1024;

	private static AppConfigurations appConfigurations;
	private static String[] emmConfiEntryNames = { ENROLL_URL, PROFILE_URL,
			CHECKIN_URL, SERVER_URL, TOKEN_URL, CA_CERT_ALIAS, RA_CERT_ALIAS,
			EMM_KEYSTORE, PATH_EMM_KEYSTORE, EMM_KEYSTORE_PASSWORD,
			KEYSTORE_CA_CERT_PRIV_PASSWORD, KEYSTORE_RA_CERT_PRIV_PASSWORD };

	private static String[] carbonConfigEntryNames = { PATH_KEYSTORE,
			KEY_ALIAS_KEYSTORE, KEYSTORE, KEYSTORE_PASSWORD,
			KEYSTORE_KEY_PASSWORD };

	private static Map<String, String> configMap;

	private static Map<String, String> readEMMConfigurations()
			throws EMMException {

		String emmConfLocation = System.getProperty(CONF_LOCATION)
				+ File.separator + EMM_CONFIG_XML;
		String carbonConfLocation = System.getProperty(CONF_LOCATION)
				+ File.separator + CARBON_XML;

		if (appConfigurations == null || configMap == null) {
			appConfigurations = new AppConfigurations();
			configMap = new HashMap<String, String>();

			// read xml entries in repository/conf/emm-config.xml

			Document document = null;
			try {
				File fXmlFile = new File(emmConfLocation);
				DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory
						.newInstance();
				DocumentBuilder documentBuilder = documentBuilderFactory
						.newDocumentBuilder();
				document = documentBuilder.parse(fXmlFile);
			} catch (Exception e) {
				throw new EMMException("Error reading emm-config.xml file");
			}

			for (String configEntry : emmConfiEntryNames) {

				NodeList elements = document.getElementsByTagName(configEntry);

				if (elements != null && elements.getLength() > 0) {
					configMap.put(configEntry, elements.item(0)
							.getTextContent());
				}

			}

			// read xml entries in repository/conf/carbon.xml

			try {
				File fXmlFile = new File(carbonConfLocation);
				DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory
						.newInstance();
				DocumentBuilder documentBuilder = documentBuilderFactory
						.newDocumentBuilder();
				document = documentBuilder.parse(fXmlFile);
			} catch (Exception e) {
				throw new EMMException("Error reading carbon.xml file");
			}

			NodeList carbonKeystoreEntry = document
					.getElementsByTagName(CARBON_KEY_STORE_PARENT);
			NodeList keyStoreChildElements;

			if (carbonKeystoreEntry == null
					|| carbonKeystoreEntry.getLength() == 0) {
				throw new EMMException("Error reading carbon.xml file");
			} else {
				keyStoreChildElements = carbonKeystoreEntry.item(0)
						.getChildNodes();
			}

			for (int i = 0; i < keyStoreChildElements.getLength(); i++) {
				Node currentNode = keyStoreChildElements.item(i);
				if (currentNode.getNodeType() == Node.ELEMENT_NODE) {
					for (String configEntry : carbonConfigEntryNames) {
						if (configEntry.equalsIgnoreCase(currentNode
								.getNodeName())) {
							configMap.put(configEntry,
									currentNode.getTextContent());
							continue;
						}
					}
				}
			}

			String carbonKeyStoreLocation = replaceCarbonHomeEnvEntry(configMap
					.get(PATH_KEYSTORE));

			if (carbonKeyStoreLocation != null) {
				configMap.put(PATH_KEYSTORE, carbonKeyStoreLocation);
			}

			String emmKeyStoreLocation = replaceCarbonHomeEnvEntry(configMap
					.get(PATH_EMM_KEYSTORE));

			if (carbonKeyStoreLocation != null) {
				configMap.put(PATH_EMM_KEYSTORE, emmKeyStoreLocation);
			}
		}

		return configMap;
	}

	public static String getConfigEntry(final String entry) throws EMMException {

		Map<String, String> configurationMap = readEMMConfigurations();
		String configValue = configurationMap.get(entry);

		if (configValue == null) {
			throw new EMMException("Configuration entry not available");
		}

		return configValue.trim();
	}

	private static String replaceCarbonHomeEnvEntry(String entry) {

		if (entry != null && entry.toLowerCase().contains(CARBON_HOME_ENTRY)) {
			return entry.replace(CARBON_HOME_ENTRY,
					System.getProperty(CARBON_HOME));
		}

		return null;
	}

}
