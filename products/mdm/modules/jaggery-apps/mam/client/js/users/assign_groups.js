$("#btn-add").click(function() {

	var id = $('#inputId').val();
	var groups = $('#inputGroups').val();
	
	var tenantId = $('#tenantId').val();
	
	
	
	var groupsArray = []
	if (groups != null) {
		groupsArray = groups.toString().split(",");
	}
	

	var removedGroups = Array();
	
	//this is not a good thing to have it in the UI, but backend logic need it badly
	$("#inputGroups option").each(function(){ 
		if(groupsArray.indexOf($(this).val()) < 0){
				 removedGroups.push($(this).val());
		}  		
	});
	
		
	jso = {
		"tenant_id" : tenantId,
		"username" : id,
		"added_groups" : groupsArray,
		"removed_groups" : removedGroups
	};

	
	jQuery.ajax({
		url : getServiceURLs("usersCRUD", id + "/groups"),
		type : "PUT",
		async : "false",
		data : JSON.stringify(jso),
		contentType : "application/json",
		dataType : "json",
		statusCode: {
			400: function() {
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
					text : 'Roles are updated for the user successfully!',
					'layout' : 'center',
					callback: {
				        afterClose: function() {
				        	window.location.assign("configuration");
				        }
				    }
				});
				
			}
		}
	});	
	

});


