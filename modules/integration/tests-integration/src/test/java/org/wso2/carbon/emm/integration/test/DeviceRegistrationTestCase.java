/*
 * Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.emm.integration.test;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.json.simple.JSONObject;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import static org.testng.Assert.assertTrue;

/**
 * Implements a simple test on registering
 * a dummy Android device to the system.
 * @since 2014-12-16
 *
 * Instructions to run this test:
 * [1] Download an older version of Firefox ranging from v20 to v25 and unzip it.
 * [2] Build the normal pack (i.e. EMM-PACK) from product-emm-source using
 *     "mvn clean install -Dwebdriver.firefox.bin=/path-to-firefox/firefox/firefox-bin".
 *
 * Additional instructions to run this test for inspecting ORACLE Support
 * [3] Once the pack is built, unzip the product zip file and do the following modifications.
 * [4] Set database configuration details of WSO2_EMM_DB in master-datasources.xml file to a running ORACLE instance.
 * [5] Run the provided oracle.sql script in product-emm-source/modules/distribution/src/repository/dbscripts/emm
 *     to populate the tables with in your oracle database instance.
 * [6] Put the relevant ORACLE JDBC connector (ojdbc) to EMM-PACK/repository/components/lib folder.
 * [7] Replace the existing db.js file from oracle_db.js file in modules/apps/emm/sqlscripts
 *     as the new db.js file.
 * [8] Once-again zip the unzipped product at product-emm-source/modules/distribution/target and
 *     run the following command at product-emm-source/modules/integration.
 *     "mvn clean install -Dwebdriver.firefox.bin=/path-to-firefox/firefox/firefox-bin".
 */

public class DeviceRegistrationTestCase extends EMMIntegrationTest {
	private static final Log log = LogFactory.getLog(DeviceRegistrationTestCase.class);

	/**
	 * Executes the constructor of abstract EMMIntegrationTest class.
	 * @throws EMMIntegrationTestException Custom exception type for any EMM Integration Test
	 */
	public DeviceRegistrationTestCase() throws EMMIntegrationTestException {
		super();
	}

	/**
	 * Logs-out from EMM web application and
	 * quits the web-driver-window after any UI operation.
	 */
	@AfterClass(alwaysRun = true, groups = "wso2.emm", description = "Quit browser window if exists")
	public void clean() {
		logoutFromEmmWebAppViaWebDriver();
		quitWebDriver();
	}

	/**
	 * Performs a simple test on registering a dummy Android device to the system.
	 * @throws EMMIntegrationTestException Custom exception type for any EMM Integration Test
	 */
	@Test(groups = "wso2.emm", description = "Check whether a dummy device is registered correctly")
	public void testAndroidRegistration() throws EMMIntegrationTestException {
		//get necessary API credentials to access emm/api/devices/register/1.0.0 API.
		String accessToken = getAccessToken();
		HttpResponse response = getAndroidRegistrationResponse(accessToken);
		//check response to verify if the registration is successful.
		assertTrue(response.toString().contains("HTTP/1.1 201 Created"), "Device registration test failed");
		log.info("Device registration test is successful");
	}

	/**
	 * Returns the response of a dummy Android device registration.
	 * @param accessToken Current access token for admin user
	 * @return Response of an Android device registration
	 * @throws EMMIntegrationTestException Custom exception type for any EMM Integration Test
	 */
	@SuppressWarnings("unchecked")
	private HttpResponse getAndroidRegistrationResponse(String accessToken) throws EMMIntegrationTestException {
		HttpPost request = new HttpPost(EMMIntegrationTestConstants.DEVICE_REGISTRATION_ENDPOINT);
		request.addHeader("content-type", "application/json");
		request.addHeader("Authorization", "Bearer " + accessToken);
		request.addHeader("User-Agent", "Mozilla/5.0(Linux; U; Android 2.2; en-gb; LG-P500 Build/FRF91)");

		JSONObject devicePayload = new JSONObject();

		devicePayload.put("regid", "969f0583b6382190");
		devicePayload.put("platform", "Android");
		devicePayload.put("username", "AndrewB");
		devicePayload.put("vendor", "samsung");
		devicePayload.put("mac", "48:5A:3F:08:19:60");
		devicePayload.put("properties", "{\"device\":\"hlte\",\"model\":\"SM-N9005\",\"imei\":\"351776060691383\"}");
		devicePayload.put("type", "BYOD");
		devicePayload.put("osversion", "4.4.2");

		StringEntity params;
		try {
			params = new StringEntity(devicePayload.toString());
		} catch (UnsupportedEncodingException e) {
			throw new EMMIntegrationTestException("Error converting android registration data into StringEntity", e);
		}

		request.setEntity(params);
		HttpResponse response;
		try {
			response = getHttpClient().execute(request);
		} catch (IOException e) {
			throw new EMMIntegrationTestException("Error executing Android registration request", e);
		}

		return response;
	}
}
