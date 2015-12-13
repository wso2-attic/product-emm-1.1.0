package org.wso2.carbon.emm.ios.core.util;

import java.io.InputStream;

public class ProfileResponse {

	private InputStream inputStream;
	private String udid;
	private String challengeToken;

	public InputStream getInputStream() {
		return inputStream;
	}

	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}

	public String getUdid() {
		return udid;
	}

	public void setUdid(String udid) {
		this.udid = udid;
	}

	public String getChallengeToken() {
		return challengeToken;
	}

	public void setChallengeToken(String challengeToken) {
		this.challengeToken = challengeToken;
	}

}
