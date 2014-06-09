package org.wso2.mobile.task.utils;/*
 * Copyright (c) 2010, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.xmlbeans.SystemProperties;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class EMMTaskConfig {

    public static final String CONF_LOCATION = "conf.location";
    public static final String EMM_CONFIG_XML = "emm-config.xml";
    public static final String TASK_MANAGER_NAME = "Device-Monitoring";
    public static final String TASK_NAME = "Monitoring";
    public static final String SERVER_HOST = "server.host";
    public static final String CARBON_LOCAL_IP = "carbon.local.ip";
    public static final String MGT_TRANSPORT_HTTPS_PROXYPORT = "mgt.transport.https.proxyPort";
    public static final String MGT_TRANSPORT_HTTPS_PORT = "mgt.transport.https.port";
    public static final String LOCALHOST = "localhost";
    public static final String HTTPS = "https://";
    public static final String CONTENT_TYPE = "Content-Type";
    public static final String APPLICATION_JSON = "application/json";
    public static final String DEVICE_MONITOR_FREQUENCY = "DeviceMonitorFrequency";

    public static final String TASK_MONITOR_CLASS = "org.wso2.mobile.task.TaskImplementor";
    public static final String MONITOR_URL = "/emm/api/devices/monitor";

    private static EMMTaskConfig emmTaskConfig;
    private static Map<String, String> configMap;
    private static String[] configEntryNames = { DEVICE_MONITOR_FREQUENCY };

    private static final Log log = LogFactory.getLog(EMMTaskConfig.class);

    /*
      This function reads the EMM Config XML file
    */
    private static Map<String, String> readEMMConfigurationXML() {
        String confLocation = SystemProperties.getProperty(CONF_LOCATION) + File.separator + EMM_CONFIG_XML;

        if (emmTaskConfig == null || configMap == null) {
            emmTaskConfig = new EMMTaskConfig();
            configMap = new HashMap<String, String>();

            Document document = null;
            try {
                File fXmlFile = new File(confLocation);
                DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory
                        .newInstance();
                DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
                document = documentBuilder.parse(fXmlFile);
            } catch (Throwable e) {
                log.error(e.getMessage(), e);
                /* don't throw exception */
            }

            for (String configEntry : configEntryNames) {
                NodeList elements = document.getElementsByTagName(configEntry);
                if (elements != null && elements.getLength() > 0) {
                    configMap.put(configEntry, elements.item(0).getTextContent());
                }
            }
        }
        return configMap;
    }

    /*
      This function retrieves the value for the key in the EMM config XML file
    */
    public static String getConfigEntry(final String entry) {

        Map<String, String> configurationMap = readEMMConfigurationXML();
        String configValue = configurationMap.get(entry);
        if (configValue == null) {
            log.error("Configuration entry not available");
        }
        return configValue.trim();
    }
}
