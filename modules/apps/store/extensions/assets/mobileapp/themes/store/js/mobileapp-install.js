$(function () {
    $('#btn-add-gadget').unbind('click').click(function (e) {
        e.stopPropagation();
        caramel.get('/extensions/assets/mobileapp/devices', function (data) {
            caramel.partials({
                devices: '/extensions/assets/mobileapp/themes/store/partials/devices.hbs'
            }, function () {
                var devices = Handlebars.partials['devices'](data);
                $('#devices').html(devices).modal({show: true});
                $('#btn-install-apps').click(function () {
                    caramel.ajax({
                        url: '/extensions/assets/mobileapp/process',
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: JSON.stringify({
                            aid: $('#btn-add-gadget').data('aid'),
                            devices: [1, 2]
                        }),
                        success: function (data) {
                            $('#devices').modal('hide');
                            $('#btn-add-gadget').html('Installed')
                                .removeClass('btn-primary')
                                .addClass('disabled')
                                .unbind('click');
                        }
                    });
                })
            });
        }, 'json');
    });

    $('.asset-add-btn').click(function (e) {
        e.stopPropagation();
        location.href = caramel.url('/assets/mobileapp/' + $(this).data('aid'));
    });
});