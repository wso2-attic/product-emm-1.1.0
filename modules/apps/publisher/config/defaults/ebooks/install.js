var installer = function () {

    var log = new Log();

	function onAssetInitialization(context) {
		    log.debug('reading configuration data from ' + context.bundle.getName() + ' [json].');

		    //obtain the configuration file
		    var configFile = context.bundle.get({extension: 'json'}).result();

		    //If the configuration file does not exist then stop.
		    if (!configFile) {

		        log.debug('unable to load configuration file for ' + context.bundle.getName());
		        context['stopProcessing'] = true;
		        return;
		    }

		    //Read the contents
		    var configContents = configFile.getContents();
		    var jsonConfig = parse(configContents);

		    //Clone the object but ignore tags and rate
		    var artifact = utility.cloneObject(jsonConfig, ['tags', 'rate']);

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


		    artifact.attributes.images_thumbnail = context.assetPath + artifact.attributes.images_thumbnail;
		    artifact.attributes.images_banner = context.assetPath + artifact.attributes.images_banner;
		    artifact.attributes.overview_url=context.assetPath+artifact.attributes.overview_url;
            artifact.attributes.overview_createdtime=now;
		    //artifact.attributes.images_thumbnail = context.httpContext + artifact.attributes.images_thumbnail;
		    //artifact.attributes.images_banner = context.httpContext + artifact.attributes.images_banner;


		    //Create the deployment object
		    context['artifact'] = artifact;


		    //Set the tags
		    context['tags'] = jsonConfig.tags.split(',');

		    //Set the ratings
		    context['rate'] = jsonConfig.rate;
		    context['path'] = '/_system/governance/'+context.assetType+'/' + artifact.attributes.overview_provider +
		        '/' + artifact.attributes.overview_name + '/' + artifact.attributes.overview_version;

		    log.debug('tags located: ' + context.tags);
		    log.debug('rate located: ' + context.rate);
		}

    return{
        onAssetInitialization: onAssetInitialization
    }
};
