//chart object
var chartCo2 = chartCo2 || null;

gadgets.HubSettings.onConnect = function() {
	gadgets.Hub.subscribe("org.uec.geo.data", callback);
};

function callback1(topic, data, subscriberData) {
	document.getElementById("output").innerHTML = "message : " + gadgets.util.escapeString(data + "") + "<br/>" + "received at: " + (new Date()).toString();
}

function callback(topic, obj, subscriberData) {

	var init = $('#chart-co2').attr('data-init');

	console.log(chartCo2);

	var myconfig = {
		baseUrl : '/portal/js/dojo//'
	};

	var coords = [];

	if (!init) {
		console.log("create");
		require(myconfig, ["dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/StackedAreas", "dojox/charting/themes/Wetland", "dojo/ready"], function(Chart, Default, StackedAreas, Wetland, ready) {
			ready(function() {
				chartCo2 = new Chart("chart-co2");
				chartCo2.addPlot("default", {
					type : StackedAreas,
					tension : 10,
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
				}).setTheme(Wetland);

				for (i in obj) {
					coords.push({
						x : parseInt(obj[i].date),
						y : parseInt(obj[i].value)
					});
				}

				coords.reverse();
				console.log(coords);
				chartCo2.addSeries("Series A", coords).render();
			});
		});
		$('#chart-co2').attr('data-init', true);
	} else {
		console.log("update");
		for (i in obj) {
			coords.push({
				x : parseInt(obj[i].date),
				y : parseInt(obj[i].value)
			});
		}

		coords.reverse();
		console.log(coords);
		chartCo2.updateSeries("Series A", coords).render();

	}
}

