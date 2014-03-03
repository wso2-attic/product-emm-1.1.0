var appMetaData = null;
var previousFile = null;

$('#application-tab a').click(function(e) {
	e.preventDefault();
	$(this).tab('show');
});


 
 
$('#txtOS').on("change",function() {
	  if($('#txtOS').val() == 'webapp'){
		  $('#control-webapp').show();
		  $('#app-upload-block').css('display', 'none');
		  $('#market-type-block').css('display', 'none');
		  
	  }else{
		  $('#control-webapp').hide();
		   $('#app-upload-block').css('display', 'block');
		   $('#market-type-block').css('display', 'block');
	  }
	  
	  
	   if($('#txtOS').val() == 'android'){
	   		$('#txtNameLabel').text('Package Name');
		   	if($('#txtMarket').val() == "VPP"){
		   		$('#txtMarket').val('Market');
		   	}
	   		$('#file-upload-text').html('<i class="icon-plus-sign"></i> SELECT .APK FILE');
	   		$('#txtMarket').children('option[value="VPP"]').css('display','none');
	   		
	   }else if($('#txtOS').val() == 'ios'){
	   		$('#txtNameLabel').text('App Identifier');
	   		$('#file-upload-text').html('<i class="icon-plus-sign"></i> SELECT .IPA FILE');
	   		//$('#txtMarket').children('option[value="VPP"]').css('display','block');   		
	   }
	  
	  
});


$('#txtMarket').on("change",function() {
	  if($('#txtMarket').val() == 'Market' || $('#txtMarket').val() == 'VPP'){
		  $('#file-upload-block').css('display', 'none');
		  $('#package-select-block').css('display', 'block');
	  }else{
		  $('#package-select-block').css('display', 'none');
		  $('#file-upload-block').css('display', 'block');
	  }
	  
	   if($('#txtOS').val() == 'android'){
	   		$('#file-upload-text').txt('SELECT .APK FILE');
	   }else if($('#txtOS').val() == 'android'){
	   		$('#file-upload-text').txt('SELECT .PLIST FILE');
	   }
});


$('#btn-create-asset-mobile').click(function(e) {
	
	var name = $("#txtName").val();
	var description = $("#txtDescription").val();
	var category = $("#txtCategory").val();
	var recentChanges = $("#txtRecentChanges").val();
	var banner = $("#txtbanner").val();
	var screenShot1 = $("#txtScreenShot1").val();
	var screenShot2 = $("#txtScreenShot2").val();
	var screenShot3 = $("#txtScreenShot3").val();	
	var iconfile = $("#txtIconfile").val();
	var isMeetGudeLines = $("#chkMeetGudeLines").val();
	
	var params = {
        name: name,
        description: description,
        category: category,
        recentChanges: recentChanges,
        banner: banner,
        screenShot1: screenShot1,
        screenShot2: screenShot2,
        screenShot3: screenShot3,
        iconfile: iconfile,
        isMeetGudeLines: isMeetGudeLines,
        url: "downloads/agent.apk",
        provider: "wso2",
        version: "1.0",
        metadata : appMetaData	
     };
	
	
	$.ajax({
      type: "POST",
      url: "/publisher/api/asset/mobileapp",
      contentType: "application/json",
      data: JSON.stringify(params),
      success: function () {
        alert("Data Uploaded: ");
      }
    });
});


$('#modal-upload-app').on('shown', function() {
        $(".dropdownimage").msDropDown();
});

$('#upload-app-again').click(function(e) {
	      $("#modal-upload-data").css("display", "block");
		  $("#modal-upload-progress").css("display", "none");
		
});



