package org.wso2.carbon.emm.ios.core.plist;

public class CheckinMessageType {

	private String messageType;
	private String pushMagic;
	private String token;
	private String topic;
	private String udid;
	private String unlockToken;

	public String getMessageType() {
		return messageType;
	}

	public void setMessageType(String messageType) {
		this.messageType = messageType;
	}

	public String getPushMagic() {
		return pushMagic;
	}

	public void setPushMagic(String pushMagic) {
		this.pushMagic = pushMagic;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getTopic() {
		return topic;
	}

	public void setTopic(String topic) {
		this.topic = topic;
	}

	public String getUdid() {
		return udid;
	}

	public void setUdid(String udid) {
		this.udid = udid;
	}

	public String getUnlockToken() {
		return unlockToken;
	}

	public void setUnlockToken(String unlockToken) {
		this.unlockToken = unlockToken;
	}

}
