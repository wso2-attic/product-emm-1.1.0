package org.wso2.carbon.emm.ios.apns.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.wso2.carbon.emm.ios.apns.exception.APNSException;

import com.notnoop.apns.APNS;
import com.notnoop.apns.ApnsService;

public class MDMPushNotificationSender {

	public static final String DEVICE_TOKEN = "devicetoken";
	public static final String MAGIC_TOKEN = "magictoken";
	public static final String UTF_8 = "UTF-8";

	ApnsService service = null;

	public MDMPushNotificationSender(InputStream inputStream,
			String certPassword, boolean isProductionMode) throws APNSException {

		if (isProductionMode) {
			service = APNS.newService().withCert(inputStream, certPassword)
					.withProductionDestination().build();
		} else {
			service = APNS.newService().withCert(inputStream, certPassword)
					.withSandboxDestination().build();
		}

		service.start();
		service.testConnection();

	}

	public String sayHello() {
		return "Hello";
	}

	public void pushToAPNS(ArrayList<Map<String, String>> userData)
			throws APNSException {

		for (Map<String, String> dictionary : userData) {

			try {

				String deviceToken = dictionary.get(DEVICE_TOKEN);

				String magicToken = dictionary.get(MAGIC_TOKEN);
				String mdmPayload = APNS.newPayload().mdm(magicToken).build();

				/* CONVERTING INTO BYTE */
				byte[] decodedBytes = Base64.decodeBase64(deviceToken
						.getBytes(UTF_8));
				StringBuffer buf = new StringBuffer();
				/*
				 * IMPLEMENTING IN 64 BITS OF HEX, HERE %02X CREATES EACH BYTE
				 * INTO LENGTH =2 HEX NUMBER , example = 2F THIS HEX NUMBERS
				 * APPENDS AND FORM A STRING OF 64BITS
				 */

				for (int i = 0; i < decodedBytes.length; ++i) {
					buf.append(String.format("%02x", decodedBytes[i]));
				}

				String hexDeviceToken = buf.toString();

				/* PUSHING TO APNS SERVER */
				service.push(hexDeviceToken, mdmPayload);
				// System.out.println(hexDeviceToken);

			} catch (Exception e) {
				throw new APNSException("Error sending APNS request "
						+ e.getMessage());

			}
		}

	}

}
