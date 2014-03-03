/*
 Description: The script is responsible for the implementing the client side logic;
    - Promoting an asset to the next stage of its life-cycle
    - Demoting an asset to the previous stage of its life-cycle
    - Obtaining the check list for a given state
    - Handling the click events associated with the check list items by calling the remote api responsible for
      ticking an asset check list item.
 Filename: lifecycle.asset.js
 Created Date: 23/8/2013
 */

var onCheckListItemClick=function(){};


$(function(){

    /*
    Obtain the current url to get the id and asset type
     */
    var url=window.location.pathname;

    //Break the url into components
    var comps=url.split('/');

    //Given a url of the form /pub/api/asset/{asset-type}/{asset-id}
    //length=5
    //then: length-2 = {asset-type} length-1 = {asset-id}
    var id=comps[comps.length-1];
    var asset=comps[comps.length-2];

    console.log(asset);
    console.log(id);

    buildCheckList(asset,id);


    /*
    Promotes an asset
     */
    $('#btn-asset-promote').on('click',function(){
       console.log('/publisher/api/lifecycle/Promote/'+asset+'/'+id);
        $.ajax({
          url:'/publisher/api/lifecycle/Promote/'+asset+'/'+id,
          type:'PUT',
          success:function(response){
              alert('Promoted');


              $.ajax({
                  url:'/publisher/api/lifecycle/'+asset+'/'+id,
                  type:'GET',
                  success:function(response){
                      $('#state').html(response);
                      $('#view-lifecyclestate').html(response);
                      buildCheckList(asset,id);
                  },
                  error:function(response){
                      $('#state').html('Error obtaining state');
                  }
              });
          },
          error:function(response){

              alert('Not promoted');
          }
        });
    });

    /*
    Demotes an asset
     */
    $('#btn-asset-demote').on('click',function(){
        $.ajax({
            url:'/publisher/api/lifecycle/Demote/'+asset+'/'+id,
            type:'PUT',
            success:function(response){
                alert('Demoted');

                $.ajax({
                    url:'/publisher/api/lifecycle/'+asset+'/'+id,
                    type:'GET',
                    success:function(response){
                        $('#state').html(response);
                        $('#view-lifecyclestate').html(response);
                        buildCheckList(asset,id);
                    },
                    error:function(response){
                        $('#state').html('Error obtaining life-cycle state of asset.');
                    }
                });
            },
            error:function(response){
                alert('Not demoted');
            }
        });


    });



    /*
    The function is used to build the representation of the check list.
     */
    function buildCheckList(asset,id){

        //Clear the checklist rendering area
        $('#checklist').html('');

        //Make a call to the lifecycle check list
        $.ajax({
            url:'/publisher/api/lifecycle/checklist/'+asset+'/'+id,
            type:'GET',
            success:function(response){

                var out='<ul>';

                var obj=JSON.parse(response);

                for(var index in obj.checkListItems){

                   var current=obj.checkListItems[index];

                   out+='<li><input type="checkbox" onclick="onCheckListItemClick(this,'+index+')" ';

                   if(current.checked){
                        out+='checked';
                   }

                   out+='>'+current.name+'</label></li>';
                }

                out+='</ul>';

                //Render the check list
                $('#checklist').html(out);
            }

        });
    }

    /*
    Click handler which detects when a check list item is clicked
     */
    function onCheckListItemClickHandler(checkbox,index){

        if(checkbox.checked){
            callCheckListItem(checkbox,index);
        }
        else{
            callUncheckListItem(checkbox,index);
        }
    }
    /*
    The function checks a life-cycle check list item by calling the checklist api method
     */
    function callCheckListItem(checkbox,checkListItemIndex){
        $.ajax({
            url:'/publisher/api/lifecycle/checklistitem/'+checkListItemIndex+'/'+asset+'/'+id,
            type:'POST',
            success:function(response){
                alert('Item checked successfully');
            },
            error:function(response){
                checkbox.checked=false; //Revert the checkbox to the previous state
                alert('Could not check item');
            }
        });
    }

    /*
    The function unchecks a life-cycle check list item by calling the checklist api method
     */
    function callUncheckListItem(checkbox,checkListItemIndex){
        $.ajax({
            url:'/publisher/api/lifecycle/checklistitem/'+checkListItemIndex+'/'+asset+'/'+id,
            type:'DELETE',
            success:function(response){
                alert('Item unchecked successfully');
            },
            error:function(response){
                checkbox.checked=true;  //Revert the checkbox to previous state
                alert('Could not uncheck item');
            }
        });
    }

   /*
   Click handlers for the checkboxes
    */
   onCheckListItemClick=onCheckListItemClickHandler;

});