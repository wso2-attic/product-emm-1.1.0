
$(document).ready(function() { 
    
		 $('#tenetForm').ajaxForm(function(e) { 
            alert("Thank you for your submit!");
             
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