var resources = function (page, meta) {
    return {
        js: ['jquery.MetaData.js', 'jquery.rating.pack.js', 'async.min.js', 'asset-core.js', 'asset.js', 'moment.min.js', 'porthole.min.js'],
        css: ['jquery.rating.css', 'asset.css'],
        code: ['store.asset.hbs']
    };
};

var format = function (context) {
    //adding enriched context for paginating template
    var log = new Log();
    var avg = context.asset.rating.average;
   
    if(context.type === 'gadget') {
        context.asset_css = "cog";

    }else if (context.type === 'site'){
        context.asset_css = "globe";

    }else if(context.type === 'ebook'){
        context.asset_css = "book";

    }else{
        context.asset_css = "link";
    }
    
    context.asset.rating.ratingPx = ratingToPixels(avg);
    
    return context;
};

var formatRatings = function(context){
	var avg;
	for(var i in context){
		avg = context[i].rating;
		context[i].ratingPx = ratingToPixels(avg);
	}

	return context;
}
var ratingToPixels = function(avg) {
	var STAR_WIDTH = 84;
	var MAX_RATING = 5;

	var ratingPx = (avg / MAX_RATING) * STAR_WIDTH;
	return ratingPx;
}
