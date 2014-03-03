
	/*
	Description: The file houses the utility logic
	Filename:utility.js
	Created Date: 28/7/2013
	*/
var rxt_utility=function(){
	return{
		/*The function takes a set of options 
		and configures a target object
		@options: A set of options to configure the target
		@targ: The object to be configured
		*/
		config:function(options,targ){

			
			//Avoid if no options given or the
			//target is undefined
			if((!options)||(!targ)){	
				return targ;
			}

			//Go through each field in the target object
			for(var key in targ){
				
				//Avoid processing functions
				if(typeof targ[key]!='function'){

					var value=options[key];

					//If a value is present
					//do the configuration
					if(value){
					   targ[key]=value;
					}
				}
			}
		},

		findInArray:function(array,fn){
                               for (var item in array){
                                    if(fn(item)){
                                        return item;
                                    }
                               }

                               return null;
        }
	}
}
