var cache = function (key, value) {
    application.put(key, value);
    return value;
};

var cached = function (key) {
    return application.get(key);
};

var invalidate = function (key) {
    application.remove(key);
};

