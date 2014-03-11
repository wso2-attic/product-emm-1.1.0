//chart object
var intro1 = intro1 || null;

gadgets.HubSettings.onConnect = function() {
	gadgets.Hub.subscribe("org.uec.geo.intro1", callbackGadget1);

};

function callback1(topic, data, subscriberData) {
	document.getElementById("output").innerHTML = "message : " + gadgets.util.escapeString(data + "") + "<br/>" + "received at: " + (new Date()).toString();
}

function callbackGadget1(topic, obj, subscriberData) {
	var data = [];
	for (i in obj) {
		data.push([parseInt(obj[i].date), parseInt(obj[i].value)]);
	}
	data.reverse();
	$.plot("#placeholder", [data], {
		series : {
			bars : {
				show : true,
				barWidth : 0.8,
				align : "center",
				fill : true,
				fillColor : "rgba(22, 160, 133, 1.0)",
				lineWidth : 0
			}
		},
		grid : {
			hoverable : true,
			clickable : true,
			show:false
		},
		yaxis : {
			show : true,
			tickFormatter : function suffixFormatter(val, axis) {
				return val / 1000000000;
			},
			tickLength : 0,
			ticks: 0 
		},
		xaxis : {
			show : true,
			ticks : 4,
			tickDecimals : 0,
			tickLength : 0,
			ticks: 0 

		}
	});

	$("#placeholder").bind("plothover", function(event, pos, item) {
		if (item) {
			if (previousPoint != item.dataIndex) {

				previousPoint = item.dataIndex;

				$("#tooltip").remove();
				var x = item.datapoint[0], y = item.datapoint[1];

				showTooltip(item.pageX, item.pageY, '<strong>' + x + "</strong><small>USD B. " + (y/1000000000) + "</small>");
			}
		} else {
			$("#tooltip").remove();
			previousPoint = null;
		}
	});

	function showTooltip(x, y, contents) {
		$("<div id='tooltip'>" + contents + "</div>").css({
			top : y - 30,
			left : x - 50,
			opacity:1,
			background: 'white',
			border:'none',
			padding:'8px 8px 18px'
		}).appendTo("body").fadeIn(200);
	}

}

