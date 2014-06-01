var ui = require('../config/tenants/default/ui.json');
var config = require('/config/emm.js').config();
var uiTenantConf = {};

var configApis = require('../config/apis.json');
var log = new Log();



if(session.get("emmConsoleUserLogin") != null){
	var userSession = session.get("emmConsoleUser");
	var tenatDomain = userSession.tenantDomain;
	//ui = require('../config/tenants/' + tenatDomain + '/ui.json');
    ui = require('../config/ui.json');
    
    var userModule = require('/modules/user.js').user;
    var user = new userModule();
    uiTenantConf = user.getTenantCopyRight(parseInt(userSession.tenantId));
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
        deviceImageService: ui.DEVICES_IMAGE_SERVICE
    };

    return appDefault;
};