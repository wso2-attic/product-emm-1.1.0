/*
 Description: The script updates a list of recently added assets of a given asset type.This logic will periodically refresh
 the list of assets that are pending indexing.If the indexing completes this script will trigger a refresh.
 Filename:recent-assets.js
 Created Date: 22/10/2013
 */
$(function () {

    var RECENT_ASSET_CONTAINER = '#recent-assets-container';
    var REFRESH_TIMER = 4000;
    var CACHE_URL = '/publisher/api/cache/';

    //Get the details of the page
    var context = obtainMetaInformation();

    //Perform a fetch as soon as the page loads
    retrieve(context);

    //Periodically update the pending assets
    setInterval(function () {

       retrieve(context);

    }, REFRESH_TIMER);
	var recentTmpl = '{{#each cachedAssets}}';
		recentTmpl += '		<div class="row-fluid">';
		recentTmpl += '			<div class="span10"><i class="icon-ok-circle"></i> <span><strong>{{attributes.overview_name}}</strong> is being added</span></div>';
		recentTmpl += '			<div class="span2"><i class="icon-refresh icon-spin"></i></div>';
		recentTmpl += '     </div>';
		recentTmpl += '{{/each}}';

    /*
    The function is used to fetch pending assets.A pending asset is one which has been added but not indexed
    @context: The context of the current page
     */
    function retrieve(context){
        $.ajax({
            url: context.url,
            type: 'GET',
            success: function (response) {

                var respObj=JSON.parse(response);
               	
               	if(respObj.cachedAssets.length){
               		var recentTmplComp =  Handlebars.compile(recentTmpl);
					$('.asset-being-added').html(recentTmplComp(respObj)).slideDown();
               	}
				
                if(respObj.cachedAssetsBefore!=respObj.cachedAssetsAfter){

                    window.location='/publisher/assets/'+context.type+'/';
                }
            },
            error: function (e) {
                showMessage('Unable to retrieve new assets');
            }
        });
    }

    /*
    The function renders the assets recently added assets
    @assets: An array of assets
     */
    function renderAssets(assets) {
        $(RECENT_ASSET_CONTAINER).html(assets);
    }

    /*
    The function displays a message in the recent asset container
     */
    function showMessage(message) {
        $(RECENT_ASSET_CONTAINER).html(message);
    }

    /*
    The function obtains details of  page
    @return: An object containing the type of asset and the url used to retrieve the recentkt
     */
    function obtainMetaInformation() {
        //Obtain the current url
        var url = window.location.pathname;

        //The type of asset
        var type = $('#meta-asset-type').val();

        //The id
        //Break the url into components
        var comps = url.split('/');

        //Given a url of the form /pub/api/asset/{asset-type}/{asset-id}
        //length=5
        //then: length-2 = {asset-type} length-1 = {asset-id}
        //var id=comps[comps.length-1];
        var type = comps[comps.length - 2];

        var url = CACHE_URL + type;

        return {
            type: type,
            url: url
        }
    }
});
