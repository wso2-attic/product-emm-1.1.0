package org.wso2.carbon.emm.ios.apns.exception;

public class APNSException extends Exception {

	private static final long serialVersionUID = 4428561477778946321L;

	public APNSException(String errorMessage) {
		super(errorMessage);
	}
}
