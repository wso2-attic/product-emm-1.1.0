	/*
	Description: Not Used -Need to remove
	TODO: Remove this file - get rid of the requires first! 
	Filename:asset_routers.js
	Created Date: 31/7/2013
	*/
var NullLogger = function() {
	return {
		log : function(msg) {
			print('null logger called');
		}
	}
};

var LogContainer = function() {
	
	var loggers=[];

	var NULL_LOGGER = new NullLogger();
	var cLogDec = new HtmlLogDecorator();

	var INFO_TYPE = 'info';
	var DEBUG_TYPE = 'debug';
	var ERR_TYPE = 'err';
	
	var STATE_ON = 'enable';
	var STATE_DISABLE = 'disable';

	/*
	 * The function sets the provider based on the type of provider
	 */
	var fnSetProvider = function(type, state) {
	
		if (state == STATE_DISABLE) {
			loggers[type] = NULL_LOGGER;
			return;
		}
	


		loggers[type]=new HtmlLogger();

	}

	// Enable all logger types
	fnSetProvider('info', 'on');
	fnSetProvider('debug', 'on');
	fnSetProvider('err', 'on');

	return {

		info : function(msg) {
			//loggers[INFO_TYPE].log(cLogDec.debug(msg));
		},

		debug : function(msg) {
			//loggers[DEBUG_TYPE].log(cLogDec.debug(msg));
		},

		err : function(msg) {
			//loggers[ERR_TYPE].log(cLogDec.err(msg));
		},

		/*
		 * The function sets the type of the logger to a new state
		 */
		set : function(type, state) {
			fnSetProvider(type, state);
		}

	};
};

var ILogProvider = function() {
	return {
		log : function(msg) {
		}
	}
};

/*
 * Filename: Description: Decorates a message before logging
 */
var ILogDecorator = function() {
	return {
		info : function(msg) {
		},
		debug : function(msg) {
		},
		err : function(msg) {
		}
	}
};

/*
 * Filename: Description: Logs a message as a response
 */
var HtmlLogger = function() {
	return {
		log : function(msg) {		
			print(msg);
		}
	}
};

var ConsoleLogger = function() {
	return {
		log : function(msg) {
			//console.log(msg);
		}
	}
}

var HtmlLogDecorator =function(){
	var infoMsg='<font color=blue>[INFO] ';
	var debugMsg='<font color=orange>[DEBUG] ';
	var errMsg='<font color=pink>[ERROR] ';
	
	var terminator='</font><br/>';
	
	return {
		info: function(msg){
			return infoMsg+msg+terminator;
		},
		debug:function(msg){
			return debugMsg+msg+terminator;
		},
		err:function(msg){
			return errMsg+msg+terminator;
		}
	}
}

var SimpleLogDecorator = function() {

	var infoMsg = '[INFO]';
	var debugMsg = '[DEBUG]';
	var errMsg = '[ERROR]';

	return {
		info : function(msg) {
			return infoMsg + msg;
		},
		debug : function(msg) {
			return debugMsg + msg;
		},
		err : function(msg) {
			return errMsg + msg;
		}
	}
};
