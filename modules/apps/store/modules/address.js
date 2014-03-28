var getAddress = function(transport){
	var process = require("process"),
	    host = process.getProperty('server.host'),
	    ip = process.getProperty('carbon.local.ip');
	    var log = new Log();
	var port;
	if(transport=="http"){
		port = process.getProperty('mgt.transport.http.proxyPort');
		if(!port){
			//can use http.port as well
			port = process.getProperty('mgt.transport.http.port');
		}
	}else if(transport=="https"){
		port = process.getProperty('mgt.transport.https.proxyPort');
		if(!port){
			//can use https.port as well
			port = process.getProperty('mgt.transport.https.port');
		}
	}
	var postUrl;
    if(host=="localhost"){
      postUrl  = transport+"://" + ip + ":" + port;
    }else{
      postUrl = transport+"://" + host+ ":" +port;
    }
    return postUrl;
}