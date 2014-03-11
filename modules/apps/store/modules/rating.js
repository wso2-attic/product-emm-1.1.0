var addRating = function (aid, value) {
    var rating,
        store = require('/config/store.js').config(),
        registry = require('/modules/store.js').systemRegistry();

    registry.rate(aid, value);
    return registry.avgRating(aid);
};

var getRating = function (aid) {
    var rating,
        store = require('/config/store.js').config(),
        registry = require('/modules/store.js').systemRegistry();

    rating = {
        avgRating: registry.avgRating(aid),
        rating: registry.rating(aid)
    };
    return rating;
};