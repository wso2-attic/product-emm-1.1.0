$("#btn-add").click(function() {

	var groupName = $('#inputName').val();
	var users = $('#inputUsers').val();
	
	var tenantId = $('#tenantId').val();
	
	
	
	var usersArray = []
	if (users != null) {
		usersArray = users.toString().split(",");
	}
	

	var removedUsers = Array();
	
	//this is not a good thing to have it in the UI, but backend logic need it badly
	$("#inputUsers option").each(function(){ 
		if(usersArray.indexOf($(this).val()) < 0){
				 removedUsers.push($(this).val());
		}  		
	});
	
		
	jso = {
		"tenant_id" : tenantId,
		"name" : groupName,
		"added_users" : usersArray,
		"removed_users" : removedUsers
	};

	
	
	
	jQuery.ajax({
		url : getServiceURLs("groupsAssign", groupName),
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
						404: function() {
							noty({
								text : 'API Not Found',
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
								text : 'Users are assigned to group successfully!',
								'layout' : 'center'
							});
							window.location.assign("configuration");
						}
			}
	});
	
	

});


