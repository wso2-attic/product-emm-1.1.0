$(".btn-action" ).click(function(e) {
var app = $(this).data("app");
var action = $(this).data("action");

//alert(app + action);


	jQuery.ajax({
		url : '/publisher/api/lifecycle/'+ action +'/mobileapp/' + app,
		type : "PUT",
		async : "false",		
		contentType : "application/json",
     	dataType : "json"			
	});
	
	$( document ).ajaxComplete(function() {
		 location.reload();
	});

 e.stopPropagation();
});



$( ".tab-button" ).click(function() {
	
	var status = $(this).data("status");
	
	$( ".app-row" ).each(function( index ) {
		$(this).css("display", "none");		
		var appRowStatus = $(this).data("status");
		if(status == "All"){
			$(this).css("display", "table-row");
		}else if(status == appRowStatus){
			$(this).css("display", "table-row");
		}
	});
	

});