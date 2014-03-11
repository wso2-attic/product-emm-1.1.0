  var treeData = [   
    {title: "Operations", value: "OPERATIONS", isFolder: true, key: "1",
      children: [
        {title: "Screen Lock", value: "LOCK"},
        {title: "Wipe", value: "WIPE"},
        {title: "Clear Password", value: "CLEARPASSWORD"},
        {title: "Camera", value: "CAMERA"},
        {title: "Mute", value: "MUTE"},
        {title: "Encrypt", value: "ENCRYPT"} 
      ]
    },
    {title: "Configurations", value: "CONFIGURATIONS", isFolder: true, key: "1",
      children: [

        {title: "Passcode Policy", value: "PASSCODEPOLICY"},
        {title: "Email Configuration", value: "EMAIL"},
        {title: "Google Calendar", value: "GOOGLECALANDAR"},
        {title: "LDAP Configuration", value: "LDAP"}
      ]
    },
    {title: "Information", value: "INFORMATION", isFolder: true, key: "1",
      children: [
        {title: "Device Information", value: "INFO"},
      ]
    },
     {title: "Messaging", value: "MESSAGING", isFolder: true, key: "1",
          children: [
              {title: "Messaging", value: "NOTIFICATION"}
          ]
     }
  ];
  $(function(){

   
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
    
  });



$("#btn-add").click(function() {
	
	 selNodes = null
	 
	 $("#tree3").dynatree("getRoot").visit(function (node) {
        selNodes = node.tree.getSelectedNodes();        
     });
     
    
     featureList = Array();     
     var selKeys = $.map(selNodes, function(node1){            
            featureList.push(node1.data.value);
     });	
     
    	
	var bundleName = $('#inputBundleName').val();
		
	
	jQuery.ajax({
		url : getServiceURLs("permissionsCRUD", ""),
		type : "PUT",
		async : "false",
		data: JSON.stringify({bundleName: bundleName, featureList: featureList}),		
		contentType : "application/json",
		dataType : "json",
		error: function(datas){
	       	
	       					if (datas.status == 200) {

									noty({
										text : 'Permission Added success!',
										'layout' : 'center',
										'modal' : false
									});
									

								} else {

									noty({
										text : 'Permission adding failed!',
										'layout' : 'center',
										'modal' : false,
										type : 'error'
									});

									
								} 
	       	
	       	
	       	
	    }		
	});
	
	
	
	//window.location.reload(true);
	
});