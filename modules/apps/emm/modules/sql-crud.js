var sqlCRUD = function (schema, options) {

    var log = new Log('sql-crud');

    var populateRXTFields = function (entity, options) {
        var type = entity.type;

        if (type === '') {
            log.debug('type not specified');
            return;
        }

        schema.addToEntity({
            attributes: {
                overview_name: String
            }
        }, entity);

    };

    schema.static.find = function (type, query, pagination) {
        var db = options.db;
        var assets= assetManager.search(type, query||null, pagination||null);
        var Model=schema.getModel();
        var items=[];
        var model;
        var id,type,path,lifecycle,lifecycleState,mediaType;

        for(var index in assets){
            id=assets[index].id;
            type=assets[index].type;
            lifecycle=assets[index].lifecycle;
            lifecycleState=assets[index].lifecycleState;
            mediaType=assets[index].mediaType;
            model=new Model({attributes:assets[index].attributes});
            items.push(model);
        }

        return items;
    };

    schema.static.findOne = function (type, query, pagination) {
        var assetManager = options.assetManager();
        return assetManager.search(type, query, pagination);
    };

    schema.pre('save', function (entity, next) {
        log.info('Before saving check if all the attributes are present');
    });

    schema.to('save', function (entity, next) {
        log.info('Saving the entity');
        entity = entity.toJSON();
        var assetManager = options.assetManager();
        assetManager.add(entity, options);
    });

    schema.pre('init', function (entity, next) {
        populateRXTFields(entity);
    });

};