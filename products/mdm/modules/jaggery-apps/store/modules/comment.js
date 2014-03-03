/*var getComment = function (cid) {
 var comment,
 store = require('/store.js').config(),
 registry = require('/modules/store.js').systemRegistry();

 comment = registry.get(store.restEPR + '/comment', {
 commentID: cid
 }, {
 'Authorization': token
 }, 'json').data;
 return comment;
 };*/

var getComments = function (rid, start, count) {
    var comments,
        store = require('/config/store.js').config(),
        registry = require('/modules/store.js').systemRegistry();
    comments = registry.comments(rid);
    return comments;
};

var addComment = function (rid, comment) {
    var registry = require('/modules/store.js').systemRegistry();
    registry.comment(rid, comment);
    return registry.comments(rid);
};

/*
 var deleteComment = function (cid) {
 var comments,
 store = require('/store.js').config(),
 token = require('/modules/store.js').accessToken();

 comments = del(store.restEPR + '/comment', {
 commentID: cid
 }, {
 'Authorization': token
 }, 'json').data;
 return comments;
 };*/
