var resources = function (block, page, area, meta) {
    return {
        template: 'assets.hbs',
        js: ['asset-core.js', 'asset-helpers.js', 'assets.js'],
        css: ['assets.css'],
        code: ['store.asset.hbs']
    };
};

var currentPage = function (assetsx,ssox,userx, paging) {
    var outx  = {
        'assets': assetsx,
        'sso': ssox,
        'user': userx
    };
    return outx;
};

var format = function (fields) {
    fields.searchFields.forEach(function (field) {
        field.field_name = field.field_name.toLocaleLowerCase();
    });
    return fields;
};

