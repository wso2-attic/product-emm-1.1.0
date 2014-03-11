var name,
    log = new Log(),
    that = this,
    hps = require('/themes/store/helpers/asset.js');

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
    //o.js.push('mobileapp-install.js');
    //o.css.push('mobileapp-custom.css');
    return o;
};