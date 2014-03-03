
var SERVER_EVENTS = 'server.events';

/**
 * Fetches callback object of this module from the application context.
 */
var callbacks = function () {
    var cbs = application.get(SERVER_EVENTS);
    if (cbs) {
        return cbs;
    }
    cbs = {};
    application.put(SERVER_EVENTS, cbs);
    return cbs;
};

/**
 * Fetches specified event object from the application context.
 * @param event
 * @return {*|Array}
 */
var events = function (event) {
    var cbs = callbacks();
    return cbs[event] || (cbs[event] = []);
};

/**
 * Registers an event listener in the server.
 * @param event
 * @param fn
 * @return {*}
 */
var on = function (event, fn) {
    var group = events(event);
    group.push(fn);
    return fn;
};

/**
 * Removes specified event callback from the listeners.
 * If this is called without fn, then all events will be removed.
 * @param event
 * @param fn callback function used during the on() method
 */
var off = function (event, fn) {
    var index, cbs,
        group = events(event);
    if (fn) {
        index = group.indexOf(fn);
        group.splice(index, 1);
        return;
    }
    cbs = callbacks();
    delete cbs[event];
};

/**
 * Executes event callbacks of the specified event by passing data.
 * @param event
 */
var emit = function (event) {
    var group = events(event),
        log = new Log(),
        args = Array.prototype.slice.call(arguments, 1);
    log.debug('Emitting event : ' + event);
    group.forEach(function (fn) {
        try {
            fn.apply(this, args);
        } catch(e) {
            log.error(e);
        }
    });
};

