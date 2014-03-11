var name,
    log = new Log(),
    that = this,
    hps = require('/themes/store/helpers/assets.js');

/**
 * This is to inherit all variables in the default helper
 */
for (name in hps) {
    if (hps.hasOwnProperty(name)) {
        that[name] = hps[name];
    }
}

var fn = that.resources;

var resources = function (page, meta) {
    var o = fn(page, meta);
    o.js.push('devices.js');
    o.css.push('mobileapp-custom.css');
    return o;
};

var currentPage = function (assetsx,ssox,userx, paging, devicesx) {    
    
    var outx  = {
        'assets': assetsx,
        'sso': ssox,
        'user': userx,
        'devices': devicesx
    };
    return outx;
};
