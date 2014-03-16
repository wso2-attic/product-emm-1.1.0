$("#btn-add").click(function() {
	
	$( 'form').parsley( 'validate' );	
	if(!$('form').parsley('isValid')){
		noty({
				text : 'Input validation failed!',
				'layout' : 'center',
				'type' : 'error'
		});		
		return;
	}
	
	var policyName = $('#policyName').val();
	var policyType = $('#policyType').val();
	params = {};
	
	$(".policy-input").each(function(index) {
		
		var prefix = $(this).attr("id").split('-')[0];
		var suffix = $(this).attr("id").split('-')[1];		
		
				
		if(!params[prefix]){
			params[prefix] = new Object();
		}
		
		var param = params[prefix];	
		
		if($(this).attr('type') == 'checkbox'){	
			
			if($(this).is(':checked')){
				var checkVal = $(this).data("trueVal");
				if(checkVal !== ""){
					
					if($(this).data("notfunction") == true){
						//alert($(this).data("notfunction"));
						params[prefix][suffix] = checkVal;
					}else{
						params[prefix]["function"] = checkVal;
					}
					
				}
			}else{
				var checkVal = $(this).data("falseVal");
				if(checkVal !== ""){
					if($(this).data("notfunction") == true){ 
						params[prefix][suffix] = checkVal;
					}else{
						params[prefix]["function"] = checkVal;
					}
					
				}
			}	
				
		}else{	
			if($(this).val() !== ""){
				params[prefix][suffix] = $(this).val();
			}			
			
		}
	});
	

	//alert(params.length);
	
	var policyData =  Array();
	
	for (var param in params) {     	
     	policyData.push({code: param, data: params[param]});
	}




	//policy data for blacklisted apps
	var policyDataBlackList = new Array(); 
	$('#inputBlackListApps > option').each(function() { 		
    	policyDataBlackList.push({identity: $(this).text(), os: $(this).data('os'), type: $(this).data('type')});
	});
		
	if(policyDataBlackList.length > 0){
		policyData.push({code: "528B", data: policyDataBlackList});
	}
	
	
	
	
	var installedAppData = new Array(); 
	$('#inputInstallApps :selected').each(function(i, selected){ 
 		installedAppData.push({identity: $(selected).val(), os: $(selected).data('os'), type: $(selected).data('type'),  name: $(selected).data('name')});
	});
	
	if(installedAppData.length > 0){
		policyData.push({code: "509B", data: installedAppData});
	}
	
		
	jQuery.ajax({
		url : getServiceURLs("policiesCRUD", ""),
		type : "POST",
		async : "false",
		data: JSON.stringify({policyData: policyData, policyName: policyName, policyType: policyType, category: "2"}),		
		contentType : "application/json",
     	dataType : "json",
     	statusCode: {
			404: function() {
				noty({
					text : 'Error occured!',
					'layout' : 'center',
					'type': 'error'
				});
			},
			500: function() {
				noty({
					text : 'Fatal error occured!',
					'layout' : 'center',
					'type': 'error'
				});
			},
			201: function() {
				noty({
					text : 'Policy saved successfully!',
					'layout' : 'center'
				});
				window.location.assign("configuration");
			}
		}		
	});
	
		
	
	
});








$( "#modalBlackListAppButton" ).click(function() {
		var alreadyExist = false;
		$("#inputBlackListApps option").each(function(){
    		if($(this).data('type') == $("#modalBlackListType").val() && $(this).val() == $("#modalBlackListPackageName").val() && $(this).data('os') == $("#modalBlackListOS").val() ){
    			noty({
							text : 'Added app already exist!',
							'layout' : 'center',
							'type': 'error'
				});
				alreadyExist = true;
				return;
    		}
		});
	
		if(alreadyExist){
			return;
		}
		$("#inputBlackListApps").append('<option data-type="'+ $("#modalBlackListType").val() +'" data-os="'+ $("#modalBlackListOS").val() +'" value="'+ $("#modalBlackListPackageName").val()  +'">' + $("#modalBlackListPackageName").val()  + '</option>');
});

$( "#modalBlackListAppRemove" ).click(function() {
	 
	 
	 noty({
		text : 'Are you sure you want delete this app from blackisted list?',
		buttons : [{
			addClass : 'btn btn-cancel',
			text : 'Cancel',
			onClick : function($noty) {
				$noty.close();

			}
			
			
		}, {
			
			addClass : 'btn btn-orange',
			text : 'Ok',
			onClick : function($noty) {
				
				 $("#inputBlackListApps :selected").each(function() {
			    		$(this).remove();
				});
				$noty.close();	
				
			}
			
		}]
	});	

	
});




$(document).ready(function() {
	
	/*jQuery.ajax({
		url : getServiceURLs("getMAMApps"),
		type : "GET",
		dataType : "json",
		success : function(apps) {			
			
			for(var i = 0; i < apps.length; i++){
				$('select[name="inputInstallApps_helper1"]').append('<option>'+ apps[i].name + '</option>');
			}

		},
		error : function(jqXHR, textStatus, errorThrown) {

		}
	}); */
	
	
	
	

});
