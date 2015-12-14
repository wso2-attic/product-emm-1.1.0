package org.wso2.carbon.emm.ios.core.impl;

import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.SecureRandom;
import java.security.Security;
import java.security.SignatureException;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.CertificateExpiredException;
import java.security.cert.CertificateFactory;
import java.security.cert.CertificateNotYetValidException;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.security.auth.x500.X500Principal;

import org.apache.commons.codec.binary.Base64;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.KeyUsage;
import org.bouncycastle.asn1.x509.X509Extension;
import org.bouncycastle.cert.CertIOException;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaCertStore;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.cms.CMSAbsentContent;
import org.bouncycastle.cms.CMSException;
import org.bouncycastle.cms.CMSSignedData;
import org.bouncycastle.cms.CMSSignedDataGenerator;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.OperatorCreationException;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.bouncycastle.util.Store;
import org.jscep.message.CertRep;
import org.jscep.message.PkcsPkiEnvelopeDecoder;
import org.jscep.message.PkcsPkiEnvelopeEncoder;
import org.jscep.message.PkiMessage;
import org.jscep.message.PkiMessageDecoder;
import org.jscep.message.PkiMessageEncoder;
import org.jscep.transaction.FailInfo;
import org.jscep.transaction.Nonce;
import org.jscep.transaction.TransactionId;
import org.wso2.carbon.emm.ios.core.exception.EMMException;
import org.wso2.carbon.emm.ios.core.util.AppConfigurations;

public class CertificateGenerator {

	public List<X509Certificate> getCA_RACertificates(byte[] ca, byte[] ra)
			throws EMMException {

		List<X509Certificate> certificateList = new ArrayList<X509Certificate>();
		try {
			CertificateFactory certificateFactory = CertificateFactory
					.getInstance(AppConfigurations.X_509);
			InputStream caInputStream = new ByteArrayInputStream(ca);
			InputStream raInputStream = new ByteArrayInputStream(ra);

			X509Certificate caCert = (X509Certificate) certificateFactory
					.generateCertificate(caInputStream);
			X509Certificate raCert = (X509Certificate) certificateFactory
					.generateCertificate(raInputStream);

			certificateList.add(caCert);
			certificateList.add(raCert);
		} catch (CertificateException e) {
			throw new EMMException("Issue in certificate " + e.getMessage());
		}

		return certificateList;
	}

	public X509Certificate generateX509Certificate() throws EMMException {

		Date targetDate1 = new Date();
		Calendar calendar1 = Calendar.getInstance();
		calendar1.setTime(targetDate1);
		calendar1.add(Calendar.DATE, -1);

		Date targetDate2 = new Date();
		Calendar calendar2 = Calendar.getInstance();
		calendar2.setTime(targetDate2);
		calendar2.add(Calendar.YEAR, 2);

		// yesterday
		Date validityBeginDate = new Date(targetDate1.getTime());
		// in 2 years
		Date validityEndDate = new Date(targetDate2.getTime());

		Security.addProvider(new BouncyCastleProvider());

		try {
			KeyPairGenerator kpGen = KeyPairGenerator.getInstance(
					AppConfigurations.RSA, AppConfigurations.PROVIDER);
			kpGen.initialize(1024, new SecureRandom());
			KeyPair pair = kpGen.generateKeyPair();

			// Generate self-signed certificate
			X500Principal principal = new X500Principal(
					"O=WSO2, OU=Mobile, C=LK");

			BigInteger serial = BigInteger.valueOf(System.currentTimeMillis());

			X509v3CertificateBuilder certGen = new JcaX509v3CertificateBuilder(
					principal, serial, validityBeginDate, validityEndDate,
					principal, pair.getPublic());
			ContentSigner sigGen;

			sigGen = new JcaContentSignerBuilder(AppConfigurations.SHA256_RSA)
					.setProvider(AppConfigurations.PROVIDER).build(
							pair.getPrivate());
			X509Certificate cert = new JcaX509CertificateConverter()
					.setProvider(AppConfigurations.PROVIDER).getCertificate(
							certGen.build(sigGen));

			// cert.checkValidity();

			cert.verify(cert.getPublicKey());

			return cert;

		} catch (NoSuchAlgorithmException e) {
			throw new EMMException("No such algorithm " + e.getMessage());
		} catch (NoSuchProviderException e) {
			throw new EMMException("No such provider " + e.getMessage());
		} catch (OperatorCreationException e) {
			throw new EMMException("Issue in operator creation"
					+ e.getMessage());
		} catch (CertificateExpiredException e) {
			throw new EMMException("Certificate expired " + e.getMessage());
		} catch (CertificateNotYetValidException e) {
			throw new EMMException("Certificate not yet valid "
					+ e.getMessage());
		} catch (CertificateException e) {
			throw new EMMException("Issue in certificate " + e.getMessage());
		} catch (InvalidKeyException e) {
			throw new EMMException("Invalid key " + e.getMessage());
		} catch (SignatureException e) {
			throw new EMMException("Issue in signature " + e.getMessage());
		}
	}

