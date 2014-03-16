$("#btn-add").click(function() {
	
	$( 'form').parsley( 'validate' );	
	if(!$('form').parsley('isValid')){
		noty({
				text : 'Input validation failed!',
				'layout' : 'center',
				'type' : 'error'
		});		
		return;
	}
	
	
	//var promocode = $('#promocode').val();
	//var users = $('[name="apps"]').val();
	
	//alert(promocode); return;
	
	

});



$( document ).ready(function() {
	
      $(document).ready(function() { 
            // bind 'myForm' and provide a simple callback function 
            $('#submitform').ajaxForm(function() { 
               // alert("Thank you for your comment!"); 
            }); 
       }); 
    
     
     
     jQuery.ajax({
				url : "/mam/api/apps",
				type : "GET",
				dataType : "json",		
			}).done(function(data) {
				for(i = 0; i < data.length; i++){
					data[i].name = data[i].attributes.overview_name;
				}
				
								
					$('#ms6').magicSuggest({
		    width: 590,
		    highlight: false,
		    data: data,
		    name: 'apps',
		    renderer: function(v){
		    return '<div>' +
		        '<div style="float:left;"><img style="width: 50px" src="' + v.attributes.images_thumbnail + '"/></div>' +
		        '<div style="padding-left: 85px;">' +
		            '<div style="padding-top: 20px;font-style:bold;font-size:120%;color:#333">' + v.attributes.overview_name + '</div>' +
		            '<div style="color: #999">' + v.attributes.overview_name + '</div>' +
		            '</div>' +
		        '</div><div style="clear:both;"></div>';
		    }
		});
	});
     
     
     
});