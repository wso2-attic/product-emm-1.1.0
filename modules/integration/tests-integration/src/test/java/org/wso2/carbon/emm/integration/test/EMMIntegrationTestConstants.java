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

/**
 * Defines the constants used by all EMM integration tests.
 * @since 2015-01-08
 */
public final class EMMIntegrationTestConstants {
	public static final String OAUTH2_TOKEN_ENDPOINT =
			"http://localhost:9763/oauth2/token?grant_type=password&username=admin&password=admin";
	public static final String EMM_CONSOLE_HTTP_ENDPOINT =
			"http://localhost:9763/emm";
	public static final String CONSUMER_CREDENTIALS_ENDPOINT =
			"http://localhost:9763/emm/api/devices/clientkey?username=admin&password=admin";
	public static final String DEVICE_REGISTRATION_ENDPOINT =
			"http://localhost:9763/emm/api/devices/register/1.0.0";

	private EMMIntegrationTestConstants() {}
}
