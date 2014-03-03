
var log=new Log('assets.mobil');
var render = function(theme, data, meta, require) {
    require('/renderers/asset.js').render(theme, data, meta, require);
};