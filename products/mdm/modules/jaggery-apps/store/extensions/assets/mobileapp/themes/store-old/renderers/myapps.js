var render = function (theme, data, meta, require) {
	
	print(data);
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
        	
        ],
        right: [ 
        	{
                partial: 'my-assets-link',
                context: data.myAssets
            },       	
            {
                partial: 'recent-assets',
                context: data.recentAssets
            },
            
            {
                partial: 'tags',
                context: data.tags
            }
        ]
    });
};