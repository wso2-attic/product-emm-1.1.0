var selectedFeatureText = null;
var selectedFeature = null;
var selectedUser = null;
var selectedUserObj = null;


$( ".device-image" ).each(function( index ) {
	var srcImage = $(this).attr("src");
	if(!urlExists(srcImage)){			
		 $(this).attr("src", "/assets/wso2mobile/img/models/none.png");			
	}
});

$('.features-role').draggable({
	revert : true,
	cursor : 'move',
	start : function(ev, ui) {
		selectedFeatureText = $(this).html();
		selectedFeature = $(this).data('feature');
		selectedFeatureTemplate = $(this).data('template');
		var image = $(this).find("img").attr("src");
		//$(this).html('<img src="' + image + '">');
	},

	stop : function() {
		$(this).html(selectedFeatureText);

	}
});

$('.user-item').droppable({
	tolerance : "pointer",
	drop : function() {
		selectedUser = $(this).data('userId');
		selectedUserObj = $(this).data('user');
		//alert(JSON.stringify(selectedUserObj));
		prePerformOperation(selectedUser, selectedFeature, selectedFeatureTemplate);
	}
}); 


function prePerformOperation(userId, feature, featureTemplate) {

	if (featureTemplate != "") {
		$.get('../client/templates/feature_templates/' + featureTemplate + '.hbs').done(function(templateData) {
			var template = Handlebars.compile(templateData);
			$("#featureModal").html(template({
				feature : feature,
				resourcePath : context().resourcePath
			}));
			$('#featureModal').modal('show');

		}).fail(function() {

		});

	} else {
		performOperation(userId, feature, {
			data : {}
		});
	}

}


$('#featureModal').on('click', '.feature-command', function(e) {
	var params = {};

	var value = $(this).data('value');
	if (value != "") {
		params['function'] = value;
	}

	$(".feature-input").each(function(index) {
		if($(this).attr('type') == 'checkbox'){			
			params[$(this).attr("id")] = $(this).is(':checked');
		}else{
			params[$(this).attr("id")] = $(this).val();
		}
	});

	performOperation(selectedUser, selectedFeature, {
		data : params
	});

});



function performOperation(userId, feature, params) {

	noty({
		text : 'Are you sure you want to perform this operation on ' + selectedUserObj.first_name + ' ' + selectedUserObj.last_name + '\'s devices?',
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

				jQuery.ajax({
					url : getServiceURLs("performUserOperation", userId, feature),
					type : "POST",
					async : "false",
					data : JSON.stringify(params),
					contentType : "application/json",
					dataType : "json"

				});

				noty({
					text : 'Operation is sent to the devices successfully!',
					'layout' : 'center',
					'modal': false
					
				});

				$noty.close();

			}
			
		}]
	});

}