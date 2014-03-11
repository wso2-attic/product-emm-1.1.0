var render = function(theme, data, meta, require) {
	//print(caramel.build(data));	
	
	var images = data.asset.attributes.images_screenshots.split(",");
	data.asset.attributes.images_screenshots = images;
	
	theme('2-column-right', {
		title : data.title,
		
		header: [
					{
						partial: 'header',
						context: data.header
					}
				],
				navigation: [
					{
						partial: 'navigation',
						context: require('/helpers/navigation.js').currentPage(data.navigation, data.type, data.search)
					}
				],
		
        body : [{
            partial : 'asset',
            context : require('/helpers/asset.js').format({
                user : data.user,
                sso : data.sso,
                asset : data.asset,
                type : data.type,
                inDashboard : data.inDashboard,
                embedURL : data.embedURL,
                isSocial : data.isSocial
            })
        }],
		right : [
			{
                partial: 'my-assets-link',
                context: data.myAssets
            },
			{
				partial : 'recent-assets',
				context : data.recentAssets
			}, {
				partial : 'tags',
				context : data.tags
			}
		]
	});
};
