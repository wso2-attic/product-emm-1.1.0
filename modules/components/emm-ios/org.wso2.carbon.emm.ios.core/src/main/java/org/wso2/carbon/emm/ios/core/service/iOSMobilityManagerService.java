/*
 * 		Copyright 2005-2014 WSO2, Inc. (http://wso2.com)
 *
 *      Licensed under the Apache License, Version 2.0 (the "License");
 *      you may not use this file except in compliance with the License.
 *      You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 */

package org.wso2.carbon.emm.ios.core.service;

import java.io.InputStream;
import java.security.cert.Certificate;

import org.wso2.carbon.emm.ios.core.exception.EMMException;
import org.wso2.carbon.emm.ios.core.impl.CertificateGenerator;
import org.wso2.carbon.emm.ios.core.impl.KeystoreReader;
import org.wso2.carbon.emm.ios.core.impl.PKCSSigner;
import org.wso2.carbon.emm.ios.core.impl.RequestHandler;
import org.wso2.carbon.emm.ios.core.impl.SCEPResponse;
import org.wso2.carbon.emm.ios.core.plist.APNSStatus;
import org.wso2.carbon.emm.ios.core.plist.CheckinMessageType;
import org.wso2.carbon.emm.ios.core.plist.PlistExtractor;
import org.wso2.carbon.emm.ios.core.plist.PlistGenerator;
import org.wso2.carbon.emm.ios.core.util.CertificateAttributes;
import org.wso2.carbon.emm.ios.core.util.CommonUtil;
import org.wso2.carbon.emm.ios.core.util.ProfileResponse;

public class iOSMobilityManagerService {

	private static iOSMobilityManagerService mobilityManagerService;
	private static KeystoreReader keystoreReader;

	public static iOSMobilityManagerService getInstance() {
		if (mobilityManagerService == null) {
			mobilityManagerService = new iOSMobilityManagerService();
			keystoreReader = new KeystoreReader();
		}
		return mobilityManagerService;
	}

	public Certificate getCACertificate() throws EMMException {
		return keystoreReader.getCACertificate();
	}

	public Certificate getRACertificate() throws EMMException {
		return keystoreReader.getRACertificate();
	}

	public String generateMobileConfigurations(String challengeToken,
			String tenantName) throws EMMException {
		PlistGenerator plistGenerator = new PlistGenerator();
		return plistGenerator.generateMobileConfigurations(challengeToken,
				tenantName);
	}

	public byte[] handleProfileRequest(InputStream inputStream, String tenant,
			String topicId, CertificateAttributes certAttributes)
			throws EMMException {
		RequestHandler requestHandler = new RequestHandler();
		return requestHandler.handleProfileRequest(inputStream, tenant,
				topicId, certAttributes);
	}

	public SCEPResponse scepGetCACert() throws EMMException {
		RequestHandler requestHandler = new RequestHandler();
		return requestHandler.scepGetCACert();
	}

	public byte[] scepGetCACaps() {
		RequestHandler requestHandler = new RequestHandler();
		return requestHandler.scepGetCACaps();
	}

	public byte[] getPKIMessage(InputStream inputStream) throws EMMException {
		CertificateGenerator certificateGenerator = new CertificateGenerator();
		return certificateGenerator.getPKIMessage(inputStream);
	}

	public CheckinMessageType extractTokens(String xmlProperties)
			throws EMMException {
		PlistExtractor plistExtractor = new PlistExtractor();
		return plistExtractor.extractTokens(xmlProperties);
	}

	public APNSStatus extractAPNSResponse(String xmlProperties)
			throws EMMException {
		PlistExtractor plistExtractor = new PlistExtractor();
		return plistExtractor.extractAPNSResponse(xmlProperties);
	}

	public byte[] getSignedData(byte[] input) throws EMMException {
		PKCSSigner pkcsSigner = new PKCSSigner();
		return pkcsSigner.getSignedData(input);
	}

	public ProfileResponse copyInputStream(InputStream inputStream)
			throws EMMException {
		CommonUtil commonUtil = new CommonUtil();
		return commonUtil.copyInputStream(inputStream);
	}
}
