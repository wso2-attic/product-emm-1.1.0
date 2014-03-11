/*
 Description: The following class is used to the sites provided in this directory.
 Filename: install.js
 Created Date: 16/8/2013
 */

var installer = function () {

    var log = new Log();

    /*
     The function is used to initialize an individual asset by first reading the
     configuration from an xml file.
     @context: An object containing a reference to the root of an asset
     */
    function onAssetInitialization(context) {

        log.debug('loading ' + context.bundle.getName() + ' configuration data');

        //obtain the configuration file
        var xmlConfig = context.bundle.get({extension: 'xml'}).result();

        if (!xmlConfig) {
            log.debug('configuration file for ' + context.bundle.getName() + 'could not be found.');
            return;
        }

        //Read the contents
        var xmlContent = xmlConfig.getContents();
        var removedContent = xmlContent.replace(/^\s*<\?.*\?>\s*/, "");
        var xml = new XML(removedContent);
        var path = context.httpContext + '/' + context.bundle.getName() + '/';

        //Create the deployment object
        var artifact = {};

        var now =new String(new Date().valueOf());
        var length = now.length;
        var prefix = 20;
        var onsetVal = '';
            if(length != prefix){
                    var onset = prefix - length;
                    for(var i = 0; i < onset; i++){
                        onsetVal+='0';
                    }
            }
        now = onsetVal+now;


        artifact['attributes'] = {};

        //Fill the attributes
        artifact['name'] = xml.*::ModulePrefs.@title;
        artifact['attributes']['overview_name'] = xml.*::ModulePrefs.@title;
        artifact['attributes']['overview_provider'] = 'admin';
        artifact['attributes']['overview_version'] = '1.0.0';
        artifact['attributes']['overview_description'] = xml.*::ModulePrefs.@description;
        artifact['attributes']['overview_category'] = xml.*::ModulePrefs.@category;
        artifact['attributes']['overview_url'] = path + context.bundle.getName() + '.xml';
        //artifact['attributes']['images_thumbnail'] = path + 'thumbnail.jpg';
        //artifact['attributes']['images_banner'] = path + 'banner.jpg';

        artifact['attributes']['images_thumbnail'] = context.assetPath +context.bundle.getName()+ '/thumbnail.jpg';
        artifact['attributes']['images_banner'] = context.assetPath + context.bundle.getName()+'/banner.jpg';
        artifact['attributes']['overview_createdtime'] = now;



        //Set the tags
        context['tags'] = (String(xml.*::ModulePrefs.@tags)).split(',');


        //Set the ratings
        context['rate'] = Math.floor(Math.random() * 5) + 1;

        context['artifact'] = artifact;
        context['path'] = '/_system/governance/gadgets/' + artifact.attributes.overview_provider +
            '/' + artifact.attributes.overview_name + '/' + artifact.attributes.overview_version;


    }

    return{
        onAssetInitialization: onAssetInitialization
    }
};


