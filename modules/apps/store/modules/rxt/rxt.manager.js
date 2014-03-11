var rxt_domain = require('rxt.domain.js').rxt_domain();
var converter = require('converter.js').rxt_converter()
var carbon = require('carbon');

/*
 Description: Encapsulates the handling of Rxt templates
 Filename:rxt.manager.js
 Created Date: 29/7/2013
 */

var rxt_management = function () {

    var GovernanceUtils = Packages.org.wso2.carbon.governance.api.util.GovernanceUtils;

    var DEFAULT_MEDIA_TYPE = 'application/vnd.wso2.registry-ext-type+xml';
    var ASSET_PATH = '/_system/governance/repository/components/org.wso2.carbon.governance/types/';
    var ASSET_EXT = 'rxt';
    var EMPTY = '';

    function RxtManager(registry) {
        this.registry = registry;
        this.rxtTemplates = [];
    }

    /*
     Loads and parses the rxt templates from the registry
     */
    RxtManager.prototype.loadAssets = function () {

        var mediaType = DEFAULT_MEDIA_TYPE;
        var assetPaths = GovernanceUtils.findGovernanceArtifacts(mediaType,
            this.registry.registry);
        var xmlToRxtConverter = new converter.XmlConversionProcess({
            mnger: converter.converter,
            instrList: converter.instrList
        });

        if (assetPaths) {
            //Create an array of empty rxt templates

            for each(var assetPath
        in
            assetPaths
        )
            {

                //Remove the path and extension
                var file = assetPath.replace(ASSET_PATH, EMPTY);
                var shortName = file.replace(ASSET_EXT, EMPTY);

                //Create a template
                var rxtTemplate = new rxt_domain.RxtTemplate({
                    path: assetPath,
                    type: shortName
                });

                //Load the rxt file
                var rxtFile = this.registry.get(rxtTemplate.path);

                //Extract the contents into an Xml file
                var xmlRxtContent = createXml(rxtFile);

                //Load the rxt template from the xml file
                rxtTemplate = xmlToRxtConverter.execute(xmlRxtContent, rxtTemplate);

                this.rxtTemplates.push(rxtTemplate);
            }

        }

        return this.rxtTemplates;
    }

    /*
     Finds a template based on the search criteria specified in the search function
     @searchFunc: A function callback of the signature: fn(currentTemplate); returns true or false
     @return
     */
    RxtManager.prototype.findAssetTemplate = function (searchFunc) {
        for each(var template
        in
        this.rxtTemplates
        )
        {
            if (searchFunc(template) == true) {
                return template;
            }
        }
        return null;
    }

    /*
     Creates an xml file from the contents of an Rxt file
     @rxtFile: An rxt file
     @return: An xml file
     */
    function createXml(rxtFile) {

        var content = rxtFile.content.toString();

        var fixedContent = content.replace('<xml version="1.0"?>', EMPTY)
            .replace('</xml>', EMPTY);
        return new XML(fixedContent);
    }

    /*
     Creates and returns an artifact manager for a given type
     @type: The type of the artifact (shortName attribute in the rxt file)
     @return: An artifact manager which handles the provided type
     */
    RxtManager.prototype.getArtifactManager = function (type) {
        GovernanceUtils.loadGovernanceArtifacts(this.registry.registry); //TODO: Can we do this only once?
        return new carbon.registry.ArtifactManager(this.registry, type);
    }

    return {
        RxtManager: RxtManager
    };

};
