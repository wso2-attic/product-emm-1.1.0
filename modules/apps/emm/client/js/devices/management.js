var selectbox = '<select name="featureList" id="featureList" class="dropdownimage" style="width:300px">';
selectbox +=										'<option value="">-- Select an operation to Apply --</option>';
selectbox +=											"{{#data.features}}{{#compare feature_type 'OPERATION'}}";
selectbox +=											'<option value="{{name}}" data-image="https://localhost:9443/mdm/themes/wso2sinine/img/features/{{name}}.png">{{description}}</option>';
selectbox +=											'{{/compare}}{{/data.features}}';
selectbox +=											'</select>';


selectedDevices = null;
selectedFeature = null;

oTable = $('#main-table').dataTable({
	
			
	
		"sDom" : "<'row-fluid'<'span6'><'span6'p>r>t<'row-fluid'>",
		"bProcessing" : true,
		"bServerSide" : true,
		"bFilter" : false,
		
		aoColumns: [
                      
                      {"bVisible":    false },
                      {"sWidth": "20%"},

                      {                         
                        "fnRender": function (oObj)                              
                        {                           
                            return "<a href='/mdm/users/devices?user="  + oObj.aData[2] + "#device-tab-"+ oObj.aData[0]+"'>"+  oObj.aData[2] +"</a>";
                        }
                      },
                      
                       null,
                       null,
                       null,
                       

                   ],	
		"sAjaxSource" : "/mdm/api/webconsole/listDevices?",
		"fnServerParams": function ( aoData ) {
          	var roles = $('#inputRoles').val();
			var user = $('#inputUser').val();
			var ownership = $('#inputOwnership').val();
			var os = $('#inputOS').val();
			
            aoData.push( { "name": "role", "value": roles } );
            aoData.push( { "name": "username", "value": user } );
            aoData.push( { "name": "byod", "value": ownership } );
            aoData.push( { "name": "platform_id", "value": os } );
        }
		
	});
	

	



jQuery.ajax({
					url : getServiceURLs("groupsCRUD", ""),
					type : "GET",
					async : "false",					
					contentType : "application/json",
					dataType : "json",
					success : function(roles) {
						
						/*					 $('#inputRoles')
					        .textext({
					            plugins : 'autocomplete tags filter'
					        })
					        .bind('getSuggestions', function(e, data)
					        {            
					            var list = roles,
					                textext = $(e.target).textext()[0],
					                query = (data ? data.query : '') || ''
					                ;
					
					            $(this).trigger(
					                'setSuggestions',
					                { result : textext.itemManager().filter(list, query) }
					            );
					        });*/
						
						
					}					

});






$("#btn-find").click(function() {
	oTable.fnDraw();
});


$( "#featureList" ).change(function() {
	
	
	var roles = $('#inputRoles').val();
	var user = $('#inputUser').val();
	var ownership = $('#inputOwnership').val();
	var os = $('#inputOS').val();
	
	var feature = $(this).val();
	selectedFeature = feature;
	var featureTemplate = $("#featureList option:selected").data('template');
	
	//selectedFeatureTemplate = this.options[this.selectedIndex].data('template');
	//alert(selectedFeatureTemplate);
	
	var nFiltered = oTable.fnGetData();
	
	var devices = new Array();
	
	for(var i = 0; i < nFiltered.length; i++){		
		if (isNaN(nFiltered[i][0]) == false){
			devices.push(nFiltered[i][0].toString() );
			
		}
	}
	
	if(devices.length == 0){
		noty({
					text : 'No devices selected',
					'layout' : 'center',
					'modal': false,
					'type': 'error'
					
		});
		return;
	}
			
	selectedDevices = devices;
	prePerformOperation(devices, feature, featureTemplate);
	
	
	
	
	
	
	
	
	
});



function prePerformOperation(devices, feature, featureTemplate) {

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
		performOperation(devices, feature, {
			data : {}
		});
	}

}


function performOperation(devices, feature, params) {

	noty({
		text : 'Are you sure you want to perform this operation? ' + devices.length + ' devices will be affected',
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
					url : getServiceURLs("performDevicesOperation", feature),
					type : "POST",
					async : "false",
					data : JSON.stringify({operation: feature, devices:devices, params: params}),
					contentType : "application/json",
					dataType : "json",
					

				});

				noty({
					text : 'Operation is sent to the devices successfully!',
					'layout' : 'center',
					'modal': false
					
				});

				$noty.close();
				
				$("#featureList").msDropdown().data("dd").setIndexByValue("");
				$("#featureList").val("");



			}
			
		}]
	});

}


$('#featureModal').on('click', '.feature-command', function(e) {
	var params = {};

	var value = $(this).data('value');
	if (value != "") {
		params['function'] = value;
	}
	
	var validationFailed = false;

	$(".feature-input").each(function(index) {
		if($(this).attr('type') == 'checkbox'){			
			params[$(this).attr("id")] = $(this).is(':checked');
		}else{
			params[$(this).attr("id")] = $(this).val();
			
			if($(this).data("required") == true && $(this).val() == ""){
				validationFailed = true;
				
				
				
			}
		}
	});
	
	if(validationFailed){
			noty({
					text : 'Please fill required fileds',
					'layout' : 'center',
					'modal': false,
					'type': 'error'
				});
			return;	
	}else{
		$('#featureModal').modal('hide');
	}

	performOperation(selectedDevices, selectedFeature, {
		data : params
	});

});


