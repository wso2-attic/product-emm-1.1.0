/*
var render = function (theme, data, meta, require) {
    //print(caramel.build(data));
   
    theme('1-column', {
        title: data.title,
        navigation: [
            {
                partial: 'navigation',
                context: data.navigation
            }
        ],
        body: [
            {
                partial: 'userAssets',
                context: data.userAssets
            }
        ]
    });
};

*/


var render = function (theme, data, meta, require) {
	
	
     if(data.userAssets){
        for(i = 0; i < data.userAssets.mobileapp.length; i++){
            //print(data.userAssets.mobileapp[i].lifecycleState);
            if(data.userAssets.mobileapp[i].lifecycleState == 'Unpublished'){
                delete data.userAssets.mobileapp.splice (i, 1);;
            }
        }
     }
    
   
		
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
       /*
        navigation: [
                   {
                       partial: 'navigation',
                       context: data.navigation
                   },
                   {
                       partial: 'search',
                       context: data.search
                   }
               ],
              */
       
        body: [
            {
                partial: 'userAssets',
                context: {
        		'userAssets': data.userAssets,
        		'URL': data.URL,
        		'devices': data.devices
				}
            }
        ],
        right: [
            {
                partial: 'recent-assets',
                 context: require('/helpers/asset.js').formatRatings(data.recentAssets)
            },
            {
                partial: 'tags',
                context: data.tags
            }
        ]
    });
};

