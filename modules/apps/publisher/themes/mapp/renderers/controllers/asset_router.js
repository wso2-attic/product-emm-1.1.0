/*
	Description: Renders the asset.jag view
	Filename:asset.js
	Created Date: 29/7/2013
*/
var render=function(theme,data,meta,require){
    //var _url = "/publisher/asset/"  + data.meta.shortName + "/" + data.info.id + "/edit"
    
  

	var listPartial='view-asset';
	//Determine what view to show
	switch(data.op){
	case 'create':
		listPartial='add-asset';
		
		if(data.data.meta.shortName=='mobileapp'){
			log.info('Special rendering case for mobileapp-using add-mobilepp.hbs');
			listPartial='add-mobileapp';
		}		
		
		break;
	case 'view':
		listPartial='view-asset';
		break;
    case 'edit':
        listPartial='edit-asset';
        break;
    case 'lifecycle':
        listPartial='lifecycle-asset';
        break;
    case 'versions':
        listPartial='versions-asset';
        break;
	default:
		break;
	}
	theme('single-col-fluid', {
        title: data.title,
     	header: [
            {
                partial: 'header',
                context: data
            }
        ],
        ribbon: [
            {
                partial: 'ribbon',
		        context:require('/helpers/breadcrumb.js').generateBreadcrumbJson(data)
            }
        ],
        leftnav: [
            {
                partial: 'left-nav',
                context: require('/helpers/left-nav.js').generateLeftNavJson(data, listPartial)
            }
        ],
        listassets: [
            {
                partial:listPartial,
		        context: data
            }
        ]
    });
};
