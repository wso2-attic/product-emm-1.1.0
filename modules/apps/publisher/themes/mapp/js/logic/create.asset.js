$(function () {

  
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

    //Obtain all of the tags for the given asset type
    $.ajax({
        url: tagUrl,
        type: 'GET',
        success: function (response) {
            var tags = JSON.parse(response);
            $(TAG_CONTAINER).tokenInput(tags, {theme: THEME, allowFreeTagging: true});

        },
        error: function () {
            console.log('unable to fetch tag cloud for ' + type);
        }
    });


    $('#btn-create-asset').on('click', function (e) {
        e.preventDefault();
   
        var fields = $('#form-asset-create :input');
        var data = {};
        var formData = new FormData();
        fields.each(function () {
            if (this.type != 'button') {
                //console.log(this.value);
                data[this.id] = this.value;
                formData = fillForm(this, formData);
            }
        });

        //Append the tags to the form data
        formData.append('tags', obtainTags());

        $.ajax({
            url: '/publisher/asset/' + type,
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                alert('asset added.');
                window.location = '/publisher/assets/' + type + '/';
            },
            error: function (response) {
                showAlert('Failed to add asset.', 'error');
            }
        });


        //$.post('/publisher/asset/'+type, data);

    });
    //}


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
            formData.append(field.id, field.files[0]);
        }
        else {
            formData.append(field.id, field.value);
        }

        return formData;
    }

    /*
     The function is used to obtain tags selected by the user
     @returns: An array containing the tags selected by the user
     */
    function obtainTags() {
        var tags = $(TAG_CONTAINER).tokenInput('get');
        var tagArray = [];

        for (var index in tags) {
            tagArray.push(tags[index].name);
        }

        return tagArray;
    }
    
    $('.selectpicker').selectpicker();
});
