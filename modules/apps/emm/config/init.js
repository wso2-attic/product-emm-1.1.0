/**
Initilization logic
**/
var carbon = require('carbon');

var entity = require('entity');
var schema = require('/modules/schema.js');
var lang = require('/config/lang/locale_en.json');
var CONSTANTS = require('/modules/constants.js');
/* 
	Get the relevant configurations from carbon.xml	
*/
var conf = carbon.server.loadConfig('carbon.xml');
var offset = conf.*::['Ports'].*::['Offset'].text();
var hostName = conf.*::['HostName'].text().toString();

if (hostName === null || hostName === '') {
    hostName = 'localhost';
}

var httpPort = 9763 + parseInt(offset, 10);
var httpsPort = 9443 + parseInt(offset, 10);

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

var process = require('process');
process.setProperty('server.host', hostName);
process.setProperty('http.port', httpPort.toString());
process.setProperty('https.port', httpsPort.toString());
