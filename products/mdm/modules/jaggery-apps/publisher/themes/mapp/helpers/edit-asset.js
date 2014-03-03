var resources=function(page,meta){
    var log=new Log('edit-asset');
    log.info('resource called');
    return{
        js:['edit.asset.js','/logic/asset.tag.edit.js', 'bootstrap-select.min.js'],
        css:['bootstrap-select.min.css']
    };

};
