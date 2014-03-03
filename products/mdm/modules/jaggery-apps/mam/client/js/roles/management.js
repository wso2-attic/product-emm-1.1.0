var selectedFeatureText = null;
var selectedFeature = null;
var selectedGroup = null;
var selectedGroupObj = null;

$('.features-role').draggable({
	revert : true,
	cursor : 'move',
	start : function(ev, ui) {
		selectedFeatureText = $(this).html();
		selectedFeature = $(this).data('feature');
		selectedFeatureTemplate = $(this).data('template');
		var image = $(this).find("img").attr("src");
		//$(this).html('<img src="' + image + '">');
		
		$( ".group-item" ).each(function( index ) {
				//$(this).css("background-image",'url(' + '/mdm/themes/wso2sinine/img/dropmsg.png' + ')');
				//$(this).css("background-size",'100%');
		});
	},

	stop : function() {
		$(this).html(selectedFeatureText);
		
		$( ".group-item" ).each(function( index ) {
				//$(this).css("background-image",'none');
		});

	}
});

$('.group-item').droppable({
	tolerance : "pointer",
	drop : function() {
		selectedGroup = $(this).data('groupId');
		selectedGroupObj = $(this).data('group');		
		prePerformOperation(selectedGroup, selectedFeature, selectedFeatureTemplate);
	}
}); 


function prePerformOperation(groupId, feature, featureTemplate) {

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
		performOperation(groupId, feature, {
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

	performOperation(selectedGroup, selectedFeature, {
		data : params
	});

});



function performOperation(groupId, feature, params) {

	noty({
		text : 'Are you sure you want to perform this operation on group ' + selectedGroupObj.name + '? ' + selectedGroupObj.no_of_devices + ' devices will be affected',
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
					url : getServiceURLs("performGroupOperation", groupId, feature),
					type : "POST",
					async : "false",
					data : JSON.stringify(params),
					contentType : "application/json",
					dataType : "json",
					

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