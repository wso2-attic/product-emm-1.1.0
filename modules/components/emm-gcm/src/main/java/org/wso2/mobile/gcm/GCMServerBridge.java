/*
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

package org.wso2.mobile.gcm;
import com.google.android.gcm.server.*;
import java.io.IOException;

public class GCMServerBridge {
    private static String apiKey = "";

    public static void setApiKey(String key){
        apiKey = key;
    }

    public String sendDataViaGCM(String apiKey, String regId,String code,String token,String data,int minutes,String collapseKey){
        int seconds = 60;
        if(minutes!=0){
            seconds = minutes*60;
        }

        Sender sender = new Sender(apiKey);
        Message message = new Message.Builder().collapseKey(collapseKey).timeToLive(seconds).delayWhileIdle(false).addData("message",code).addData("token",token).addData("data",data).build();
        Result result = null;
        try {
            result = sender.send(message,regId, 5);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return result.toString();
    }

    public String sendDataViaGCM(String apiKey, String regId,String code,String token,String data,int minutes){
        int seconds = 60;
        if(minutes!=0){
            seconds = minutes*60;
        }

        Sender sender = new Sender(apiKey);
        Message message = new Message.Builder().timeToLive(seconds).delayWhileIdle(false).addData("message",code).addData("token",token).addData("data",data).build();
        Result result = null;
        try {
            result = sender.send(message,regId, 5);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return result.toString();
    }
}
