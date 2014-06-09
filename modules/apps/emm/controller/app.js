var ui = require('../config/tenants/default/ui.json');
var config = require('/config/emm.js').config();
var uiTenantConf = {};

var configApis = require('../config/apis.json');
var log = new Log();



if(session.get("emmConsoleUserLogin") != null){
	var userSession = session.get("emmConsoleUser");
	var tenatDomain = userSession.tenantDomain;
	ui = require('../config/tenants/' + tenatDomain + '/ui.json');
    //ui = require('../config/ui.json');
    
    var userModule = require('/modules/user.js').user;
    var user = new userModule();
    if(session.get("uiTenantConf") == null){
         uiTenantConf = user.getTenantCopyRight(parseInt(userSession.tenantId));
         session.put("uiTenantConf", uiTenantConf);
    }else{
       uiTenantConf =  session.get("uiTenantConf");
    }
        
   // print(uiTenantConf);
   
}



/*
	Basic Application Info
*/
appInfo = function() {
    var appInfo = {
        server_url: ui.EMM_UI_URI
    };
    
    if(session.get("emmConsoleUserLogin") != null){
        appInfo.headerTitle = uiTenantConf.Title[0];
        appInfo.title = uiTenantConf.Title[0];
        appInfo.copyright = uiTenantConf.Footer[0];
        appInfo.wso2 = db64("ZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCNEFBQUFMQ0FZQUFBQm9LejJLQUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQUF5UnBWRmgwV0UxTU9tTnZiUzVoWkc5aVpTNTRiWEFBQUFBQUFEdy9lSEJoWTJ0bGRDQmlaV2RwYmowaTc3dS9JaUJwWkQwaVZ6Vk5NRTF3UTJWb2FVaDZjbVZUZWs1VVkzcHJZemxrSWo4K0lEeDRPbmh0Y0cxbGRHRWdlRzFzYm5NNmVEMGlZV1J2WW1VNmJuTTZiV1YwWVM4aUlIZzZlRzF3ZEdzOUlrRmtiMkpsSUZoTlVDQkRiM0psSURVdU1DMWpNRFl4SURZMExqRTBNRGswT1N3Z01qQXhNQzh4TWk4d055MHhNRG8xTnpvd01TQWdJQ0FnSUNBZ0lqNGdQSEprWmpwU1JFWWdlRzFzYm5NNmNtUm1QU0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh4T1RrNUx6QXlMekl5TFhKa1ppMXplVzUwWVhndGJuTWpJajRnUEhKa1pqcEVaWE5qY21sd2RHbHZiaUJ5WkdZNllXSnZkWFE5SWlJZ2VHMXNibk02ZUcxd1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM2hoY0M4eExqQXZJaUI0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlnZUcxc2JuTTZjM1JTWldZOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlZKbFppTWlJSGh0Y0RwRGNtVmhkRzl5Vkc5dmJEMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTlROUzR4SUUxaFkybHVkRzl6YUNJZ2VHMXdUVTA2U1c1emRHRnVZMlZKUkQwaWVHMXdMbWxwWkRwRk1UTTJRakJGUVVVMU9Ua3hNVVV6T0VRNVEwSkdSa1k1UkVZd056aEVSaUlnZUcxd1RVMDZSRzlqZFcxbGJuUkpSRDBpZUcxd0xtUnBaRHBGTVRNMlFqQkZRa1UxT1RreE1VVXpPRVE1UTBKR1JrWTVSRVl3TnpoRVJpSStJRHg0YlhCTlRUcEVaWEpwZG1Wa1JuSnZiU0J6ZEZKbFpqcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPa1V4TXpaQ01FVTRSVFU1T1RFeFJUTTRSRGxEUWtaR1JqbEVSakEzT0VSR0lpQnpkRkpsWmpwa2IyTjFiV1Z1ZEVsRVBTSjRiWEF1Wkdsa09rVXhNelpDTUVVNVJUVTVPVEV4UlRNNFJEbERRa1pHUmpsRVJqQTNPRVJHSWk4K0lEd3ZjbVJtT2tSbGMyTnlhWEIwYVc5dVBpQThMM0prWmpwU1JFWStJRHd2ZURwNGJYQnRaWFJoUGlBOFAzaHdZV05yWlhRZ1pXNWtQU0p5SWo4K1c1b0NEZ0FBQkZaSlJFRlVlTnFVVkYxc1UyVVlmcjZ2Ly85YjEyM3QxbzBLRzM4cVFtQ0ZnYWdKS0ZOaFpHSlUzQlhFaEJpNVVDK01LTTZZS0JvRnZCVERCUmRUaURNc1FSRVVOOEpNK0hHakxGc1k3YUFNMXJHL3c5cXVhK25hbm5PK3o2OHRVZU9kYjNMeW5qenZtL004Nzk4aG1hTTdPbWh0dzdmRTd1NkduQUVIQStZVFRjUmdtWWE1ckI5TUJiUjY4TEhBdXp5WHJnTFZTbHdLYlFjb00xVDRmcGswTHpuMGZtZFFEbHpyZnk0OUc5M3JrR2RXTVVMWnRHeSt2R3BOdytHVzVoZDZiVFlidXJxNmtjMW04SHhURTFwYlcwRnBSWDJBellUM3dPSUV6SFlRdlpteVNGOGJtd3ErQVowQjBCc0JqZDdHRXBOTllJcUZwNk1iTmI3MUw2SE10d3U1bEJwUHpHRTZtbWkxejRWUEgyczJicnZ3d1hydmhmZlcxQjV0dHIwcURWMCtOeElaYnpLWmpJS0k0dCttSlNYZTd5Q0ZYNGFTZVl6WVBkZlorT0FHTG1lcmtab3hrdVMwRzJibkZKTkNXMEUxU1dJdDcrTFM3RjR1cDFVOVVjSmhWdjNWTndPeVJ3cGUrYUxqZFordXptTUNsbThCVDkzSE51MERsT2hVeHp1bmZ2eE1RL0RIdlh2MzBtNTM1ZC9FbElPTXcxSjJoWTBHZHZMNUZGZ2tzRnRUcy9vd2RWVDNxbE5CZ2MyQzNiLzFHaTFkY0ZwVDkvUkpZaW5yVmlOWHo3QUg4WDNXRXJ0cGNuSml4Y3JTakxmT1k0RnM4a0dla3lBckttVFZnaWZYTmFER29pdzk4MXQzU3pJNTl3cEF5ZzBHUTVHWUdCMmdsY3ZhZVhUa0tSNGZYU3ZtdkJoVzF3blIrcE04RmQzTU0wbUJaU3NFNFU5TXVnbmljSDlLbmJXN0ZGbXRkMmVHMjMzbStVVzZVaS9Ia2swZzdxVmdvNzNnaVFuUWxUdEFYRDdvdFlUSXNteWVtSmlzR3h3WS9Eb1lEUGtMeFBubEVTM3NJK2JTdXl6NGF6dXhWL1lTYTVra1J0QkR0UG9zRzduNHZZai96REp6VVhYMHowcm9MRHFpdHczUnlpVzdRUXp4emJXb0c0akVSbUtCYzlDT2RBTzVORWh5Q3ByTUJJWjdUaUdTWUdNYk56VCtzSG5UcGdOZXIzZXdyZTJqZlVYaVhGSWtKemx4VkhYd2RNeExMSzUybnBUeW01d2pUdDlacE9OZTZ2TWZwdzZQd0V3ZjgvalloNXd6d2xOU0NVL0dIbG50Ynp4cld2REVvVDNIaHpFV1QwTnZOa0JMc3dpZTc4U2JuZU5zemJNdEI1cGYzRExuOW5oMDJWelcxK0QzWHl3dWw3VkNPQ0xFV3k4Qi9CTlJjVkI4T0g5U2dNSGNSZXFmMlEralBaTHZESFV0T3FLR0x4d2lWTnZKbFl5VGxDKzRORzl5bjEvbzlmemVjNmVhYnowMjhkYWpMaXhYVk1adXhMVDljQ3crdU5hazY3Z1ZEaU1RdUxxL3ZyNXV6R3BiZGJCQURFSUx4S0M2cUtqd1M1Z2NuS2d5K015STBLSGVJU1UxQjhXY1JackkwMmdHcVd0aEM2R2FGVnhWRXJDV0RBa1BWVkZRVmU0OE1xODRUNlM5M3ByRWJJTHBhUFR1NDh2cTAvY2xDY09oME50eVRtRW1vL256MitIYnhlWDY1N0k0eEozeXdnOGpYekY1R0dLS2VDZEZjWnpuZlFyNTd1aU1RNFc4aDZhcUt2UWFrcWlwZEY3M3VPdzNOamI2MDQzcjFtbkhSaU50L2RmNmR6TE9lM3Y3K3JaSG83RVZ4WXIvdC9HaXNJS0kvMFFFbGhlUWY2cXJxb1JlcWcrRmhzdWpzZGpOVENibkY3aURrRUlWZzM4Sk1BQkt4d2sxVmNiWnV3QUFBQUJKUlU1RXJrSmdnZz09");
        appInfo.pb = db64("UG93ZXJlZCBieQ==");
    }
    return appInfo;
};

