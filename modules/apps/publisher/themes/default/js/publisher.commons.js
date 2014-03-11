window.showAlert = function(msg, type) {
	var html = '<div class="info-div alert">';
	html += ' <a data-dismiss="alert" class="close">x</a><i class="icon-info-sign"></i> <span></span>';
	html += '</div>';

	var container = $('.asset-view-container');

	if (!container.has('.alert').length) {
		container.prepend(html);
	}
	var alert = container.find('.alert');
	alert.removeClass().addClass('info-div alert alert-' + type).find('span').html(msg);
	alert.stop().fadeIn("fast");
}

$(document).ready(function() {

	/* creating a new version */
	//The existing versions of the asset
	var existingVersionList = null;
	var ASSET_VERSION_CONTAINER = '#asset-new-version-control-group';
	var ASSET_NEW_VERSION_MSG_CONTAINER = '#asset-new-version-msgs';
	var CSS_ERR = 'control-group error';
	var CSS_SUCCESS = 'control-group success';

	$('.dropdown-toggle').dropdown();
	$('#asset_view_tabs a').click(function(e) {
		e.preventDefault();
		$(this).tab('show');
	});

	$('.list-asset-table').on('click', 'tbody tr', function() {
		var link = $(this).find('.asset-listing-name a').attr('href');
		window.location = link;
	});

	$('#search-button').on('click', search);

	$('#inp_searchAsset').keypress(function(e) {
		if (e.which == 13)
			search();
	});

	$('#asset-new-version-control-group').click(function(e) {
		e.stopPropagation();
	});

	/* creating a new version */
	//initCssContainer(ASSET_VERSION_CONTAINER,[CSS_ERR,CSS_SUCCESS]);

	$('#btn-increase-version-asset').on('click', function(e) {
		e.preventDefault();

		var MSG_ERR_NO_VERSION = 'Version number is empty.';

		var url = window.location.pathname;

		//Obtain the asset id
		var assetId = getAssetIdFromUrl(url);

		var assetType = $('#meta-asset-type').val();

		//Obtain the version entered by the user
		var userProvidedVersion = $('#asset-new-version').val();

		//Check if the user has entered a version
		if (!userProvidedVersion) {
			//alert(MSG_ERR_NO_VERSION);
			displayVersionMessage({
				msgCss : CSS_ERR,
				message : MSG_ERR_NO_VERSION
			});
			return;
		}

		displayVersionMessage({
			msgCss : CSS_SUCCESS,
			message : 'Checking version..'
		});

		//alert('id: '+assetId+' version: '+userProvidedVersion);

		var path = '/publisher/api/version/' + assetType + '/' + assetId;

		//Make a call an obtain the existing asset versions
		$.ajax({
			url : path,
			type : 'GET',
			success : function(response) {
				// alert(response);

				var versionList = JSON.parse(response);

				//Check if the version entered by the user is an existing one
				var existingVersion = checkIfExisting(versionList, userProvidedVersion);

				//Display a message to the user indicating the version exists
				if (existingVersion) {
					displayVersionMessage({
						msgCss : CSS_ERR,
						message : 'Version already exists.'
					});
					return;
				}

				/*
				displayVersionMessage({
									msgCss : CSS_SUCCESS,
									message : 'Creating new version..'
								});*/
				

				createNewVersion(userProvidedVersion, assetId, assetType);
			},
			error : function() {
				alert('unable to retrieve asset version details.');
			}
		});

	});

	$('.btn-upload').on('click', function(e) {
		e.preventDefault();
		$(this).next().click();
	});

	$('input[type="file"]').change(function() {
		$(this).closest('.tbl-upload').find('.txt-filepath').val($(this).val());
	})
	/*
	 The function is used to check if the version entered by the user exists
	 @versionList: A list of versions
	 @newVersion: The new version entered by the user
	 @return: True if the version exists,else False
	 */
	function checkIfExisting(versionList, newVersion) {
		var found = false;

		for (var index = 0; (index < versionList.length) && (!found); index++) {
			if (versionList[index].version == newVersion) {
				found = true;
			}
		}

		return found;
	}

	/*
	 The function is used to create a new version of a given asset
	 @assetId: The id of the asset to be created
	 @newVersion: The new version of the asset to be created
	 */
	function createNewVersion(newVersion, assetId, assetType) {
		var path = '/publisher/api/version/' + assetType + '/' + assetId + '/' + newVersion;

		$.ajax({
			url : path,
			type : 'POST',
			success : function(response) {
				$('#modal-redirect').modal('show');
				setTimeout(function() {
					var newVersionDetails = JSON.parse(response);
					window.location = newVersionDetails.url;
				}, 2000);

			},
			error : function() {
				displayVersionMessage({
					msgCss : CSS_ERR,
					message : 'A new version of this ' + assetType + ' was not created.'
				})
			}
		})
	}

	/*
	 The function is used to display a message in-line
	 @msg: The message to be displayed
	 */
	function displayVersionMessage(msg) {
		var container = ASSET_VERSION_CONTAINER;
		var containerCss = msg.msgCss;
		var msgContainer = ASSET_NEW_VERSION_MSG_CONTAINER;
		var message = msg.message;

		if ($(msgContainer).attr('expanded') != 'true') {
			$(msgContainer).attr('expanded', 'true');
			$(msgContainer).closest('.dropdown-menu').height('+=10');
		}

		$(container).attr('class', containerCss);
		$(msgContainer).html(message);

	}

	/*
	 The function is used to initialize the container housing the version
	 input
	 @container: The container within which the version details reside
	 @classes: The CSS classes to be added to the container.
	 */
	function initCssContainer(container, classes) {
		/* for(var index in classes){
		 console.log('container: '+container+' added class: '+classes[index]);

		 $(container).addClass(classes[index]);
		 $(container).toggleClass(classes[index]);
		 }  */

	}

	/*
	 The function is used to parse a url to obtain the
	 asset id and type.
	 @return: The id component of the url
	 */
	function getAssetIdFromUrl(url) {
		//The id
		//Break the url into components
		var comps = url.split('/');

		//Given a url of the form /pub/api/asset/{asset-type}/{asset-id}
		//length=5
		//then: length-2 = {asset-type} length-1 = {asset-id}
		var id = comps[comps.length - 1];

		return id;
	}

	function search() {
		var searchAssetString = $('#inp_searchAsset').val();
		var searchPrefix = $('#search-prefix').val();

		if (searchAssetString != "") {
			var link = '/publisher/assets/' + searchPrefix + '/?query=' + searchAssetString;
			window.location = link;
		}
	}

});
