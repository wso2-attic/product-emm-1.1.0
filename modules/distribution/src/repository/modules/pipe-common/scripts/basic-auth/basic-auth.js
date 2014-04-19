/*
 Description: This plugin provides basic authentication capabilities, to secure a url install the plugin
 to the required route (or root if the entire site needs to be secured)
 Filename:   basicAuth.js
 Created Date: 3/2/2014
 */

var basicAuth=(function(){

    var name = 'defaultBasicAuth';
    var logic={};

    /*
     The default authenticator, a user can pass in their own function
     */
    logic.authenticator=function(session,arguments){
        session.put("LOGGED_IN_USER", arguments.username);
        session.put("Loged", "true");
        return true;
    };

    /*
     The method is used to check if there is a logged in user.
     */
    logic.isLoggedIn=function(session,arguments){
        var isLogged=session.get('Loged');
        if(isLogged){
            return true;
        }
        return false;
    };

    /*
     The method is used to decode the authentication header sent by the user
     */
    logic.decodeCredentials=function(authHeader){
        var comps=authHeader.split(' ');
        var Util=org.opensaml.xml.util.Base64;
        var result=new java.lang.String(Util.decode(comps[1]));
        var creds=result.split(':');
        return { username: creds[0],password:creds[1]};
    };

    logic.challengeAuth=function(req,res){
        res.addHeader('WWW-Authenticate','Basic realm="restricted"');
        res.sendError(401);
    }

    /**
     * The function allows core logic of the basicAuth plug-in to be
     * changed
     * @param key The method to override
     * @param func The function with which the method should be overridden
     */
    var override=function(key,func){
        var log=new Log();
        if(logic[key]){
            logic[key]=func;
            return;
        }

        log.info('Basic Authentication plug-in does not have '+key+'.');

    };

    var handle = function (req, res, session, handlers) {
        var log = new Log();
        log.info('Basic authentication handler called!');

        //Check the session to see if the user has been logged
        if(logic.isLoggedIn(session)){

            //Call the other handlers
            handlers();

        }
        else{
            //Check if the user has sent an Authorization
            var authHeader=req.getHeader('Authorization');

            //If the user has provided the auth header do an authentication check
            if(authHeader){
                var credentials=logic.decodeCredentials(authHeader);
                var isAuthenticated=logic.authenticator(session,credentials);

                //If authentication fails, the user should be challeneged again
                if(!isAuthenticated){
                    log.info('Authentication failed');
                    logic.challengeAuth(req,res);
                }
                else{
                    log.info('Authentication successfull');
                    //Invoke the other plugins
                    handlers();
                }
            }
            else{
                //Challenge the user for authentication
                logic.challengeAuth(req,res);
            }
        }
    };


    return{
        name:name,
        handle:handle,
        override:override
    };
}());