/*
	Redirect to login page if the user is no loggedin
*/
if(session.get("emmConsoleUserLogin") == null && session.get("emmConsoleUserLogin") != "true" && request.getRequestURI() != appInfo().server_url + "login"){
    response.sendRedirect(appInfo().server_url + "login?"+request.getQueryString());
    throw require('/modules/absolute.js').appRedirect;
}else{
	if(!(session.get("emmConsoleUser")['isEMMAdmin'] == true | session.get("emmConsoleUser")['isAdmin'] == true)){
	 var user = request.getParameter('user');
	 if(request.getParameter('user') != null && request.getParameter('user') != session.get("emmConsoleUser")['username']){
		 response.sendError(403); 
	 }
 	
 	}
	
}

 


/*
	Deprcated!
	Common functions to call APIS in the backend. this is diconitinued after introdusing function calls
*/
getServiceURLs = function(item){
    var serverURL = config.HTTP_URL + ui.EMM_API_URI;
    var urls = configApis.APIS;
    arguments[0] = urls[item];
    var returnURL;
    if(session.get("emmConsoleUser") != null) {
        var log = new Log();
        returnURL = serverURL + String.format.apply(this, arguments) + "?tenantId=" + session.get("emmConsoleUser").tenantId;
        log.debug("Calling URL From server: " + returnURL);
    } else {
        returnURL = serverURL + String.format.apply(this, arguments);
        log.debug("Calling URL From server: " + returnURL);
    }
    return returnURL;
};


