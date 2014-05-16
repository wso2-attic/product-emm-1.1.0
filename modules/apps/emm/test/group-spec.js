describe('group-operation', function () {
    try{
        db = new Database("WSO2_EMM_DB");
    }catch(e){
        log.error(e);
    }
    var group_module = require('/modules/group.js').group;
    var group;
    beforeEach(function () {
        group = new group_module(db);
    });
    it('Test getAllGroups is not equal to null', function () {
        var allGroups = group.getAllGroups({});
        expect(allGroups).not.toBe(null);
    });
    it('Test getAllGroups is not equal to undefined', function () {
        var allGroups = group.getAllGroups({});
        expect(allGroups).not.toBe(undefined);
    });
    it('Test getAllGroups is not equal to empty String', function () {
        var allGroups = group.getAllGroups({});
        expect(allGroups).not.toBe("");
    });
});