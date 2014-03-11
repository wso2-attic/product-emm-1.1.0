var repostsModule = require('/modules/mdm_reports.js').mdm_reports;
var report = new repostsModule(db);


index = function(appController){		
	
	context = appController.context();
	context.title = context.title + " | Reports";	
	context.page = "reports";
	context.data = {		
	};
	return context;	
	
};


all_reg_devices = function(appController){	
	
	var results = null; 
	
	var dashboard = request.getParameter('dashboard');
	
	
	if(request.getMethod() == 'POST' || dashboard == 'true'){
		
		//print(request.getParameter('dashboard') == 'true');
		
		var startdate = request.getParameter('startdate');
		var enddate = request.getParameter('enddate');
		var platform = request.getParameter('platform');
		
		try{
			var reportResults = report.getDevicesByRegisteredDate({startDate: startdate, endDate: enddate, platformType : platform});	
		}catch(e){
			var reportResults = [];
		}
		
		
		results = reportResults;
	}
	
		
	context = appController.context();
	context.title = context.title + " | Reports";	
	context.jsFile= "reports/reports.js";
	context.page = "reports";
	context.data = {
		results: results,
		inputData : {startdate: startdate, enddate: enddate, platform : platform}		
	};
	return context;	
	
};


devices_complience = function(appController){	
	
	var results = null; 
	
	var dashboard = request.getParameter('dashboard');
	
	
	
	if(request.getMethod() == 'POST' || dashboard == 'true'){
		
		var startdate = request.getParameter('startdate');
		var enddate = request.getParameter('enddate');
		var username = request.getParameter('username');
		var status = request.getParameter('status');
		
		if(username == null){
			username = "";
		}
		
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