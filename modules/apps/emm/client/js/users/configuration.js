var selectedUser = null;

//$.fn.dataTableExt.sErrMode = 'ignore';

$(document).ready(function() {
	oTable = $('#main-table').dataTable({
		"sDom" : "<'row-fluid'<'tabel-filter-group span8'T><'span4'f>r>t<'row-fluid'<'span6'i><'span6'p>>",

		"iDisplayLength" : 10,		
		"bProcessing" : false,
		"bServerSide" : true,
		"bSort" : false,
		

		  aoColumns: [
                      
                      null,
                      null,
                      null,
                      null,
                      
                      {                         
                        "sWidth": "40%",
                        "fnRender": function (oObj)                              
                        {                           
                           if(oObj.aData[3] == 'administrator'){
                           	 return '<a href="/mdm/users/view?user='+ oObj.aData[0] +'" data-item="'+ oObj.aData[0] +'" title="View User"><i class="icon-user"> </i> Info</a>&nbsp;' +
                                '<a href="/mdm/users/assign_groups?user='+ oObj.aData[0] +'" class="btn-assign-roles" data-item="'+ oObj.aData[0] +'" title="Assign Roles"><i class="icon-edit"> </i> Assign Roles</a>&nbsp;'; 
                               
                           	
                           }else{
                           	 return '<a href="/mdm/users/view?user='+ oObj.aData[0] +'" data-item="'+ oObj.aData[0] +'" title="View User"><i class="icon-user"> </i> Info</a>&nbsp;' +
                                '<a href="/mdm/users/assign_groups?user='+ oObj.aData[0] +'" class="btn-assign-roles" data-item="'+ oObj.aData[0] +'" title="Assign Roles"><i class="icon-edit"> </i> Assign Roles</a>&nbsp;' +
                                //'<a href="/mdm/users/edit?user='+ oObj.aData[0] +'" class="btn-edit-roles" data-item="'+ oObj.aData[0] +'" title="Edit"><i class="icon-edit"> </i> Edit</a>&nbsp;' + 
                                '<a href="#" class="btn-invite" data-item="'+ oObj.aData[0] +'" title="Invite"><i class="icon-envelope"> </i> Invite</a>&nbsp;' +
                           		 '<a href="#" class="btn-item-remove" data-item="'+ oObj.aData[0] +'" title="Remove"><i class="icon-remove"> </i> Remove</a>&nbsp;';
                           }
                           
                        }
                      },
                       

                   ],	
		
		
		"sAjaxSource" : "/mdm/api/webconsole/allUsers",
		"fnServerParams": function ( aoData ) {
			
			usertype= $('.block-body #userTypeSelect option:selected').val();
          	var roleid = getURLParameter('group');
          	if(roleid != "null"){
          		 aoData.push( { "name": "groupid", "value": roleid } );
            }
            
            if(usertype != ""){
          		  aoData.push( { "name": "userType", "value": usertype } );
            }
           
           
       },
       
       "fnDrawCallback": function( oSettings ) {
       		$(".tabel-filter-group").html("Type: " + fnCreateSelect( this.fnGetColumnData(3)));
	
			$('.tabel-filter-group select').change( function () {
		            oTable.fnFilter( $(this).val(), 3 );
		     } );
       	
      		$('.block-body #userTypeSelect').val(usertype);
    	}
		
	});
	
	
	
	
	

});



function fnCreateSelect( aData ){

    var r='<select id="userTypeSelect"><option value="">--All--</option><option value="user">User</option><option value="administrator">Administrator</option><option value="mam">MAM</option>', i, iLen=aData.length;
   // for ( i=0 ; i<iLen ; i++ )
   // {
   //     r += '<option value="'+aData[i]+'">'+aData[i]+'</option>';
   // }
    return r+'</select>';
}
 


$(".add-group-link").click(function() {
	selectedUser = $(this).data("user");
	$('#assign-group-heading').html("Assign groups to " + selectedUser);

});

//$(".btn-item-remove").click(function() {
$( "#main-table" ).on( "click", ".btn-item-remove", function() {
	var item = $(this).data("item");
		
	noty({
		text : 'Are you sure you want delete this user?',
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
					url : getServiceURLs("hasDevicesEnrolled", item),
					type : "GET",					
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
						200: function(dataResponse) {
							if(dataResponse == "true"){
								noty({
									text : 'This user cannot be deleted. This user has enrolled devices.',
									'layout' : 'center',
									'type': 'error'
								});
							}else{
								
								
						        jQuery.ajax({
									url : getServiceURLs("usersCRUD", item),
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
										200: function() {
											noty({
												text : 'User is unassigned successfully!',
												'layout' : 'center'
											});
											window.location.assign("configuration");
										}
									}
									
							
								}).done(function() {
									$noty.close();					
								});
								
								
							}
						}
					}
					
			
				}).done(function() {
					$noty.close();					
				});
				
				
				
			}
			
		}]
	}); 	


});



//$(".btn-invite").click(function() {
$( "#main-table" ).on( "click", ".btn-invite", function() {
	var item = $(this).data("item");
		
	noty({
		text : 'Are you sure you want invite this user?',
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
				
				var n = noty({
								text : 'Inviting user, please wait....',
								'layout' : 'center',
								timeout: false
											
				});
				
					
				jQuery.ajax({
					url : getServiceURLs("usersInvite"),
					type : "PUT",					
					data : JSON.stringify({'userid': item}),		
					contentType : "application/json",
			     	dataType : "json",
			     	statusCode: {
						400: function() {
							n.close();
							noty({
								text : 'Error occured!',
								'layout' : 'center',
								'type': 'error'
							});
						},
						500: function() {
							n.close();
							noty({
								text : 'Fatal error occured!',
								'layout' : 'center',
								'type': 'error'
							});
						},
						200: function() {
							n.close();
							noty({
								text : 'invitation is sent to user successfully!',
								'layout' : 'center'
							});
							window.location.assign("configuration");
						}
					}
			
				});
							
			
				
				
				
			}
			
		}]
	});
	
	
});
 



$("#btn-assign-group").click(function() {
	$('#assign-group-heading').html("Assign groups to " + selectedUser);
	var userGroups = $('#inputGroups').val();
	var userGroupsArray = []
	if (userGroups != null) {
		userGroupsArray = userGroups.toString().split(",");
	}

	jQuery.ajax({
		url : getServiceURLs("usersCRUD", ""),
		type : "PUT",
		async : "false",
		data : JSON.stringify({
			user : selectedUser,
			groups : userGroupsArray
		}),
		contentType : "application/json",
		dataType : "json",
		success : function(appList) {
			alert(appList);
			noty({
				text : 'Groups are assigned to the user successfully!',
				'layout' : 'center'
			});
		},
		error : function(xhr, textStatus, errorThrown) {
			noty({
				text : xhr.responseText,
				'layout' : 'center'
			});
		}
	});
}); 