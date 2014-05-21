
$(document).ready(function() { 
    
		 $('#tenetForm').ajaxForm(function(e) { 
            var n = noty({
					text : 'Settings saved!',
					'layout' : 'center',
					timeout: 1000				
								
	        });
             
        }); 
    
});



jQuery("#tenetForm").submit(function(e) {
	
	       $( 'form').parsley( 'validate' );	
             if(!$('form').parsley('isValid')){
                 e.preventDefault();
             }
});


$('#iosAPNSCert').change(function(){
    $('#iosAPNSCertModified').val("true");
});

$('#iosMDMCert').change(function(){
     $('#iosMDMCertModified').val("true");
});