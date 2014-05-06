var sqlCRUD = function (schema, options) {
    var log = new Log('sql-crud');
    var db = options.db;
    var Model=schema.getModel();
    /*
        Transform resultset to entity list
    */
    var transform = function(results){
        var props = schema.props; 
        var list = [];
        for (var i = results.length - 1; i >= 0; i--) {
            var result = results[i];
            var obj = new Model();
            var fields = Object.getOwnPropertyNames(props);
            for (var j = fields.length - 1; j >= 0; j--) {

                var field = fields[j];
                obj[field] = result[field.toUpperCase()];
                if(props[field].type=="string"){
                    obj[field] = obj[field].toString();
                }
            };
            list.push(obj);
        };
        return list;
    }

    var removeLastComma = function(query){
        return query.substring(0, query.length - 1);;
    }
     var removeLastAnd = function(query){
        return query.substring(0, query.length - 3);;
    }
    /*
        Make this a top-level method later
    */
    schema.methods.update = function (ids) {
        var props = schema.props;
        var query_line = "UPDATE `"+schema.meta.tablename+"` SET ";
        var keys = Object.getOwnPropertyNames(schema.props);
        
        //Add starting brackets
        var columns = "";
        var where = "";
        for (var i = keys.length - 1; i >= 0; i--) {
            var column = keys[i];
            columns += " "+String.toUpperCase(column) +"='"+this[column]+"',";
        };
        //Add ending brackets
        columns = removeLastComma(columns);

        for (var j = ids.length - 1; j >= 0; j--) {   
            var key_id = ids[j];    
            where+=" "+key_id+"='"+this[key_id]+"' AND";
        };
        where = removeLastAnd(where);
        query_line +=columns+" WHERE "+where;
        log.info(query_line);
        db.query(query_line);
    }
    schema.static.find = function (query, pagination) {
        var types = Object.getOwnPropertyNames(query);
        var query_line = "SELECT * FROM `"+schema.meta.tablename+"` WHERE ";
        var where = "";
        for (var i = types.length - 1; i >= 0; i--) {
            where += " "+types[i]+"='"+query[types[i]]+"' and";
        };
        query_line += removeLastAnd(where);
        log.info('Find Query:- '+query_line);
        var list = transform(db.query(query_line));
        return list;
    };
    schema.static.findAll = function(){
        var query_line = "SELECT * FROM `"+schema.meta.tablename+"`";
        log.info('FindAll Query:- '+query_line);
        var list = transform(db.query(query_line));
        return list;
    }
    /* 
        Will throw exception if more than one result is available for query
    */
    schema.static.findOne = function (query) {
        var types = Object.getOwnPropertyNames(query);
        var query_line = "SELECT * FROM `"+schema.meta.tablename+"` WHERE ";
        var where = "";
        for (var i = types.length - 1; i >= 0; i--) {
            where += " "+types[i]+"='"+query[types[i]]+"' and";
        };
        query_line += removeLastAnd(where);
        log.info('FindOne Query:- '+query_line);
        var list = transform(db.query(query_line));
        if(list.length>1){
            throw "More than one result found";
        }
        return list[0];
    };
    /*
        Advance method used to deal with joins 
        query - SQL query
        mapper - a function that maps query results to the objects. mapper function should accept 
            dataObject and model object
    */
    schema.static.query = function(query, mapper){
        var results = db.query(query);
        var list = [];
        for (var i = results.length - 1; i >= 0; i--) {
            var complexdataObject = results[i];
            var obj = new Model();
            list.push(mapper(complexdataObject, obj));
        };
        return list;
    }

    schema.pre('save', function (entity, next) {
        log.info('Before saving check if all the attributes are present');
    });

    schema.to('save', function (entity, next) {
        var props = schema.props;
        var query = "INSERT INTO `"+schema.meta.tablename+"`";
        var keys = Object.getOwnPropertyNames(entity);
        //Add starting brackets
        var columns = "(";
        var values = "(";
        for (var i = keys.length - 1; i >= 0; i--) {
            var column = keys[i];
            if(typeof(entity[column])!=="function"){
                // var columnType = props[column].type;
                if(entity[column]){
                    columns += String.toUpperCase(column)+",";
                    values += "'"+entity[column]+"',";   
                }
            }
        };
        //Add ending brackets
        columns = removeLastComma(columns) +")";
        values = removeLastComma(values) + ")";

        query +=columns+" VALUES "+values;
        db.query(query);
    });

    schema.pre('init', function (entity, next) {
    });

};