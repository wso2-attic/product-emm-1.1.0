var appMetaData = null;

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
	   		$('#file-upload-text').html('<i class="icon-plus-sign"></i> SELECT .APK FILE');
	   		
	   }else if($('#txtOS').val() == 'ios'){
	   		$('#file-upload-text').html('<i class="icon-plus-sign"></i> SELECT .IPA FILE');	   		
	   }
	  
	  
});


$('#txtMarket').on("change",function() {
	  if($('#txtMarket').val() == 'Market'){
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



$(document).ready(function(){
	// $("#app-upload-progress").css("display", "block");
	 //$("#app-upload-progress-done").css("display", "none");
	

	$('#txtAppUpload').fileuploadFile({
        dataType: 'json',
       	add: function (e, data) {
		           $('#btn-app-upload').click(function () {
		                    //data.context = $('<p/>').text('Uploading...').replaceAll($(this));
		                    $("#modal-upload-data").css("display", "none");
		                     $("#modal-upload-progress").css("display", "block");
		                    data.submit();		                    
		                });
		        },
		        done: function (e, data) {
		        	appMetaData = data._response.result;
					$('#appmeta').val(JSON.stringify(data._response.result));
					$("#app-upload-progress-done").css("display", "block");
					$('#modal-upload-app').modal('hide');
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
		                                      
});


jQuery("#form-asset-create").submit(function() {
	
	$("#txtMarketHidden").val($("#txtMarket").val());
	$("#txtOSHidden").val($("#txtOS").val());
	
	if($("#txtMarketHidden").val() == 'Market'){
		$('#appmeta').val(JSON.stringify({package: $("#txtPackagename").val(), version: $("#txtVersion").val()}));
	}
	
   
});