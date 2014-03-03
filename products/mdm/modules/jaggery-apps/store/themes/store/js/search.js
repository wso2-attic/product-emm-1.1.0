$(function () {
    History.Adapter.bind(window, 'statechange', function () {


        var state = History.getState();
        if (state.data.id === 'sort-assets') {
            renderAssets(state.data.context);
        } else if (state.data.id === 'top-assets') {
            var el = $('.store-left'), data = state.data.context;
            //caramel.css($('head'), data.header['sort-assets'].resources.css, 'sort-assets');
            //caramel.code($('head'), data.body['assets'].resources.code);
            async.parallel({
                topAssets: function (callback) {
                    caramel.render('top-assets', data.body['top-assets'].context, callback);
                }
            }, function (err, result) {
                theme.loaded(el, result.sort);
                el.html(result.topAssets);
                $("#top-asset-slideshow-gadget").carouFredSel({
                    items: 4,
                    width: "100%",
                    infinite: false,
                    auto: false,
                    circular: false,
                    pagination: "#top-asset-slideshow-pag-gadget"

                });

                $("#top-asset-slideshow-site").carouFredSel({
                    items: 4,
                    width: "100%",
                    infinite: false,
                    auto: false,
                    circular: false,
                    pagination: "#top-asset-slideshow-pag-site"

                });

                $("#top-asset-slideshow-ebook").carouFredSel({
                    items: 4,
                    width: "100%",
                    infinite: false,
                    auto: false,
                    circular: false,
                    pagination: "#top-asset-slideshow-pag-ebook"

                });
                mouseStop();
                /*el.append(result.paging);
                 caramel.js($('body'), data.body['assets'].resources.js, 'assets', function () {
                 mouseStop();
                 });
                 caramel.js($('body'), data.header['sort-assets'].resources.js, 'sort-assets', function () {
                 updateSortUI();
                 });*/
                $(document).scrollTop(0);
            });
        }
    });


    /*
     var search = function () {
     var url;
     currentPage = 1;
     if (store.asset) {
     url = caramel.url('/assets/' + store.asset.type + '/?query=' + $('#search').val());
     caramel.data({
     title: null,
     header: ['sort-assets'],
     body: ['assets', 'pagination']
     }, {
     url: url,
     success: function (data, status, xhr) {
     //TODO: Integrate a new History.js library to fix this
     if ($.browser.msie == true && $.browser.version < 10) {
     renderAssets(data);
     } else {
     History.pushState({
     id: 'sort-assets',
     context: data
     }, document.title, url);
     }
     },
     error: function (xhr, status, error) {
     theme.loaded($('#assets-container').parent(), '<p>Error while retrieving data.</p>');
     }
     });
     theme.loading($('#assets-container').parent());
     } else if ($('#search').val().length > 0 && $('#search').val() != undefined) {
     url = caramel.url('/assets/all/?query=' + $('#search').val());
     caramel.data({
     title: null,
     body: ['top-assets']
     }, {
     url: url,
     success: function (data, status, xhr) {
     //TODO: Integrate a new History.js library to fix this
     if ($.browser.msie == true && $.browser.version < 10) {
     renderAssets(data);
     } else {
     History.pushState({
     id: 'top-assets',
     context: data
     }, document.title, url);
     }
     },
     error: function (xhr, status, error) {
     theme.loaded($('#assets-container').parent(), '<p>Error while retrieving data.</p>');
     }
     });
     theme.loading($('#assets-container').parent());
     }
     };
     */

	var buildParams = function(query) {
	    return 'query=' + query;
	};

    var search = function () {
        var url, searchVal = $('#search').val();
        
        //var url, searchVal = test($('#search').val());
        currentPage = 1;
        if (store.asset) {
        	
            url = caramel.url('/assets/' + store.asset.type + '/?' + buildParams(searchVal));
            caramel.data({
                title: null,
                header: ['header'],
                body: ['assets', 'sort-assets']
            }, {
                url: url,
                success: function (data, status, xhr) {
                	
                    //TODO: Integrate a new History.js library to fix this
                    if ($.browser.msie == true && $.browser.version < 10) {
                        renderAssets(data);
                    } else {
                        History.pushState({
                            id: 'sort-assets',
                            context: data
                        }, document.title, url);
                    }
                    location.reload(); 
                },
                error: function (xhr, status, error) {
                	
                    theme.loaded($('#assets-container').parent(), '<p>Error while retrieving data.</p>');
                }
            });
            theme.loading($('#assets-container').parent());
        } else if (searchVal.length > 0 && searchVal != undefined) {
        	
            url = caramel.url('/?' + buildParams(searchVal));
            caramel.data({
                title: null,
                header: ['header'],
                body: ['top-assets', 'navigation', 'sort-assets']
            }, {
                url: url,
                success: function (data, status, xhr) {
                    //TODO: Integrate a new History.js library to fix this
                    if ($.browser.msie == true && $.browser.version < 10) {
                        renderAssets(data);
                    } else {
                        History.pushState({
                            id: 'top-assets',
                            context: data
                        }, document.title, url);
                    }
                    
                },
                error: function (xhr, status, error) {
                    theme.loaded($('#assets-container').parent(), '<p>Error while retrieving data.</p>');
                }
            });
            theme.loading($('#assets-container').parent());
        }

        $('.search-bar h2').find('.page').text(' / Search: "' + searchVal + '"');
    };

    $('#search-dropdown-cont').ontoggle = function ($, divobj, state) {
        var icon = $('#search-dropdown-arrow').find('i'), cls = icon.attr('class');
        icon.removeClass().addClass(cls == 'icon-sort-down' ? 'icon-sort-up' : 'icon-sort-down');
    }

    $('#search').keypress(function (e) {
        if (e.keyCode === 13) {
            if ($('#search-dropdown-cont').is(':visible')) {
                $('#search').val('');
                makeQuery();
            }
            search();
        } else if (e.keyCode == 27) {

            $('#search-dropdown-cont').toggle();
        }

    })
    .click(function(e){
            $(this).animate({width:'500px'}, 100);
            e.stopPropagation();
        })
    /*
    .blur(function(){
             $(this).animate({width:'100%'});
        })*/
    
    ;
    
    $(document).click(function(){
    	 $('#search').animate({width:'100%'});
    });
    /*
     $('#search').blur(function(){
     $(this).fadeOut();
     $('#search-button').fadeIn("fast");
     });*/

    $('#search-button').click(function () {
        if ($('#search').val() == '') return;
        if ($('#search-dropdown-cont').is(':visible')) {
            $('#search').val('');
            makeQuery();
        }
        search();
        /*
         $(this).fadeOut("fast", function(){
         $('#search').fadeIn("fast").focus();
         });*/
    });

    $('#search-dropdown-arrow').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        var icon = $(this).find('i'), cls = icon.attr('class');
        icon.removeClass().addClass(cls == 'icon-sort-down' ? 'icon-sort-up' : 'icon-sort-down');
        if ($('#search').val().length > 0) {
            if ($('#search').val().indexOf(',')) {
                var qarray = $('#search').val().split(",");
                if (qarray.length > 0) {
                    $('#search-dropdown-cont').children('div').each(function () {
                        var $this = $(this);
                        $this.find('input').val('')

                    });
                    for (var i = 0; i < qarray.length; i++) {
                        $('#search-dropdown-cont').children('div').each(function () {
                            var $this = $(this);
                            var idVal = $this.find('input').attr('id').toLowerCase();
                            if (idVal == qarray[i].split(':')[0].toLowerCase()) {
                                $this.find('input').val(qarray[i].split(':')[1])
                            }
                        });

//                        $('#search-dropdown-cont').children('div').find('#'+qarray[i].split(':')[0].toLowerCase()).val(qarray[i].split(':')[1]);
//                        $('#'+qarray[i].split(':')[0]).val(qarray[i].split(':')[1]);
                    }

                }
            }
        }
        $('#search-dropdown-cont').delay(300).slideToggle("fast");
        $('#search').trigger('click');
    });

    $('#search-dropdown-close').click(function (e) {
        e.stopPropagation();
        $('#search-dropdown-cont').toggle();
        var icon = $('#search-dropdown-arrow').find('i'), cls = icon.attr('class');
        icon.removeClass().addClass(cls == 'icon-sort-down' ? 'icon-sort-up' : 'icon-sort-down');
    });

    $('html').click(function () {
        if ($('#search-dropdown-cont').is(':visible')) {
            $('#search-dropdown-cont').hide();

            var icon = $('#search-dropdown-arrow').find('i'), cls = icon.attr('class');
            icon.removeClass().addClass(cls == 'icon-sort-down' ? 'icon-sort-up' : 'icon-sort-down');
        }

    });

    $('#search-dropdown-cont').click(function (e) {
        e.stopPropagation();
    });

	 $('#search-dropdown-cont').find('input').keypress(function(e){
	 	if(e.keyCode == 13){
	 		$('#search-button2').trigger('click');
	 	}
	 });
    /*
     $('#search').keypress(function (e) {
     if (e.keyCode === 13) {
     search();
     }
     });

     $('#search-button').click(function () {
     search();
     return false;
     });*/
    /*
     var test = function (que) {
     var map = {};
     var key = "";
     var value = "";
     var isKey = true;
     for (var i = 0; i < que.length; i++) {
     if (isKey) {
     for (; i < que.length; i++) {
     if (que.charAt(i) == ":") {
     isKey = false;
     break;
     }
     key += que.charAt(i);
     }
     } else if (que.charAt(i) != " ") {
     if (que.charAt(i) == "\"") {
     i++;
     for (; i < que.length; i++) {
     if (que.charAt(i) == "\"") {
     break;
     }
     value += que.charAt(i);
     }
     } else {
     for (; i < que.length; i++) {
     if (que.charAt(i) == " ") {
     break;
     }
     value += que.charAt(i);
     }
     }
     isKey = true;
     } else {

     }
     if (isKey) {
     map[key] = value;
     key = "";
     value = "";
     }

     }
     var query = "";
     for (var searchKey in map) {
     query += searchKey + "=" + map[searchKey] + "&";
     }
     return query.substring(0, query.length - 1);
     };
     */

    var makeQuery = function () {

        $('#search-dropdown-cont').children('div').each(function () {
            var $this = $(this);
            if ($('#search').val().length > 0) {
                if ($this.find('input').val().length > 0) {
                    $('#search').val($('#search').val() + ' ' + $this.find('input').attr('name') + ':"' + $this.find('input').val() + '"');
                }
            } else {
                if ($this.find('input').val().length > 0) {
                    $('#search').val($this.find('input').attr('name') + ':"' + $this.find('input').val() + '"');
                }
            }

        });

    }

    $('#search-button2').click(function () {
        $('#search').val('');
        
        makeQuery();
        if ($('#search').val() == '') return;
        search();
        $('#search-dropdown-cont input').val('');
        return false;
    });
    
    $('#container-search').affix({
       offset: { top: $('.navbar').offset().top + 80}
   });
});