package com.wso2mobile.mdm.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import android.content.Context;
import android.os.Environment;
import android.util.Log;

public class LoggerCustom {
	Context context;
	
	public LoggerCustom(Context context){
		this.context = context;
	}
	public void writeStringAsFile(final String fileContents, String fileName) {
        try {
            FileWriter out = new FileWriter(new File(Environment.getExternalStorageDirectory(), fileName));
            out.write(fileContents);
            out.close();
        } catch (IOException e) {
            Log.e("ERROR : ", e.toString());
        }
    }

    public String readFileAsString(String fileName) {
        StringBuilder stringBuilder = new StringBuilder();
        String line;
        BufferedReader in = null;
        
        try {
            in = new BufferedReader(new FileReader(new File(Environment.getExternalStorageDirectory(), fileName)));
            while ((line = in.readLine()) != null) stringBuilder.append(line);
            in.close();
        } catch (FileNotFoundException e) {
        	Log.e("FILE ERROR : ", e.toString());
        } catch (IOException e) {
        	Log.e("FILE ERROR : ", e.toString());
        } 
        
        return stringBuilder.toString();
    }
}
