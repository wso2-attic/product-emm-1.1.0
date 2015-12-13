package org.wso2.carbon.emm.ios.core.plist;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.wso2.carbon.emm.ios.core.exception.EMMException;
import org.wso2.carbon.emm.ios.core.util.AppConfigurations;
import org.xml.sax.SAXException;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class PlistExtractor {

	public static final String KEY = "key";
	public static final String VALUE = "string";
	public static final String DICTIONARY = "dict";
	public static final String ARRAY = "array";
	public static final String IMEI = "IMEI";
	public static final String PRODUCT = "PRODUCT";
	public static final String SERIAL = "SERIAL";
	public static final String UDID = "UDID";
	public static final String VERSION = "VERSION";
	public static final String PUSH_MAGIC = "PushMagic";
	public static final String STATUS = "Status";
	public static final String STATE = "State";
	public static final String ERROR = "ErrorChain";
	public static final String MESSAGE_TYPE = "MessageType";
	public static final String QUERY_RESPONSES = "QueryResponses";
	public static final String INSTALLED_APPLICATION_LIST = "InstalledApplicationList";
	public static final String PROFILE_LIST = "ProfileList";
	public static final String TOKEN = "Token";
	public static final String TOPIC = "Topic";
	public static final String UNLOCK_TOKEN = "UnlockToken";
	public static final String CHALLENGE = "CHALLENGE";
	public static final String COMMAND_UUID = "CommandUUID";

	public DeviceProperties extractDeviceProperties(String xmlProperties)
			throws EMMException {

		Document document = getDocumentElement(xmlProperties);

		if (document.getChildNodes().getLength() == 0) {
			throw new EMMException("Device properties not available");
		}

		NodeList childNodes = document.getElementsByTagName(DICTIONARY);

		if (childNodes == null || childNodes.item(0) == null
				|| childNodes.item(0).getChildNodes().getLength() == 0) {
			throw new EMMException("Device properties not available");
		}

		childNodes = childNodes.item(0).getChildNodes();

		DeviceProperties deviceProperties = new DeviceProperties();

		for (int i = 0; i < childNodes.getLength(); i++) {

			Node childNode = childNodes.item(i);

			String childNodeName = childNode.getNodeName();

			if (!KEY.equals(childNodeName)) {
				continue;
			}

			Node valueNode = childNodes.item(i + 2);

			if (valueNode == null) {
				continue;
			}

			String keyValue = valueNode.getTextContent();
			String childNodeValue = childNode.getTextContent();

			if (IMEI.equals(childNodeValue)) {
				deviceProperties.setImei(keyValue);
			} else if (PRODUCT.equals(childNodeValue)) {
				deviceProperties.setProduct(keyValue);
			} else if (SERIAL.equals(childNodeValue)) {
				deviceProperties.setSerial(keyValue);
			} else if (UDID.equals(childNodeValue)) {
				deviceProperties.setUdid(keyValue);
			} else if (VERSION.equals(childNodeValue)) {
				deviceProperties.setVersion(keyValue);
			} else if (CHALLENGE.equals(childNodeValue)) {
				deviceProperties.setChallenge(keyValue);
			}
		}

		return deviceProperties;

	}

	public CheckinMessageType extractTokens(String xmlProperties)
			throws EMMException {

		Document document = getDocumentElement(xmlProperties);

		if (document.getChildNodes().getLength() == 0) {
			throw new EMMException("Device properties not available");
		}

		NodeList childNodes = document.getElementsByTagName(DICTIONARY);

		if (childNodes == null || childNodes.item(0) == null
				|| childNodes.item(0).getChildNodes().getLength() == 0) {
			throw new EMMException("Device properties not available");
		}

		childNodes = childNodes.item(0).getChildNodes();

		CheckinMessageType checkinMessageType = new CheckinMessageType();

		for (int i = 0; i < childNodes.getLength(); i++) {

			Node childNode = childNodes.item(i);

			String childNodeName = childNode.getNodeName();

			if (!KEY.equals(childNodeName)) {
				continue;
			}

			Node valueNode = childNodes.item(i + 2);

			if (valueNode == null) {
				continue;
			}

			String keyValue = valueNode.getTextContent();
			String childNodeValue = childNode.getTextContent();

			if (MESSAGE_TYPE.equals(childNodeValue)) {
				checkinMessageType.setMessageType(keyValue.trim());
			} else if (PUSH_MAGIC.equals(childNodeValue)) {
				checkinMessageType.setPushMagic(keyValue.trim());
			} else if (TOKEN.equals(childNodeValue)) {
				checkinMessageType.setToken(keyValue.trim());
			} else if (TOPIC.equals(childNodeValue)) {
				checkinMessageType.setTopic(keyValue.trim());
			} else if (UDID.equals(childNodeValue)) {
				checkinMessageType.setUdid(keyValue.trim());
			} else if (UNLOCK_TOKEN.equals(childNodeValue)) {
				checkinMessageType.setUnlockToken(keyValue.trim().replaceAll(
						"\\s+", ""));
			}
		}

		return checkinMessageType;

	}

	public APNSStatus extractAPNSResponse(String xmlProperties)
			throws EMMException {

		Document document = getDocumentElement(xmlProperties);

		if (document.getChildNodes().getLength() == 0) {
			throw new EMMException("APNS properties not available");
		}

		NodeList childNodes = document.getElementsByTagName(DICTIONARY);

		if (childNodes == null || childNodes.item(0) == null
				|| childNodes.item(0).getChildNodes().getLength() == 0) {
			throw new EMMException("APNS properties not available");
		}

		childNodes = childNodes.item(0).getChildNodes();

		APNSStatus apnsStatus = new APNSStatus();

		for (int i = 0; i < childNodes.getLength(); i++) {

			Node childNode = childNodes.item(i);

			String childNodeName = childNode.getNodeName();

			if (!KEY.equals(childNodeName)) {
				continue;
			}

			Node valueNode = childNodes.item(i + 2);

			if (valueNode == null) {
				continue;
			}

			String keyValue = valueNode.getTextContent();
			String childNodeValue = childNode.getTextContent();

			if (STATUS.equals(childNodeValue)) {
				apnsStatus.setStatus(keyValue.trim());
			} else if (ERROR.equals(childNodeValue)) {
				apnsStatus.setError(arrayToJson(valueNode.getChildNodes()));
			} else if (UDID.equals(childNodeValue)) {
				apnsStatus.setUdid(keyValue.trim());
			} else if (STATE.equals(childNodeValue)) {
				apnsStatus.setState(keyValue.trim());
			} else if (COMMAND_UUID.equals(childNodeValue)) {
				apnsStatus.setCommandUUID(keyValue.trim());
			} else if (QUERY_RESPONSES.equals(childNodeValue)) {
				apnsStatus.setOperation(QUERY_RESPONSES);
				apnsStatus.setResponseData(dictionaryToJson(valueNode
						.getChildNodes()));
			} else if (INSTALLED_APPLICATION_LIST.equals(childNodeValue)) {
				apnsStatus.setOperation(INSTALLED_APPLICATION_LIST);
				apnsStatus.setResponseData(arrayToJson(valueNode
						.getChildNodes()));
			} else if (PROFILE_LIST.equals(childNodeValue)) {
				apnsStatus.setOperation(PROFILE_LIST);
				apnsStatus.setResponseData(arrayToJson(valueNode
						.getChildNodes()));
			}
		}

		return apnsStatus;

	}

	public String dictionaryToJson(NodeList childNodes) {
		return dictionaryToObject(childNodes).toString();
	}

	public JsonObject dictionaryToObject(NodeList childNodes) {

		JsonObject jsonObject = new JsonObject();

		for (int i = 0; i < childNodes.getLength(); i++) {

			Node childNode = childNodes.item(i);

			String childNodeName = childNode.getNodeName();

			if (!KEY.equals(childNodeName)) {
				continue;
			}

			Node valueNode = childNodes.item(i + 2);

			if (valueNode == null) {
				continue;
			}

			String keyValue = valueNode.getTextContent();
			String childNodeValue = childNode.getTextContent();

			jsonObject.addProperty(childNodeValue, keyValue);
		}

		return jsonObject;
	}

	public String arrayToJson(NodeList childNodes) {

		JsonArray jsonArray = new JsonArray();

		for (int i = 0; i < childNodes.getLength(); i++) {

			Node childNode = childNodes.item(i);

			String childNodeName = childNode.getNodeName();

			if (!DICTIONARY.equals(childNodeName)) {
				continue;
			}

			NodeList innerNodes = childNode.getChildNodes();
			JsonObject innerJsonObject = dictionaryToObject(innerNodes);
			jsonArray.add(innerJsonObject);

		}

		return jsonArray.toString();
	}

	private Document getDocumentElement(String xmlProperties)
			throws EMMException {

		try {
			InputStream inputStream = new ByteArrayInputStream(
					xmlProperties.getBytes(AppConfigurations.UTF8));
			DocumentBuilderFactory dbFactory = DocumentBuilderFactory
					.newInstance();
			DocumentBuilder dBuilder;
			dBuilder = dbFactory.newDocumentBuilder();
			Document document = dBuilder.parse(inputStream);
			document.getDocumentElement().normalize();

			return document;
		} catch (ParserConfigurationException e) {
			throw new EMMException("Parser configuration exception "
					+ e.getMessage());
		} catch (UnsupportedEncodingException e) {
			throw new EMMException("Unsupported encoding " + e.getMessage());
		} catch (SAXException e) {
			throw new EMMException("SAX parsing error " + e.getMessage());
		} catch (IOException e) {
			throw new EMMException("IO exception " + e.getMessage());
		}

	}

}
