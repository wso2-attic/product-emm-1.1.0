/**
 *  Copyright (c) 2011, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var DriverModule = {};

var log = new Log();
var configFile = require('/config/config.json');

/*
 * Get DB instance
 */
DriverModule.getConnection = function(){
    try {
        var db = application.get("db");
        if (!db) {
            db = new Database("EMM_DB_H2")
            application.put("db", db);
        }
        return db;
    } catch (e) {
        log.error(e);
    }

}


/*
 * For H2 database, check if the tables exists else create it.
 */
DriverModule.createDB = function() {
    var db = DriverModule.getConnection();
    if (configFile.H2_DB) {
        try {
            var isDBExist = db.query('SELECT * FROM devices');
        } catch (e) {
            var carbon = require('carbon');
            var h2ScriptPath = carbon.server.home + '/dbscripts/emm/h2/resource.sql';
            var h2ScriptFile = new File(h2ScriptPath);
            h2ScriptFile.open("r");
            var h2Script = h2ScriptFile.readAll();
            h2ScriptFile.close();
            db.query(h2Script);
        }
    }
}
