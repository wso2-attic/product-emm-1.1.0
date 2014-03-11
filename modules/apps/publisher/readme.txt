
Description
-----------

Publisher application for UES.

It allows the following functionality;
	- Login has been integrated
	- View assets
	- Add a new asset (gadgets and sites)
	- * An asset when it is created is attached to a default life cycle,and moved to the first life cycle state
	- Delete an existing asset (gadgets and sites) [Feature is present via API]

Changes:
----------

5/10/2013 Minor Changes:
          --------------
          Several bug fixes (please refer to JIRAs)

1/10/2013 Major Changes:
          --------------
          All resources are now stored in a Storage Manager ( Default H2)


20/8/2013 Major Changes:
          --------------
          All default assets are now attached a life-cycle
          Default assets can now be added by placing content in the config/defaults/ folder (e.g.gadgets,sites and ebooks)
          Assets can be now updated from the UI
          Implemented versions of assets
          IMPORTANT: This version requires the latest changes to artifact.js (Pushed separately)
          Updated the API to support updating assets
          Added API calls to create a new version of an asset and return all versions of an asset

13/8/2013 Major Changes:
          -------------
          The everyone role can no longer see assets in the created state
          The store will only show assets in the published state
          Multitenancy support has been added

6/3/2013	Major Changes:
		--------------
		IMPORTANT: The life-cycle changes require the jaggery.scxml.excutor component available as a 
			plug-in.
		Changed the registry.xml lifecycle entry:SampleLifeCycle2 to be in line with the 
			"Travelling Permissions Model". Please refer to the relevant documentation.
		The life-cycle promote/demote operations will now change the permissions to a given asset
			Please refer to the life-cycle state document.
		Added a Life-Cycle diagram with animations to reflect the promote/demote operations
			using raphael and a custom script (graph.js)
		
		
		Minor Changes:
		--------------		
		The provider name is now auto populated and is read-only.
		

28/8/2013	Major Changes:
		-------------
		IMPORTANT: Requires the changes to Jaggery in SAM JAG PULL # 2 (artifact.js changes)
		All newly created users are assigned the role of "Publisher"
		All newly created private_user roles are assigned read/write/authorize rights to the 
			collections defined in the userSpace.accessible block in the sso.json.
		

23/8/2013	Major Changes:
		--------------
		Note: An asset in order to be visible in the store must have its state set to PUBLISHED when it is created
		Changes to the extension mechanism can be found in /ext2/ folder of modules and config
		IMPORTANT: Requires the changes to artfiact.js in SAM PULL #2 JAG
		

13/8/2013	Major Changes:
		--------------	
		Replaced the api code with the model approach used by the site controllers
		Assets are now auto attached to a sample lifecycle when they are created 
		Assets are automatically promoted to the first stage of a lifecycle when created
		API and site controllers now return identical output where appropriate;
			GET /asset/type/{id} and GET /asset/type
		A model approach to handling rxts:
			var model=modelManager.getModel('gadget');
		Supported operations:
			model.import(<name of importer>, <input data>);
			var output=model.export(<name of exporter>);
			model.save();	//Invokes save actions defined on a field by field basis

		Minor Changes:
		--------------
		Changed the structure of this document to better reflect the state of the app!
		Added log info and debug statements where appropriate
		Removed unused code
		Added comments where appropriate , all files now have a description
		Commented the client side script for handling life-cycle operations
			
		
Additions:
----------
5/10/2013 Added API calls to handle tagging

20/9/2013 Added API calls to handle versions and updating of assets

28/8/2013	API:(Refer to API for complete changes
		Added lifecycle check list methods
			

23/8/2013	
		API: (Refer to API for complete changes)
		Lifecycle API
		-------------
			/publisher/api/lifecycle/checkList/{asset-type}/{asset-id} : Returns the check list for current lifecycle state
			/publisher/api/lifecycle/{ACTION}/{asset-type}/{asset-id}  : Performs the ACTION -(Promote/Demote)

			
13/8/2013	/tests/jmeter: 
			publisher_test_plan.jmx	Simple JMeter test plan for the site and API ( I am still wondering how I can use it to test the site)
		modules/ext/scripts: 
			asset.exporter.js		Exports model data to an asset format that can be used with the ArtifactManager
			form.importer.js		Imports asset data from a post array
			asset.action.save.js		Saves an asset using the ArtifactManager
			asset.lifecycle.action.save.js	Attaches a lifecycle to an asset using the ArtifactManager
			

Bugs:
-----
x		The created assets can only be viewed by a logged in user

13/8/2013	Asset types other than sites are classed as sites (e.g. Books)		

28/8/2013	Newly created users have access to collections owned by other users

TODO:
-----
		Add update support for assets
		Change the rxt extension configuration file to be more user friendly
		Change the meta variable that needs to be defined for each external adpater
			
Note:
-----

-The publisher does not allow update operations
-Please copy and paste the lifecycle found in the registry.xml of the DEPENDENCIES folder . 


API
---

The following API calls have been implemented

	Noun	Url					Description

	GET  	/publisher/api/asset/{type}			Returns a template JSON object describing the structure of an asset
	GET  	/publisher/api/asset/{type}/{id}		Returns an asset of the given {type} and matching the {id}
	POST 	/publisher/api/asset/{type}			Creates a new asset of the given {type}
	DELETE 	/publisher/api/asset/{type}/{id}		Deletes an asset
	PUT     /publisher/api/asset/{type}/{id}	    Updates an asset with the given type and id
	POST 	/publisher/api/lifecycle/{type}/{id}		Attaches a lifecycle for the specified asset type with the id
 	GET api/lifecycle/checklist/{type}/{id}                 Returns the check list for an artifact
 	GET api/lifecycle/checklistitem/{index}/{type}/{id}     Returns the checked state of the check list item at
 		                                                the given index.

 	GET api/lifecycle/actions/{type}/{id}                   Gets the actions available to an asset at a given state
 	DELETE api/lifecycle/{asset-type}/{artifact-id}		Detaches the current lifecycle from the artifact
 	DELETE api/lifecycle/checklistitem/{index}/{type}/{id}  Unticks a check list item at the given index
 	POST  api/lifecycle/{asset-type}/{artifact-id}   	Attach the provided lifecycle to the artifact
 	POST api/lifecycle/checklistitem/{index}/{type}/{id}    Ticks a check list item at the given index
 	PUT api/lifecycle/{action}/{asset-type}/{artifact-id}	Performs the provided the action on the provided asset
	GET api/lifecycle/information/history/{asset-type}/{artifact-id}/{version} Returns the life-cycle history of the provided asset.
	GET /api/version/{type}/{id}              Retrieves the list of versions of the asset
    POST /api/version/{type}/{id}/{version}   Duplicates the asset with the given id
                                                      and changes version

    GET /api/tag/{type}/        Get all of the tags for a type
    GET /api/tag/{type}/{id}    Get all tags associated with an asset
    PUT /api/tag/{type}/{id}    Add a tag to a given asset (or tags)
    DELETE /api/tag/{type}/{id} Remove a tag from a given asset (or multiple tags)
	
	


	