/*
	Deprcated!
	String Format function for above function
*/
String.format = function() {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
};


index = function(){
	var user = session.get("emmConsoleUser");
	if(user!=null){
		if(user.isAdmin){
			response.sendRedirect('console/dashboard');
		}else{
			response.sendRedirect(appInfo().server_url + 'users/devices?user=' + user.username);
		}
	}

};
    
    
 function db64(s) {
    var e={},i,k,v=[],r='',w=String.fromCharCode;
    var n=[[65,91],[97,123],[48,58],[43,44],[47,48]];

    for(z in n){for(i=n[z][0];i<n[z][1];i++){v.push(w(i));}}
    for(i=0;i<64;i++){e[v[i]]=i;}

    for(i=0;i<s.length;i+=72){
    var b=0,c,x,l=0,o=s.substring(i,i+72);
         for(x=0;x<o.length;x++){
                c=e[o.charAt(x)];b=(b<<6)+c;l+=6;
                while(l>=8){r+=w((b>>>(l-=8))%256);}
         }
    }
    return r;
    }   


/*
	Top Navigation and Configurations navigations
*/

navigation = function(role) {

    switch(role) {
        case "admin":
            var topNavigation = [{
                name : "Home"
            }];
            break;
        case "manager":

            break;
        default:
    };
    var currentUser = session.get("emmConsoleUser");
    var topNavigation = [];
    var configNavigation = [];
    if(currentUser){
        if(role == 'admin'){
            topNavigation = [
                {name : "Dashboard"	, link: appInfo().server_url + "console/dashboard", displayPage: "dashboard", icon: "icon-th-large"},
                {name : "Configurations", link: appInfo().server_url + "users/configuration", displayPage: "configuration", icon:"icon-wrench"},
                {name : "Device Management"	, link: appInfo().server_url + "devices/management", displayPage: "management", icon:"icon-mobile-phone"},
                {name : "App Management"	, link: appInfo().server_url + "apps/management", displayPage: "appmanagement", icon:"icon-qrcode"},
                 {name : "Reports"	, link: appInfo().server_url + "reports/", displayPage: "reports", icon:"icon-bar-chart"}               
            ];
            var configNavigation =	[
                {name : "Users", link: appInfo().server_url + "users/configuration", displayPage: "users", icon:"icon-user"},
                {name : "Roles", link: appInfo().server_url + "roles/configuration", displayPage: "roles", icon:"icon-group"},
                {name : "Policies", link: appInfo().server_url + "policies/configuration", displayPage: "policies", icon:"icon-lock"},
                {name : "Settings", link: appInfo().server_url + "tenant/configuration", displayPage: "tenant", icon:"icon-gear"},
            ];
        }else if(role == 'emmadmin'){
            topNavigation = [
                {name : "Dashboard"	, link: appInfo().server_url + "console/dashboard", displayPage: "dashboard", icon: "icon-th-large"},
                {name : "Configurations", link: appInfo().server_url + "users/configuration", displayPage: "configuration", icon:"icon-wrench"},
                 {name : "Device Management"	, link: appInfo().server_url + "devices/management", displayPage: "management", icon:"icon-mobile-phone"},
                {name : "App Management"	, link: appInfo().server_url + "apps/management", displayPage: "appmanagement", icon:"icon-qrcode"},
                 {name : "Reports"	, link: appInfo().server_url + "reports/", displayPage: "reports", icon:"icon-bar-chart"}
            ];
            var configNavigation =	[
                {name : "Users", link: appInfo().server_url + "users/configuration", displayPage: "users", icon:"icon-user"},
                {name : "Roles", link: appInfo().server_url + "roles/configuration", displayPage: "roles", icon:"icon-group"},
                {name : "Policies", link: appInfo().server_url + "policies/configuration", displayPage: "policies", icon:"icon-lock"},
            ];
        }else{
            topNavigation = [
                {name : "My Devices"	, link: appInfo().server_url + "users/devices", displayPage: "management", icon:"icon-briefcase"}
            ];
        }
    }

    return {
        topNavigation : topNavigation,
        configNavigation: configNavigation
    };

};


