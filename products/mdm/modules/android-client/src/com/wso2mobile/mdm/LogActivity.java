package com.wso2mobile.mdm;

import com.wso2mobile.mdm.utils.LoggerCustom;

import android.os.Bundle;
import android.app.Activity;
import android.text.Html;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TextView;

public class LogActivity extends Activity {
	TextView txtLog;
	Button btnRefresh, btnReset;
	LoggerCustom logger = null;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_log);
		txtLog = (TextView)findViewById(R.id.txtLog);
		btnRefresh = (Button)findViewById(R.id.btnRefresh);
		btnReset = (Button)findViewById(R.id.btnReset);
		logger = new LoggerCustom(this);
		String log_in = logger.readFileAsString("wso2log.txt");
		
		txtLog.setText(Html.fromHtml(log_in));
		
		btnRefresh.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				// TODO Auto-generated method stub
				String log_in = logger.readFileAsString("wso2log.txt");
				
				txtLog.setText(Html.fromHtml(log_in));
			}
		});
		
		btnReset.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				// TODO Auto-generated method stub
				logger.writeStringAsFile("", "wso2log.txt");
				
				txtLog.setText("");
			}
		});
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		//getMenuInflater().inflate(R.menu.log, menu);
		return true;
	}

}
