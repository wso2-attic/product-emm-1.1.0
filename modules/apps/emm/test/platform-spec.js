describe('get-platforms', function () {
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

    it('Test platforms are not null', function () {
        initModule();
        var platforms = platform.getPlatforms();
        expect(platforms).not.toBe(null);
        closeDB();
    });

    it('Test platforms array to contain 1 or more elements', function () {
        initModule();
        var platforms = platform.getPlatforms();
        expect(platforms.length).not.toBe(0);
        closeDB();
    });
});