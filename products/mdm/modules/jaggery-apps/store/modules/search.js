/**
 * Query tokenizer. Example queries are(TODO: fix for a b)
 *
 * ' a:b c:d e:"f g: \\"h\\" k" l:"m" ',
 * '"a":b "c":d ',
 * ' "a":b "c":d ',
 * ' "a":"b" "c"',
 * 'a:b c',
 * 'c',
 * 'a:"b" c',
 * '"a":b c',
 * '"a":b "c"',
 * '"a": "b" ',
 * 'a : b',
 * ' a: b ',
 * ' a:b',
 * ' a :b ',
 * 'a:b "c\\"d":"e\\"f"',
 * ' a:b c:d e:"f g: \\"h\\" k" l:"m" ',
 * 'a b',
 * 'a b:',
 * 'a b:c',
 * 'a: b:c',
 * 'a: b:c:',
 * 'a :b:c:',
 * 'a: b:'
 * 'a:"b"'
 * @param q can be something similar to the above example queries
 * @return {Array} [{key: "a", value: "b"}, {key:"c"}]
 */
var tokenize = function (q) {
    var i, ch, last, length,
        key = true,
        esc = false,
        tokens = [],
        token = {},
        buff = [];

    q = q.trim() + ' ';
    length = q.length;
    for (i = 0; i < length; i++) {
        ch = q.charAt(i);
        if ((ch === '"' && last !== '\\')) {
            esc = !esc;
        } else if (esc) {
            buff.push(ch);
        } else if (ch === ' ') {
            if (last !== ' ') {
                //word ended
                if (key) {
                    //key ended
                    token['key'] = buff.join('');
                    tokens.push(token);
                    buff = [];
                    token = {};
                    key = true;
                } else {
                    //value ended
                    if (buff.length) {
                        token['value'] = buff.join('');
                        tokens.push(token);
                        buff = [];
                        token = {};
                        key = true;
                    }
                }
            }
        } else if (ch === ':') {
            if (key && buff.length) {
                //: as a key-value separator
                //key ended
                token['key'] = buff.join('');
                buff = [];
                key = false;
            } else {
                //: as a part of the query
                buff.push(ch);
            }
        } else if (ch === '"') {
            //escaping start or end
        } else {
            //char buffering
            buff.push(ch);
        }
        last = ch;
    }
    if (token.hasOwnProperty('key')) {
        tokens.push(token);
    }
    return tokens;
};

var build = function (query) {
    var tokens = tokenize(query),
        obj = {},
        advanced = false;
    tokens.forEach(function (token) {
        //tokens with just keys will be ignored
        if (token.value) {
            //for the moment search has been restricted only to 'overview' section
            advanced = true;
            obj['overview_' + token.key.toLowerCase()] = token.value;
        }
    });
    return advanced ? obj : query;
};

var fields = function () {
    return [
        {
            "field_name": "provider",
            "field_label": "Provider",
            "search": false
        },
        {
            "field_name": "name",
            "field_label": "Name",
            "search": false
        },
        {
            "field_name": "version",
            "field_label": "Version",
            "search": false
        },
        {
            "field_name": "category",
            "field_label": "Category",
            "search": false
        },
        {
            "field_name": "description",
            "field_label": "Description",
            "search": false
        }
    ];
};