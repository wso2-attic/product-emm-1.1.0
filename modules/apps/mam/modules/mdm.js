/*
MDM module for communicating with MDM backend
*/
var mdm = (function () {
	var log = new Log();
	var configs = require('config/mam.js').config();
	var conf;
    var module = function (config) {
		conf= config;
    };
    var common = require('/modules/common.js');
    function mergeRecursive(obj1, obj2) {
        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor == Object) {
                    obj1[p] = MergeRecursive(obj1[p], obj2[p]);
                } else {
                    obj1[p] = obj2[p];
                }
            } catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    }
	
	//Tunnel communicating to the MDM server 
	function jsonPost(postUrl, postData){
        	var url = postUrl;
			var data = postData;
			data = JSON.stringify({"data":data, "SAML_TOKEN": session.get("samlresponse")});

			var result = post(url, data, {
				"Content-Type": "application/json",
			    "User-Agent" : "Jaggery-XHR",
			    "Country" : "LK"
			});
			if(result.xhr.status=="403"){
				throw "Unauthorized";
			}
			return result;
    }
	
    // prototype
    module.prototype = {
        constructor: module,
        install: function(payload, device){
			var url =  configs.mdm.api+'/devices/'+device+'/AppInstall';
			var result = jsonPost(url, payload);
		},
		uninstall: function(payload, device){
			var url = configs.mdm.api+'/devices/'+device+'/AppUNInstall';
			var result = jsonPost(url, payload);
		},
		installBulk: function(data){
			var url =  configs.mdm.api+'/devices/AppInstall';
			var result = jsonPost(url, data);
		},
		uninstallBulk: function(data){
			var url =  configs.mdm.api+'/devices/AppUNInstall';
			var result = jsonPost(url, data);
		},
		enforce: function(policyid){
			var url = configs.mdm.api+'/policies/external/'+policyid+'/enforce';
			var result = jsonPost(url, {tenantId: common.getTenantID()});
		}
    };
    // return module
    return module;
})();