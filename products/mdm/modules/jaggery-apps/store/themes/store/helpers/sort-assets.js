var format = function (context, paging, navigation, type, selectedCategory) {
    return {
        url: context.url,
        categories : navigation.assets[type].categories,
        type: type,
        selectedCategory: selectedCategory
    };
};

var resources = function (page, meta) {
    return {
        js: ['sort-assets.js'],
        css: ['sort-assets.css']
    };
};