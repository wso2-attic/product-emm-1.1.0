//chart object
var chartGreen = chartGreen || null;

gadgets.HubSettings.onConnect = function() {
	gadgets.Hub.subscribe("org.uec.geo.green", callback);
};

function callback1(topic, data, subscriberData) {
	document.getElementById("output").innerHTML = "message : " + gadgets.util.escapeString(data + "") + "<br/>" + "received at: " + (new Date()).toString();
}

function callback(topic, obj, subscriberData) {

	var init = $('#chart-green').attr('data-init');

	console.log("data-init" + init);

	var myconfig = {
		baseUrl : '/portal/js/dojo//'
	};

	var coords = [];

	if (!init) {
		console.log("create");
		require(myconfig, ["dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Bubble", "dojox/charting/themes/IndigoNation", "dojo/ready"], function(Chart, Default, Bubble, IndigoNation, ready) {
			ready(function() {
				chartGreen = new Chart("chart-green");
				chartGreen.addPlot("default", {
					type : Bubble,
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
				}).setTheme(IndigoNation);

				for (i in obj) {
					var s = Math.floor(parseInt(obj[i].value) / 10);
					coords.push({
						x : parseInt(obj[i].date),
						y : parseInt(obj[i].value),
						size : s
					});
				}

				coords.reverse();
				chartGreen.addSeries("Series A", coords).render();
			});
		});

		$('#chart-green').attr('data-init', true);

	} else {
		for (i in obj) {
			var s = Math.floor(parseInt(obj[i].value) / 10);
			coords.push({
				x : parseInt(obj[i].date),
				y : parseInt(obj[i].value),
				size : s
			});
		}
		coords.reverse();
		chartGreen.updateSeries("Series A", coords).render();

	}
}

