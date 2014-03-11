/*
	Description: Renders the asset.jag view
	Filename:asset.js
	Created Date: 29/7/2013
*/
var render=function(theme,data,meta,require){

	var listPartial='view-asset';
	//Determine what view to show
	switch(data.op){
	case 'create':
		listPartial='add-asset';
		break;
	case 'view':
		listPartial='view-asset';
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
		context:data
            }
        ],
        leftnav: [
            {
                partial: 'left-nav'
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
