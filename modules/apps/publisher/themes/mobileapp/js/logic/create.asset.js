$(function() {

	/*
	Creates a new asset
	 */

	//var id=$('#meta-asset-id').html();
	var type = $('#meta-asset-type').val();

	var TAG_API_URL = '/publisher/api/tag/';
	var tagType = $('#meta-asset-type').val() + 's';

	var tagUrl = TAG_API_URL + tagType;
	var THEME = 'facebook';
	var TAG_CONTAINER = '#tag-container';
	var CHARS_REM = 'chars-rem';
	var DESC_MAX_CHARS = 995;

	$('#overview_description').after('<span class="span8 ' + CHARS_REM + '"></span>');

	//Obtain all of the tags for the given asset type
	$.ajax({
		url : tagUrl,
		type : 'GET',
		success : function(response) {
			var tags = JSON.parse(response);
			$(TAG_CONTAINER).tokenInput(tags, {
				theme : THEME,
				allowFreeTagging : true
			});

		},
		error : function() {
			console.log('unable to fetch tag cloud for ' + type);
		}
	});

	$('#overview_name').on('blur', function() {
		var $this = $(this), flag = $('.icon-check-appname'), btnCreate = $('#btn-create-asset');
		var assetName = $this.val();

		if (!flag.length) {
			$this.after('<i class="icon-check-appname"></i>');
			flag = $('.icon-check-appname');
		}

		//check if the asset name available as user types in
		$.ajax({
			url : '/publisher/api/validations/assets/' + type + '/overview_name/' + assetName,
			type : 'GET',
			success : function(response) {

				var result = JSON.parse(response);

				//Check if the asset was added
				if (result.ok) {
					flag.removeClass().addClass('icon-ok icon-check-appname').show();
					btnCreate.removeAttr('disabled');
					$(".alert-error").hide();
				} else {
					flag.removeClass().addClass('icon-ban-circle icon-check-appname').show();
					btnCreate.attr('disabled', 'disabled');
				}

			},
			error : function(response) {
				flag.removeClass().addClass('icon-ok icon-check-appname').hide();
				showAlert('Unable to auto check Asset name availability', 'error');
			}
		});

	});


	$('#btn-create-asset').on('click', function(e) {
		e.preventDefault();

	/*
		var fields = $('#form-asset-create :input');
			var data = {};
			var formData = {};
			fields.each(function() {
				if (this.type != 'button') {
					//console.log(this.value);
					data[this.id] = this.value;
					formData = fillForm(this, formData);
				}
			});
	
			//Append the tags to the form data
			formData['tags'] = obtainTags();
	*/
	
	//var tags = JSON.stringify(obtainTags());
	

 var options = { 
       // target:        '#output1',   // target element(s) to be updated with server response 
       // beforeSubmit:  showRequest,  // pre-submit callback 
      // data : {"tags":tags},
        success:       function(response) {

				var result = JSON.parse(response);

				//Check if the asset was added
				if (result.ok) {
					showAlert('Asset added successfully.', 'success');
					window.location = '/publisher/assets/' + type + '/';
				} else {
					var msg = processErrorReport(result.report);
					showAlert(msg, 'error');
				}

			},  // post-submit callback 
 		
		 error : function(response) {
						 showAlert('Failed to add asset.', 'error');
				 },
		 
        // other available options: 
        url:       '/publisher/asset/' + type,         // override for form's 'action' attribute 
        type : 'POST'      // 'get' or 'post', override for form's 'method' attribute 
        //dataType:  null        // 'xml', 'script', or 'json' (expected server response type) 
        //clearForm: true        // clear all form fields after successful submit 
        //resetForm: true        // reset the form after successful submit 
 
        // $.ajax options can be used here too, for example: 
        //timeout:   3000 
    }; 
    
    

$('#form-asset-create').ajaxSubmit(options); 




		/*
		$.ajax({
					url : '/publisher/asset/' + type,
					type : 'POST',
					data : formData,
					success : function(response) {
		
						var result = JSON.parse(response);
		
						//Check if the asset was added
						if (result.ok) {
							showAlert('Asset added successfully.', 'success');
							//window.location = '/publisher/assets/' + type + '/';
						} else {
							var msg = processErrorReport(result.report);
							showAlert(msg, 'error');
						}
		
					},
					error : function(response) {
						showAlert('Failed to add asset.', 'error');
					}
				});*/
		

		//$.post('/publisher/asset/'+type, data);

	});

	$('#overview_description').keyup(function() {
		var self = $(this), length = self.val().length, left = DESC_MAX_CHARS - length, temp;

		if (length > DESC_MAX_CHARS) {
			temp = self.val();
			$(this).val(temp.substring(0, DESC_MAX_CHARS));
			console.log("Max chars reached");
			return;
		}
		$('.' + CHARS_REM).text('Characters left: ' + left);
	});

	/*
	 The function is used to build a report message indicating the errors in the form
	 @report: The report to be processed
	 @return: An html string containing the validation issues
	 */
	function processErrorReport(report) {
		var msg = '';
		for (var index in report) {

			for (var item in report[index]) {
				msg += report[index][item] + "<br>";
			}
		}

		return msg;
	}

	/*
	 The function is used to add a given field to a FormData element
	 @field: The field to be added to the formData
	 @formData: The FormDara object used to store the field
	 @return: A FormData object with the added field
	 */
	function fillForm(field, formData) {

		var fieldType = field.type;

		if (fieldType == 'file') {
			console.log('added ' + field.id + ' file.');
			formData[field.id] = field.files[0];
		} else {
			formData[field.id] = field.value;
		}

		return formData;
	}

	/*
	 The function is used to obtain tags selected by the user
	 @returns: An array containing the tags selected by the user
	 */
	function obtainTags() {

		var tagArray = [];

		try {
			var tags = $(TAG_CONTAINER).tokenInput('get');

			for (var index in tags) {
				tagArray.push(tags[index].name);
			}

			return tagArray;
		} catch(e) {
			return tagArray;
		}

	}


	$('.selectpicker').selectpicker();
});
