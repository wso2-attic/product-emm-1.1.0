describe('Platform Module',function(){

    describe('Get platforms operation - Platform Module', function () {
        var db, platform;
        var platform_module = require('/modules/platform.js').platform;

        function initModule() {
            try {
                db = new Database("WSO2_EMM_DB");
                platform = new platform_module(db);
            } catch (e) {
                log.error(e);
            }
        }

        function closeDB() {
            db.close();
        }

        it('Test getPlatforms is not returning null', function () {
            initModule();
            var platforms = platform.getPlatforms();
            expect(platforms).not.toBe(null);
            closeDB();
        });

        it('Test getPlatforms is returning a valid array', function () {
            initModule();
            var platforms = platform.getPlatforms();
            expect(platforms.length).not.toBe(0);
            closeDB();
        });
    });
});
