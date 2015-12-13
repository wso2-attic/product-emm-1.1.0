package org.wso2.carbon.emm.ios.core.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;

import org.apache.commons.codec.binary.Base64;
import org.bouncycastle.cms.CMSException;
import org.bouncycastle.cms.CMSProcessable;
import org.bouncycastle.cms.CMSSignedData;
import org.wso2.carbon.emm.ios.core.exception.EMMException;
import org.wso2.carbon.emm.ios.core.plist.DeviceProperties;
import org.wso2.carbon.emm.ios.core.plist.PlistExtractor;

public class CommonUtil {

	public byte[] convertDERtoPEM(byte[] bytes, String headfoot) {

		ByteArrayOutputStream pemStream = new ByteArrayOutputStream();
		PrintWriter writer = new PrintWriter(pemStream);

		byte[] stringBytes = Base64.encodeBase64(bytes);

		String encoded = new String(stringBytes);

		if (headfoot != null) {
			writer.print("-----BEGIN" + headfoot + "-----\n");
		}

		// write 64 chars per line till done
		int i = 0;
		while ((i + 1) * 64 < encoded.length()) {
			writer.print(encoded.substring(i * 64, (i + 1) * 64));
			writer.print("\n");
			i++;
		}
		if (encoded.length() % 64 != 0) {
			writer.print(encoded.substring(i * 64)); // write remainder
			writer.print("\n");
		}
		if (headfoot != null) {
			writer.print("-----END" + headfoot + "-----\n");
		}

		writer.flush();

		return pemStream.toByteArray();
	}

	public ProfileResponse copyInputStream(InputStream inputStream)
			throws EMMException {

		ByteArrayOutputStream newStream = new ByteArrayOutputStream();
		byte[] buf = new byte[4096];

		try {
			for (int n; 0 < (n = inputStream.read(buf));) {
				newStream.write(buf, 0, n);
			}
			newStream.close();
		} catch (IOException e) {
			throw new EMMException("IOException " + e.getMessage());
		}

		byte[] data = newStream.toByteArray();
		String[] devicesInfo = this
				.getDeviceUDIDFromProfile(new ByteArrayInputStream(data));

		// This is the new stream that you can pass it to other code and use its
		// data.
		ByteArrayInputStream newInputStream = new ByteArrayInputStream(data);
		ProfileResponse profileResponse = new ProfileResponse();
		profileResponse.setInputStream(newInputStream);
		profileResponse.setUdid(devicesInfo[0]);
		profileResponse.setChallengeToken(devicesInfo[1]);

		return profileResponse;
	}

	public String[] getDeviceUDIDFromProfile(InputStream inputStream)
			throws EMMException {

		try {
			String[] devicesInfo = new String[2];
			CMSSignedData cms = new CMSSignedData(inputStream);
			CMSProcessable cmsProcessable = cms.getSignedContent();
			String contentString = new String(
					(byte[]) cmsProcessable.getContent(),
					AppConfigurations.UTF8);
			PlistExtractor plistExtractor = new PlistExtractor();
			DeviceProperties deviceProperties = plistExtractor
					.extractDeviceProperties(contentString);
			devicesInfo[0] = deviceProperties.getUdid();
			devicesInfo[1] = deviceProperties.getChallenge();
			return devicesInfo;

		} catch (CMSException e) {
			throw new EMMException("CMS exception " + e.getMessage());
		} catch (UnsupportedEncodingException e) {
			throw new EMMException("Unsupported encoding exception "
					+ e.getMessage());
		}
	}

}
