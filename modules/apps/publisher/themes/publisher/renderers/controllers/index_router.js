var render = function (theme, data, meta, require) {
    theme('single-col-fluid', {
        title: data.title,
        ribbon: [
            {
                partial: 'ribbon'
            }
        ],
        leftnav: [
            {
                partial: 'left-nav'
            }
        ],
        listassets: [
            {
                partial: 'list-assets'
            }
        ]
    });
};

