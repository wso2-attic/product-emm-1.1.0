$(document).ready(function(){
	$('.dropdown-toggle').dropdown();
	$('#asset_view_tabs a').click(function (e) {
	  e.preventDefault();
	  $(this).tab('show');
	});
});
