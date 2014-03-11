$(function(){

	/*
	Sets up the assset view
	-Disables any buttons which do not need to be there
	*/
	var id=$('#meta-asset-id').html();
	console.log(id);

	//if the id is not present then disable the delete button
	if(id){
		$('#btn-asset-create').css('display','none');
	}
	else{
		$('#btn-asset-delete').hide();
	}
});
