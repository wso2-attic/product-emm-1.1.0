//chart object
var chartElec = chartElec || null;

gadgets.HubSettings.onConnect = function() {
	gadgets.Hub.subscribe("org.uec.geo.elec", callback);
};

function callback1(topic, data, subscriberData) {
	document.getElementById("output").innerHTML = "message : " + gadgets.util.escapeString(data + "") + "<br/>" + "received at: " + (new Date()).toString();
}

function callback(topic, obj, subscriberData) {

	var init = $('#chart-elec').attr('data-init');

	console.log("data-init" + init);

	var myconfig = {
		baseUrl : '/portal/js/dojo//'
	};

	var coords = [];
	var tip;

	if (!init) {
		console.log("create");
		require(myconfig, ["dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Pie", "dojox/charting/themes/Bahamation", "dojo/ready"], function(Chart, Default, Pie, Bahamation, ready) {
			ready(function() {
				chartElec = new Chart("chart-elec");
				chartElec.addPlot("default", {
					type : Pie,
					radius : 120,
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
				}).setTheme(Bahamation);

				for (i in obj) {
					coords.push({
						x : parseInt(obj[i].date),
						y : parseInt(obj[i].value)
					});
				}

				coords.reverse();
				chartElec.addSeries("Series A", coords).render();
			});
		});
		$('#chart-elec').attr('data-init', true);

	} else {
		for (i in obj) {
			coords.push({
				x : parseInt(obj[i].date),
				y : parseInt(obj[i].value)
			});
		}
		coords.reverse();
		chartElec.updateSeries("Series A", coords).render();

	}
}

