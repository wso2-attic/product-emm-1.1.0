var render = function (theme, data, meta, require) {
	
	
   
    theme('2-column-right', {
        title: data.title,
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
        body: [
            {
                partial: 'top-assets',
                context: require('/helpers/top-assets.js').currentPage(data.topAssets,data.sso,data.user)
            }
        ],
        right: [
            {
                partial: 'recent-assets',
                context: require('/helpers/asset.js').formatRatings(data.recentAssets)
            }
        ]
    });
};