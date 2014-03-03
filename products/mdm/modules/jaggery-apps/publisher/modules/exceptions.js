/*
Description: Handles the creation and management of exceptions
Filename: exceptions.js
Created Date: 26/8/2013
*/

var exceptions=function(){

    var utility=require('/modules/utility.js');
    var MSG_EXCEPTION_NOT_FOUND='The exception was not found';

    /*
    A generic exception which is thrown
     */
    function GenericException(){

        this.msg='';
        this.e=null;
        this.type=null;
        utility.config(arguments,this);
    }

    function ExceptionManager(){
        this.exceptionMap={};
    }

    /*
    The function throws an exception based on the provided exception type
     */
    ExceptionManager.prototype.throwException=function(exceptionType){
        if(exceptionMap.hasOwnProperty(exceptionType)){
            return new GenericException(exceptionType,MSG_EXCEPTION_NOT_FOUND);
        }

        return this.exceptionMap[exceptionType];
    }

    /*
    Handles the exception provided
    @exception: The exception to be handled

     */
    ExceptionManager.prototype.handlException=function(exception){
         //Run the exception handler
    }

    return{
        instance:function(){

        }
    }
};