/*
 Description: The script is used to edit an asset
 Filename: edit.asset.js
 Created Date: 17/8/2013
 */
$(function () {

    //The container used to display messages to the user
    var MSG_CONTAINER='#msg-container-recent-activity';
    var ERROR_CSS='alert alert-error';
    var SUCCESS_CSS='alert alert-info';
    
   

    $('#editAssetButton').on('click', function () {
        var data = {};

        //Obtain the current url
        var url=window.location.pathname;

        //The type of asset
        var type=$('#meta-asset-type').val();


        //The id
        //Break the url into components
        var comps=url.split('/');

        //Given a url of the form /pub/api/asset/{asset-type}/{asset-id}
        //length=5
        //then: length-2 = {asset-type} length-1 = {asset-id}
        var id=comps[comps.length-1];

        //Extract the fields
        var fields = $('#form-asset-edit :input');

        //Create the data object which will be sent to the server
        fields.each(function () {

            if ((this.type != 'button')&&(this.type!='reset')&&(this.type!='hidden')) {
                data[this.id] = this.value;
            }
        });

        var url='/publisher/api/asset/'+type+'/'+id;

        //Make an AJAX call to edit the asset
        $.ajax({
            url:url,
            type:'PUT',
            data:JSON.stringify(data),
            contentType:'application/json; charset=utf-8',
            dataType:'json',
            success:function(response){
                createMessage(MSG_CONTAINER,SUCCESS_CSS,'Asset updated successfully');
            },
            error:function(response){
                createMessage(MSG_CONTAINER,ERROR_CSS,'Asset was not updated successfully.');
            }
        })

    });


    /*
    The function creates a message and displays it in the provided container element.
    @containerElement: The html element within which the message will be displayed
    @cssClass: The type of message to be displayed
    @msg: The message to be displayed
     */
    function createMessage(containerElement,cssClass,msg){
        var date=new Date();
        var time=date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()
        +':'+date.getSeconds();
        var infoMessage='<div class="'+cssClass+'">'
           +'<a data-dismiss="alert" class="close">x</a>'
           +time+' '+msg+'</div';

        //Place the message
        $(containerElement).html(infoMessage);
    }
    
    
	$('.selectpicker').selectpicker();

});
