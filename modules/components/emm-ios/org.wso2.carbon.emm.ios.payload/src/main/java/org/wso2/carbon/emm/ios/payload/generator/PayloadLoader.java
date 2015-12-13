package org.wso2.carbon.emm.ios.payload.generator;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.wso2.carbon.emm.ios.core.exception.EMMException;
import org.wso2.carbon.emm.ios.core.service.iOSMobilityManagerService;

public class PayloadLoader {

	public static final String UTF_8 = "UTF-8";
	public static final String PATH_PREFIX = "plist/";
	public static final String TRUE = "true";
	public static final String FALSE = "false";
	public static final String TRUE_TAG = "<true />";
	public static final String FALSE_TAG = "<false />";

	public String loadPayload(PayloadType payloadType,
			Map<String, Object> paramMap, boolean isProfile)
			throws EMMException {

		String plistFile = payloadType.toString();
		InputStream inputStream = PayloadLoader.class
				.getResourceAsStream(PATH_PREFIX + plistFile);
		StringWriter writer = new StringWriter();

		if (inputStream == null) {
			throw new EMMException("Error accessing file " + plistFile);
		}

		try {
			IOUtils.copy(inputStream, writer, UTF_8);
		} catch (IOException e) {
			throw new EMMException("Error accessing file " + plistFile + " "
					+ e.getMessage());
		}
		String outputString = writer.toString();

		outputString = substituteRuntimeParameters(outputString, paramMap);

		if (isProfile) {
			InputStream inputStreamCommon = PayloadLoader.class
					.getResourceAsStream(PATH_PREFIX
							+ PayloadType.COMMON_PROFILE);
			StringWriter writerCommon = new StringWriter();

			if (inputStreamCommon == null) {
				throw new EMMException("Error accessing file "
						+ PayloadType.COMMON_PROFILE);
			}

			try {
				IOUtils.copy(inputStreamCommon, writerCommon, UTF_8);
			} catch (IOException e) {
				throw new EMMException("Error accessing file "
						+ PayloadType.COMMON_PROFILE + " " + e.getMessage());
			}
			String outputStringCommon = writerCommon.toString();
			outputStringCommon = substituteRuntimeParameters(
					outputStringCommon, paramMap);

			iOSMobilityManagerService mobilityManagerService = new iOSMobilityManagerService();
			byte signedData[];
			try {
				signedData = mobilityManagerService.getSignedData(outputString
						.getBytes(UTF_8));
			} catch (UnsupportedEncodingException e) {
				throw new EMMException("Unsupported encoding UTF-8 "
						+ e.getMessage());
			}

			Map<String, Object> placeHolderItems = new HashMap<String, Object>();
			placeHolderItems.put("placeholder",
					Base64.encodeBase64String(signedData));
			outputString = substituteRuntimeParameters(outputStringCommon,
					placeHolderItems);
		}

		try {
			inputStream.close();
		} catch (IOException e) {
			throw new EMMException(
					"Error closing input stream when reading file "
							+ PayloadType.COMMON_PROFILE + " " + e.getMessage());
		}

		return outputString;
	}

	public String substituteRuntimeParameters(String outputString,
			Map<String, Object> paramMap) {

		Iterator<String> iterator = paramMap.keySet().iterator();

		while (iterator.hasNext()) {
			String key = iterator.next();
			Object value = paramMap.get(key);

			String strValue = "";

			if (value instanceof Boolean) {
				if (((Boolean) value).booleanValue() == true) {
					strValue = TRUE_TAG;
				} else if (((Boolean) value).booleanValue() == false) {
					strValue = FALSE_TAG;
				}
			} else if (value instanceof String) {
				strValue = (String) value;
			} else if (value instanceof Integer) {
				strValue = ((Integer) value).toString();
			} else if (value instanceof Double) {
				strValue = ((Double) value).toString();
			} else {
				strValue = (String) value;
			}

			outputString = outputString.replace(String.format("${%s}", key),
					strValue);
		}

		return outputString;
	}

	public static void main(String[] args) throws EMMException {
		PayloadLoader payloadLoader = new PayloadLoader();
		Map<String, Object> paramMap = new HashMap<String, Object>();
		String responseData = payloadLoader.loadPayload(
				PayloadType.PROFILE_LIST, paramMap, false);

	}
}
