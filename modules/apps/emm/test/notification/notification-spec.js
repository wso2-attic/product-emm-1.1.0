
describe('notification module', function() {

    var common = require('/modules/common.js');
    var log = new Log();

    var db = common.getDatabase();
    var sqlscripts = require('/sqlscripts/mysql.js');
    var deviceModule = require('/modules/device.js').device;
    var notificationModule = require('/modules/notification.js').notification;
    var notification = new notificationModule(db);


    it('Get Pending operations for Android', function() {

        var sendRestCall = {};
        sendRestCall.regId = "APA91bEf";
        log.info(" >>>>>>> " + stringify(sendRestCall));
        try {
            notification.getAndroidOperations(sendRestCall);
        } catch (e) {
            log.info(e);
            //Handle situtation where operation is invalid
            //Handle situation where operation is not permitted to user
        }
    });

});