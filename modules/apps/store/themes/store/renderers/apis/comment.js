var render = function (theme, data, meta, req) {
    var caramel = require('caramel'),
        matcher = new URIMatcher(meta.request.getRequestURI());

    if (matcher.match('/{context}/apis/comments')) {
        print(caramel.build(data));
        return;
    }

    if (matcher.match('/{context}/apis/comments/paging')) {
        print(req('/helpers/pagination.js').format(caramel.build(data)));
        return;
    }

    if (matcher.match('/{context}/apis/comment')) {
        return;
    }
    print(caramel.build(data));
};