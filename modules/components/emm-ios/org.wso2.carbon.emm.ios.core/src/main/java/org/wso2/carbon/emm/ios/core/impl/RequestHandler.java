package org.wso2.carbon.emm.ios.core.impl;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.security.KeyStore;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.jcajce.JcaCertStore;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.bouncycastle.cms.CMSAbsentContent;
import org.bouncycastle.cms.CMSAlgorithm;
import org.bouncycastle.cms.CMSEnvelopedData;
import org.bouncycastle.cms.CMSEnvelopedDataGenerator;
import org.bouncycastle.cms.CMSException;
import org.bouncycastle.cms.CMSProcessable;
import org.bouncycastle.cms.CMSProcessableByteArray;
import org.bouncycastle.cms.CMSSignedData;
import org.bouncycastle.cms.CMSSignedDataGenerator;
import org.bouncycastle.cms.CMSTypedData;
import org.bouncycastle.cms.SignerInformation;
import org.bouncycastle.cms.SignerInformationStore;
import org.bouncycastle.cms.jcajce.JcaSimpleSignerInfoVerifierBuilder;
import org.bouncycastle.cms.jcajce.JceCMSContentEncryptorBuilder;
import org.bouncycastle.cms.jcajce.JceKeyTransRecipientInfoGenerator;
import org.bouncycastle.operator.OperatorCreationException;
import org.bouncycastle.util.Store;
import org.wso2.carbon.emm.ios.core.exception.EMMException;
import org.wso2.carbon.emm.ios.core.plist.DeviceProperties;
import org.wso2.carbon.emm.ios.core.plist.PlistExtractor;
import org.wso2.carbon.emm.ios.core.plist.PlistGenerator;
import org.wso2.carbon.emm.ios.core.publisher.TokenPublisher;
import org.wso2.carbon.emm.ios.core.util.AppConfigurations;
import org.wso2.carbon.emm.ios.core.util.CertificateAttributes;

public class RequestHandler {

	public byte[] handleProfileRequest(InputStream inputStream, String tenant,
			String topicId, CertificateAttributes certAttributes)
			throws EMMException {

		try {
			CMSSignedData cms = new CMSSignedData(inputStream);
			Store store = cms.getCertificates();
			SignerInformationStore signers = cms.getSignerInfos();
			Collection<?> collectionSigners = signers.getSigners();

			Iterator<?> iterator = collectionSigners.iterator();
			while (iterator.hasNext()) {
				SignerInformation signer = (SignerInformation) iterator.next();
				Collection<?> certCollection = store
						.getMatches(signer.getSID());
				Iterator<?> certIt = certCollection.iterator();
				X509CertificateHolder certHolder = (X509CertificateHolder) certIt
						.next();
				X509Certificate cert = new JcaX509CertificateConverter()
						.setProvider(AppConfigurations.PROVIDER)
						.getCertificate(certHolder);

				// verifies the signer
				if (signer.verify(new JcaSimpleSignerInfoVerifierBuilder()
						.setProvider(AppConfigurations.PROVIDER).build(cert))) {

					KeystoreReader keystoreReader = new KeystoreReader();
					X509Certificate caCertificate = (X509Certificate) keystoreReader
							.getCACertificate();

					JcaX509CertificateHolder jcaX509CertificateHolder = new JcaX509CertificateHolder(
							caCertificate);
					X500Name x500name = jcaX509CertificateHolder.getSubject();

					PlistGenerator plistGenerator = new PlistGenerator();
					PKCSSigner pkcsSigner = new PKCSSigner();
					KeyStore keyStore = pkcsSigner.loadKeyStore();
					CMSSignedDataGenerator signedDataGenerator = pkcsSigner
							.setUpProvider(keyStore);
					byte[] signedData = null;

					// extract content
					CMSProcessable cmsProcessable = cms.getSignedContent();
					String contentString;

					try {
						contentString = new String(
								(byte[]) cmsProcessable.getContent(),
								AppConfigurations.UTF8);
					} catch (UnsupportedEncodingException e) {
						throw new EMMException("Unsupported encoding "
								+ e.getMessage());
					}

					PlistExtractor plistExtractor = new PlistExtractor();
					DeviceProperties deviceProperties = plistExtractor
							.extractDeviceProperties(contentString);

					if (signer.getSID().getIssuer().equals(x500name)) {

						/*
						 * By this point, any previously fully enrolled clients
						 * have been redirected to the enrollment page to enroll
						 * again. Implement that.
						 * 
						 * Profile execution phase 1
						 */

						// For now send the udid here. Register a listener
						// later.
						String mdmConfigurationPayload = plistGenerator
								.generateMDMConfigurationPayload(
										deviceProperties.getUdid(), tenant,
										topicId, certAttributes);

						CMSTypedData msg;
						try {
							msg = new CMSProcessableByteArray(
									mdmConfigurationPayload
											.getBytes(AppConfigurations.UTF8));
						} catch (UnsupportedEncodingException e) {
							throw new EMMException("Unsupported encoding "
									+ e.getMessage());
						}
						CMSEnvelopedDataGenerator edGen = new CMSEnvelopedDataGenerator();
						edGen.addRecipientInfoGenerator(new JceKeyTransRecipientInfoGenerator(
								cert).setProvider(AppConfigurations.PROVIDER));
						CMSEnvelopedData envelopedData = edGen.generate(
								msg,
								new JceCMSContentEncryptorBuilder(
										CMSAlgorithm.DES_EDE3_CBC).setProvider(
										AppConfigurations.PROVIDER).build());

						// CommonUtil commonUtil = new CommonUtil();
						// String pkcs7EnvelopedData = new String(
						// commonUtil.convertDERtoPEM(
						// envelopedData.getEncoded(), "pkcs7"),
						// "UTF-8");

						String encryptedConfigurationPayload;
						try {
							encryptedConfigurationPayload = plistGenerator
									.generateEncryptedConfigurationPayload(
											new String(Base64
													.encodeBase64(envelopedData
															.getEncoded()),
													AppConfigurations.UTF8),
											tenant);
						} catch (UnsupportedEncodingException e) {
							throw new EMMException("Unsupported encoding "
									+ e.getMessage());
						} catch (IOException e) {
							throw new EMMException("IO exception "
									+ e.getMessage());
						}

						signedData = pkcsSigner.signPkcs(
								encryptedConfigurationPayload.getBytes(),
								signedDataGenerator);

					} else {

						/*
						 * 
						 * Profile execution phase 2
						 */

						String encryptionCertificatePayload = plistGenerator
								.generateEncryptionCertificatePayload(
										deviceProperties.getChallenge(),
										tenant, certAttributes);
						signedData = pkcsSigner.signPkcs(
								encryptionCertificatePayload.getBytes(),
								signedDataGenerator);

						TokenPublisher tokenPublisher = new TokenPublisher();
						int result = tokenPublisher
								.publishiOSTokens(deviceProperties);

					}

					return signedData;
				}
			}

		} catch (OperatorCreationException e) {
			throw new EMMException("OperatorCreationException " + e.getMessage());
		} catch (CertificateException e) {
			throw new EMMException("CertificateException " + e.getMessage());
		} catch (CMSException e) {
			throw new EMMException("CMSException " + e.getMessage());
		}

		return null;
	}

