/**
 * Description: The Entity module implements a basic entity management framework
 */
var entity = {};
var Schema = {};
var model = {};    //Returns a model based on the provide schema name
var schema = {};

(function () {


    var log = new Log('entity');
    var utils = require('utils');

    function EntityManager() {
        this.schemas = {};
        this.generators = {};
    }

    /**
     * The function is used to register a schema with the entity manager
     */
    EntityManager.prototype.register = function (schema) {
        var schemaName = schema.meta.name;

        //Do nothing if the schema name has not been provided
        if (schemaName) {
            this.schemas[schemaName] = schema;
            this.generators[schemaName] = generator(schema);
        }
    };

    /**
     * The function returns an entity instance given the schema name of the entity
     * @param schemaName
     */
    EntityManager.prototype.entity = function (schemaName) {
        if (this.generators.hasOwnProperty(schemaName)) {
            var generator = this.generators[schemaName];
            var schema = this.schemas[schemaName];

            //Attach the static methods
            attachStaticMethods(generator, schema);

            //TODO:Cache this the first time so we don't loop
            return generator;
        }
        return null;
    };

    EntityManager.prototype.findSchema = function (schemaName) {
        if (this.generators.hasOwnProperty(schemaName)) {
            return this.schemas[schemaName];
        }
    };

    /**
     * The function adds static methods defined in the schema to the
     * generator function
     * @param generator
     * @param schema
     */
    var attachStaticMethods = function (generator, schema) {
        for (var index in schema.static) {
            generator[index] = schema.static[index];

            //schema.static[index].bind(generator);
        }
    };

    var DEFAULT_FIELD_TYPE = 'string';
    var DEFAULT_REQUIRED = false;
    var DEFAULT_STRING_VALUE = '';
    var DEFAULT_NUM_VALUE = 0;
    var DEFAULT_BOOL_VALUE = false;

    /**
     * The class is used to describe a field type
     */
    function FieldType(options) {
        this.type = DEFAULT_FIELD_TYPE;
        this.default = '';
        this.required = DEFAULT_REQUIRED;
        this.validations = [];    //A validation object
        utils.reflection.copyProps(options, this);

        this.type = typeof this.type();
        //Assign default values based on the type
        this.default = this.default ? this.default : getDefaultValues(this.type);

        resolveDefaultValidations(this);
    }

    FieldType.prototype.validation = function (validator, msg) {
        this.validations.push({msg: (msg || 'No error message defined'),
            validator: validator});
    };

    /**
     * The function will assign the default value based on the type
     * @param fieldType
     * @param field
     */
    var getDefaultValues = function (fieldType) {
        var value;
        switch (fieldType) {
            case 'string':
                value = DEFAULT_STRING_VALUE;
                break;
            case 'number':
                value = DEFAULT_NUM_VALUE;
                break;
            case 'boolean':
                value = DEFAULT_BOOL_VALUE;
                break;
            default:
                value = DEFAULT_STRING_VALUE;
                break;
        }

        return value;
    };

    function EntitySchema(entityName, entityProps, entityMeta) {

        this.meta = entityMeta || {};
        this.props = entityProps || {};
        this.meta.name = entityName;
        this.meta.plugins = {};

        resolveTypes(entityProps);

        //Register the schema
        EntitySchema._em.register(this);

        this.methods = {};
        this.static = {};
        //this._em=EntitySchema._em;

        this.meta.plugins.save = {pre: [], post: [], to: []};
        this.meta.plugins.init = {pre: [], post: [], to: []};
        //this.meta.plugins.validate = {pre: [], post: []};
        this.meta.plugins.remove = {pre: [], post: [], to: []};

        //Attach validations
        attachValidations(this);

        //Attach default static methods
        attachDefaultStaticMethods(this);
    }


    /**
     * The function resolves the types of each of the
     * properties
     * @param props
     */
    var resolveTypes = function (props) {

        var keys = Object.keys(props);

        for (var index in keys) {
            recurseResolveType(props, keys[index]);
        }
    };

    /**
     * The function recursively fills in the FieldType data of fields
     * @param obj The object to be examined
     * @param key The current property of the object to be examined
     */
    var recurseResolveType = function (obj, key) {
        var type = typeof obj[key];
        if (type == 'function') {
            obj[key] = new FieldType({type: obj[key]});
        }
        else {
            //Determine if it is a nested object
            if (isNestedObject(obj[key])) {

                //Go through each key in the nested object
                var keys = Object.keys(obj[key]);

                for (var index in keys) {
                    recurseResolveType(obj[key], keys[index]);
                }
            }
            else {
                //Check if it is a type definition
                obj[key] = new FieldType(obj[key]);
            }

        }
    };

    /**
     *The function determines if a provided object is a nested object by
     1. Checking if it is an object
     2. If it is an object it should not have a property called type or if it does type should declare its own definition
     @return: True if the object is a nested type,else false
     */
    var isNestedObject = function (obj) {
        return((obj.constructor.name == 'Object') && ((!obj.hasOwnProperty('type')) || (isTypeDefinition(obj))));
    };

    /**
     * The function checks if the provided object has a type definition .i.e. a child property
     * @param obj The object to be inspected
     * @returns True if there is a child property
     */
    var isTypeDefinition = function (obj) {
        if (obj.type) {
            if (obj.type.type) {
                return true;
            }
        }

        return false;
    }

    /**
     * The function attaches the default static methods
     * @param schema
     */
    var attachDefaultStaticMethods = function (schema) {
        schema.static.find = function () {
            log.warn('Find method not implemeneted');
            return [];
        };

        schema.static.findOne = function () {
            log.warn('FindAll method not implemented');
        };


        schema.static.create = function (options) {
            var generator = getEntity(schema.meta.name);
            return new generator();
        };
    };

    /**
     * The function adds the default validations for a given field type
     */
    var resolveDefaultValidations = function (fieldSchema) {
        if (fieldSchema.required) {
            fieldSchema.validations.push({msg: 'Required field', validator: requiredFieldValidator});
        }
    };

    var requiredFieldValidator = function (fieldSchema, fieldValue) {
        if ((!fieldValue) || (fieldValue == '')) {
            return false;
        }

        return true;
    };

    /**
     * The function is used to return a reference to a field
     * @param fieldName
     * @returns {*}
     */
    EntitySchema.prototype.field = function (fieldName) {

        var field = null;

        for (var key in this.props) {
            field = recurseLocateField(this.props, fieldName, key)

            //Stop the search if the field was located
            if (field) {
                return field;
            }
        }

        return field;
    };

    /**
     * The function is used to recursively locate a field in the schema
     * @param entity
     * @param fieldName
     * @param key
     */
    var recurseLocateField = function (props, fieldName, key) {
        if (isFieldType(props[key])) {
            if (key == fieldName) {
                return props[key];
            }
        }
        else {
            //Go through all the properties
            var keys = Object.keys(props[key]);
            entity[key] = {};

            for (var index in keys) {
                recurseLocateField(props[key], fieldName, keys[index]);
            }

            return null;
        }
    };

    EntitySchema.prototype.pre = function (action, handler) {

        initPlugins(action, this.meta.plugins);

        this.meta.plugins[action].pre.push(handler);
    };

    EntitySchema.prototype.post = function (action, handler) {

        initPlugins(action, this.meta.plugins);

        this.meta.plugins[action].post.push(handler);
    };

    EntitySchema.prototype.to = function (action, handler) {
        this.meta.plugins[action].to.push(handler);
    };

    /**
     * The function allows a plugin to define extra properties
     * @param options An object containing properties to be added to the schema
     */
    EntitySchema.prototype.add = function (options, entity) {

        resolveTypes(options);

        //Add each property in the options object to the properties
        for (var key in options) {
            this.props[key] = options[key];
        }

        //if the user has given an entity then add the new properties to the object
        if (entity) {

            for (var key in options) {
                recursiveFillProps(options, entity, key);
            }
        }
    };

    /**
     * The function copies the provided options only to the current entity
     * @param options  The field properties to be added
     * @param entity  The entity instance to be modified
     */
    EntitySchema.prototype.addToEntity = function (options, entity) {
        for (var key in options) {
            //entity[key] = this.props[key].default;
            recursiveFillProps(options, entity, key);
        }
    };

    EntitySchema.prototype.getModel=function(){
        return EntitySchema._em.entity(this.meta.name);
    };

    EntitySchema.prototype.save = function (entity) {
        //var entity = entity.toJSON();

        var preSave = this.meta.plugins.save.pre;
        var postSave = this.meta.plugins.save.post;
        var toSave = this.meta.plugins.save.to;
        var action = 'save';

        executePluginList('pre' + action, entity, preSave);
        executePluginList(action, entity, toSave);
        executePluginList('post' + action, entity, postSave);
    };

    /**
     * The function will invoke any initialization logic on the entity which invokes this method
     * @param entity  The entity which has invoked the init method
     */
    EntitySchema.prototype.init = function (entity) {
        //var entity = entity;
        var pre = this.meta.plugins.init.pre;
        var post = this.meta.plugins.init.post;
        var to = this.meta.plugins.init.to;
        var action = 'init';

        executePluginList('pre' + action, entity, pre);
        executePluginList(action, entity, to);
        executePluginList('post' + action, entity, post);
    };

    /**
     * The function is called whenever the current entity needs to be removed.It will call any plugins
     * registered to remove the entity.
     */
    EntitySchema.prototype.remove = function (entity) {
        //var entity = entity.toJSON();
        var pre = this.meta.plugins.remove.pre;
        var post = this.meta.plugins.remove.post;
        var to = this.meta.plugins.remove.to;
        var action = 'remove';

        executePluginList('pre' + action, entity, pre);
        executePluginList(action, entity, to);
        executePluginList('post' + action, entity, post);
    };


    /**
     * The function creates properties in an entity instance
     * @param entity
     */
    EntitySchema.prototype.fillProps = function (entity) {
        for (var key in this.props) {
            //entity[key] = this.props[key].default;
            recursiveFillProps(this.props, entity, key);
        }
    };

    /**
     * The function is used to recursively populate an empty object with properties of the schema
     * @param props The properties to be mirrored in the object
     * @param entity The object which will be provided to the user
     * @param key The current property to be examined
     */
    var recursiveFillProps = function (props, entity, key) {
        if (isFieldType(props[key])) {
            entity[key] = props[key].default;
        }
        else {
            //Go through all the properties
            var keys = Object.keys(props[key]);
            entity[key] = {};
            for (var index in keys) {

                recursiveFillProps(props[key], entity[key], keys[index]);
            }
        }
    };

    /**
     * The function checks whether the provided object is of the FieldType
     * @param obj The object to examined
     * @returns True if the object is a FieldType object
     */
    var isFieldType = function (obj) {
        return (obj.constructor.name == 'FieldType') ? true : false;
    };

    /**
     * The function allows a plugin to install itself for the schema
     * @param plugin  The plug-in to be installed to the schema
     */
    EntitySchema.prototype.plugin = function (plugin, options) {
        var options = options || {};
        plugin(this, options);
    };

    /**
     * The function attaches validations to occur before the save method is invoked
     * @param schema
     */
    var attachValidations = function (schema) {

        var errors = {};

        schema.pre('save', function (entity, next) {

            log.info('Performing validations');

            for (var key in schema.props) {
                recurseDoValidate(entity, schema.props, key, {});
            }

            next();
        });
    };

    /**
     * The function recursively performs some validation
     * @param entity
     * @param props
     * @param key
     * @param errors
     */
    var recurseDoValidate = function (entity, props, key, errors) {
        if (isFieldType(props[key])) {
            validateField(props[key], entity[key], key, errors);
        }
        else {
            //Go through all the properties
            var keys = Object.keys(props[key]);

            for (var index in keys) {
                recurseDoValidate(entity[key], props[key], keys[index], errors);
            }
        }
    };

    /**
     * The function is used to validate a field value based on the schema
     * and then record the validation failure to an object.
     * @param field
     * @param value
     * @param fieldName
     * @param errors
     * @returns {*}
     */
    var validateField = function (field, value, fieldName, errors) {

        var validations = field.validations;
        var validation;

        for (var index in validations) {
            validation = validations[index];

            if (!validation.validator(value, field)) {

                if (!errors[fieldName]) {
                    errors[fieldName] = {};
                }

                errors[fieldName].value = value;
                errors[fieldName].msg = validation.msg;
            }

        }
    };

    var initPlugins = function (action, plugins) {
        if (!plugins.hasOwnProperty(action)) {
            plugins[action] = {};
            plugins[action].pre = [];
            plugins[action].post = [];
        }
    };

    var ERR_ARITY = 3;
    var HANDLER_ARITY = 2;
    /**
     * The function executes each plugin in an array of plug-ins while
     * giving plug-in the option to continue to the next or stop processing
     * @param plugins
     */
    var executePluginList = function (action, entity, plugins) {
        if (plugins.length == 0) {
            //log.warn('No plugins defined for ' + action);
            return;
        }

        var index = 0;

        var next = function (err) {
            var plugin = plugins[index];
            index++;

            if (!plugin) {
                log.warn('End of plugin chain');
                return;
            }

            if (err) {
                //Check if the current plugin can handle errors
                if (plugin.length == ERR_ARITY) {
                    plugin(err, entity, next);
                }
                else {
                    next(err);
                }
            }
            else {
                if (plugin.length == HANDLER_ARITY) {
                    plugin(entity, next);
                }
                else {
                    next();
                }
            }
        };

        next();
    };

    /**
     * The generator method takes a schema and then prepares a class which can be instanitaed by the user
     * @param schema The schema on which the class should be created
     * @returns An object which can be used to describe assets
     */
    var generator = function (schema) {

        var ptr = function (options) {

            //Add the properties that should be present based on the schema
            schema.fillProps(this);

            //utils.reflection.copyProps(options, this);
            utils.reflection.copyAllPropValues(options, this);

            //Bind the methods to the object
            for (var index in schema.methods) {
                log.info('Adding instance method ' + index);
                this[index] = schema.methods[index];
            }

            this.init();
        };

        ptr.prototype.getSchema = function () {
            return schema;
        };

        ptr.prototype.save = saveHandler;
        ptr.prototype.remove = removeHandler;
        ptr.prototype.validate = validateHandler;
        ptr.prototype.init = initHandler;
        ptr.prototype.toJSON = toJSON;

        return ptr;
    };

    var initHandler = function () {
        this.getSchema().init(this);
    };

    /**
     * The method will create a simple JSON object of the entity.It accepts
     * an optional boolean value; if true it will ignore hidden properties,else all properties will
     * be added to the resulting object.
     * @isPublicOnly (Optional) It is true by default
     * @returns A JSON object
     */
    var toJSON = function () {
        var data = {};
        utils.reflection.copyAllPropValues(this, data);

        //utils.reflection.copyProps(this, data);
        return data;
    };

    var saveHandler = function () {
        this.getSchema().save(this);
    };

    var removeHandler = function () {
        this.getSchema().remove(this);
    };

    var validateHandler = function () {
        this.getSchema().validate(this);
    };


    /**
     * A utility method to return an Entity
     * @param schemaName
     * @returns {*}
     */
    var getEntity = function (schemaName) {
        return entityManager.entity(schemaName);
    };


    var getSchema = function (schemaName) {
        return entityManager.findSchema(schemaName);
    };

    var entityManager = new EntityManager();

    /* if (!session.get('enManager')) {
     log.info('Caching Entity Manager');
     entityManager = new EntityManager();
     session.put('enManager', entityManager);
     }
     else {
     log.info('Using cached Entity Manager');
     entityManager = session.get('enManager');
     } */

    EntitySchema._em = entityManager;


    Schema = EntitySchema;
    entity.EntityManager = entityManager;
    model = getEntity;
    schema = getSchema;

}());
