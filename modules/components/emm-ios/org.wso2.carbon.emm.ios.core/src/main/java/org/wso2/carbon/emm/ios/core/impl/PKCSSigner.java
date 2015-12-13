package org.wso2.carbon.emm.ios.core.impl;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.Security;
import java.security.UnrecoverableKeyException;
import java.security.cert.Certificate;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;

import org.bouncycastle.cert.jcajce.JcaCertStore;
import org.bouncycastle.cms.CMSException;
import org.bouncycastle.cms.CMSProcessableByteArray;
import org.bouncycastle.cms.CMSSignedData;
import org.bouncycastle.cms.CMSSignedDataGenerator;
import org.bouncycastle.cms.CMSTypedData;
import org.bouncycastle.cms.jcajce.JcaSignerInfoGeneratorBuilder;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.OperatorCreationException;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder;
import org.bouncycastle.util.Store;
import org.wso2.carbon.emm.ios.core.exception.EMMException;
import org.wso2.carbon.emm.ios.core.util.AppConfigurations;

public class PKCSSigner {

	static {
		Security.addProvider(new BouncyCastleProvider());
	}

	protected KeyStore loadKeyStore() throws EMMException {

		InputStream is = null;
		try {
			KeyStore keystore = KeyStore.getInstance(AppConfigurations
					.getConfigEntry(AppConfigurations.KEYSTORE));
			is = new FileInputStream(
					AppConfigurations
							.getConfigEntry(AppConfigurations.PATH_KEYSTORE));
			keystore.load(
					is,
					AppConfigurations.getConfigEntry(
							AppConfigurations.KEYSTORE_PASSWORD).toCharArray());

			return keystore;
		} catch (FileNotFoundException e) {
			throw new EMMException("Keystore not found");
		} catch (IOException e) {
			throw new EMMException("Error reading keystore");
		} catch (KeyStoreException e) {
			throw new EMMException("Keystore exception " + e.getMessage());
		} catch (NoSuchAlgorithmException e) {
			throw new EMMException("No such algorithm " + e.getMessage());
		} catch (CertificateException e) {
			throw new EMMException("Issue in certificate " + e.getMessage());
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
	}

	public CMSSignedDataGenerator setUpProvider(final KeyStore keystore)
			throws EMMException {

		CMSSignedDataGenerator generator;

		try {
			Certificate[] certchain = (Certificate[]) keystore
					.getCertificateChain(AppConfigurations
							.getConfigEntry(AppConfigurations.KEY_ALIAS_KEYSTORE));

			final List<Certificate> certlist = new ArrayList<Certificate>();

			for (int i = 0, length = certchain == null ? 0 : certchain.length; i < length; i++) {
				certlist.add(certchain[i]);
			}

			Store certstore = new JcaCertStore(certlist);

			Certificate cert = keystore.getCertificate(AppConfigurations
					.getConfigEntry(AppConfigurations.KEY_ALIAS_KEYSTORE));

			ContentSigner signer = new JcaContentSignerBuilder(
					AppConfigurations.SIGNATUREALGO)
					.setProvider(AppConfigurations.PROVIDER)
					.build((PrivateKey) (keystore.getKey(
							AppConfigurations
									.getConfigEntry(AppConfigurations.KEY_ALIAS_KEYSTORE),
							AppConfigurations.getConfigEntry(
									AppConfigurations.KEYSTORE_KEY_PASSWORD)
									.toCharArray())));

			generator = new CMSSignedDataGenerator();

			generator.addSignerInfoGenerator(new JcaSignerInfoGeneratorBuilder(
					new JcaDigestCalculatorProviderBuilder().setProvider(
							AppConfigurations.PROVIDER).build()).build(signer,
					(X509Certificate) cert));

			generator.addCertificates(certstore);

		} catch (KeyStoreException e) {
			throw new EMMException("Keystore exception " + e.getMessage());
		} catch (CertificateEncodingException e) {
			throw new EMMException("Certificate encoding exception "
					+ e.getMessage());
		} catch (UnrecoverableKeyException e) {
			throw new EMMException("Unrecoverable key " + e.getMessage());
		} catch (OperatorCreationException e) {
			throw new EMMException("Issue in operator creation"
					+ e.getMessage());
		} catch (NoSuchAlgorithmException e) {
			throw new EMMException("No such algorithm " + e.getMessage());
		} catch (CMSException e) {
			throw new EMMException("CMS exception " + e.getMessage());
		}

		return generator;
	}

	public byte[] signPkcs(final byte[] content,
			final CMSSignedDataGenerator generator) throws EMMException {

		try {
			CMSTypedData cmsdata = new CMSProcessableByteArray(content);
			CMSSignedData signeddata = generator.generate(cmsdata, true);

			return signeddata.getEncoded();
		} catch (CMSException e) {
			throw new EMMException("CMS exception " + e.getMessage());
		} catch (IOException e) {
			throw new EMMException("IO exception " + e.getMessage());
		}

	}

	public byte[] getSignedData(byte[] input) throws EMMException {

		byte[] signedData;
		try {
			KeyStore keyStore = loadKeyStore();
			CMSSignedDataGenerator signedDataGenerator = setUpProvider(keyStore);
			signedData = signPkcs(input, signedDataGenerator);
		} catch (Exception e) {
			throw new EMMException("Error when signing data " + e.getMessage());
		}

		return signedData;
	}

}
