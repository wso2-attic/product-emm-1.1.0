//chart object
var chartAgri = chartAgri || null;

gadgets.HubSettings.onConnect = function() {
	gadgets.Hub.subscribe("org.uec.geo.agri", callback);
};

function callback1(topic, data, subscriberData) {
	document.getElementById("output").innerHTML = "message : " + gadgets.util.escapeString(data + "") + "<br/>" + "received at: " + (new Date()).toString();
}

function callback(topic, obj, subscriberData) {

	var init = $('#chart-agri').attr('data-init');

	console.log("data-init" + init);

	var myconfig = {
		baseUrl : '/portal/js/dojo//'
	};

	var coords = [];

	if (!init) {
		console.log("create");
		require(myconfig, ["dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Lines","dojox/charting/plot2d/Markers", "dojox/charting/themes/Bahamation", "dojo/ready"], function(Chart, Default, Lines, Markers, Bahamation, ready) {
			ready(function() {
				chartAgri = new Chart("chart-agri");
				chartAgri.addPlot("default", {
					type : Lines,
					markers : true,
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
				console.log(coords);
				chartAgri.addSeries("Series A", coords);
				//var tip = new Tooltip(chartAgri,"default");
				chartAgri.render();
			});
		});
		$('#chart-agri').attr('data-init', true);
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
		chartAgri.updateSeries("Series A", coords).render();

	}
}

