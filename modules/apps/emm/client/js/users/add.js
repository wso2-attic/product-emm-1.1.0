
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

	var firstname = $('#inputFirstName').val();
	var lastname = $('#inputLastName').val();
	var type = $('input[name="inputType"]:checked').val();
	var username = $('#inputUsername').val();
    var email = $('#inputEmail').val();
	
		
	var userMAMGroups = $('#inputMAMGroups').val();
	var tenantId = $('#tenantId').val();
	
	
	if($(".radioUserType:checked").val() == 'user'){
		var userGroups = $('#inputGroups').val();
	}else{
		var userGroups = [];
	}
	
	
	if(userGroups != null){
		if(userMAMGroups != null){
			userGroups = userGroups + "," + userMAMGroups;
		}
		
	}else{
		if(userMAMGroups != null){
			userGroups = userMAMGroups;
		}		
	}
	
	
	var userGroupsArray = [];
	if (userGroups != null) {
		userGroupsArray = userGroups.toString().split(",");
	}
	
	
	//alert(userGroupsArray);
	
	// alert(JSON.stringify(userGroupsArray));
	jso = {
		"tenant_id" : tenantId,
		"username" : username,
        "email" : email,
		"first_name" : firstname,
		"last_name" : lastname,
		"type": type,
		"groups" : userGroupsArray	
	};	
	
	 var n = noty({
					text : 'Adding user and sending an invitation, please wait....',
					'layout' : 'center',
					timeout: false				
								
	});
	
	
	
		
	jQuery.ajax({
		url : getServiceURLs("usersCRUD", ""),
		type : "POST",		
		data : JSON.stringify(jso),		
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
			201: function(data) {
               if(data.responseText != 'SUCCESSFUL'){
                  n.setTimeout(0);	
                    noty({
                       text : '<b>User Added successfully!</b> <br>' + '<u>User Password</u>: ' + data.password + '<br>' + '<u>Enroll URL</u>: ' + data.enroll_url,
                        buttons : [{
                            addClass : 'btn btn-orange',
                            text : 'OK',
                            onClick : function($noty) {
                                $noty.close();
                                window.location.assign("configuration");    
                            }


                        }]
                    });

                   
               }else{
                   n.setText('User Added successfully!');	
				   window.location.assign("configuration");
               }
				
			},
			409: function() {				
				n.setText('User already exist!');	
				n.setType('error');
				n.setTimeout(1000);			
			}
		}				
	});
	

});





$( ".radioUserType" ).change(function() {
	var value = $(this).val();	
	//$(".inputGroupsSelect .box1 .filter").val(value);	
	//$(".inputGroupsSelect .box1 .filter" ).change();
	
	if(value == 'user'){
		$("#userSeletBox").css("display", "block");		
	}else{
		$("#userSeletBox").css("display", "none");		
	}
});



