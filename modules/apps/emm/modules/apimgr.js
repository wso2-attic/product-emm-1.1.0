var apimgr = (function() {

	var log = new Log();
	var dataConfig = require('/config/emm.js').config();
	
	var module = function() {

	};

	function mergeRecursive(obj1, obj2) {
		for ( var p in obj2) {
			try {
				// Property in destination object set; update its value.
				if (obj2[p].constructor == Object) {
					obj1[p] = MergeRecursive(obj1[p], obj2[p]);
				} else {
					obj1[p] = obj2[p];
				}
			} catch (e) {
				// Property in destination object not set; create it and set its
				// value.
				obj1[p] = obj2[p];
			}
		}
		return obj1;
	}

	module.prototype = {
		constructor : module,
		login : function(serviceURL) {
			
			var params = {};
			params.action = "login";
			params.username = dataConfig.apiManagerConfigurations.username;
			params.password = dataConfig.apiManagerConfigurations.password;
			
			var url = serviceURL + '/site/blocks/user/login/ajax/login.jag';
			
			var headers = {};
			
			var result = post(url, params, headers, null);
			var cookie = result.xhr.getResponseHeader("Set-Cookie");
			
			return cookie;
		},
		publishAPIs : function(apiInfo, serviceURL, cookie) {
			
			var params = {};
			params.action = "addAPI";
			params.name = apiInfo.name;
			params.context = apiInfo.context;
			params.version = dataConfig.apiManagerConfigurations.apiVersion;
			params.tier = "Unlimited";
			params.transports = "http&http_checked=http&transports=https&https_checked=https";
			params.description = apiInfo.description;
			params.visibility = "public API";
			params.tags = "emm,mobile";
			params.resourceCount = "0";
			params["resourceMethod-0"] = "GET";
			params["resourceMethodAuthType-0"] = "Application & Application User";
			params["uriTemplate-0"] = "/*";
			params["resourceMethodThrottlingTier-0"] = "Unlimited";
			params.tiersCollection = "Unlimited";
			
			var production_endpoints = {};
			production_endpoints.url = "https://emm.";
			production_endpoints.config = null;
			
			var sandbox_endpoints = {};
			sandbox_endpoints.url = "https://emm";
			sandbox_endpoints.config = null;
			
			var endpoint_config = {};
			endpoint_config.production_endpoints = production_endpoints;
			endpoint_config.endpoint_type = "https";
			endpoint_config.production_endpoints = production_endpoints;
			endpoint_config.endpoint_type = "https";
			
			params.endpoint_config = endpoint_config;
			
			var headers = {};
			headers.Cookie = cookie;
			
			var url = serviceURL + '/site/blocks/item-add/ajax/add.jag';
			var result = post(url, params, headers, null);
		},
		promote : function(apiInfo, serviceURL, cookie, provider) {
			
			var params = {};
			params.action = "updateStatus";
			params.name = apiInfo.name;
			params.version = dataConfig.apiManagerConfigurations.apiVersion;
			params.provider = provider;
			params.status = "PUBLISHED";
			params.publishToGateway = "true";
			params.requireResubscription = "true";
			
			var headers = {};
			headers.Cookie = cookie;
			
			var url = serviceURL + '/site/blocks/life-cycles/ajax/life-cycles.jag';
			var result = post(url, params, headers, null);
		},
		addSubscription : function(apiInfo, serviceURL, cookie, provider) {
		
			var params = {};
			params.action = "addSubscription";
			params.name = apiInfo.name;
			params.version = dataConfig.apiManagerConfigurations.apiVersion;
			params.provider = provider;
			params.user1 = provider;
			params.tier = "Unlimited";
			params.applicationId = "1";
			
			var headers = {};
			headers.Cookie = cookie;
			
			var url = serviceURL + '/site/blocks/subscription/subscription-add/ajax/subscription-add.jag';
			var result = post(url, params, headers, null);
		}
		,getConsumerKeyPair : function(serviceURL, cookie) {
	        
			var params = {};
			params.action = "getAllSubscriptions";

			var headers = {};
			headers.Cookie = cookie;
			
			var url = serviceURL + '/site/blocks/subscription/subscription-list/ajax/subscription-list.jag';
			var result = post(url, params, headers, null);
			
			return result;
		}
		,publishEMMAPIs : function() {
			
			var publisherServiceURL = dataConfig.apiManagerConfigurations.publisherServiceURL;
			var storeServiceURL = dataConfig.apiManagerConfigurations.storeServiceURL;
			var cookie = this.login(publisherServiceURL);
			
			var allAPIs = new Array();
			allAPIs.push({name:"sender_id", context:"/emm/api/devices/sender_id/", description:"Get sender id"});
			allAPIs.push({name:"isregistered", context:"/emm/api/devices/isregistered/", description:"Device is registered?"});
			allAPIs.push({name:"license", context:"/emm/api/devices/license/", description:"Get license."});
			allAPIs.push({name:"register", context:"/emm/api/devices/register/", description:"Register device."});
			allAPIs.push({name:"unregister", context:"/emm/api/devices/unregister/", description:"Unregister device"});
			allAPIs.push({name:"pendingOperations", context:"/emm/api/devices/pendingOperations/", description:"Get pending operations."});

			for(var i = 0; i < allAPIs.length; i++) {
				this.publishAPIs(allAPIs[i], publisherServiceURL, cookie);
				this.promote(allAPIs[i], publisherServiceURL, cookie, "admin");
				this.addSubscription(allAPIs[i], publisherServiceURL, cookie, "admin");
			}
			
			cookie = this.login(storeServiceURL);
			var result = this.getConsumerKeyPair(storeServiceURL, cookie);
			
			if(result != null) {

				var data = result.data;
				data = parse(data);
				
				if(data != null) {
					
					var subscriptions = data["subscriptions"];
					
					if(subscriptions != null && subscriptions != undefined && subscriptions.length > 0) {
						
						var subscription = subscriptions[0];
						var prodConsumerKey = subscription["prodConsumerKey"];
						var prodConsumerSecret = subscription["prodConsumerSecret"];
						var sandboxConsumerKey = subscription["sandboxConsumerKey"];
						var sandboxConsumerSecret = subscription["sandboxConsumerSecret"];
						
						var properties = {};
						properties.prodConsumerKey = prodConsumerKey;
						properties.prodConsumerSecret = prodConsumerSecret;
						properties.sandboxConsumerKey = sandboxConsumerKey;
						properties.sandboxConsumerSecret = sandboxConsumerSecret;
						
						
					}
					
				}
			}


			
		}
	}
	
	return module;
})();
