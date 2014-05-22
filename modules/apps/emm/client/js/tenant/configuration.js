if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
    };
}



$(document).ready(function() { 

    $('#tenetForm').ajaxForm(function(e) { 
        var n = noty({
            text : 'Settings saved!',
            'layout' : 'center',
            timeout: 1000				

        });

    }); 


    $.ajax({
        url: getServiceURLs("tenantConfig", ''),
        type : "GET",

    }).done(function(data) {
        data = JSON.parse(data);
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                $("#" + key).val(data[key]);
            }
        }
    });


});



jQuery("#tenetForm").submit(function(e) {

    $( 'form').parsley( 'validate' );	
    if(!$('form').parsley('isValid')){
        e.preventDefault();
    }

    var emailFiledCount = 0;
    var emailFiledFilledCount = 0;
    
    var iosFiledCount = 0;
    var  iosFiledFilledCount = 0;

    $('input').each(function(){

        if($(this).attr('id').startsWith('email')){
            emailFiledCount++;
            if($(this).val() != ""){
                emailFiledFilledCount++;
            }

        }
        
        
        if($(this).attr('id').startsWith('ios')){
            
            if(!($(this).attr('type') == 'hidden' || $(this).attr('type') == 'file')){
                iosFiledCount++;
                if($(this).val() != ""){
                    iosFiledFilledCount++;
                }
            }
            
        }

    });

    
    if(emailFiledFilledCount != 0){
        if(emailFiledFilledCount < emailFiledCount){
            var n = noty({
                text : 'Please fill all the email related values',
                'layout' : 'center',
                timeout: 1000,
                type: "error"

            });
            
             e.preventDefault();
        }
    }
    
    
    if(iosFiledFilledCount != 0){
        if(iosFiledFilledCount < iosFiledCount){
            var n = noty({
                text : 'Please fill all the iOS related values',
                'layout' : 'center',
                timeout: 1000,
                type: "error"

            });
            
             e.preventDefault();
        }
    }




});


$('#iosAPNSCert').change(function(){
    $('#iosAPNSCertModified').val("true");
});

$('#iosMDMCert').change(function(){
    $('#iosMDMCertModified').val("true");
});