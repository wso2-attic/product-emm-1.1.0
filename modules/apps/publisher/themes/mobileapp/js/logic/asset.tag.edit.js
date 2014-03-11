/*
 Description: The script is used to edit the tags of an asset
 Created Date:4/10/2013
 Filename: asset.tag.edit.js
 */
$(function () {

    /*
     Obtain the current url to get the id and asset type
     */
    var url = window.location.pathname;

    //Break the url into components
    var comps = url.split('/');

    //Given a url of the form /pub/api/asset/{asset-type}/{asset-id}
    //length=5
    //then: length-2 = {asset-type} length-1 = {asset-id}
    var assetId = comps[comps.length - 1];
    var assetType = comps[comps.length - 2];

    var TAG_CONTAINER = '#tag-test';
    var TAG_API = '/publisher/api/tag/'
    var TAG_THEME = 'facebook';
    var ERROR_CSS='alert alert-error';
    var MSG_CONTAINER='#msg-container-recent-activity';



    //$(TAG_CONTAINER).tokenInput([],{theme: TAG_THEME});
    //fetchTagsOfAssetType(assetType,assetId);
    fetchTagsOfType(assetType);


    /*
     The function is used to fetch the tags of the current asset type
     @assetType: The asset type for which the tags must be fetched
     */
    function fetchTagsOfType(assetType) {

        $.ajax({
            url: TAG_API + assetType + 's',
            type: 'GET',
            success: function (response) {

                var tags = JSON.parse(response);
                console.log('obtaining tags of type.');

                fetchTagsOfAsset(assetType, assetId, tags);
            },
            error: function () {
                console.log('unable to retrieve tags for ' + assetTYpe);
            }
        });
    }


    /*
     The function is used to fetch the tags of the current asset
     @assetType: The asset type for which the tags must be fetched
     @assetId: The asset id of the asset for which the tags must be fetched
     */
    function fetchTagsOfAsset(assetType, assetId, masterTags) {

        $.ajax({
            url: TAG_API + assetType + '/' + assetId,
            type: 'GET',
            success: function (response) {
                var tags = JSON.parse(response);

                //Initialize the tag container
                $(TAG_CONTAINER).tokenInput(masterTags, {theme: TAG_THEME, prePopulate: tags, preventDuplicates: false,
                    onAdd: onAdd,
                    allowFreeTagging: true,
                    onDelete: onRemove});

            }
        });

    }

    /*
     The function is called when a tag is added to an asset
     @item: The tag object which has been added to the asset
     */
    function onAdd(item) {

        var data = {};

        var tags = [item.name];
        data['tags'] = tags;

        //Make an api call to add the tag
        $.ajax({
            url: TAG_API + assetType + '/' + assetId,
            type: 'PUT',
            data: JSON.stringify(data),
            contentType:'application/json; charset=utf-8',
            dataType:'json',
            success:function(response){
            },
            error:function(){
                createMessage(MSG_CONTAINER,ERROR_CSS,'Unable to add the selected tag.');
            }
        });
    }

    /*
     The funciton is called when a tag is removed from an asset
     @item: The tag object which has been removed from the asset
     */
    function onRemove(item) {

        var data = {};

        var tags = [item.name];
        data['tags'] = tags;

        //Make an api call to add the tag
        $.ajax({
            url: TAG_API + assetType + '/' + assetId+'/'+item.name,
            type: 'DELETE',
            success:function(response){
            },
            error:function(){
                createMessage(MSG_CONTAINER,ERROR_CSS,'Unable to detach the selected tag.');
            }
        });
    }

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

});
