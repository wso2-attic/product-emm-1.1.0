var graphDataModule=function(){

    //var data={"class" : "org.wso2.jaggery.scxml.aspects.JaggeryTravellingPermissionLifeCycle", "name" : "MobileAppLifeCycle", "configuration" : [{"type" : "literal", "lifecycle" : [{"scxml" : [{"initialstate" : "Initial", "version" : "1.0", "xmlns" : "http://www.w3.org/2005/07/scxml", "state" : [{"id" : "Initial", "datamodel" : [{"data" : [{"name" : "transitionExecution", "execution" : [{"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Create", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:Created", "value" : "private_{asset_author}:+add,+delete,+authorize"}, {"name" : "STATE_RULE2:Created", "value" : "Internal/everyone:-add,-delete,-authorize"}]}]}]}], "transition" : [{"event" : "Create", "target" : "Created"}]}, {"id" : "Created", "datamodel" : [{"data" : [{"name" : "transitionExecution", "execution" : [{"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Submit", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:In-Review", "value" : "private_{asset_author}:-add,-delete,-authorize"}, {"name" : "STATE_RULE2:In-Review", "value" : "reviewer:+add,-delete,+authorize"}, {"name" : "STATE_RULE3:In-Review", "value" : "Internal/everyone:-add,-delete,-authorize"}]}]}]}], "transition" : [{"event" : "Submit", "target" : "In-Review"}]}, {"id" : "In-Review", "datamodel" : [{"data" : [{"name" : "transitionExecution", "execution" : [{"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Approve", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:Approved", "value" : "private_{asset_author}:+get,-add,-delete,-authorize"}, {"name" : "STATE_RULE2:Approved", "value" : "reviewer:-add,-delete,-authorize"}, {"name" : "STATE_RULE3:Approved", "value" : "Internal/everyone:-add,-delete,-authorize"}]}, {"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Reject", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:Rejected", "value" : "private_{asset_author}:+add,+delete,+authorize"}, {"name" : "STATE_RULE2:Rejected", "value" : "reviewer:-add,-delete,-authorize"}, {"name" : "STATE_RULE3:Rejected", "value" : "Internal/everyone:-add,-delete,-authorize"}]}]}]}], "transition" : [{"event" : "Approve", "target" : "Approved"}, {"event" : "Reject", "target" : "Rejected"}]}, {"id" : "Approved", "datamodel" : [{"data" : [{"name" : "transitionExecution", "execution" : [{"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Publish", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:Published", "value" : "private_{asset_author}:-add,+delete,-authorize"}, {"name" : "STATE_RULE2:Published", "value" : "reviewer:-add,-delete,-authorize"}, {"name" : "STATE_RULE3:Published", "value" : "Internal/everyone:-add,-delete,-authorize"}]}]}]}], "transition" : [{"event" : "Publish", "target" : "Published"}]}, {"id" : "Rejected", "datamodel" : [{"data" : [{"name" : "transitionExecution", "execution" : [{"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Submit", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:In-Review", "value" : "private_{asset_author}:-add,-delete,-authorize"}, {"name" : "STATE_RULE2:In-Review", "value" : "reviewer:+add,-delete,+authorize"}, {"name" : "STATE_RULE3:In-Review", "value" : "Internal/everyone:-add,-delete,-authorize"}]}]}]}], "transition" : [{"event" : "Re-Submit", "target" : "In-Review"}]}, {"id" : "Published", "datamodel" : [{"data" : [{"name" : "transitionExecution", "execution" : [{"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Unpublish", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:Unpublished", "value" : "private_{asset_author}:-add,-delete,-authorize"}, {"name" : "STATE_RULE2:Unpublished", "value" : "reviewer:-add,-delete,-authorize"}, {"name" : "STATE_RULE3:Unpublished", "value" : "Internal/everyone:-add,-delete,-authorize"}]}, {"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Deprecate", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:Deprecated", "value" : "private_{asset_author}:-add,-delete,-authorize"}, {"name" : "STATE_RULE2:Deprecated", "value" : "reviewer:-add,-delete,-authorize"}, {"name" : "STATE_RULE3:Deprecated", "value" : "Internal/everyone:-add,-delete,-authorize"}]}]}]}], "transition" : [{"event" : "Unpublish", "target" : "Unpublished"}, {"event" : "Deprecate", "target" : "Deprecated"}]}, {"id" : "Unpublished", "datamodel" : [{"data" : [{"name" : "transitionExecution", "execution" : [{"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Publish", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:Published", "value" : "private_{asset_author}:-add,+delete,-authorize"}, {"name" : "STATE_RULE2:Published", "value" : "reviewer:-add,-delete,-authorize"}, {"name" : "STATE_RULE3:Published", "value" : "Internal/everyone:-add,-delete,-authorize"}]}, {"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Retire", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:Retired", "value" : "private_{asset_author}:-add,+delete,-authorize"}, {"name" : "STATE_RULE2:Retired", "value" : "reviewer:-add,-delete,-authorize"}, {"name" : "STATE_RULE3:Retired", "value" : "Internal/everyone:-add,-delete,-authorize"}]}]}]}], "transition" : [{"event" : "Publish", "target" : "Published"}, {"event" : "Retire", "target" : "Retired"}]}, {"id" : "Deprecated", "datamodel" : [{"data" : [{"name" : "transitionExecution", "execution" : [{"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Retire", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:Retired", "value" : "private_{asset_author}:-add,+delete,-authorize"}, {"name" : "STATE_RULE2:Retired", "value" : "reviewer:-add,-delete,-authorize"}, {"name" : "STATE_RULE3:Retired", "value" : "Internal/everyone:-add,-delete,-authorize"}]}]}]}], "transition" : [{"event" : "Retire", "target" : "Retired"}]}, {"id" : "Retired"}]}]}]}]};
    var data={"class" : "org.wso2.jaggery.scxml.aspects.JaggeryTravellingPermissionLifeCycle", "name" : "SampleLifeCycle2", "configuration" : [{"type" : "literal", "lifecycle" : [{"scxml" : [{"initialstate" : "Initial", "version" : "1.0", "xmlns" : "http://www.w3.org/2005/07/scxml", "state" : [{"id" : "Initial", "datamodel" : [{"data" : [{"name" : "transitionExecution", "execution" : [{"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Promote", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:Created", "value" : "Internal/private_{asset_author}:+get,+add,+delete,+authorize"}, {"name" : "STATE_RULE2:Created", "value" : "Internal/reviewer:+get,-add,-delete,-authorize"}, {"name" : "STATE_RULE3:Created", "value" : "Internal/everyone:+get,-add,-delete,-authorize"}]}]}]}], "transition" : [{"event" : "Promote", "target" : "Created"}]}, {"id" : "Created", "datamodel" : [{"data" : [{"name" : "transitionExecution", "execution" : [{"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Promote", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:In-Review", "value" : "Internal/private_{asset_author}:+get,-add,-delete,-authorize"}, {"name" : "STATE_RULE2:In-Review", "value" : "Internal/reviewer:+get,+add,-delete,+authorize"}, {"name" : "STATE_RULE3:In-Review", "value" : "Internal/everyone:+get,-add,-delete,-authorize"}]}]}]}], "transition" : [{"event" : "Promote", "target" : "In-Review"}]}, {"id" : "In-Review", "datamodel" : [{"data" : [{"name" : "transitionExecution", "execution" : [{"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Promote", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:Published", "value" : "Internal/private_{asset_author}:+get,+add,-delete,+authorize"}, {"name" : "STATE_RULE2:Published", "value" : "Internal/reviewer:+get,-add,-delete,-authorize"}, {"name" : "STATE_RULE3:Published", "value" : "Internal/everyone:+get,-add,-delete,-authorize"}]}]}]}], "transition" : [{"event" : "Promote", "target" : "Published"}]}, {"id" : "Published", "datamodel" : [{"data" : [{"name" : "transitionExecution", "execution" : [{"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Demote", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:Unpublished", "value" : "Internal/private_{asset_author}:+get,+add,+delete,+authorize"}, {"name" : "STATE_RULE2:Unpublished", "value" : "Internal/reviewer:+get,-add,-delete,-authorize"}, {"name" : "STATE_RULE3:Unpublished", "value" : "Internal/everyone:+get,-add,-delete,-authorize"}]}]}]}], "transition" : [{"event" : "Demote", "target" : "Unpublished"}]}, {"id" : "Unpublished", "datamodel" : [{"data" : [{"name" : "transitionExecution", "execution" : [{"class" : "org.wso2.jaggery.scxml.generic.GenericExecutor", "forEvent" : "Promote", "parameter" : [{"name" : "PERMISSION:get", "value" : "http://www.wso2.org/projects/registry/actions/get"}, {"name" : "PERMISSION:add", "value" : "http://www.wso2.org/projects/registry/actions/add"}, {"name" : "PERMISSION:delete", "value" : "http://www.wso2.org/projects/registry/actions/delete"}, {"name" : "PERMISSION:authorize", "value" : "authorize"}, {"name" : "STATE_RULE1:In-Review", "value" : "Internal/private_{asset_author}:+get,-add,-delete,-authorize"}, {"name" : "STATE_RULE2:In-Review", "value" : "Internal/reviewer:+get,+add,-delete,+authorize"}, {"name" : "STATE_RULE3:In-Review", "value" : "Internal/everyone:+get,-add,-delete,-authorize"}]}]}]}], "transition" : [{"event" : "Promote", "target" : "In-Review"}]}]}]}]}]};


    function DataProvider(){
        this.map={};
        this.rawMap={};
        this.keys=[];
    }

    DataProvider.prototype.createMap=function(data){

        //Obtain the pointer to the starting point of the
        var ptr=data.configuration[0].lifecycle[0].scxml[0].state;
        var state;


        for(var index in ptr){
            state=ptr[index];

            var transitions=state.transition;

            this.map[state.id]={};
            this.rawMap[state.id]={};
            this.keys.push(state.id);

            for(var transitionIndex in transitions){

                var transition=transitions[transitionIndex];
               // console.log('adding '+transition.target);
                this.map[state.id][transition.target]=1;
                this.rawMap[state.id][transition.target]=1;
            }

        }

    };

    DataProvider.prototype.prepareData=function(data){

        this.createMap(data);
        keyIndexer(this.map,this.keys);
    };


    function findLoop (from,map,stack){

        //Check if the token is present
        if(isIn(from,stack)){
            //stack.push(from);
            var to=stack.pop();
           map[from][to]=1;
           map[to][from]=0;

           return stack;
        }
        else{

            stack.push(from);

            //Go through all the nodes to which from is connected
            var connected=getConnectedVertices(from,map);
            var resultantStack;
            for(var index in connected){
               resultantStack=findLoop(connected[index],map,stack);

                if(resultantStack!=null){
                    //return resultantStack;
                    stack=new MStack();
                    stack.push(from);
                }
            }

            return null;
        }
    };

    function getConnectedVertices(from,map){
        var items = [];

        if (map.hasOwnProperty(from)) {

            for (var index in map[from]) {
                if(map[from][index]==1){
                    items.push(index);
                }

            }

            return items;
        }

        return items;
    }

    function isIn(token,stack){
        return  stack.isPresent(function(data){
           return data==token;
        });
    }

    function Node(data,next){
        this.data=data||null;
        this.next=next||null;
    }

    function LL(){
        this.head=null;
    }

    LL.prototype.add=function(item){
        var node=new Node(item);
        node.next=null;

        if(this.head==null){
            this.head=node;
            return;
        }

        node.next=this.head;
        this.head=node;
    } ;

    LL.prototype.removeHead=function(){
        var data=this.head.data;
        this.head=this.head.next;
        return data;
    };

    function MStack(){
        this.ll=new LL();
    }

    MStack.prototype.push=function(data){
        this.ll.add(data);
    };

    MStack.prototype.pop=function(){
        return this.ll.removeHead();
    };

    MStack.prototype.isPresent=function(pred){

       var ptr=this.ll.head;

       while(ptr!=null){

           if(pred(ptr.data)){
               return true;
           }

           ptr=ptr.next;
       }

        return false;
    };

     function keyIndexer(map,keys){

        for(var key in keys){
            var index=keys[key];
            //console.log('indexing '+index);
            findLoop(index,map,new MStack());
        }

    }

    //console.log(map);
    //var result=findLoop('Created',map,new MStack());
    //findLoop('In-Review',map,new MStack());
    //console.log(map);
    //findLoop('Published',map,new MStack());
    //findLoop('Unpublished',map,new MStack());

    //Pop the first two
    //var a=result.pop();
    //var b=result.pop();
    //keyIndexer(map,keys);
    //console.log(a);
    //console.log(b);
    //console.log(map);

    /*var st=new MStack();
    st.push('a');
    st.push('b');
    st.push('c');
    st.push('d');*/



    //var d=new DataProvider();
    //d.prepareData(data);

    //console.log(d.map);

    return{
        DataProvider:DataProvider
    }

};