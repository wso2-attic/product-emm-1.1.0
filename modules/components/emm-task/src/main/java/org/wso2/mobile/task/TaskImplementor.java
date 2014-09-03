package org.wso2.mobile.task;/*
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

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.xmlbeans.SystemProperties;
import org.wso2.carbon.ntask.core.Task;
import org.wso2.mobile.task.utils.EMMTaskConfig;

import java.io.IOException;
import java.util.Map;


public class TaskImplementor implements Task {

    /*
      This function will call https call to the device monitor api
    */
    @Override
    public void execute() {
        // TODO Auto-generated method stub
        GetMethod getMethod = null;
        try {
            String host = SystemProperties.getProperty(EMMTaskConfig.SERVER_HOST);
            String ip = SystemProperties.getProperty(EMMTaskConfig.CARBON_LOCAL_IP);
            String port = SystemProperties.getProperty(EMMTaskConfig.MGT_TRANSPORT_HTTPS_PROXYPORT);
            if (port == null)
                port = SystemProperties.getProperty(EMMTaskConfig.MGT_TRANSPORT_HTTPS_PORT);
            String postUrl = "";
            if (host == null || host == EMMTaskConfig.LOCALHOST) {
                postUrl = EMMTaskConfig.HTTPS + ip + ":" + port;
            } else {
                postUrl = EMMTaskConfig.HTTPS + host + ":" + port;
            }

            getMethod = new GetMethod(postUrl + EMMTaskConfig.MONITOR_URL);
            final HttpClient httpClient = new HttpClient();
            getMethod.addRequestHeader(EMMTaskConfig.CONTENT_TYPE, EMMTaskConfig.APPLICATION_JSON);
            httpClient.executeMethod(getMethod);
        } catch (HttpException e) {
            // TODO Auto-generated catch block
            //e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            getMethod.releaseConnection();
        }
    }

    @Override
    public void setProperties(Map<String, String> properties) {
        // TODO Auto-generated method stub

    }

    @Override
    public void init() {
        // TODO Auto-generated method stub

    }
}
