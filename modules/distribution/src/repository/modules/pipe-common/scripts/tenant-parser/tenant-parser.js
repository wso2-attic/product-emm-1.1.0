/***
 * Description: Parses the url to check for a tenant
 */
var tenantParser=(function(){
    var PARAM_TENANT_ID = 'tenantId';
    var TENANT_URL_TOKEN='t';
    var SUPER_TENANT='carbon.super';

    /*
     This plug-in is used to obtain the tenant details if any is present.
     It looks for the t symbol in the url to check for a tenant
     */
    var handle=function(req,res,session,handlers){
        //Break the request uri into components
        var uriComponents = req.getRequestURI().split('/');
        var tenantId = null;

        //Find the t component
        for (var index = 0; ((index < uriComponents.length) && (tenantId == null)); index++) {

            //Detected the tenant flag
            if (uriComponents[index] == TENANT_URL_TOKEN) {
                //The next component should be the tenantId
                tenantId = uriComponents[index + 1];
            }
        }

        //If a tenant is not present then the request is directed
        //at the super tenant
        if (!tenantId) {
            tenantId = SUPER_TENANT;
        }

        log.info('Tenant ID is : '+tenantId);

        session.put(PARAM_TENANT_ID,tenantId);

        handlers();

    };

    return {
        handle:handle
    };
}());

