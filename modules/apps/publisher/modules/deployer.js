var site = function (tenantId, options) {
    var tag, tags, rate, asset, assets,
        carbon = require('carbon'),
        store = require('/modules/store.js'),
        path = '/_system/governance/sites/' + options.provider + '/' + options.name + '/' + options.version,
        server = require('store').server,
    //site = require('/modules/site-browser.js'),
        um = server.userManager(tenantId),
        registry = server.systemRegistry(tenantId),
        am = store.assetManager('site', registry);

    asset = {
        "name": options.name,
        "lifecycle": null,
        "lifecycleState": null,
        "attributes": {
            "overview_status": options.status,
            "overview_name": options.name,
            "overview_version": options.version,
            "overview_description": options.description,
            "overview_url": options.url,
            "overview_provider": options.provider,
            "images_banner": options.banner,
            "images_thumbnail": options.thumbnail
        }
    };

    assets = am.search({
        attributes:{
            overview_name: options.name,
            overview_provider: options.provider,
            overview_version: options.version
        }
    }, {start: 0, count: 10});

    if(assets.length > 0){
        asset.id = assets[0].id;
        am.update(asset);
    } else {
        am.add(asset);
    }

    um.authorizeRole(carbon.user.anonRole, path, carbon.registry.actions.GET);
    tags = options.tags;
    for (tag in tags) {
        if (tags.hasOwnProperty(tag)) {
            registry.tag(path, options.tags[tag]);
        }
    }
    rate = options.rate;
    if (options.rate != undefined) {
        registry.rate(path, rate);
    }

};

var ebook = function (tenantId, options) {
    var tag, tags, rate, asset, assets,
        carbon = require('carbon'),
        store = require('/modules/store.js'),
        path = '/_system/governance/ebooks/' + options.provider + '/' + options.name + '/' + options.version,
        server = require('store').server,
        um = server.userManager(tenantId),
        registry = server.systemRegistry(tenantId),
        am = store.assetManager('ebook', registry);

    asset = {
        "name": options.name,
        "lifecycle": null,
        "lifecycleState": null,
        "attributes": {
            "overview_status": options.status,
            "overview_name": options.name,
            "overview_version": options.version,
            "overview_description": options.description,
            "overview_url": options.url,
            "overview_category": options.category,
            "overview_author": options.author,
            "overview_isbn": options.isbn,
            "overview_provider": options.provider,
            "images_banner": options.banner,
            "images_thumbnail": options.thumbnail
        }
    };

    assets = am.search({
        attributes: {
            overview_name: options.name,
            overview_provider: options.provider,
            overview_version: options.version
        }
    }, { start: 0, count: 10 });

    if (assets.length > 0) {
        asset.id = assets[0].id;
        am.update(asset);
    } else {
        am.add(asset);
    }

    um.authorizeRole(carbon.user.anonRole, path, carbon.registry.actions.GET);
    tags = options.tags;
    for (tag in tags) {
        if (tags.hasOwnProperty(tag)) {
            registry.tag(path, options.tags[tag]);
        }
    }

    rate = options.rate;
    if (options.rate != undefined) {
        registry.rate(path, rate);
    }

}

var gadget = function (tenantId, options) {
    var tag, tags, rate, asset, assets,
        carbon = require('carbon'),
        store = require('/modules/store.js'),
        path = '/_system/governance/gadgets/' + options.provider + '/' + options.name + '/' + options.version,
        server = require('store').server,
        um = server.userManager(tenantId),
        registry = server.systemRegistry(tenantId),
        am = store.assetManager('gadget', registry);

    asset = {
        "name": options.name,
        "lifecycle":null,
        "lifecycleState":null,
        "attributes": {
            "overview_status": options.status,
            "overview_name": options.name,
            "overview_version": options.version,
            "overview_description": options.description,
            "overview_url": options.url,
            "overview_provider": options.provider,
            "images_banner": options.banner,
            "images_thumbnail": options.thumbnail
        }
    };

    assets = am.search({
        attributes: {
            overview_name: options.name,
            overview_provider: options.provider,
            overview_version: options.version
        }
    }, { start: 0, count: 10 });

    if (assets.length > 0) {
        asset.id = assets[0].id;
        am.update(asset);
    } else {
        am.add(asset);
    }

    um.authorizeRole(carbon.user.anonRole, path, carbon.registry.actions.GET);
    tags = options.tags;
    for (tag in tags) {
        if (tags.hasOwnProperty(tag)) {
            registry.tag(path, options.tags[tag]);
        }
    }
    rate = options.rate;
    if (options.rate != undefined) {
        registry.rate(path, rate);
    }
};

var buildSiteRXT = function (options) {
    var rxt = <metadata xmlns="http://www.wso2.org/governance/metadata">
        <overview>
            <provider>{options.provider}</provider>
            <name>{options.name}</name>
            <version>{options.version}</version>
            <url>{options.url}</url>
            <status>{options.status}</status>
            <description>{options.description}</description>
        </overview>
        <images>
            <thumbnail>{options.thumbnail}</thumbnail>
            <banner>{options.banner}</banner>
        </images>
    </metadata>;
    return rxt;
};

var buildEBookRXT = function (options) {
    var rxt = <metadata xmlns="http://www.wso2.org/governance/metadata">
        <overview>
            <provider>{options.provider}</provider>
            <name>{options.name}</name>
            <version>{options.version}</version>
            <url>{options.url}</url>
            <status>{options.status}</status>
            <category>{options.category}</category>
            <isbn>{options.isbn}</isbn>
            <author>{options.author}</author>
            <description>{options.description}</description>
        </overview>
        <images>
            <thumbnail>{options.thumbnail}</thumbnail>
            <banner>{options.banner}</banner>
        </images>
    </metadata>;
    return rxt;
};

var sso = function (tenantId, options) {
    var path = '/_system/config/repository/identity/SAMLSSO/' + options.issuer64,
        server = require('store').server,
        registry = server.systemRegistry(tenantId);
    registry.put(path, {
        properties: {
            'Issuer': options.issuer,
            'SAMLSSOAssertionConsumerURL': options.consumerUrl,
            'doSignAssertions': options.doSign,
            'doSingleLogout': options.singleLogout,
            'useFullyQualifiedUsername': options.useFQUsername
        }
    });
};

