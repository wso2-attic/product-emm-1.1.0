var theme = (function () {
    var loading, loaded,
        //loaderClass = 'loading';
        loaderClass = 'loading';

    loading = function (el) {
        var loader;
        //el.children().hide();
        loader = $('.' + loaderClass, el);
        if (loader.length === 0) {
            loader = el.append('<div class="' + loaderClass+ '"><img src="' + caramel.context + '/themes/store/img/preloader-40x40.gif"></div>');
        }
        loader.show();
    };

    loaded = function (el, data) {
        var children;
        $('.' + loaderClass, el).hide();
        children = el.children(':not(.' + loaderClass + ')');
        if (!data) {
            children.show();
            return;
        }
        children.remove();
        el.append(data);
    };

    return {
        loading: loading,
        loaded: loaded
    };
})();


$(function(){
	$(window).bind('resize', adjustStoreRight);
	
	adjustStoreRight();
})

var adjustStoreRight = function(){
	
	var docWidth = $(window).width();
	
	if(docWidth < 1200){
		$('.store-left').removeClass('span9').addClass('span12');
		$('.store-right').removeClass('span3').addClass('span12');
		
		$('.store-right > .row > .span3').removeClass('span3').addClass('span12');
		$('.store-right').height('auto');
		$('.asset-description-header > .row > .span9').removeClass('span9').addClass('span12');
	} else {
		$('.store-left').removeClass('span12').addClass('span9');
		$('.store-right').removeClass('span12').addClass('span3');
		$('.store-right > .row > .span12').removeClass('span12').addClass('span3');
		$('.asset-description-header > .row > .span12').removeClass('span12').addClass('span9');
		
	
		
		setTimeout(function(){ 
					($('.store-right').height() < $('.store-left').height()) &&  $('.store-right').height($('.store-left').height() + 15);
					}, 200);
		
	
	}
	$('.store-left').resize(function(){
		var right = $('.store-right');
		var left = $(this);
		if(right.height > left.height) {
			right.height(left.height());
		} 
	});
	
}
$(function(){
	$("#myasset-container .btn-popover").on("click",function(){
		$('.popover').hide();
	});
	$('.btn-popover').popover({ html: false });
	$('.popover-content').live("click",function(){
		var selectedTxt = $(this).text();
		var $textArea = $("<textarea>").addClass('popover-textarea').val(selectedTxt);
		$(this).text("").append($textArea);	
		$(".popover-textarea").height($(".popover-textarea")[0].scrollHeight);
		$(".popover-textarea").select();
		$(".popover").on("click",function(){
			$(".popover-textarea").text(selectedTxt);
		});
		$(".popover").on("mouseleave",function(){
			$(".popover-content").text(selectedTxt);
		});	
	});
});
