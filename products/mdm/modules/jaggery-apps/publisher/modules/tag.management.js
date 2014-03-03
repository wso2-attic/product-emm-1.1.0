/*
Description: The class is used to manage and process tags
Filename: tag.management.js
Created Date: 4/10/2013
 */

var tagModule=function(){

    var log=new Log('tag.manager');

    function TagManager(){
       this.tagCloud={};
    }

    /*
    The method is used to process a list of tags
    @tags: A tag array
     */
    TagManager.prototype.process=function(tags){
        var tags=tags||[];
        var tag;
        var tagIndex;

        for(var index in tags){

            tag=tags[index];

            //Break by url
            var components=tag.split(':');
            var url=components[0]||'';
            var tagComponent=components[1]||'';

            //Obtain the type
            var urlComponents=url.split('/');

            //Get the type
            var type=urlComponents[3];

            //Get the tag name
            var tagName=tagComponent;

            //Check if the tag cloud has the type
            if(!this.tagCloud.hasOwnProperty(type)){

                 this.tagCloud[type]={tags:{},totalTagCount:0};
            }

            //Check if the tag cloud has the tag name
            if(!this.tagCloud[type].hasOwnProperty(tagName)){
                this.tagCloud[type].tags[tagName]={ count:1};
                this.tagCloud[type].totalTagCount++;
            }

            //Increase the tag count for tag
            this.tagCloud[type].tags[tagName].count++;

        }
    };

    /*
    The function returns all tags matching a given query after been formatted by
    an optional formatter
    @type: The types of tags that must be removed
    @formatter: A formatting function which will change the structure of the output
    @return: An array of tags containing an id and the name
     */
    TagManager.prototype.get=function(type,predicate,formatter){

        var tagType=this.tagCloud[type]||{};
        var tags=tagType.tags||{};
        var formatter=formatter||defaultFormatter;
        var predicate=predicate||defaultPredicate;
        var output=[];
        var counter=0;
        var context={};

        for(var index in tags){
            context={};
            context['index']=counter;
            context['tagName']=index;
            if(predicate(context)){

                output.push(formatter(context));
                counter++;
            }

        }

        return output;

    };

    /*
    The function checks whether the tag manager needs to be updated
    @tags: The tags that must be added
    @return: True if the tags have been updated,else false
     */
    TagManager.prototype.update=function(tags){

        //Update the tag manager if the tag entry count is different
        if(tags.length!=this.tagCloud.totalTagCount){
             this.process(tags);
            return true;
        }

        return false;
    };

    /*
    The
     */
    function defaultFormatter(context){
        return { id:context.index ,name:context.tagName};
    }

    function defaultPredicate(context){
        return true;
    }

    return{
        TagManager:TagManager
    }
};