/*
	Assign theme and default layout of the theme
*/

theme = function() {

    var theme = {
        name : ui.EMM_THEME,
        default_layout : "1-column"
    };

    return theme;

};


/*
	Whole context which is sent to each request
*/

context = function() {
    var contextData = {};
    var currentUser = session.get("emmConsoleUser");
    if(currentUser){
        if(currentUser.isAdmin){
            contextData.user = {
                name : "Admin",
                role : "admin"
            };
        }else if(currentUser.isEMMAdmin){
            contextData.user = {
                name : "EMM Admin",
                role : "emmadmin"
            };
        }else{
            contextData.user = {
                name : "User",
                role : "user"
            };
        }
    }else{
        contextData.user = {
            name : "Guest",
            role : "guest"
        };
    }

    var appDefault = {
        layout : this.theme().default_layout,
        title : this.appInfo().title,
        appInfo : this.appInfo(),
        theme : this.theme(),
        config: config,
        userLogin : session.get("emmConsoleUserLogin"),
        currentUser : session.get("emmConsoleUser"),
        resourcePath: "../themes/" + this.theme().name + "/img/",
        contextData : contextData,
        navigation : this.navigation(contextData.user.role),
        deviceImageService: ui.DEVICES_IMAGE_SERVICE,
    };

    return appDefault;
};