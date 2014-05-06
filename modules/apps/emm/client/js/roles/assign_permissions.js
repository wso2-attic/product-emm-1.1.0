var selectedGroup = null;

treeData = null;


$(document).ready( function () {
	
	var role = getURLParameter("group");
	
	if(role == null){
		return;
	}
		
	jQuery.ajax({
		url : getServiceURLs("permissionFeatures", role),
		type : "GET",			
		contentType : "application/json",
		dataType : "json",

		success : function(datas){
		 treeData = datas;
		
		
		$("#tree3").dynatree({
      checkbox: true,
      selectMode: 3,
      children: treeData,
      minExpandLevel: 2,
      onSelect: function(select, node) {
        // Get a list of all selected nodes, and convert to a key array:
        var selKeys = $.map(node.tree.getSelectedNodes(), function(node){
          return node.data.key;
        });
        $("#echoSelection3").text(selKeys.join(", "));

        // Get a list of all selected TOP nodes
        var selRootNodes = node.tree.getSelectedNodes(true);
        // ... and convert to a key array:
        var selRootKeys = $.map(selRootNodes, function(node){
          return node.data.key;
        });
        $("#echoSelectionRootKeys3").text(selRootKeys.join(", "));
        $("#echoSelectionRoots3").text(selRootNodes.join(", "));
      },
      onDblClick: function(node, event) {
        node.toggleSelect();
      },
      onKeydown: function(node, event) {
        if( event.which == 32 ) {
          node.toggleSelect();
          return false;
        }
      }     
    });
				
		
		}
	});
	
	
} );





$("#btn-add").click(function() {
	
	 selNodes = null;
	 
	 selectedGroup = $("#inputName").val();
	 
	 $("#tree3").dynatree("getRoot").visit(function (node) {
        selNodes = node.tree.getSelectedNodes();        
     });
     
    
     featureList = Array();     
     var selKeys = $.map(selNodes, function(node1){            
            if(!node1.data.isFolder){
            	featureList.push(node1.data.value);
            }
            
     });	
     
    	
	var bundleName = $('#inputBundleName').val();
		
	
	jQuery.ajax({
		url : getServiceURLs("permissionsCRUD", ""),
		type : "PUT",
		async : "false",
		data: JSON.stringify({selectedGroup: selectedGroup, featureList: featureList}),		
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
								text : 'Permissions are assigned to group successfully!',
								'layout' : 'center'
							});
							window.location.assign("configuration");
						}
					}		
	});
	
	
	
});

