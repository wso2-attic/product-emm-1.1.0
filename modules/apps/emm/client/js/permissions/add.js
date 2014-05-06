$("#btn-add").click(function() {	
	
	var groupId =  $("#inputGroupId").val();
	var features = $('#inputFeatures').val();
	
	var featuresArray = []
	if (features != null) {
		featuresArray = features.toString().split(",");
	}	
	
	jQuery.ajax({
		url : getServiceURLs("permissionsCRUD", ""),
		type : "POST",
		async : "false",
		data: JSON.stringify({groupId: groupId, features: featuresArray}),		
		contentType : "application/json",
		dataType : "json",		
	});
	
	noty({
		text : 'Permission Added successfully!',
		'layout' : 'center',
		'modal': false
	});
	
	//window.location.reload(true);
	
});