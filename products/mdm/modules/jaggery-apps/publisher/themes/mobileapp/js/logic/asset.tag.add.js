/*
Description: The script is used to populate the tag text box
Created Date: 4/10/2013
Filename: asset.tag.add.js
 */
$(function(){

    var TAG_API_URL='/publisher/api/tag/';
    var type=$('#meta-asset-type').val()+'s';

    var url=TAG_API_URL+type;
    var THEME='facebook';
    var TAG_CONTAINER='#tag-container';

    //Obtain all of the tags for the given asset type
    $.ajax({
        url:url,
        type:'GET',
        success:function(response){
            var tags=JSON.parse(response);
            $(TAG_CONTAINER).tokenInput(tags,{theme:THEME, allowFreeTagging: true});

        },
        error:function(){
            console.log('unable to fetch tag cloud for '+type);
        }
    });



});
