var meta={
	use:'action',
    purpose:'save',
    source:'custom',
	type:'form',
	applyTo:'*',
	required:['model','template'],
	name:'asset.lifecycle.action.save'
};

/*
 Description: Saves the lifeCycle field.
 Filename:asset.exporter.js
 Created Dated: 11/8/2013
 */

var module=function(){

    var configs=require('/config/publisher.json');
    var log=new Log();

	return{
		execute:function(context){

           log.debug('Entered : '+meta.name);

           var model=context.model;
           var template=context.template;
           var type=template.shortName;

           log.debug(stringify(context.actionMap));

           //Get the id of the model
           var id=model.getField('*.id').value;

           //Invoke an api call with the life cycle state
           var lifeCycle=model.getField('*.lifeCycle').value;

           var rxtManager=context.rxtManager;

           var artifactManager=rxtManager.getArtifactManager(type);

           var asset=context.parent.export('asset.exporter');

           log.debug('Attempting to attach the lifecycle :'+lifeCycle+'to asset with id: '+id);

           artifactManager.attachLifecycle(lifeCycle,asset);

           log.debug('Finished attaching the lifecycle to the asset'+stringify(asset));

           log.debug('Check if there is an action to be performed when attaching a life-cycle');

            var invokeAction='';

            //Check the config for a lifeCycleBehaviour block
            utility.isPresent(config,'lifeCycleBehaviour',function(lifeCycleBehaviour){

                utility.isPresent(lifeCycleBehaviour,lifeCycle,function(lifeCycleData){

                    utility.isPresent(lifeCycleData,'onAttach',function(onAttach){

                        invokeAction=onAttach.action||'';

                    });
                });

            });

            //Check if an action needs to be invoked.
           if(invokeAction!=''){

               log.debug('Invoke Action: '+invokeAction);

               var asset=artifactManager.get(asset.id);

               artifactManager.promoteLifecycleState(invokeAction,asset);

               log.debug('Asset has been '+invokeAction+'ed to the next state.');
           }


		}
	};
};

