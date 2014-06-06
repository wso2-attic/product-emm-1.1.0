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
        appInfo.wso2 = "iVBORw0KGgoAAAANSUhEUgAAAB4AAAALCAYAAABoKz2KAAAAGXRFWHRTb2Z0d2Fy" +
                        "ZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAA" +
                        "ADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+" + 
                        "IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3" + 
                        "JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJ" +
                        "odHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIge" + 
                        "G1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS" +
                        "4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9v" + 
                        "bD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFMTM2QjBFQUU1OTkxMUUzOEQ5Q0JGRkY" + 
                        "5REYwNzhERiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFMTM2QjBFQkU1OTkxMUUzOEQ5Q0JGRkY5REYwNzhERiI+IDx4bXBNTTpEZXJpdmVkRnJvbSB" + 
                        "zdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkUxMzZCMEU4RTU5OTExRTM4RDlDQkZGRjlERjA3OERGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkUxMzZCMEU5RTU5OTExRTM4RDlDQkZGRjlERjA3O" + 
                        "ERGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+W5oCDgAABFZJREFUeNqUVF1sU2UYfr6v//9b123t1o0KG38qQmCFgagJKFNhZGJU3BXE" + 
                        "hBi5UC+MKM6YKBoFvBTDBRdTiDMsQREUN8JM+HGjLFsY7aAM1rG/w9qua+nannO+z68tUeOdb3Lynjzvm/M8798hmaM7Omhtw7fE7u6GnAEHA+YTTcRgmYa5rB9MBbR68LHAuzyXrgLVSlwKbQcoM1T4fpk0Lzn0fmdQ" + 
                        "Dlzrfy49G93rkGdWMULZtGy+vGpNw+GW5hd6bTYburq6kc1m8HxTE1pbW0FpRX2AzYT3wOIEzHYQvZmySF8bmwq+AZ0B0BsBjd7GEpNNYIqFp6MbNb71L6HMtwu5lBpPzGE6mmi1z4VPH2s2brvwwXrvhffW1B5ttr0qDV0+NxIZb" + 
                        "zKZjIKI4t+mJSXe7yCFX4aSeYzYPdfZ+OAGLmerkZoxkuS0G2bnFJNCW0E1SWIt7+LS7F4up1U9UcJhVv3VNwOyRwpe+aLjdZ+uzmMClm8BT93HNu0DlOhUxzunfvxMQ/DHvXv30m535d/ElIOMw1J2hY0GdvL5FFgksFtTs/owdVT3qlNBgc2C3b/" + 
                        "1Gi1dcFpT9/RJYinrViNXz7AH8X3WErtpcnJixcrSjLfOY4Fs8kGekyArKmTVgifXNaDGoiw981t3SzI59wpAyg0GQ5GYGB2glcvaeXTkKR4fXSvmvBhW1wnR+pM8Fd3MM0mBZSsE4U9MugnicH9KnbW7FFmtd2eG233m+UW6Ui/Hkk0g7qVgo73giQnQlTt" + 
                        "AXD7otYTIsmyemJisGxwY/DoYDPkLxPnlES3sI+bSuyz4azuxV/YSa5kkRtBDtPosG7n4vYj/zDJzUXX0z0roLDqitw3RyiW7QQzxzbWoG4jERmKBc9COdAO5NEhyCprMBIZ7TiGSYGMbNzT+sHnTpgNer3ewre2jfUXiXFIkJzlxVHXwdMxLLK52npTym5wjTt9ZpO" + 
                        "Ne6vMfpw6PwEwf8/jYh5wzwlNSCU/GHlntbzxrWvDEoT3HhzEWT0NvNkBLswie78SbneNszbMtB5pf3DLn9nh02VzW1+D3Xywul7VCOCLEWy8B/BNRcVB8OH9SgMHcReqf2Q+jPZLvDHUtOqKGLxwiVNvJlYyTlC+4NG9yn1/o9fzec6eabz028dajLixXVMZuxLT9cCw+uNak" + 
                        "67gVDiMQuLq/vr5uzGpbdbBADEILxKC6qKjwS5gcnKgy+MyI0KHeISU1B8WcRZrI02gGqWthC6GaFVxVErCWDAkPVVFQVe48Mq84T6S93prEbILpaPTu48vq0/clCcOh0NtyTmEmo/nz2+HbxeX657I4xJ3ywg8jXzF5GGKKeCdFcZznfQr57uiMQ4W8h6aqKvQakqipdF73uOw3Nj" + 
                        "b6043r1mnHRiNt/df6dzLOe3v7+rZHo7EVxYr/t/GisIKI/0QElheQf6qrqoReqg+FhsujsdjNTCbnF7iDkEIVg38JMABKxwk1VcbZuwAAAABJRU5ErkJggg==";
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