var theme = function(){
	return require('/config/ui.json').MAM_THEME;
}

/*
	Load the ui config json
*/
var uiConfig = function(){
	return require('/config/ui.json');
}

var config = function(){
	return require('config/mam.js').config();
}

if(session.get("mamConsoleUserLogin") != "true" && request.getRequestURI() != uiConfig().MAM_UI_URI + "login"){
	response.sendRedirect(uiConfig().MAM_UI_URI  + "login");
}
var index = function(){
	var user = session.get("mamConsoleUser");
	if(user!=null){
		if(user.isMAMAdmin || user.isAdmin){
			response.sendRedirect('console/management');
		}
	}
};

/*
	Top navigation is generated through this function
*/
var navigation = function(role) {

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
    // var currentUser = session.get("mamConsoleUser");
	var currentUser = true;
    var topNavigation = [];
    var configNavigation = [];
    if(currentUser){
        if(role == 'admin'){
			var app_info = uiConfig();
            topNavigation = [
                {name : "Management"	, link: app_info.MAM_UI_URI + "console/management", displayPage: "management", icon:"icon-briefcase"},
                {name : "Configurations", link: app_info.MAM_UI_URI + "users/configuration", displayPage: "configuration", icon:"icon-wrench"},
                 {name : "Reports"	, link: app_info.MAM_UI_URI + "reports/", displayPage: "reports", icon:"icon-bar-chart"},
               // {name : "VPP", link: app_info.MAM_UI_URI + "vpp/configuration", displayPage: "vpp", icon:"icon-mobile-phone"}
            ];
            var configNavigation =	[
                {name : "Users", link: app_info.MAM_UI_URI + "users/configuration", displayPage: "users", icon:"icon-user"},
                {name : "Roles", link: app_info.MAM_UI_URI + "roles/configuration", displayPage: "roles", icon:"icon-group"},
                {name : "Policies", link: app_info.MAM_UI_URI + "policies/configuration", displayPage: "policies", icon:"icon-lock"},
            ];
        }else if(role == 'Internal/mdmadmin'){
            topNavigation = [
                {name : "Configurations", link: app_info.MAM_UI_URI + "users/configuration", displayPage: "configuration", icon:"icon-wrench"},
                {name : "Management"	, link: app_info.MAM_UI_URI + "devices/management", displayPage: "management", icon:"icon-briefcase"},
                 {name : "Reports"	, link: app_info.MAM_UI_URI + "reports/", displayPage: "reports", icon:"icon-bar-chart"},
               // {name : "VPP", link: app_info.MAM_UI_URI + "vpp/configuration", displayPage: "vpp", icon:"icon-mobile-phone"}
            ];
            var configNavigation =	[
                {name : "Users", link: app_info.MAM_UI_URI + "users/configuration", displayPage: "users", icon:"icon-user"},
                {name : "Roles", link: app_info.MAM_UI_URI + "roles/configuration", displayPage: "roles", icon:"icon-group"},
                {name : "Policies", link: app_info.MAM_UI_URI + "policies/configuration", displayPage: "policies", icon:"icon-lock"},
            ];
        }else{
            topNavigation = [
                {name : "My Devices"	, link: app_info.MAM_UI_URI + "users/devices", displayPage: "management", icon:"icon-briefcase"}
            ];
        }
    }

    return {
        topNavigation : topNavigation,
        configNavigation: configNavigation
    };
};

/*
	Initial context used by each controller
*/
var context = function() {

    var contextData = {};
       var currentUser = session.get("mamConsoleUser");  
       if(currentUser){
           if(currentUser.isAdmin){
               contextData.user = {
                   name : "Admin",
                   role : "admin"
               };
           }else if(currentUser.isMAMAdmin){
               contextData.user = {
                   name : "MAM Admin",
                   role : "Internal/mamadmin"
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
	var defaultContext = {
		ui: uiConfig(),
		title: "MAM",
		layout: '1-column',
		navigation: navigation('admin'),
		theme: theme(),
		config: config(),
		contextData : contextData,
		userLogin : session.get("mamConsoleUserLogin"),
        currentUser : session.get("mamConsoleUser"),
		resourcePath: "../themes/" + theme() + "/img/"
	};
    return defaultContext;
};