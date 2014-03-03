var from, to;
var chartArc = chartArc || null;
var generateChart = function(){
var lists = [
            {
                channel: 'org.wso2.arc',
                list: 'architecture'
            }
        ];

	$.each(lists, function (index, value) {
            var obj;
            var channel = lists[index].channel;
            var list = lists[index].list;

            $.ajax({
                url: '/markmail/api/wso2.jag?list=' + list + '&from=' + from + '&to=' + to,
                dataType: 'json',
                //async : false,
                success: function (data) {
                    obj = data;

                    $.ajax({
                        url: '/markmail/api/wso2.jag?list=' + list + '&from=' + from + '&to=' + to + '&action=sender',
                        dataType: 'json',
                        //async : false,
                        success: function (data) {

                            obj['senders'] = data.msg;
                            drawChart(obj);

                        }
                    });

                }
            });

        });
}


function drawChart(obj) {
	
	var init = $('#chart-wso2').attr('data-init');

	var values = obj['msg'];
	var title = obj['title'];
	var senders = obj['senders'];
	
	
	var myconfig = {
		baseUrl : '/portal/js/dojo//'
	};

	var coords = [];
	var labels = [];

	for (var i in values) {
		labels.push({
			value : i,
			text : values[i].month.replace('Z','')
		});
	}


	if (!init) {

		require(myconfig, ["dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Bars", "dojox/charting/plot2d/Markers", "dojox/charting/themes/Bahamation", "dojo/ready"], function(Chart, Default, Bars, Markers, Bahamation, ready) {
			ready(function() {
				chartArc = new Chart("chart-wso2");
				chartArc.addPlot("default", {
					type : Bars,
					markers : true,
					gap : 5,
					animate : {
						duration : 800
					}
				}).addAxis("x", {
					fixLower : "major",
					fixUpper : "major"
				}).addAxis("y", {
					vertical : true,
					 microTicks: false,
					labels : labels
				}).setTheme(Bahamation);

				for (i in values) {
					coords.push({
						x : i,
						y : parseInt(values[i]['count'])
					});
				}

				coords.reverse();
				chartArc.addSeries("Series A", coords);
				//var tip = new Tooltip(chartArc,"default");
				chartArc.render();

			});
		});

		$('#chart-wso2').attr('data-init', true);
	} else {
		for (i in values) {
			coords.push({
				x : i,
				y : parseInt(values[i]['count'])
			});
		}

		coords.reverse();
		chartArc.addAxis("y", {
			vertical : true,
			labels : labels
		});
		chartArc.updateSeries("Series A", coords).render();

	}
	
	
	$('#senders ul').empty();
	for(var i in senders){
		$('#senders ul').append('<li><span class="span-left">' + senders[i].email.replace('+',' ') + ' </span><span class="span-right"> ' + senders[i].count + '</span></li>');
	}
	
	
	
}
var month = [];
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
var getScale = function(){
	var scale = [];
	var d1 = 2005, d2 = new Date().getFullYear(); 
	for(var y = d1; y <= d2; y++){ scale.push(y) }
	return scale;
};
$(document).ready(function(){
	$("#Slider1").slider({
		from: 0,
		to: monthDiff(new Date(2005, 01),new Date()),
		step: 1,
		dimension: '',
		scale: getScale(),
		limits: false,
		calculate: function (value) {
		    var year = Math.floor(value / 12);
		    return year + 2005 + ' ' + month[value % 12];
		},
		skin: 'round_plastic',
		callback: function (value) {

		    var split = value.split(';');

		    from = (2005 + Math.floor(split[0] / 12));
		    to = (2005 + Math.floor(split[1] / 12));

		    var m1 = 1 + (split[0] % 12);
		    from += m1 < 10 ? "0" + m1 : m1;

		    var m2 = 1 + (split[1] % 12);
		    to += m2 < 10 ? "0" + m2 : m2;

		    generateChart();

		    $("#Slider1").slider('value', split[0], split[1]);

		}
	    });

	    $("#Slider1").slider('value', 12, 84);
		from = from || "200601"; 
		to = to || "201201";
		generateChart();
});
var monthDiff = function(d1, d2) {
    var months;
	d1 = new Date(d1.getFullYear(), 01)
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    //months -= d1.getMonth() + 1;
    //months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

