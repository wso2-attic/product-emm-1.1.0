var resources = function (page, meta) {
    return {
        js: ['jquery.MetaData.js', 'jquery.rating.pack.js', 'async.min.js', 'asset-core.js', 'asset.js', 'moment.min.js', 'porthole.min.js', 'devices.js'],
        css: ['jquery.rating.css', 'asset.css'],
        code: ['store.asset.hbs']
    };
};

var format = function (context) {
    //adding enriched context for paginating template
    var log = new Log();
    if(context.type === 'gadget') {
        context.asset_css = "cog";

    }else if (context.type === 'site'){
        context.asset_css = "globe";

    }else if(context.type === 'ebook'){
        context.asset_css = "book";

    }else{
        context.asset_css = "link";
    }

    return context;
};