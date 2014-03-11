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
				var requireData = $(this).data("requiredata");
				if(checkVal !== ""){
					if(requireData){
						if($("#" + requireData).val() == ""){
							return;
						}
					}
					
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
		if(!isEmptyObj(params[param])){    	
     		policyData.push({code: param, data: params[param]});
     	}
	}


	/* comment because this is not belong to mdm

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
 		installedAppData.push({identity: $(selected).val(), os: $(selected).data('os'), type: $(selected).data('type')});
	});
	
	if(installedAppData.length > 0){
		policyData.push({code: "509B", data: installedAppData});
	}
	
	*/

    var n = noty({
        text : 'Saving policy, please wait....',
        'layout' : 'center',
        timeout: false

    });
	
		
	jQuery.ajax({
		url : getServiceURLs("policiesCRUD", ""),
		type : "PUT",
		async : "false",
		data: JSON.stringify({policyData: policyData, policyName: policyName, policyType: policyType, category: "1"}),		
		contentType : "application/json",
     	dataType : "json",
        statusCode: {
            400: function() {
                n.setText('Error occured!');
                n.setType('error');
                n.setTimeout(1000);
            },
            404: function() {
                n.setText('API not found!');
                n.setType('error');
                n.setTimeout(1000);
            },
            500: function() {
                n.setText('Fatal error occured!');
                n.setType('error');
                n.setTimeout(1000);
            },
            200: function() {
                n.setText('Policy saved successfully!');
                window.location.assign("configuration");
            },
            409: function() {
                n.setText('Policy already exist!');
                n.setType('error');
                n.setTimeout(1000);
            }
        }
	});
	
	
});




$( "#modalBlackListAppButton" ).click(function() {
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
			$("#policyType").val(policyData.type);			
			policyContent = JSON.parse(policyData.content);				
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
					
					if($("#" + code + "-" + key).attr('type') == "checkbox"){
						//alert(code + " " + key + " " + $("#" + code + "-" + key).attr('type'));						
						if($("#" + code + "-" + key).data("trueVal") == value){							
							$("#" + code + "-" + key).prop('checked', true);
							$("#" + code + "-policy .icon-ok-sign").css("display", "inline");
						}
						
					}
					
					if($("#" + code + "-" + key).attr('type') == "text" || $("#" + code + "-" + key).attr('type') == "password" || $("#" + code + "-" + key).is("select")){
						$("#" + code + "-" + key).val(value);
						$("#" + code + "-policy .icon-ok-sign").css("display", "inline");
					}	
					
					
					
					
					
					if(code == '528B'){
						for(var j = 0; j < data.length; j++){
							$("#applist .icon-ok-sign").css("display", "inline");							
							$('#inputBlackListApps').append('<option value="'+ data[j].identity + '" data-os="'+ data[j].os + '" data-type="'+ data[j].type + '">'+ data[j].identity + '</option>');
						}
					}
					
				});
				
				
			}
			
			validations();		
		}
		
		
	});

		
	
	
	
} );



function isEmptyObj(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}



//validations

$( ".policy-input" ).change(function() {
	
	validations();

});


function validations(){
	//remove allow simple when minimum complex characters are set
	if(! ($('#519A-minComplexChars').val() == "" || $('#519A-minComplexChars').val() == "0")){
		$('#519A-allowSimple').parent().parent().hide();
		$('#519A-allowSimple').prop('checked', false);
	}else{
		$('#519A-allowSimple').parent().parent().show();
	}
	
	
	//remove encryption passcode when passcode policy is set
	if($('#519A-maxFailedAttempts').val() != "" | $('#519A-minLength').val() != ""){
		$('#511A-password').parent().parent().hide();
		$('#511A-password').val("");
	}else{
		$('#511A-password').parent().parent().show();
	}
	
}
