var getTypeObj, breadcrumbItems, generateBreadcrumbJson;
var deploymentManagement=require('/modules/deployment/deployment.manager.js').deploymentManagementModule();
var deploymentManager=deploymentManagement.cached();

/*breadcrumbItems = [{
		assetType : 'gadget',
		assetTitle : "Gadgets",
		url : "/publisher/assets/gadget/",
		assetIcon : "icon-dashboard" //font-awesome icon class
	}, {
		assetType : "ebook",
		assetTitle : "E-Books",
		url : "/publisher/assets/ebook/",
		assetIcon : "icon-book" //font-awesome icon class
	}, {
		assetType : "site",
		assetTitle : "Sites",
		url : "/publisher/assets/site/",
		assetIcon : "icon-compass" //font-awesome icon class
	}]; */

//Populate the breadcrumb data
breadcrumbItems=deploymentManager.getAssetData();


generateBreadcrumbJson = function(data) {

	var currentTypeObj = getTypeObj(data.shortName);
		
    var breadcrumbJson = {
        currentType : currentTypeObj.assetType,
        currentTitle : currentTypeObj.assetTitle,
        currentUrl : currentTypeObj.url,
        breadcrumb : breadcrumbItems,
        shortName : data.shortName,
        query : data.query
    };
    
    if(data.artifact){
    	breadcrumbJson.assetName = data.artifact.attributes.overview_name;
        breadcrumbJson.currentVersion = data.artifact.attributes.overview_version;
        breadcrumbJson.versions = data.versions;
        breadcrumbJson.currentVersionUrl = data.artifact.id;
        
        if(data.op === "edit"){
        	breadcrumbJson.breadCrumbStaticText = "Edit";
        } else if(data.op === "view"){
        	breadcrumbJson.breadCrumbStaticText = "Overview";
        } else if(data.op === "lifecycle"){
        	breadcrumbJson.breadCrumbStaticText = "Life cycle";
        }
        
    }  else if(data.op === "create"){
    	 breadcrumbJson.breadCrumbStaticText = 'Add Asset';
    }  else if(data.op === "statistics"){
    	 breadcrumbJson.breadCrumbStaticText = 'Statistics';
    }
    
    return breadcrumbJson;
};


getTypeObj = function(type){
	for(item in breadcrumbItems){
		var obj = breadcrumbItems[item]
		if(obj.assetType == type){
			return obj;
		}
	}
}