$(document).ready(function(){
	// $("#app-upload-progress").css("display", "block");
	 //$("#app-upload-progress-done").css("display", "none");
	 
	    $(document).ready(function() { 
            // bind 'myForm' and provide a simple callback function 
            $('#form-asset-create').ajaxForm(function(data) { 
            	
            	try{
            		data = JSON.parse(data);
            	}catch(e){
            		window.location.replace("/publisher/assets/mobileapp/");
               		return;
            	}
            	
            	
               
               	if(data.ok == false){
               		
               		var validationErrors = "";
               		
               		for (var key in data.report) {
					  if (data.report.hasOwnProperty(key)) {					   
					    if(key != "failed"){
					    	validationErrors += data.report[key] + "<br>";
					    }
					    
					  }
					}
               		//window.location.replace("/publisher/assets/mobileapp/");
               		
               		 noty({               		 	
					    text: '<strong>Validation Failed!</strong> <br />' + validationErrors,
					    template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
					    layout: "center",
					    timeout: 2000,
					    type: "error"
				   
				 	 });
               		
               		
               	}else{
               		window.location.replace("/publisher/assets/mobileapp/");
               	}
               
				
             
            }); 
        });
	

	$('#txtAppUpload').fileuploadFile({
        dataType: 'json',
       	add: function (e, data) {
		        $('#btn-app-upload').one( "click", function() {
		                    //data.context = $('<p/>').text('Uploading...').replaceAll($(this));
		                    $("#modal-upload-data").css("display", "none");
		                     $("#modal-upload-progress").css("display", "block");
		                    data.platform = $('#txtOS').val();
		                   
		                    if(previousFile != data){
		                    	data.submit();	
		                    }		
		                     previousFile = data;                   
		                    	                    
		                });
		        },
		        done: function (e, data) {
		        	var data = data._response.result;
		        	$('#txtVersion').val(data.version);
		        	
		        	
		        	
		        	if(data.ok == false){
               			var validationErrors = "";
	               		for (var key in data.report) {
						  if (data.report.hasOwnProperty(key)) {					   
						    if(key != "failed"){
						    	validationErrors += data.report[key] + "<br>";
						    }
						    
						  }
						}
						 $("#modal-upload-progress").css("display", "none");
	               		
	               		
					 	//window.location.replace("/publisher/assets/mobileapp/");
				
					 	
				noty({
					 		text: '<strong>Validation Failed!</strong> <br />' + validationErrors,
						    template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
						    layout: "center",
						    modal: true,
						    timeout: 2000,
						    type: "error",
					buttons : [{
						
						addClass : 'btn',
						text : 'Ok',
						onClick : function($noty) {
							location.reload(); 
							
						}
						
					}]
				});
					 	
					 	
					 	
					 	
					 	
					 	
					 	
					 	
					 	
	               	}else{
	               		$('#appmeta').val(JSON.stringify(data));
						$("#app-upload-progress-done").css("display", "block");
						$('#modal-upload-app').modal('hide');
	               	}
					
		        	//$('#txtWebapp').val(data._response.result[0]);
		            //alert();
		            //$("#app-upload-progress").css("display", "none");
		            //$("#app-upload-progress-done").css("display", "block");
		        }

	});

	$("#modal-upload-app").modal('show');

});

$('#btn-app-upload').click(function () {
		          if(appMetaData == null){
		          	  $("#modal-upload-data").css("display", "none");
		              $('#modal-upload-app').modal('hide');
		          }	
		          
		       
				   if($('#txtMarket').val() == 'Enterprise' && $("#txtOS").val() != 'webapp' ){
				   	$("#txtVersion").attr("disabled", "disabled");
				   }	                  
		                                      
});


jQuery("#form-asset-create").submit(function(e) {
	
	$("#txtMarketHidden").val($("#txtMarket").val());
	$("#txtOSHidden").val($("#txtOS").val());
	
	if($("#txtMarketHidden").val() == 'VPP'){
		$('#appmeta').val(JSON.stringify({package: $("#txtPackagename").val(), version: $("#txtVersion").val()}));
	}
	
	if($("#txtMarketHidden").val() == 'Market'){
		$('#appmeta').val(JSON.stringify({package: $("#txtPackagename").val(), version: $("#txtVersion").val()}));
	}
	
	if($("#txtWebapp").val() != ''){
		$('#appmeta').val(JSON.stringify({weburl: $("#txtWebapp").val()}));
	   
	}
	
	
	if($("#txtOS").val() == 'webapp'){
		 $('#txtMarket').val("Web App");
		 $("#txtMarketHidden").val("Web App");
	}
	
	if($('#appmeta').val() == null || $('#appmeta').val() == ""){
		 $("#modal-upload-app").modal('show');
		 $("#modal-upload-data").css("display", "block");
		e.preventDefault();
	}
   //alert($('#appmeta').val());
});