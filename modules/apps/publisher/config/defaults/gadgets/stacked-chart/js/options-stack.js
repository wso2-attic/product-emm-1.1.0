var chartColorScheme1 = ["#3da0ea","#bacf0b","#e7912a","#4ec9ce","#f377ab","#ec7337","#bacf0b","#f377ab","#3da0ea","#e7912a","#bacf0b"];
var options = {
	series: {
		stack: true,
		lines: {
			show: false,
			fill: true
		},
		bars: {
			show: true,
			barWidth: 0.6
		}
	},
	grid: {
		hoverable: true,
		clickable: true
	},
	colors:chartColorScheme1,
	yaxis: {
		zoomRange: [0.1, 10]
	},
	zoom: {
		interactive: true
	},
    	selection: {
        	mode: "xy"
    	}
};


var overviewOptions = {
    legend: {
        show: false
    },
    series: {
		stack: true,
		lines: {
			show: false,
			fill: true
		},
		bars: {
			show: true,
			barWidth: 0.6
		}
	},
    xaxis: {
        show: true,
        ticks: 4
    },
	colors:chartColorScheme1,
    yaxis: {
        ticks: 3
    },
    grid: {
        color: "#999"
    },
    selection: {
        mode: "xy"
    }
};
$(function(){
	$(".btn-group button").click(function(){
		$(".btn-group button").removeClass("btn-success");
		$(this).addClass("btn-success");
		console.debug($(this).text());
		options.series.bars.show = $(this).text().indexOf("Bar") != -1;
		options.series.lines.show = $(this).text().indexOf("Line") != -1;
		overviewOptions.series.bars.show = $(this).text().indexOf("Bar") != -1;
		overviewOptions.series.lines.show = $(this).text().indexOf("Line") != -1;
		fetchData();
	});
});

