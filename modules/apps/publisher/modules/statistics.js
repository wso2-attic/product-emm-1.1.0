var server = require('store').server;
var db = server.privileged(function() {
	var localdb = new Database('WSO2_CARBON_DB');
	return localdb;
});



var getBookmarkStats = function (loggedInUser, currentTenant) {
 
    //Temporary fix as defautls assets are deployed as wso2.system.user
    /*if (loggedInUser == 'admin') {
        loggedInUser = 'wso2.system.user';
    }*/
    var query = "SELECT RR.REG_NAME AS asset_id, RS.REG_MEDIA_TYPE AS asset_type,COUNT(RR.REG_NAME) AS no_of_bookmarks " +
        "FROM REG_RESOURCE RS " +
        "JOIN REG_RESOURCE RR ON RS.REG_UUID=RR.REG_NAME " +
        "JOIN REG_PATH RP ON  RR.REG_PATH_ID = RP.REG_PATH_ID " +
        "WHERE RS.REG_CREATOR = '" + loggedInUser + "' AND " +
        "RR.REG_TENANT_ID = '" + currentTenant + "' AND " +
        "RP.REG_PATH_VALUE like '/_system/governance/users/%' AND " +
        "RR.REG_NAME IS NOT NULL GROUP BY RR.REG_NAME" ;
    return db.query(query);

};

var getHotAssetStats = function (startDate, endDate, currentTenant) {

    var query = "SELECT RR.REG_NAME AS asset_id, RS.REG_MEDIA_TYPE AS asset_type,COUNT(RR.REG_NAME) AS no_of_bookmarks " +
        "FROM REG_RESOURCE RS " +
        "JOIN REG_RESOURCE RR ON RS.REG_UUID=RR.REG_NAME " +
        "JOIN REG_PATH RP ON  RR.REG_PATH_ID = RP.REG_PATH_ID " +
        "WHERE RP.REG_PATH_VALUE like '/_system/governance/users/%' AND " +
        "RR.REG_TENANT_ID = '" + currentTenant + "' AND " +
        "RR.REG_LAST_UPDATED_TIME BETWEEN '" + startDate + "' AND '" + endDate + "' AND " +
        "RR.REG_NAME IS NOT NULL " +
        "GROUP BY RR.REG_NAME";

    return db.query(query);
}

var filterResultsByAssetType = function (array, type) {
    return array.filter(function (el) {
        return el.ASSET_TYPE == 'application\/vnd.wso2-' + type + '+xml';
    });
}






