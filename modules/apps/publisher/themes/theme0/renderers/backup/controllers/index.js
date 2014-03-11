/*
	Description: Renders the index.jag view
	Filename:index.js
	Author: Sameera M.
	Created Date: 29/7/2013
*/
var render=function(theme,data,meta,require){
	/*theme('index',{ body:[
		{
			partial:'list',
			context:data.sample
		}
	]
     });*/

    theme('index',data.sample);
};
