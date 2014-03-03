var caramel = require('caramel');

var carbon = require('carbon');
var conf = carbon.server.loadConfig('carbon.xml');
var offset = conf.*::['Ports'].*::['Offset'].text();
var hostName = conf.*::['HostName'].text().toString();

if (hostName === null || hostName === '') {
    hostName = 'localhost';
}

var httpPort = 9763 + parseInt(offset, 10);
var httpsPort = 9443 + parseInt(offset, 10);

var process = require('process');
process.setProperty('server.host', hostName);
process.setProperty('http.port', httpPort.toString());
process.setProperty('https.port', httpsPort.toString());


/*
  Rxt stuff
 */

var rxt_management=require('/modules/rxt/rxt.manager.js').rxt_management();
var publisherConfig=require('/config/publisher.json');
var pubConfig=require('/config/publisher.js').config();

/*
Finished the parsing stuff
 */
caramel.configs({
    context: '/store',
    cache: true,
    negotiation: true,
    themer: function () {
        /*var meta = caramel.meta();
        if(meta.request.getRequestURI().indexOf('gadget') != -1) {
            return 'modern';
        }*/
        return 'store';
    }/*,
    languagesDir: '/i18n',
    language: function() {
        return 'si';
    }*/
});

var configs = require('/config/store.js').config();

var mod = require('store');
mod.server.init(configs);

mod.user.init(configs);

var store = require('/modules/store.js');
store.init(configs);

/*
var url='https://localhost:9443/admin',
    username='admin',
    password='admin';

var server=new carbon.server.Server(url);
var registry=new carbon.registry.Registry(server,{
    systen:true,
    username:username,
    tenantId:carbon.server.superTenant.tenantId
});
 */

//TODO : fix this
/*var tenantId = -1234;
var event = require('event');
event.emit('tenantLoad', tenantId);*/

//for server startup log for informing store URL
var logStoreUrl = function() {
	var log = new Log();
	log.debug("Store URL : " + configs.server.http + caramel.configs().context);
};

setTimeout(logStoreUrl, 7000);



