package org.wso2.carbon.emm.ios.core.test;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.util.Enumeration;

import org.wso2.carbon.emm.ios.core.exception.EMMException;

public class KeyStoreAliasCheck {

	public void aliasCheck() throws Exception {

		KeyStore keyStore = loadKeyStore();

		// List the aliases
		Enumeration<String> enumeration = keyStore.aliases();
		for (; enumeration.hasMoreElements();) {
			String alias = (String) enumeration.nextElement();

			System.out.println("ALIAS : " + alias);

			// Does alias refer to a private key?
			boolean b = keyStore.isKeyEntry(alias);

			// Does alias refer to a trusted certificate?
			b = keyStore.isCertificateEntry(alias);

		}

		Certificate[] certchain = (Certificate[]) keyStore
				.getCertificateChain("wso2carbon");

		for (Certificate certificate : certchain) {
			System.out.println(certificate);
		}

	}

	protected KeyStore loadKeyStore() throws KeyStoreException,
			NoSuchAlgorithmException, CertificateException, IOException,
			EMMException {

		KeyStore keystore = KeyStore.getInstance("JKS");
		InputStream is = new FileInputStream(
				"E:/wso2mobile/alpha3_mdm_server_final/wso2mobileserver-1.0.0/repository/resources/security/wso2mobilemdm.jks");
		keystore.load(is, "wso2mobile".toCharArray());
		return keystore;

	}

	public static void main(String[] args) throws Exception {

		KeyStoreAliasCheck aliasCheck = new KeyStoreAliasCheck();
		aliasCheck.aliasCheck();
	}

}
