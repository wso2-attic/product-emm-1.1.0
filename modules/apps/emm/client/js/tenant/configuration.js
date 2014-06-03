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
            
            $('#aPNSCertFileName').html(data.iosAPNSCertFileName);
            $('#mDMCertFileName').html(data.iosMDMCertFileName);
        }
        
        toggleAPNSCerts();
        toggleMDMCerts()
    });


});



jQuery("#tenetForm").submit(function(e) {

    $( 'form').parsley( 'validate' );	
    if(!$('form').parsley('isValid')){
        e.preventDefault();
    }

    var emailFieldCount = 0;
    var emailFieldFilledCount = 0;
    
    var iosFieldCount = 0;
    var  iosFieldFilledCount = 0;

    $('input').each(function(){

       
        if($('#emailSenderAddress').val() != ""){
             if($(this).attr('id').startsWith('email')){
        
                emailFieldCount++;
                if($(this).val() != ""){
                    emailFieldFilledCount++;
                }
              

            }
        }
       
        
        
        if($(this).attr('id').startsWith('ios')){
            
            if(!($(this).attr('type') == 'hidden' || $(this).attr('type') == 'file')){
                
                iosFieldCount++;
                if($(this).val() != ""){
                    iosFieldFilledCount++;
                }
            }
            
        }

    });

    
    if(emailFieldFilledCount != 0){
        if(emailFieldFilledCount < emailFieldCount){
            var n = noty({
                text : 'Please fill all the email configurations related values or leave all blank',
                'layout' : 'center',
                timeout: 1000,
                type: "error"

            });
            
             e.preventDefault();
        }
    }
    
    
    if(iosFieldFilledCount != 0){
        if(iosFieldFilledCount < iosFieldCount){
            var n = noty({
                text : 'Please fill all the iOS configurations related values or leave all blank',
                'layout' : 'center',
                timeout: 1000,
                type: "error"

            });
            
             e.preventDefault();
        }
    }




});


$('#iosAPNSCert').change(function(){
    var extension = $(this).val().replace(/^.*\./, '');
    if(extension != "pfx"){
        $(this).val("");
        var n = noty({
            text : 'Please select a pfx file',
            'layout' : 'center',
            timeout: 1000,
            type: "error"

        });
    }
    $('#iosAPNSCertModified').val("true");
    $('#aPNSCertFileName').html("");
    toggleAPNSCerts();
});

$('#iosMDMCert').change(function(){
    var extension = $(this).val().replace(/^.*\./, '');
    if(extension != "pfx"){
        $(this).val("");
        var n = noty({
            text : 'Please select a pfx file',
            'layout' : 'center',
            timeout: 1000,
            type: "error"

        });
    }
    $('#iosMDMCertModified').val("true");
     $('#mDMCertFileName').html("");
    toggleMDMCerts();
});


function toggleAPNSCerts(){
    if($('#iosAPNSCertModified').val() == "true"){
        $('#iosAPNSPass').prop('disabled',false);
    }else{
        $('#iosAPNSPass').prop('disabled',true);
    }
}


function toggleMDMCerts(){
    if($('#iosMDMCertModified').val() == "true"){
        $('#iosMDMPass').prop('disabled',false);
        $('#iosMDMTopic').prop('disabled',false);
    }else{
        $('#iosMDMPass').prop('disabled',true);
        $('#iosMDMTopic').prop('disabled',true);
    }
}