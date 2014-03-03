var gadgets = gadgets || {};
var log = new Log();
(function () {
    gadgets.addGadgetViaAppContext = function (url, options) {
        var layout = application.get('gadgetLayout') || {};

        if (!getGadgetProps(options.id, layout)) {
            layout[options.container] = layout[options.container] || {};

            layout[options.container][options.id] = layout[options.container][options.id] || {
                'url': url,
                'userPrefs': options.userPrefs
            };

            application.put('gadgetLayout', layout);
        }
    };

    gadgets.getGadgetCode = function (url, options) {
        var clientOpt = {
            'url': url,
            'userPrefs': options.userPrefs
        };
        return '<script type="text/javascript"> '
            + 'if(!__gadgetLayout){' +
            '    var __gadgetLayout = {};' +
            ' }' +
            ' __gadgetLayout["' + options.container + '"] =  __gadgetLayout["' + options.container + '"] || {};' +
            ' __gadgetLayout["' + options.container + '"]["' + options.id + '"] = ' + stringify(clientOpt) + ';' +
            '</script>';
    };
    gadgets.addGadget = function (url, options) {
        print(gadgets.getGadgetCode(url, options));
    };

    var getGadgetProps = function (id, layout) {
        for (var gadgetAreaId in layout) {
            var gadgetArea = layout[gadgetAreaId];
            for (var gadgetId in gadgetArea) {
                if (gadgetId == id) {
                    return (layout[gadgetAreaId][gadgetId]);
                }
            }
        }
    };

})();
