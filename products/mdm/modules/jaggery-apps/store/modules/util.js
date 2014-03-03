var getRXTAttributes = function (tenantId, type) {

    var log=new Log('util');
   // var config = require('/config/publisher.json');
    var store=require('/modules/store.js').storeManagers(request,session);

    //var modelManager = application.get(config.app.MODEL_MANAGER);
    var modelManager=store.modelManager;
    var model = modelManager.getModel(type);
    return model.export('formo');
};


var getCategories = function (tenantId, type) {
    //var config = require('/config/publisher.json');
    var store=require('/modules/store.js').storeManagers(request,session);
    //var modelManager = application.get(config.app.MODEL_MANAGER);
    var modelManager=store.modelManager;
    var model = modelManager.getModel(type);
    var fieldArr = model.export('form')['fields'];

    for (var i in fieldArr) {
        if (fieldArr.hasOwnProperty(i)) {
            if (fieldArr[i].name == 'overview_category')
                return fieldArr[i].valueList;
        }
    }


};


