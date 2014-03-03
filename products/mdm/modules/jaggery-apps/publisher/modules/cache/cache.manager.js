/*
Description: The class provides caching support for storing assets for a given session in order to track
            assets which are not readily added due to registry indexing.This class is used to display
            newly added assets as pending while the registry performs the indexing.
Filename: cache.manager.js
Created Date: 22/10/2013
 */
var assetCachingModule=function(){

    var datastructuresModule=require('/modules/common/datastructures.js').datastructuresModule();
    var log=new Log();

    var CACHE_MANAGER_KEY='cache.manager';

    function AssetCacheManager(session){
      this.session=session;

    }

    /*
    The function returns the map from the session.The map is used to store the assets.
     */
    AssetCacheManager.prototype.getStorage=function(){
        var instance=this.session.get(CACHE_MANAGER_KEY);

        if(!instance){

            instance={};
            this.session.put(CACHE_MANAGER_KEY,instance);
        }

        return instance;
    }

    /*
    The function stores the provided asset in the cache till it appears in the artifact manager list
    @asset:  The asset to be cached
    @type: The type of the asset
     */
    AssetCacheManager.prototype.add=function(asset,type){

        var storage=this.getStorage();

        //Check if the type is in the storage
        if(!storage.hasOwnProperty(type)){
            storage[type]=new datastructuresModule.LinkedList();
        }

        storage[type].add(asset);
    };

    /*
    The function returns all stored assets of the provided type
    @type: The type of asset to be retrieved
    @return: The list of assets which have been stored in the cache
     */
    AssetCacheManager.prototype.get=function(type){
        var results=[];
        var storage;

        storage=this.getStorage();

        //If there is no cached assets of the provided type send an empty array
        if(!storage.hasOwnProperty(type)){

            return results;
        }

        results=storage[type].toArray();

        return results;
    };

    /*
    The function deletes an asset or range of assets based on the provided predicate
    @predicate: The predicate logic which dictates whether an asset should be removed
    @type: The type of assets to be examined with the predicate logic
    @return: The number of cached assets after the removing similar assets
     */
    AssetCacheManager.prototype.refresh=function(assets,type){

        var storage=this.getStorage();
        var cachedAssets=[];

        //Do not run the predicate logic if the asset type is not cached
        if(!storage.hasOwnProperty(type)){
            return cachedAssets.length;
        }

        var cachedAssets=storage[type];


        removeCommonAssets(assets,cachedAssets);

        cachedAssets=storage[type].toArray();

        return cachedAssets.length;
    };

    /*
    The function gets the total number of assets which are cached
     */
    AssetCacheManager.prototype.getCachedAssetCount=function(type){
       var storage;
       var assets=[];

       storage=this.getStorage();

       if(!storage.hasOwnProperty(type)){
          return assets.length;
       }

       assets=storage[type].toArray();
       return assets.length;
    };


    /*
    The function identifies the common assets between the assets and the cached assets.The common
    assets are then removed.
     */
    function removeCommonAssets(assets,cachedAssetsList){
        var asset;

        for(var index in assets){
            asset=assets[index];

            //If the ids are the same remove the asset from the cache
            cachedAssetsList.remove(function(node){

               return node.id==asset.id;
            });
        }
    }

    return{
        AssetCacheManager:AssetCacheManager
    }
};