	public byte[] getPKIMessage(InputStream inputStream) throws EMMException {

		try {
			CMSSignedData sd = new CMSSignedData(inputStream);
			Store reqStore = sd.getCertificates();
			@SuppressWarnings("unchecked")
			Collection<X509CertificateHolder> reqCerts = reqStore
					.getMatches(null);

			KeystoreReader keystoreReader = new KeystoreReader();

			PrivateKey privateKeyRA = keystoreReader.getRAPrivateKey();
			PrivateKey privateKeyCA = keystoreReader.getCAPrivateKey();
			X509Certificate certRA = (X509Certificate) keystoreReader
					.getRACertificate();
			X509Certificate certCA = (X509Certificate) keystoreReader
					.getCACertificate();

			CertificateFactory factory = CertificateFactory
					.getInstance(AppConfigurations.X_509);
			X509CertificateHolder holder = reqCerts.iterator().next();
			ByteArrayInputStream bais = new ByteArrayInputStream(
					holder.getEncoded());
			X509Certificate reqCert = (X509Certificate) factory
					.generateCertificate(bais);

			PkcsPkiEnvelopeDecoder envDecoder = new PkcsPkiEnvelopeDecoder(
					certRA, privateKeyRA);
			PkiMessageDecoder decoder = new PkiMessageDecoder(reqCert,
					envDecoder);
			PkiMessage<?> msg = decoder.decode(sd);

			// MessageType msgType = msg.getMessageType();
			Object msgData = msg.getMessageData();

			Nonce senderNonce = Nonce.nextNonce();
			TransactionId transId = msg.getTransactionId();
			Nonce recipientNonce = msg.getSenderNonce();
			CertRep certRep;

			PKCS10CertificationRequest certRequest = (PKCS10CertificationRequest) msgData;
			X509Certificate generatedCert = generateCertificateFromCSR(
					privateKeyCA, certRequest, certCA.getIssuerX500Principal()
							.getName());

			List<X509Certificate> issued = new ArrayList<X509Certificate>();
			issued.add(generatedCert);

			if (issued.size() == 0) {
				certRep = new CertRep(transId, senderNonce, recipientNonce,
						FailInfo.badCertId);
			} else {
				CMSSignedData messageData = getMessageData(issued);

				certRep = new CertRep(transId, senderNonce, recipientNonce,
						messageData);
			}

			PkcsPkiEnvelopeEncoder envEncoder = new PkcsPkiEnvelopeEncoder(
					reqCert, AppConfigurations.DES_EDE);
			PkiMessageEncoder encoder = new PkiMessageEncoder(privateKeyRA,
					certRA, envEncoder);
			CMSSignedData signedData = encoder.encode(certRep);

			return signedData.getEncoded();

		} catch (Exception e) {
			throw new EMMException("Error occurred in PKIMessage "
					+ e.getMessage());
		}
	}

