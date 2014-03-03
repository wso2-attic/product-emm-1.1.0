//chart object
var chartEnergy = chartEnergy || null;

gadgets.HubSettings.onConnect = function() {
	gadgets.Hub.subscribe("org.uec.geo.energy", callback);
};

function callback1(topic, data, subscriberData) {
	document.getElementById("output").innerHTML = "message : " + gadgets.util.escapeString(data + "") + "<br/>" + "received at: " + (new Date()).toString();
}

function callback(topic, obj, subscriberData) {

	var init = $('#chart-energy').attr('data-init');

	console.log("data-init" + init);

	var myconfig = {
		baseUrl : '/portal/js/dojo//'
	};

	var coords = [];

	if (!init) {
		console.log("create");
		require(myconfig, ["dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Columns", "dojox/charting/themes/PurpleRain", "dojo/ready"], function(Chart, Default, Columns, PurpleRain, ready) {
			ready(function() {
				chartEnergy = new Chart("chart-energy");
				chartEnergy.addPlot("default", {
					type : Columns,
					gap: 5,
					animate : {
						duration : 800
					}
				}).addAxis("x", {
					fixLower : "major",
					fixUpper : "major"
				}).addAxis("y", {
					vertical : true,
					fixLower : "major",
					fixUpper : "major",
					min : 0
				}).setTheme(PurpleRain);

				for (i in obj) {
					coords.push({
						x : parseInt(obj[i].date),
						y : parseInt(obj[i].value)
					});
				}

				coords.reverse();
				chartEnergy.addSeries("Series A", coords).render();
			});
		});
		$('#chart-energy').attr('data-init', true);
		
	} else {
		for (i in obj) {
			coords.push({
				x : parseInt(obj[i].date),
				y : parseInt(obj[i].value)
			});
		}
		coords.reverse();
		chartEnergy.updateSeries("Series A", coords).render();

	}
}

