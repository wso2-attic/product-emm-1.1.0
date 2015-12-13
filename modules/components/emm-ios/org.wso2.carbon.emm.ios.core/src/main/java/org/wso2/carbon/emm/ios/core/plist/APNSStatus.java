package org.wso2.carbon.emm.ios.core.plist;

public class APNSStatus {

	private String status;
	private String udid;
	private String operation;
	private String responseData;
	private String commandUUID;
	private String state;
	private String error;

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getUdid() {
		return udid;
	}

	public void setUdid(String udid) {
		this.udid = udid;
	}

	public String getOperation() {
		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;
	}

	public String getResponseData() {
		return responseData;
	}

	public void setResponseData(String responseData) {
		this.responseData = responseData;
	}

	public String getCommandUUID() {
		return commandUUID;
	}

	public void setCommandUUID(String commandUUID) {
		this.commandUUID = commandUUID;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

}
