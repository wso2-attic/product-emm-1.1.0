var appsLoded  = false;

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
	$("[name='inputInstallApps_helper2'] > option").each(function(){ 
 		//alert($(this).text());
 		installedAppData.push({identity: $(this).val(), os: $(this).data('os'), type: $(this).data('type'), name: $(this).data('name')});
	});
	
	if(installedAppData.length > 0){
		policyData.push({code: "509B", data: installedAppData});
	}
	
		
	jQuery.ajax({
		url : getServiceURLs("policiesCRUD", ""),
		type : "PUT",
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
			200: function() {
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
		
		
		if($("#modalBlackListPackageName").val() == ""){
			
			noty({
							text : 'Please add package/bundle name',
							'layout' : 'center',
							'type': 'error'
			});
			return;
		}
		
		
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
	 $("#inputBlackListApps :selected").each(function() {
    		$(this).remove();
	});
});

$( "#modalBlackListAppCreate" ).click(function() {
	 $("#modalBlackListPackageName").val("");
});




$(document).ready( function () {
	
	policyId = getURLParameter("policy");	
	
	jQuery.ajax({
		url : getServiceURLs("policiesCRUD", policyId),
		type : "GET",
		dataType : "json",
		success : function(policyData) {
			//policyData = policyData[0];			
			$("#policyName").val(policyData.name);			
			policyContent = JSON.parse(policyData.mam_content);				
			for( var i = 0; i < policyContent.length; i++){
				var code = policyContent[i].code;
				var data = policyContent[i].data;				
				$.each( data, function( key, value ) {
					if($("#" + code + "-function").attr('type') == "checkbox"){
						if($("#" + code + "-function").data("trueVal") == value){
							$("#" + code + "-function").prop('checked', true);
							$("#" + code + "-policy .icon-ok-sign").css("display", "inline");
						}
						
					}
					
					if($("#" + code + "-" + key).attr('type') == "text" || $("#" + code + "-" + key).attr('type') == "password" || $("#" + code + "-" + key).attr('type') == "select"){
						$("#" + code + "-" + key).val(value);
						$("#" + code + "-policy .icon-ok-sign").css("display", "inline");
					}
					
					
					
					
					
					if(code == '528B'){
						$("#applist .icon-ok-sign").css("display", "inline");							
							$('#inputBlackListApps').append('<option value="'+ value.identity + '" data-os="'+ value.os + '" data-type="'+ value.type + '">'+ value.identity + '</option>');
					}
					
					if(code == '509B'){
						if(!appsLoded){
							
									for(var j = 0; j < data.length; j++){
									$("#applist .icon-ok-sign").css("display", "inline");							
									//alert(data[j].identity);
									 $("[name='inputInstallApps_helper1'] > option").each(function() {
										    //alert(this.text + ' ' + this.value);								   
										    if(data[j].identity === this.value){								    	
										    	 $("[name='inputInstallApps_helper1'] option[value='"+ this.value+"']").remove();
										    }
										      
										});
									
									  $("[name='inputInstallApps_helper2']").append('<option value="'+ data[j].identity + '" data-os="'+ data[j].os + '" data-name="'+ data[j].name + '" data-type="'+ data[j].type + '">'+ data[j].name + '</option>');
									  
		    						  
								}
								appsLoded = true;
								$("#inputInstallApps").trigger('bootstrapduallistbox.refresh', true);
							
							
							
						}
						
					}
					
				});
				
				
			}
			
					
		}
	});

		
	
	
	
} );