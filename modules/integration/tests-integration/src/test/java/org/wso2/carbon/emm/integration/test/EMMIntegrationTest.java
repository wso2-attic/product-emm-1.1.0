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

import org.apache.commons.net.util.Base64;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;

/**
 * Serves as the abstract integration test class
 * for all emm integration tests.
 * @since 2015-01-05
 */
public abstract class EMMIntegrationTest {
	private final WebDriver webDriver;
	private final WebDriverWait webDriverWait;
	private final HttpClient httpClient;
	private final String encodedConsumerCredentials;

	/**
	 * Initializes all EMM APIs required for any integration test by logging into emm web application and
	 * obtain necessary consumer credentials to access them.
	 * @throws EMMIntegrationTestException Custom exception type for any EMM Integration Test
	 */
	public EMMIntegrationTest() throws EMMIntegrationTestException {
		webDriver = new FirefoxDriver();
		int timeOutInSeconds = 10;
		webDriverWait = new WebDriverWait(webDriver, timeOutInSeconds);
		httpClient = new DefaultHttpClient();
		//Following is done to initialize EMM APIs.
		loginToEmmWebAppViaWebDriver();
		//get necessary consumer credentials to access EMM APIs.
		JSONObject consumerCredentials = getConsumerCredentials();
		String consumerKey = (String) consumerCredentials.get("clientkey");
		String consumerSecret = (String) consumerCredentials.get("clientsecret");
		String combinedCredentials = consumerKey + ":" + consumerSecret;
		encodedConsumerCredentials = new String(Base64.encodeBase64(combinedCredentials.getBytes()));
	}

	/**
	 * Returns a new HttpClient object to perform
	 * any REST operation with the available APIs.
	 * @return New HttpClient object
	 */
	public HttpClient getHttpClient() {
		return httpClient;
	}

	/**
	 * Performs the login operation to emm web-app using Selenium.
	 */
	protected void loginToEmmWebAppViaWebDriver() {
		webDriver.get(EMMIntegrationTestConstants.EMM_CONSOLE_HTTP_ENDPOINT);
		webDriverWait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[contains(.,'Sign in')]")));
		webDriver.findElement(By.xpath("//input[@name='username']")).sendKeys("admin");
		webDriver.findElement(By.xpath("//input[@name='password']")).sendKeys("admin");
		webDriver.findElement(By.xpath("//button[contains(.,'Sign in')]")).click();
		webDriverWait.until(ExpectedConditions.
				presenceOfElementLocated(By.xpath("//div[contains(.,'Devices By Ownership')]")));
	}

	/**
	 * Performs the logout operation from emm web-app using Selenium.
	 */
	protected void logoutFromEmmWebAppViaWebDriver() {
		webDriver.findElement(By.xpath("//a[contains(.,'Welcome Admin')]")).click();
		webDriverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//a[contains(.,'Logout')]")));
		webDriver.findElement(By.xpath("//a[contains(.,'Logout')]")).click();
		webDriverWait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[contains(.,'Sign in')]")));
	}

	/**
	 * Quits the web-driver-window after any UI operation.
	 */
	protected void quitWebDriver() {
		webDriver.quit();
	}

	/**
	 * Returns a json object which will carry consumer credentials of admin user.
	 * @return A json object with "clientkey" and "clientsecret"
	 * @throws EMMIntegrationTestException Custom exception type for any EMM Integration Test
	 */
	protected JSONObject getConsumerCredentials() throws EMMIntegrationTestException {
		HttpPost request = new HttpPost(EMMIntegrationTestConstants.CONSUMER_CREDENTIALS_ENDPOINT);
		request.addHeader("content-type", "application/x-www-form-urlencoded");

		HttpResponse response;
		try {
			response = httpClient.execute(request);
		} catch (IOException e) {
			throw new EMMIntegrationTestException("Error executing getConsumerCredentials request", e);
		}

		HttpEntity entity = response.getEntity();
		String entityString;
		JSONParser parser = new JSONParser();
		Object obj;
		try {
			entityString = EntityUtils.toString(entity, "UTF-8");
			obj = parser.parse(entityString);
		} catch (IOException e) {
			throw new EMMIntegrationTestException("Error converting consumerCredentials into a string", e);
		} catch (ParseException e) {
			throw new EMMIntegrationTestException("Error passing consumerCredentials into json", e);
		}

		return (JSONObject)obj;
	}

	/**
	 * Returns a string carrying the current access token of admin user.
	 * @return Access token of admin user
	 * @throws EMMIntegrationTestException Custom exception type for any EMM Integration Test
	 */
	protected String getAccessToken() throws EMMIntegrationTestException {
		HttpPost request = new HttpPost(EMMIntegrationTestConstants.OAUTH2_TOKEN_ENDPOINT);
		request.addHeader("Authorization", "Basic " + encodedConsumerCredentials);
		request.addHeader("content-type", "application/x-www-form-urlencoded");

		HttpResponse response;
		try {
			response = httpClient.execute(request);
		} catch (IOException e) {
			throw new EMMIntegrationTestException("Error executing getAccessToken request", e);
		}

		HttpEntity entity = response.getEntity();
		String entityString;
		JSONParser parser = new JSONParser();
		Object obj;
		try {
			entityString = EntityUtils.toString(entity, "UTF-8");
			obj = parser.parse(entityString);
		} catch (IOException e) {
			throw new EMMIntegrationTestException("Error converting tokenDetails into a string", e);
		} catch (ParseException e) {
			throw new EMMIntegrationTestException("Error parsing tokenDetails into json", e);
		}

		JSONObject tokenDetails = (JSONObject)obj;
		return (String) tokenDetails.get("access_token");
	}
}
