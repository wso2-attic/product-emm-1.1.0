var format = function (context) {
    //adding enriched context for paginating template
    var i, next, prev,
        left = [],
        right = [],
        pages = Math.ceil(context.total / context.size),
        current = Math.ceil(context.start / context.size) + 1;
    for (i = 1; i <= pages; i++) {
        if (i < current) {
            left.push(i);
        } else if (i > current) {
            right.push(i);
        }
    }
    prev = (current === 1) ? null : current - 1;
    next = (current === pages) ? null : current + 1;
    return pages < 2 ? {} : {
        url: context.url,
        prev: prev,
        left: left,
        current: current,
        right: right,
        next: next
    };
};