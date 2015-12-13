package org.wso2.carbon.emm.ios.core.impl;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.UnrecoverableKeyException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;

import org.wso2.carbon.emm.ios.core.exception.EMMException;
import org.wso2.carbon.emm.ios.core.util.AppConfigurations;

public class KeystoreReader {

	private KeyStore loadKeyStore() throws EMMException {

		InputStream is = null;
		KeyStore keystore;

		try {
			keystore = KeyStore.getInstance(AppConfigurations
					.getConfigEntry(AppConfigurations.EMM_KEYSTORE));
			is = new FileInputStream(
					AppConfigurations
							.getConfigEntry(AppConfigurations.PATH_EMM_KEYSTORE));
			keystore.load(
					is,
					AppConfigurations.getConfigEntry(
							AppConfigurations.EMM_KEYSTORE_PASSWORD)
							.toCharArray());

		} catch (KeyStoreException e) {
			throw new EMMException("Keystore exception " + e.getMessage());
		} catch (FileNotFoundException e) {
			throw new EMMException("Keystore not found " + e.getMessage());
		} catch (NoSuchAlgorithmException e) {
			throw new EMMException("No such algorithm " + e.getMessage());
		} catch (CertificateException e) {
			throw new EMMException("Issue in certificate " + e.getMessage());
		} catch (IOException e) {
			throw new EMMException("Error reading keystore " + e.getMessage());
		} finally {
			try {
				if(is != null) {
					is.close();
				}
			} catch (IOException e) {
				throw new EMMException("Error closing keystore input stream "
						+ e.getMessage());
			}
		}

		return keystore;

	}

	public Certificate getCACertificate() throws EMMException {

		KeyStore keystore = loadKeyStore();
		Certificate caCertificate;

		try {
			caCertificate = keystore.getCertificate(AppConfigurations
					.getConfigEntry(AppConfigurations.CA_CERT_ALIAS));
		} catch (KeyStoreException e) {
			throw new EMMException("Keystore exception " + e.getMessage());
		}

		if (caCertificate == null) {
			throw new EMMException("CA certificate not found in keystore");
		}

		return caCertificate;
	}

	protected PrivateKey getCAPrivateKey() throws EMMException {

		KeyStore keystore = loadKeyStore();
		PrivateKey caPrivateKey;
		try {
			caPrivateKey = (PrivateKey) (keystore.getKey(
					AppConfigurations
							.getConfigEntry(AppConfigurations.CA_CERT_ALIAS),
					AppConfigurations.getConfigEntry(
							AppConfigurations.KEYSTORE_CA_CERT_PRIV_PASSWORD)
							.toCharArray()));
		} catch (UnrecoverableKeyException e) {
			throw new EMMException("Unrecoverable CA private key "
					+ e.getMessage());
		} catch (KeyStoreException e) {
			throw new EMMException("Keystore exception " + e.getMessage());
		} catch (NoSuchAlgorithmException e) {
			throw new EMMException("No such algorithm " + e.getMessage());
		}

		if (caPrivateKey == null) {
			throw new EMMException("CA private key not found in keystore");
		}

		return caPrivateKey;
	}

	public Certificate getRACertificate() throws EMMException {

		KeyStore keystore = loadKeyStore();
		Certificate raCertificate;
		try {
			raCertificate = keystore.getCertificate(AppConfigurations
					.getConfigEntry(AppConfigurations.RA_CERT_ALIAS));
		} catch (KeyStoreException e) {
			throw new EMMException("Keystore exception " + e.getMessage());
		}

		if (raCertificate == null) {
			throw new EMMException("RA certificate not found in keystore");
		}

		return raCertificate;
	}

	protected PrivateKey getRAPrivateKey() throws EMMException {

		KeyStore keystore = loadKeyStore();
		PrivateKey raPrivateKey;
		try {
			raPrivateKey = (PrivateKey) (keystore.getKey(
					AppConfigurations
							.getConfigEntry(AppConfigurations.RA_CERT_ALIAS),
					AppConfigurations.getConfigEntry(
							AppConfigurations.KEYSTORE_RA_CERT_PRIV_PASSWORD)
							.toCharArray()));
		} catch (UnrecoverableKeyException e) {
			throw new EMMException("Unrecoverable CA private key "
					+ e.getMessage());
		} catch (KeyStoreException e) {
			throw new EMMException("Keystore exception " + e.getMessage());
		} catch (NoSuchAlgorithmException e) {
			throw new EMMException("No such algorithm " + e.getMessage());
		}

		if (raPrivateKey == null) {
			throw new EMMException("RA private key not found in keystore");
		}

		return raPrivateKey;
	}
}
