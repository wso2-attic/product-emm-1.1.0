package org.wso2.carbon.emm.ios.core.publisher;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.StringRequestEntity;

import org.wso2.carbon.emm.ios.core.exception.EMMException;
import org.wso2.carbon.emm.ios.core.plist.DeviceProperties;
import org.wso2.carbon.emm.ios.core.util.AppConfigurations;

import com.google.gson.JsonObject;

public class TokenPublisher {

	public int publishiOSTokens(DeviceProperties deviceProperties)
			throws EMMException {

		String model = "";

		if (deviceProperties.getProduct() == null) {
			model = "";
		} else if (deviceProperties.getProduct().contains(
				AppConfigurations.I_PAD)) {
			model = AppConfigurations.I_PAD;
		} else if (deviceProperties.getProduct().contains(
				AppConfigurations.I_POD)) {
			model = AppConfigurations.I_POD;
		} else if (deviceProperties.getProduct().contains(
				AppConfigurations.I_PHONE)) {
			model = AppConfigurations.I_PHONE;
		} else {
			model = "";
		}

		JsonObject innerProperties = new JsonObject();
		// innerProperties.addProperty("CHALLENGE",
		// deviceProperties.getChallenge());
		innerProperties.addProperty("product", deviceProperties.getProduct());
		innerProperties.addProperty("device", "");
		innerProperties.addProperty("serial", deviceProperties.getSerial());
		innerProperties.addProperty("version", deviceProperties.getVersion());
		innerProperties.addProperty("imei", deviceProperties.getImei());
		innerProperties.addProperty("model", model);

		JsonObject outerProperties = new JsonObject();
		outerProperties.add("properties", innerProperties);
		outerProperties.addProperty("email", deviceProperties.getChallenge());
		outerProperties.addProperty("auth_token",
				deviceProperties.getChallenge());
		outerProperties.addProperty("osversion", "");
		outerProperties.addProperty("vendor", "Apple");
		outerProperties.addProperty("platform", model);
		outerProperties.addProperty("udid", deviceProperties.getUdid());
		outerProperties.addProperty("regid", "");

		StringRequestEntity requestEntity;
		try {
			requestEntity = new StringRequestEntity(outerProperties.toString(),
					AppConfigurations.APPLICATION_JSON, AppConfigurations.UTF8);
			PostMethod postMethod = new PostMethod(
					AppConfigurations
							.getConfigEntry(AppConfigurations.TOKEN_URL));
			postMethod.setRequestEntity(requestEntity);

			final HttpClient httpClient = new HttpClient();
			postMethod.addRequestHeader("Content-Type",
					AppConfigurations.APPLICATION_JSON);
			httpClient.executeMethod(postMethod);
			postMethod.getResponseBodyAsStream();
			postMethod.releaseConnection();

			return httpClient.executeMethod(postMethod);
		} catch (UnsupportedEncodingException e) {
			throw new EMMException("Unsupported encoding exception "
					+ e.getMessage());
		} catch (IOException e) {
			throw new EMMException("IO exception " + e.getMessage());
		}

	}
}
