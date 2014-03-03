/*
 Description: Renders the assets.jag view
 Filename:assets.js
 Created Date: 29/7/2013
 */
var render = function (theme, data, meta, require) {
    theme('single-col-fluid', {
        title: data.title,
        header: [
            {
                partial: 'header',
                context: data
            }
        ],
        ribbon: [
            {
                partial: 'ribbon',
                context: data
            }
        ],
        leftnav: [
            {
                partial: 'left-nav'
            }
        ],
        listassets: [
            {
                partial: 'list-assets',
                context: data
            }
        ]
    });
};
