/**
 * Description: The script implements a request body parser which will read any request content
 * and convert it to a JSON object which will be accessible as the req._body property
 * by other handlers
 * Filename:body-parser.js
 */



var bodyParser = (function () {

    var log=new Log('body-parser');

    var decodes=function(encodedURI) {
        return decodeURIComponent(encodedURI);
    };

    var handleUrlEncodedForm=function(content){
        var decodedURI = decodes(content),
            compoArray = [],
            obj = {};

        decodedURI.split('&').forEach(function(comp) {

            comp.split('=').some(function(element, index, array) {

                if(hasOwnProperty(obj, element.toString())) {
                    compoArray.push(obj[element]);
                    compoArray.push(array[1]);

                    obj[element] = compoArray;
                } else {
                    Object.defineProperty(obj, element, {
                        enumerable:true,
                        writable:true,
                        value:array[1]
                    });
                }
                return true;
            });
        });
        return obj;
    };

    var handleMultiPartForm=function(req){
        log.info(req.getAllParameters());
        return {};
    };

    var handle = function (req, res, session, handlers) {

        var contentType = request.getContentType()||'';
        req.body=req.body||{};
        req.files=req.files||{};

        //Check for multipart/form-data content type
        //NOTE:We need to do this before calling getContent as it removes all form data
        if(contentType.indexOf('multipart/form-data')>=0){
            log.info('A multi-part form');
            req.body=req.getAllParameters();
            req.files=req.getAllFiles();
            handlers();
            return;
        }

        var content = req.getContent();
        var contentObj = {};


        //If content is not present do nothing and advance to the next plugin
        if(!content){
            handlers();
            return;
        }

        //Determine what to do based on the content type
        switch(contentType){
            case 'application/json':
                contentObj=content;
                break;
            case 'application/x-www-form-urlencoded':
                contentObj=handleUrlEncodedForm(content);
                break;
            default:
                log.warn('Content type: '+contentType+' not handled by bodyParser');
                contentObj=req.body||{}; //Only put an empty object if there is nothing already in the body
                break;
        }

        req.body = contentObj;

        handlers();
    };

    return {
        handle: handle
    }

}());
