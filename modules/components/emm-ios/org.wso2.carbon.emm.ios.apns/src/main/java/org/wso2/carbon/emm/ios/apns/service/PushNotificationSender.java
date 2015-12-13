package org.wso2.carbon.emm.ios.apns.service;

import java.io.InputStream;

import org.wso2.carbon.emm.ios.apns.exception.APNSException;

import com.notnoop.apns.APNS;
import com.notnoop.apns.ApnsService;

public class PushNotificationSender {

	ApnsService service = null;

	public PushNotificationSender(InputStream inputStream, String certPassword,
			boolean isProductionMode) throws APNSException {

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

	public void pushToAPNS(String token, String message) throws APNSException {

		String payload = APNS.newPayload().alertBody(message).build();
		service.push(token, payload);

	}

}
