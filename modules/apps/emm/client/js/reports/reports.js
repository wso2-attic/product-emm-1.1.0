$(document).ready( function () {
	oTable = $('#main-table').dataTable( {
		"sDom": "t",
		"aaSorting": [[ 0, "desc" ]],
		"iDisplayLength": 20,
		 "bStateSave": false,
		"oTableTools": {
			"aButtons": [
				"copy",
				"print",
				{
					"sExtends":    "collection",
					"sButtonText": 'Save <span class="caret" />',
					"aButtons":    [ "csv", "xls", "pdf" ]
				}
			]
		}
	} );
	
} );