var options = {
    legend: {
        show: true
    },
    series: {
        bars: {
            show: true,
            barWidth: 0.6,
            align: "center"
            }
    },
    grid: {
        hoverable: true,
        clickable: true
    },
    yaxis: {
        show:true
    },
    xaxis: {
        show: true
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
        bars: {
            show: true,
            barWidth: 0.6,
            align: "center"
    },
        shadowSize: 0
    },
    xaxis: {
        show: true,
        ticks: 4
    },
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
