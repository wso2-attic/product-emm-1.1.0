/*
Description: The validation manager is able to run some set of logic on a provided context
Filename: validation.manager.js
Created Date: 8/10/2013
 */

var validationManagement=function(){

    var log=new Log('validation.manager');
    var bundler=require('/modules/bundler.js').bundle_logic();

    var VALIDATOR_PATH='/modules/ext/scripts/validations';

    var VALIDATION_TYPES={
        MANDATORY_CHECK:'MANDATORY_CHECK',
        READ_ONLY_CHECK:'READ_ONLY'
    };

    function ValidationManager(){
       this.validatorScripts=[];
       this.init();
    }

    ValidationManager.prototype.init=function(){

        var bundleManager=new bundler.BundleManager({path:VALIDATOR_PATH});

        var root=bundleManager.getRoot();
        var that=this;
        root.each(function(bundle){
           //log.debug('looking at: '+bundle.getName());
            //Load the script
            var file=require(VALIDATOR_PATH+'/'+bundle.getName()).validatorModule();
            var validatorName=bundle.getName().replace(bundle.getExtension(),'');

            that.validatorScripts.push({name:validatorName,script:file});

        });
    };

    /*
    The function runs all loaded validators
    @context: The context of the validation request
    @return: A report of the validator actions
     */
    ValidationManager.prototype.validate=function(context){
        var validator;
        var noKill=false;

        //Create a report object to assist validators to report issues
        context['report']=new Report();

        log.debug('about to execute validators');

        for(var index in this.validatorScripts){

            validator=this.validatorScripts[index];

            //Check if the current validator script can be run on the current context
            if(validator.script.isApplicable(context)){

                noKill=validator.script.execute(context);

                //Checks if the other validations should be skipped
                if(!noKill){
                    log.debug('validation execution stopped by '+validator.name);
                    return context.report.map;
                }

            }

        }

        return context.report.map;
    };

    /*
    The class is used to encapsulate the validation error reporting
     */
    function Report(){
       this.map={};
       this.map['failed']=false;
    }

    /*
    Records an infraction for a given field.All infractions are grouped on a per field basis
    @field: The field for which the infraction has been committed
    @infraction: The form of validation infraction which has taken place
     */
    Report.prototype.record=function(field,infraction){

        if(!this.map.hasOwnProperty(field)){
            this.map[field]=[];
        }
        this.map.failed=true;
        this.map[field].push(infraction);
    }

    return{
        ValidationManager:ValidationManager
    }

}
