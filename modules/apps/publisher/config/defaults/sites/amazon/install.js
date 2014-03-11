/*
Description: The bundle deployer will use the following module to override default installation logic
             The default logic is found at the root of the sites directory as the install.js file.
Filename: install.js
Created Date: 16/8/2013
 */
var installer=function(){


    var log=new Log();


    var onCreate=function(context){
        log.debug('on create called by amazon.');
    };


    return{
        onCreate:onCreate
    }
};