	public SCEPResponse scepGetCACert() throws EMMException {

		SCEPResponse scepResponse = new SCEPResponse();

		try {
			KeystoreReader keystoreReader = new KeystoreReader();

			byte[] caBytes = keystoreReader.getCACertificate().getEncoded();
			byte[] raBytes = keystoreReader.getRACertificate().getEncoded();

			CertificateGenerator caImpl = new CertificateGenerator();
			final List<X509Certificate> certs = caImpl.getCA_RACertificates(
					caBytes, raBytes);

			byte[] bytes = null;

			if (certs.size() == 0) {
				scepResponse.setResultCriteria(CAStatus.CA_CERT_FAILED);
				bytes = new byte[0];
			} else if (certs.size() == 1) {
				scepResponse.setResultCriteria(CAStatus.CA_CERT_RECEIVED);

				try {
					bytes = certs.get(0).getEncoded();
				} catch (CertificateEncodingException e) {
					e.printStackTrace();
				}

			} else {
				scepResponse.setResultCriteria(CAStatus.CA_RA_CERT_RECEIVED);

				CMSSignedDataGenerator generator = new CMSSignedDataGenerator();
				JcaCertStore store = null;

				store = new JcaCertStore(certs);
				generator.addCertificates(store);
				CMSSignedData degenerateSd = generator
						.generate(new CMSAbsentContent());
				bytes = degenerateSd.getEncoded();

			}

			scepResponse.setEncodedResponse(bytes);
		} catch (Exception e) {
			throw new EMMException(
					"Error occurred when retrieving CA certificate "
							+ e.getMessage());
		}

		return scepResponse;
	}

	public String getChallengeTokenFromProfile(InputStream inputStream)
			throws EMMException {

		try {
			CMSSignedData cms = new CMSSignedData(inputStream);
			CMSProcessable cmsProcessable = cms.getSignedContent();
			String contentString = new String(
					(byte[]) cmsProcessable.getContent(),
					AppConfigurations.UTF8);

			PlistExtractor plistExtractor = new PlistExtractor();
			DeviceProperties deviceProperties = plistExtractor
					.extractDeviceProperties(contentString);

			return deviceProperties.getChallenge();

		} catch (CMSException e) {
			throw new EMMException("CMS exception " + e.getMessage());
		} catch (UnsupportedEncodingException e) {
			throw new EMMException("Unsupported encoding exception"
					+ e.getMessage());
		}
	}

	public byte[] scepGetCACaps() {
		return AppConfigurations.POST_BODY_CA_CAPS.getBytes();
	}

}
