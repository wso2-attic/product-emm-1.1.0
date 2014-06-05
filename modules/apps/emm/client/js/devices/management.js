
var selectbox = '<select name="featureList" id="featureList" class="dropdownimage" style="width:300px">';
selectbox +=										'<option value="">-- Select an operation to Apply --</option>';
selectbox +=											"{{#data.features}}{{#compare feature_type 'OPERATION'}}";
selectbox +=											'<option value="{{name}}" data-image="../themes/' + uiConfig.EMM_THEME + '/img/features/{{name}}.png">{{description}}</option>';
selectbox +=											'{{/compare}}{{/data.features}}';
selectbox +=											'</select>';


selectedDevices = null;
selectedFeature = null;

oTable = $('#main-table').dataTable({



    "sDom" : "<'row-fluid'<'span6'><'span6'p>r>t<'row-fluid'>",
    "bProcessing" : true,
    "bSort" : false,
    "bServerSide" : true,
    "bFilter" : false,
    
    aoColumns: [
        {"bVisible":    false },
        {              
            "mData": null,
            "fnRender": function (oObj)                              
            {                           
                
               
                var srcImage = context().devicesImageService + "/" + oObj.aData[1] + ".png";
                if(!urlExists(srcImage)){			
                         srcImage =  context().resourcePath + "none.png";			
                }
                
                
                return  "<a href='/emm/users/devices?user="  + oObj.aData[3] + "#device-tab-"+ oObj.aData[0]+"'>" +     "<div style=\"text-align:center\"><img title=\"" + oObj.aData[1] + "\" class=\"device-image\" style=\"height:75px\" src=\"" + srcImage  + "\"> </div> "  +"</a>";
                
                
                
                
            }
        },
        {   "sWidth": "20%", 
             "mData": null,
            "fnRender": function (oObj)                              
            {                           
                var imei = "N/A" 
                    
                if( oObj.aData[2] != null){
                    imei = oObj.aData[2]
                }
                return "<a href='/emm/users/devices?user="  + oObj.aData[3] + "#device-tab-"+ oObj.aData[0]+"'>"+  imei +"</a>";
            }
        },
        null,
        null,
        null,
        null,
       /* {                         
            "sWidth": "40%",
            "fnRender": function (oObj)                              
            {
                return '<a href="#" class="btn-item-remove" data-item="'+ oObj.aData[0] +'" title="Remove"><i class="icon-remove"> </i> Remove</a>&nbsp;';
            }
        } */


    ],	
    "sAjaxSource" : "/emm/api/webconsole/listDevices?",
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


$( document ).ready(function() {

    jQuery.ajax({
        url : getServiceURLs("platformCRUD", ""),
        type : "GET",
        contentType : "application/json",
        dataType : "json",
        success: function(platforms){
            var html = '<option value="">--All--</option>';
            $.each( platforms, function( key, platform ) {
                //alert(JSON.stringify(platform));
                html += "<option value='"+ platform.id +"'>" + platform.name + "</option>";
            });

            $("#inputOS").html(html);
        }		
    });  



});




$( "#main-table" ).on( "click", ".btn-item-remove", function() {
    var item = $(this).data("item");

    noty({
        text : 'Are you sure you want delete this device?',
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
                 $noty.close();	
                jQuery.ajax({
                    url : getServiceURLs("devicesCRUD", item),
                    type : "DELETE",					
                    contentType : "text/plain",
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
                        403: function() {
                            noty({
                                text : 'Error occured!',
                                'layout' : 'center',
                                'type': 'error'
                            });
                        },
                        200: function() {
                            noty({
                                text : 'device is deleted successfully!',
                                'layout' : 'center'
                            });
                            window.location.assign("management");
                        }
                    }


                }).done(function() {
                   	 $noty.close();			
                });


            }

        }]
    }); 	


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
                $("#featureList").msDropdown().data("dd").setIndexByValue("");
                $("#featureList").val("");
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
                    text : 'Operation queued successfully!',
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


$('#featureModal').on('click', '.btn-cancel', function(e) {
     $("#featureList").msDropdown().data("dd").setIndexByValue("");
     $("#featureList").val("");


});


$(".btn-enroll").click(function() {
    var enrollURL = $(this).data('url') +  "/emm/api/device_enroll";
         
	noty({
                        text : '<u>Enroll URL</u>: ' + enrollURL + '<div  id="qrcode" style="width:200px; padding-left:45px"></div>',
                        buttons : [{
                            addClass : 'btn btn-orange',
                            text : 'OK',
                            onClick : function($noty) {
                                $noty.close();
                            }


                        }]
                    });
     updateQRCode(enrollURL);    

}); 

function updateQRCode(text) {

    var element = document.getElementById("qrcode");



    var bodyElement = document.body;
    if(element.lastChild)
        element.replaceChild(showQRCode(text), element.lastChild);
    else
        element.appendChild(showQRCode(text));

}


