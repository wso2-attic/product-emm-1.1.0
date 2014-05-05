var staticContent = function (options) {

    var publicDirectory = '';
    var defaultContentType = 'text/html';
    var options = options || {};
    var log = new Log('static-content');

    if(!options.dir){
        log.warn('The static content plugin requires a directory to serve content from.');
    }

    publicDirectory =options.dir||'';

    var serve = function (req, res) {

        var startIndex = req.getRequestURI().indexOf(publicDirectory);
        var fileToReturn = req.getRequestURI().substring(startIndex);
        var file = new File(fileToReturn);

        log.info('STATIC CONTENT');
        log.info(fileToReturn);

        if (!file.isExists()) {
            log.info('Could not locate the file!');
            return false;
        }


        try {
            file.open('r');
            print(file.getStream());
        }
        catch (e) {
            log.info('Unable to serve the file');
        }
        finally {
            file.close();
        }

        return true;
    };

    var handle = function (req, res, session, handlers) {
        var isServed = serve(req, res);

        //Throw an error if the resource could not be found
        if (!isServed) {
            handlers({code: 404, msg: 'Could not locate the resource'});
        }
    };

    return handle;


};