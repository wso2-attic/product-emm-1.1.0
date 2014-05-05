var errHandler=(function(){
    var name='simpleErrorHandler';

    var environment='dev';
    var DEV='dev';
    var PRODUCTION='production';

    var handle=function(err,req,res,session,handlers){
        var log=new Log();
        log.info('Entered error handler '+environment);

        if(environment==DEV){
            res.sendError(err.code?err.code:500,err.msg?err.msg:err.toString());
        }
        else{
            res.sendError(err.code?err.code:500,'Oops something has gone wrong');
        }
        handlers(err);
    };

    var env=function(value){
      if(value==null){
          return environment;
      }

      environment=value;
    };

    return{
        handle:handle,
        env:env,
        name:name
    };
}());