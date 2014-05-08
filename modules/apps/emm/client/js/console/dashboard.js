chartData = null;

var url = document.location.toString();
if (url.match('#')) {
    $('.nav-tabs a[href=#'+url.split('#')[1]+']').tab('show') ;
} 


$('#dashboardTab a').on('shown', function (e) {	
    window.location.hash = e.target.hash;
    renderView();
});


$(document).ready(function() {
	renderView();
	
});


function renderView(){
	
	$( ".widget" ).each(function( index ) {
		var templateArea = $(this).attr("id");
		var templateWidget = $(this).data("chart");
		var serviceMethod = $(this).data("method");
		var height = $(this).data("height");
		var width = $(this).data("width");
		var title = $(this).data("title");
		
		
		var currentDate = moment().format('YYYY-MM-DD');
		
		
		$.get('../client/templates/dashboard_widgets/' + templateWidget + '.hbs').done(function(templateData) {	
			
			
			if(serviceMethod){				
				jQuery.ajax({
					url : getServiceURLs("dashboardMethods", serviceMethod),
					type : "GET",					
					contentType : "application/json",
					dataType : "json",
					success: function(data) 
				    {  			
					
						//alert(JSON.stringify(data));
						chartData = data; 
						 var template = Handlebars.compile(templateData);
						  $('#' + templateArea).html(template({index:index, title: title, chartData : data, currentDate:currentDate, height:height, width: width}));	
				    }

				});					
			}else{				
				var template = Handlebars.compile(templateData);
				$('#' + templateArea).html(template({index:index, title:title, currentDate:currentDate}));				
			}
			
			
					

		}).fail(function() {

		});
	});
	
}