	public static X509Certificate generateCertificateFromCSR(
			PrivateKey privateKey, PKCS10CertificationRequest request,
			String issueSubject) throws EMMException {

		Calendar targetDate1 = Calendar.getInstance();
		targetDate1.setTime(new Date());
		targetDate1.add(Calendar.DAY_OF_MONTH, -1);

		Calendar targetDate2 = Calendar.getInstance();
		targetDate2.setTime(new Date());
		targetDate2.add(Calendar.YEAR, 100);

		// yesterday
		Date validityBeginDate = targetDate1.getTime();
		// in 2 years
		Date validityEndDate = targetDate2.getTime();

		X509v3CertificateBuilder certGen = new X509v3CertificateBuilder(
				new X500Name(issueSubject), BigInteger.valueOf(System
						.currentTimeMillis()), validityBeginDate,
				validityEndDate, request.getSubject(),
				request.getSubjectPublicKeyInfo());
		ContentSigner sigGen;
		X509Certificate issuedCert;

		try {
			certGen.addExtension(X509Extension.keyUsage, true, new KeyUsage(
					KeyUsage.digitalSignature | KeyUsage.keyEncipherment));
			sigGen = new JcaContentSignerBuilder(AppConfigurations.SHA256_RSA)
					.setProvider(AppConfigurations.PROVIDER).build(privateKey);
			issuedCert = new JcaX509CertificateConverter().setProvider(
					AppConfigurations.PROVIDER).getCertificate(
					certGen.build(sigGen));
		} catch (CertIOException e) {
			throw new EMMException("Certificate IO exception " + e.getMessage());
		} catch (OperatorCreationException e) {
			throw new EMMException("Issue in operator creation"
					+ e.getMessage());
		} catch (CertificateException e) {
			throw new EMMException("Issue in certificate " + e.getMessage());
		}

		return issuedCert;
	}

	private CMSSignedData getMessageData(final List<X509Certificate> certs)
			throws EMMException {

		CMSSignedDataGenerator generator = new CMSSignedDataGenerator();
		JcaCertStore store = null;

		try {
			store = new JcaCertStore(certs);
			generator.addCertificates(store);

			return generator.generate(new CMSAbsentContent());
		} catch (CertificateEncodingException e) {
			throw new EMMException("Certificate encoding exception "
					+ e.getMessage());
		} catch (CMSException e) {
			throw new EMMException("CMS exception " + e.getMessage());
		}
	}

	public PrivateKey getSignerKey(String signerPrivateKeyPath)
			throws EMMException {

		File file = new File(signerPrivateKeyPath);
		FileInputStream fis;

		try {
			fis = new FileInputStream(file);
			DataInputStream dis = new DataInputStream(fis);
			byte[] keyBytes = new byte[(int) file.length()];
			dis.readFully(keyBytes);
			dis.close();

			String temp = new String(keyBytes);
			String privKeyPEM = temp.replace(
					"-----BEGIN RSA PRIVATE KEY-----\n", "");
			privKeyPEM = privKeyPEM
					.replace("-----END RSA PRIVATE KEY-----", "");

			byte[] decoded = Base64.decodeBase64(privKeyPEM);

			PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
			KeyFactory kf = KeyFactory.getInstance(AppConfigurations.RSA);

			return kf.generatePrivate(spec);
		} catch (FileNotFoundException e) {
			throw new EMMException("File not found " + e.getMessage());
		} catch (IOException e) {
			throw new EMMException("IO exception " + e.getMessage());
		} catch (NoSuchAlgorithmException e) {
			throw new EMMException("No such algorithm " + e.getMessage());
		} catch (InvalidKeySpecException e) {
			throw new EMMException("Invalid key " + e.getMessage());
		}

	}

	public X509Certificate getSigner(String signerCertificatePath)
			throws EMMException {

		X509Certificate cert = null;
		try {
			CertificateFactory cf = CertificateFactory
					.getInstance(AppConfigurations.X_509);
			cert = (X509Certificate) cf
					.generateCertificate(new FileInputStream(
							signerCertificatePath));

			return cert;
		} catch (CertificateException e) {
			throw new EMMException("Issue in certificate " + e.getMessage());
		} catch (FileNotFoundException e) {
			throw new EMMException("File not found " + e.getMessage());
		}
	}

}