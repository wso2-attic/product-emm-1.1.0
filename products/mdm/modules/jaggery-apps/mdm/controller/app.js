var ui = require('../config/tenants/default/ui.json');
var config = require('/config/mdm.js').config();

var configApis = require('../config/apis.json');
var log = new Log();



if(session.get("mdmConsoleUserLogin") != null){
	var userSession = session.get("mdmConsoleUser");
	var tenatDomain = userSession.tenantDomain;
	ui = require('../config/tenants/' + tenatDomain + '/ui.json');
}


if(session.get("mdmConsoleUserLogin") != null){
	var userSession = session.get("mdmConsoleUser");
	var tenatDomain = userSession.tenantDomain;
	ui = require('../config/tenants/' + tenatDomain + '/ui.json');
}



/*
	Basic Application Info
*/
appInfo = function() {
    var appInfo = {
        headerTitle : ui.HEADING,
        title : ui.TITLE,
        copyright : ui.COPYRIGHT,
        server_url: ui.MDM_UI_URI
    };
    return appInfo;
};

/*
	Redirect to login page if the user is no loggedin
*/
if(session.get("mdmConsoleUserLogin") == null && session.get("mdmConsoleUserLogin") != "true" && request.getRequestURI() != appInfo().server_url + "login"){
	response.sendRedirect(appInfo().server_url + "login");
    throw require('/modules/absolute.js').appRedirect;
}else{
	if(!(session.get("mdmConsoleUser")['isMDMAdmin'] == true | session.get("mdmConsoleUser")['isAdmin'] == true)){
	 var user = request.getParameter('user');
	 if(request.getParameter('user') != null && request.getParameter('user') != session.get("mdmConsoleUser")['username']){
		 response.sendError(403); 
	 }
 	
 	}
	
}

 


/*
	Deprcated!
	Common functions to call APIS in the backend. this is diconitinued after introdusing function calls
*/
getServiceURLs = function(item){
    var serverURL = config.HTTP_URL + ui.MDM_API_URI;
    var urls = configApis.APIS;
    arguments[0] = urls[item];
    var returnURL;
    if(session.get("mdmConsoleUser") != null) {
        var log = new Log();
        returnURL = serverURL + String.format.apply(this, arguments) + "?tenantId=" + session.get("mdmConsoleUser").tenantId;
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
	var user = session.get("mdmConsoleUser");
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
    var currentUser = session.get("mdmConsoleUser");
    var topNavigation = [];
    var configNavigation = [];
    if(currentUser){
        if(role == 'admin'){
            topNavigation = [
                {name : "Dashboard"	, link: appInfo().server_url + "console/dashboard", displayPage: "dashboard", icon: "icon-th-large"},
                {name : "Configurations", link: appInfo().server_url + "users/configuration", displayPage: "configuration", icon:"icon-wrench"},
                {name : "Management"	, link: appInfo().server_url + "devices/management", displayPage: "management", icon:"icon-briefcase"},
                 {name : "Reports"	, link: appInfo().server_url + "reports/", displayPage: "reports", icon:"icon-bar-chart"}               
            ];
            var configNavigation =	[
                {name : "Users", link: appInfo().server_url + "users/configuration", displayPage: "users", icon:"icon-user"},
                {name : "Roles", link: appInfo().server_url + "roles/configuration", displayPage: "roles", icon:"icon-group"},
                {name : "Policies", link: appInfo().server_url + "policies/configuration", displayPage: "policies", icon:"icon-lock"},
            ];
        }else if(role == 'Internal/mdmadmin'){
            topNavigation = [
                {name : "Dashboard"	, link: appInfo().server_url + "console/dashboard", displayPage: "dashboard", icon: "icon-th-large"},
                {name : "Configurations", link: appInfo().server_url + "users/configuration", displayPage: "configuration", icon:"icon-wrench"},
                {name : "Management"	, link: appInfo().server_url + "devices/management", displayPage: "management", icon:"icon-briefcase"},
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
        name : ui.MDM_THEME,
        default_layout : "1-column"
    };

    return theme;

};


/*
	Whole context which is sent to each request
*/

context = function() {
    var contextData = {};
    var currentUser = session.get("mdmConsoleUser");  
    if(currentUser){
        if(currentUser.isAdmin){
            contextData.user = {
                name : "Admin",
                role : "admin"
            };
        }else if(currentUser.isMDMAdmin){
            contextData.user = {
                name : "MDM Admin",
                role : "Internal/mdmadmin"
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
        userLogin : session.get("mdmConsoleUserLogin"),
        currentUser : session.get("mdmConsoleUser"),
        resourcePath: "../themes/" + this.theme().name + "/img/",
        contextData : contextData,
        navigation : this.navigation(contextData.user.role),
        deviceImageService: ui.DEVICES_IMAGE_SERVICE
    };

    return appDefault;
};