$(function () {

    $('button[data-toggle=tooltip]').tooltip();

    $(document).on('click', '#myasset-container .asset-remove-btn', function () {
        caramel.get('/apis/remove', {
            aid: $(this).attr('data-aid'),
            type: $(this).attr('type')
        }, function (data) {
            location.reload();
        });
    });

    $('.embed-snippet').hide();

    $(document).on('click', '#myasset-container .btn-embed', function () {
        $(this).closest('.store-my-item').find('.embed-snippet').toggle(50);
        return false;
    });

    $('.popover-content').live("click", function (event) {
        $('.arrow').css({"display": "none"});
    });

    $(".popover-content").live("mouseleave", function () {
        $('.arrow').css({"display": "block"});
    });


});
