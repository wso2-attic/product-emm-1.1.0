/**
Initilization logic
**/
var entity = require('entity');
var sql_crud = require('/modules/sql-crud.js').sqlCRUD;
try {
    var db = application.get("db");
    if (!db) {
        db = new Database("JAGH2")
        application.put("db", db);
    }
} catch (e) {
    log.error(e);
}

var DeviceSchema = new entity.Schema("Device", {
    id: Number,
    tenant_id: Number,
    user_id: String,
    platform_id: String,
    udid: String,
    os_version: String,
    ownership: Number,
    mac_address: String,
    status: String,
    created_date: Date,
    updated_date: Date
}, {
    tablename: "devices"
});
// Need to know the database
DeviceSchema.plugin(sql_crud, {
    db: db
});