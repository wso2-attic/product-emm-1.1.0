appToUninstall = null;
appToReinstall = null;


$(function(){
	


$('button[data-toggle=tooltip]').tooltip();

$(document).on('click', '#myasset-container .asset-remove-btn', function() {
	
	var aid = $(this).attr('data-aid');
	var type = $(this).attr('type');
	
	
noty({
		text : 'Are you sure you want remove this app?',
		buttons : [{
			addClass : 'btn btn-cancel',
			text : 'Cancel',
			'layout' : 'center',
			onClick : function($noty) {
				$noty.close();

			}
			
			
		}, {
			
			addClass : 'btn btn-orange',
			text : 'Ok',
			onClick : function($noty) {
				
				caramel.get('/apis/remove', {
			    aid: aid,
			    type: type
		            }, function (data) {
				location.reload();
		            });
				
				
			}
			
		}]
	});		
	
	
	
	
	
	

//console.log("removing : "+$(this).attr('data-aid')+" type :"+$(this).attr('type'));
});





$(".device-image-modal").each(function(index) {	
	var srcImage = $(this).attr("src");	
	if (!urlExists(srcImage)) {
		$(this).attr("src", "/assets/wso2mobile/img/models/none.png");
	}
});

function urlExists(url){
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}




$(document).on('click', '#myasset-container .asset-uninstall-btn', function() {
	appToUninstall = $(this).data("aid");	
	$('#devicesList').modal('show');	
});

$(document).on('click', '#myasset-container .asset-reinstall-btn', function() {
	appToReinstall = $(this).data("aid");
	   devicePlatform = $(this).data("platform").toLowerCase();
	
		
		$(".device-image-block-modal").each(function(index) {	
			var platform = $(this).data("platform").toLowerCase();
			if(devicePlatform == 'webapp'){ 
				
			}else if(devicePlatform != platform){
				$(this).css("display", "none");
			}
			
		
		});
		
		
		$('#devicesList').modal('show');
		
});



$('#devicesList').on('hidden', function () {
    location.reload(); 
});


$(".device-image").each(function(index) {	
	var device = getURLParameter("device");	
	if(device != "null"){
		var deviceId = $(this).data("deviceId");
		if(deviceId != device){
			$(this).fadeTo("slow", 0.1);
		}else{
			$(this).parent().css("cursor", "default");
			$(this).fadeTo("slow", 1);
		}
	}else{
		$(this).css("opacity", 1);
	}
	
	var srcImage = $(this).attr("src");	
	if (!urlExists(srcImage)) {
		$(this).attr("src", "/assets/wso2mobile/img/models/none.png");
	}
});

$(".device-image-block-modal").click(function(index) {	
	
	var deviceId = $(this).data("deviceId");
	jQuery.ajax({
      url: "/store/apps/devices/" + deviceId + "/install", 
      type: "POST",
      dataType: "json",	
      data : {"asset": appToReinstall}			      
	});	
		
});








$('.embed-snippet').hide();

$(document).on('click', '#myasset-container .btn-embed', function() {
    $(this).closest('.store-my-item').find('.embed-snippet').toggle(50);
    return false;
});

$('.popover-content').live("click",function(event){
	$('.arrow').css({"display":"none"});
});

$(".popover-content").live("mouseleave",function(){
	$('.arrow').css({"display":"block"});
});

	$("#asset-in-gadget").carouFredSel({
		items:4,
		infinite: false,
		auto : false,
		circular: false,		
		pagination  : "#own-asset-slideshow-pag-gadget"

	});
	
	
	$("#asset-in-site").carouFredSel({
		items:4,
		infinite: false,
		auto : false,
		circular: false,		
		pagination  : "#own-asset-slideshow-pag-site"

	});

    $("#asset-in-ebook").carouFredSel({
		items:4,
		infinite: false,
		auto : false,
		circular: false,
		pagination  : "#own-asset-slideshow-pag-ebook"

	});
	

});