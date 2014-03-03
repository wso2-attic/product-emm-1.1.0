
var weaver=function(){
    var log=new Log();

    function Weaver(){
        this.beforeAspectContainers={};
        this.afterAspectContainers={};
    }

    Weaver.prototype.before=function(object,method,aspect){
        this.prepare(object,method);
        var ptr=this.beforeAspectContainers[object.name][method];
        if(ptr) {
            ptr.add(aspect);
        }
    }

    Weaver.prototype.beforeAll=function(object,aspect){


        this.prepareAll(object);

        for(var index in object.prototype){

            var ptr=this.beforeAspectContainers[object.name][index];
            if(ptr) {
                ptr.add(aspect);
            }
        }
    }

    Weaver.prototype.after=function(object,method,aspect){
        this.prepare(object,method);
        var ptr=this.afterAspectContainers[object.name][method];
        if(ptr) {
            ptr.add(aspect);
        }
    }

    Weaver.prototype.afterAll=function(object,aspect){
        this.prepareAll(object);

        for(var index in object.prototype){

            var ptr=this.afterAspectContainers[object.name][index];
            if(ptr) {
                ptr.add(aspect);
            }
        }

    }

    Weaver.prototype.prepare=function(object,method){
          if(object['_hidden_weaved']){
              return;
          }

          this.attach(object,method);
    }

    Weaver.prototype.prepareAll=function(object){
         if(object['_hidden_weaved']){
             log.debug('Hidden Weave property exists');
             return;
         }

         for(var index in object.prototype){
             this.attach(object,index);
         }
    }

    Weaver.prototype.attach=function(object,method){



        var fnPtr=object.prototype[method];
        object.prototype['_hidden_'+method]=fnPtr;
        object['_hidden_weaved']=true;  //Add a hidden property

        if(!this.beforeAspectContainers[object.name]){
            this.beforeAspectContainers[object.name]={};
        }

        if(!this.afterAspectContainers[object.name]){
            this.afterAspectContainers[object.name]={};
        }

        this.beforeAspectContainers[object.name][method]=new AspectContainer();

        this.afterAspectContainers[object.name][method]=new AspectContainer();
        var that=this;
        object.prototype[method]=function(){
            context={};
            context['functionName']=method;
            context['arguments']=arguments;
            context['stop']=false;
            context['stopCb']=function(){};

            that.beforeAspectContainers[object.name][method].execute(context);
            var fnResult=null;

            if(!context.stop)
            {
                 fnResult=this['_hidden_'+method].apply(this,['apple','oranges']);
            }
            else{
                context.stopCb();
            }

            that.afterAspectContainers[object.name][method].execute(context);

            if(context.stop){
                 context.stopCb();
            }

            return fnResult;
        }
    }

    function AspectContainer(){
        this.aspects=[];
    }

    AspectContainer.prototype.add=function(fn){
        this.aspects.push(fn);
    }

    AspectContainer.prototype.execute=function(context){
        var result=null;
        for(var index in this.aspects){
            result=this.aspects[index](context);
        }
        return result;
    }

    return{
        Weaver:Weaver
    }

};