package com.wso2mobile.mdm;

import com.actionbarsherlock.app.SherlockActivity;

import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TextView;

public class AlertActivity extends SherlockActivity {
	String message = "";
	Button btnOK;
	TextView txtMessage;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_alert);
		
		btnOK = (Button)findViewById(R.id.btnOK);
		txtMessage = (TextView)findViewById(R.id.txtMessage);
		
		Bundle extras = getIntent().getExtras();
		if (extras != null) {
			if(extras.containsKey( getResources().getString(R.string.intent_extra_message))){
				message = extras.getString( getResources().getString(R.string.intent_extra_message));
			}
		}
		
		txtMessage.setText(message);
		
		btnOK.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				// TODO Auto-generated method stub
				finish();
			}
		});
	}

	@Override
	public boolean onCreateOptionsMenu(com.actionbarsherlock.view.Menu menu) {
		// TODO Auto-generated method stub
		return true;
	}

}
