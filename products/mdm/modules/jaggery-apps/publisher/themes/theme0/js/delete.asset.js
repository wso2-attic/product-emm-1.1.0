$(function(){

	/*
	Deletes an asset type using an id value
	*/
	$('#btn-delete-asset').on('click',function(){

		var id=$('#meta-asset-id').html();
		var type=$('#meta-asset-type').html();
	
		//TODO: Replace with caramel client
		$.ajax({
			url:'/publisher/asset/'+type+'/'+id,
			type:'DELETE',
			success:function(response){
//				alert('asset deleted');

				window.location='/publisher/assets/'+type+'/';
			},
			error:function(response){
				alert('Failed to delete asset.');
			}
		});
	});
	
});
