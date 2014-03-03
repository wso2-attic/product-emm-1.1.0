var repostsModule = require('/modules/mam_reports.js').mam_reports;
var report = new repostsModule(db);


index = function(appController){		
	
	context = appController.context();
	context.title = context.title + " | Reports";	
	context.page = "reports";
	context.data = {		
	};
	return context;	
	
};


top_ten_apps = function(appController){	
	
	var results = null; 
	
	if(request.getMethod() == 'POST'){
		
		
		var platform = request.getParameter('platform');
		
		var reportResults = report.getInstalledApps({platformType : platform});
		
		//print(reportResults);
		
		results = reportResults;
	}
	
		
	context = appController.context();
	context.title = context.title + " | Reports";	
	context.jsFile= "reports/reports.js";
	context.page = "reports";
	context.data = {
		results: results,
		inputData : {platform : platform}		
	};
	return context;	
	
};


devices_complience = function(appController){	
	
	var results = null; 
	
	if(request.getMethod() == 'POST'){
		
		var startdate = request.getParameter('startdate');
		var enddate = request.getParameter('enddate');
		var username = request.getParameter('username');
		var status = request.getParameter('status');
		
		//print(startdate + enddate + username + status);
		
		var reportResults = report.getDevicesByComplianceState({startDate: startdate, endDate: enddate, username: username, status: status});
		
		//print(reportResults);
		
		results = reportResults;
	}
	
		
	context = appController.context();
	context.title = context.title + " | Reports";	
	context.jsFile= "reports/reports.js";
	context.page = "reports";
	context.data = {
		results: results,
		inputData : {startdate: startdate, enddate: enddate, username: username, status: status}		
	};
	return context;	
	
};


devices_status = function(appController){	
	
	    var results = null; 
	
	
		
		var startdate = request.getParameter('startdate');
		var enddate = request.getParameter('enddate');
		var deviceId = request.getParameter('deviceid');
		var imei = request.getParameter('imei');
		
		//print(startdate + enddate + username + status);
		
		var reportResults = report.getComplianceStatus({startDate: startdate, endDate: enddate, deviceID: deviceId});
		
		//print(reportResults);
		
		results = reportResults;
	
	
		
	context = appController.context();
	context.title = context.title + " | Reports";	
	context.jsFile= "reports/reports.js";
	context.page = "reports";
	context.data = {
		results: results,
		inputData : {startdate: startdate, enddate: enddate, deviceId: deviceId, imei: imei}		
	};
	return context;	
	
};


install_app_sum = function(appController){	
	
	var results = null; 
	
	if(request.getMethod() == 'POST'){
		
		var username = request.getParameter('username');
		
		var reportResults = report.getInstalledAppsByUser({userid: username});
		
		results = reportResults;
	}
	
		
	context = appController.context();
	context.title = context.title + " | Reports";	
	context.jsFile= "reports/reports.js";
	context.page = "reports";
	context.data = {
		results: results,
		inputData : {username: username}		
	};
	return context;	
	
};