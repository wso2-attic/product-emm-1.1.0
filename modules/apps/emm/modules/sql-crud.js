var sqlCRUD = function (schema, options) {
    var log = new Log('sql-crud');
    var db = options.db;

    var transform = function(results){
        var props = schema.props; 
        var list = [];
        var Model=schema.getModel();
        for (var i = results.length - 1; i >= 0; i--) {
            var result = results[i];
            var obj = new Model();
            var fields = Object.getOwnPropertyNames(props);
            for (var j = fields.length - 1; j >= 0; j--) {
                var field = fields[j];
                obj[field] = result[field.toUpperCase()];
            };
            list.push(obj);
        };
        return list;
    }

    schema.static.find = function (query, pagination) {
        try{
            var types = Object.getOwnPropertyNames(query);
            var query_line = "SELECT * FROM "+schema.meta.tablename+" WHERE ";
            var where = "";
            for (var i = types.length - 1; i >= 0; i--) {
                where += " "+types[i]+"='"+query[types[i]]+"' and";
            };
            where = where.substring(0, where.length - 3);
            query_line = query_line+where;
            log.info(query_line);
            var results = db.query(query_line);
            var list = transform(results);
        }catch(e){
            log.info(e);
        }
        return list;
    };
    schema.static.findAll = function(){
        try{
            var query_line = "SELECT * FROM "+schema.meta.tablename;
            log.info(query_line);
            var results = db.query(query_line);
            var list = transform(results);
        }catch(e){
            log.info(e);
        }
        return list;
    }

    schema.static.findOne = function (query) {
        try{
            var types = Object.getOwnPropertyNames(query);
            var query_line = "SELECT * FROM "+schema.meta.tablename+" WHERE ";
            var where = "";
            for (var i = types.length - 1; i >= 0; i--) {
                where += " "+types[i]+"='"+query[types[i]]+"' and";
            };
            where = where.substring(0, where.length - 3);
            query_line = query_line+where;
            log.info(query_line);
            var results = db.query(query_line);
            var list = transform(results);
        }catch(e){
            log.info(e);
        }
        if(list.length>1){
            throw "One than one result found";
        }
        return list;
    };

    schema.pre('save', function (entity, next) {
        log.info('Before saving check if all the attributes are present');
    });

    schema.to('save', function (entity, next) {
        try{
            // log.info(entity);
            log.info(schema.props);
            var props = schema.props;
            var query = "INSERT INTO `"+schema.meta.tablename+"`";
            var keys = Object.getOwnPropertyNames(entity);
            var columns = "(";
            var values = "(";
            for (var i = keys.length - 1; i >= 0; i--) {
                var column = keys[i];
                var columnType = props[column].type;
                columns += String.toUpperCase(column)+","
                values += "'"+entity[column]+"',";
            };
            columns = columns.substring(0, columns.length - 1) +")";
            values = values.substring(0, values.length - 1) + ")";
            query +=columns+" VALUES "+values;
            //log.info(query);
            db.query(query);
            // var results = db.query("SELECT * FROM `platforms`");
            // db.query("CREATE TABLE `devices` (`id` int(11) NOT NULL AUTO_INCREMENT,`name` varchar(45) DEFAULT NULL, `description` varchar(45) DEFAULT NULL, `registrationDate` timestamp DEFAULT NULL)");
        }catch(e){
            log.info(e);
        }
    });

    schema.pre('init', function (entity, next) {
    });

};