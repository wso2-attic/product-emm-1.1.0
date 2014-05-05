var carbon = require('carbon');
describe('Server Configuration test spec', function () {
	beforeEach(function () {

    });
    afterEach(function(){

    });
    it('Test hostname', function () {
    	var conf = carbon.server.loadConfig('carbon.xml');
		var offset = conf.*::['Ports'].*::['Offset'].text();
		var hostName = conf.*::['HostName'].text().toString();

		if (hostName === null || hostName === '') {
		    hostName = 'localhost';
		}

		var httpPort = 9763 + parseInt(offset, 10);
		var httpsPort = 9443 + parseInt(offset, 10);
		
		expect(hostName).toEqual(9763);
    });
});