/*
 Description: The class is used to filter assets based on the permissions specified in the extension json files
 Filename: permission.asset.filter.js
 Created Date: 7/10/2013
 */

var cleanUsername = function (username) {
    /**
     * this is a one-way hash function, @ is replaced if the user name is an email
     * if the user name is coming from a secondery user store it will be second.com/user hence
     * "/" will be replaced.
     */

    return username.replace('@', ':');
};

var filterModule = function () {

    var log = new Log('permission.asset.filter');
    var utility = require('/modules/utility.js').rxt_utility();

    var ADMIN_ROLE = 'admin';
    var ANON_ROLE = 'anon';


    /*
     The function checks whether the filter can be applied to the current request
     @context: The context of the request
     @return: True if the filter can be applied ,else false
     */
    function isApplicable(context) {

        var permissions = context.config.permissions || null;

        //Check if a permission block is present for the given asset type
        if (permissions) {

            return true;
        }

        log.debug('not applying filter as a permission block has not been specified for the asset type.');

        return false;
    }

    /*
     The function filters the provided assets list based on the permissions defined in the extension file
     @context: The context provides the required resources for the filter
     */
    function execute(context) {
        var data = context['data'];
        var userRoles =context['roles'];
        var item;
        var items = [];
        // for (var i = userRoles.length - 1; i >= 0; i--) {
        //     var role_obj =  userRoles[i];
        //     role_obj = cleanUsername(role_obj);
        //     userRoles[i] = role_obj;
        // };
        log.info(userRoles);
        log.info(data);
        log.info("_____");
        //Go through each data item
        for (var index in data) {

            item = data[index];

            //TODO: We are ignoring any assets without a lifecycle state
            if(item.lifecycleState) {

                //Obtain the permissions for the current lifecycle state
                permissableRoles = obtainPermissibleRoles(context, item.lifecycleState);

                //Fill in dynamic values
                permissableRoles = fillDynamicPermissibleRoles(item, permissableRoles);

                //Check if the user has any of the roles specified for the state
                var commonRoles = utility.intersect(userRoles, permissableRoles, function (a, b) {
                    return (a == b);
                });
                log.info(permissableRoles);
                log.info(userRoles);
                log.info(commonRoles);
                log.info("****");
                //Check if we have common roles
                if (commonRoles.length > 0) {
                    log.info('adding asset'+stringify(item));
                    items.push(item);
                }
            }
            else{
                log.debug('ignoring '+item.attributes.overview_name+' as it does not have a lifecycle state.');
            }
        }

        context['data'] = items;

        return true;

    }

    /*
     The function is used to fill in dynamic roles (e.g. private_{overview_provider} )
     @context: The context of the request (username)
     @permissions: A list of permissions
     */
    function fillDynamicPermissibleRoles(item, permissions) {
        var list = [];
        for (var index in permissions) {
            list.push(permissions[index].replace('{overview_provider}', item.attributes.overview_provider));
        }

        return list;
    }

    /*
     The function is used to obtain permissible roles based on the provided state
     @context: A context containing the permissions configuration block
     @state: The state of the current asset
     @return: An array of permissible roles
     */
    function obtainPermissibleRoles(context, state) {
        var config = context.config.permissions;
        var roles = [];
        var state = state.toLowerCase();

        //Check if any roles are specified for the state
        if (config.hasOwnProperty(state)) {
            roles = config[state];
        }

        //All resources can be accessed by the admin role
        roles = addAdminRole(roles);

        return roles;
    }

    /*
     The function checks whether the admin role is present in the permissions array.If it is not present,then
     the it is added (All assets can be viewed by the admin role)
     @roles: An array of roles having access to a resource
     @return: If the admin role is not present in the permissions it is added
     */
    function addAdminRole(roles) {

        //If the admin role has not been given,then add it
        if (roles.indexOf(ADMIN_ROLE) == -1) {

            roles.push(ADMIN_ROLE);

        }

        return roles;
    }


    return{
        isApplicable: isApplicable,
        execute: execute
    }
}