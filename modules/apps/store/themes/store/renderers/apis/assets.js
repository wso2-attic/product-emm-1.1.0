var render = function (theme, data, meta, req) {
    var paging,
        caramel = require('caramel'),
        matcher = new URIMatcher(meta.request.getRequestURI());
    if (matcher.match('/{context}/apis/assets/{type}')) {
        print(caramel.build(data));
        return;
    }
    if (matcher.match('/{context}/apis/assets/{type}/paging')) {
        data.url = '/assets/' + data.type + '?sort=' + data.sort + '&page=';
        print(req('/helpers/pagination.js').format(data));
        return;
    }
    print(caramel.build(data));
};