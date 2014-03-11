var PAGE_SIZE = 12;
var API_URL = '/store/apis/';

var prefs = new gadgets.Prefs();
var type = prefs.getString('type') || 'gadget';

/**
 * START: form caramel module caramel/scripts/caramel.handlebars.js
 *
 * {{#slice start="1" end="10" count="2" size="2"}}{{name}}{{/slice}}
 */
Handlebars.registerHelper('slice', function (context, block) {
    var html = '', length = context.length, start = parseInt(block.hash.start) || 0, end = parseInt(block.hash.end) || length, count = parseInt(block.hash.count) || length, size = parseInt(block.hash.size) || length, i = start, c = 0;
    while (i < end && c++ < count) {
        var slice = context.slice(i, (i += size));
        slice.sliceIndex = c;
        html += block.fn(slice);
    }
    return html;
});
/*
 * END: form caramel module caramel/scripts/caramel.handlebars.js
 */


/**
 * START: form http://code.google.com/p/jqueryjs/source/browse/trunk/plugins/validate/additional-methods.js?r=6307
 */
jQuery.validator.addMethod("url2", function (value, element, param) {
    return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}, jQuery.validator.messages.url);
/*
 * END: form http://code.google.com/p/jqueryjs/source/browse/trunk/plugins/validate/additional-methods.js?r=6307
 */

var toFade = [];
var assets;
var currantPage;
var isMyAssetsShown = true;
var tabSwitched = false;
var tagToBeLoaded = null;
var queryToBeLoaded = null;

$(function () {
    var assetTmpl = Handlebars.compile($('#asset-template').html());
    var gridTmpl = Handlebars.compile($('#grid-template').html());
    var tagTmpl = Handlebars.compile($('#tags-template').html());

    var MY_ASSET = $('#asset-grid-my');
    var STORE_ASSET = $('#asset-grid-store');
    var STORE_TAB = $('#store-tab');
    var ADD_EXT_BTN = $('#add-ext-btn');
    var ADD_EXT_URL = $('#add-ext-url');
    var EXT_FORM = $('#add-ext');
    var SEARCH_TEXT = $('#inp-search-gadget');

    var getAssetGrid = function () {
        return ( isMyAssetsShown ? MY_ASSET : STORE_ASSET);
    };

    function fade(i) {
        if ((i % PAGE_SIZE == 0 || toFade[i - 1] === true) && toFade[i] && toFade[i].fadeIn) {

            toFade[i].show(100, function () {
                //HACK:ensure the items are show even when gadgets is hidden at init.
                toFade[i].show();

                toFade[i] = true;
                fade(i + 1);
            });
        }
    }

    /**
     * loads single page
     */
    var loadPage = function (pageNum) {
        var pages = getAssetGrid().find('.page');
        var nums = $('.page-num');
        var newPage = pages.eq(pageNum);

        if (currantPage >= 0) {
            pages.eq(currantPage).hide();
            nums.eq(currantPage).removeClass('current-page');
        }
        currantPage = pageNum;
        nums.eq(pageNum).addClass('current-page');
        newPage.show();

        var divs = newPage.find('.asset-box');
        for (var i = 0; i < divs.length; i++) {
            var div = divs[i];
            loadDiv(pageNum * PAGE_SIZE + i, div);
        }
    };

    /**
     * load single asset in to a given div
     *
     * @param {number} i asset index.
     * @param {dom} div div to be displayed in.
     */
    var loadDiv = function (i, div) {
        var asset = assets[i];
        assets[i] = null;
        if (asset) {
            $.ajax({
                url: API_URL + 'asset/' + type,
                data: {
                    id: asset.path
                },
                success: function (data) {
                    var JqDiv = $(div);
                    JqDiv.html(assetTmpl(data));
                    toFade[i] = JqDiv;
                    JqDiv.data(data);
                    fade(i);
                },
                dataType: 'json'
            });
        }
    };

    var addListener = function (func) {
        $(document).bind('assetSelect', function (e, p) {
            func(p);
        });
    };

    var fireEvent = function (e) {
        var target = $(e.target);
        if (target.hasClass('select-btn')) {
            var event = jQuery.Event('assetSelect');
            $(document).trigger(event, $(e.target).parents('.asset-box').data());
        } else if (target.hasClass('btn-browse')) {
            STORE_TAB.click();
        }
    };

    /**
     * load name list for all pages and shows the first of them.
     *
     * @param {?string=} query Search query. should be null if tag argument is present.
     * @param {?string=} tag Filer by tag if passed or show all otherwise.
     */
    var loadPages = function (query, tag) {
        var data = query ? {query:query} : {};
        $.ajax({
            url: API_URL + ( isMyAssetsShown ? 'myAsset/' : ( tag ? 'tag/' + tag + '/' + type : 'asset/' + type)),
            data: data,
            success: function (data) {
                toFade = [];
                if (isMyAssetsShown) {
                    assets = data[type] || [];
                } else {
                    assets = data;
                }

                currantPage = -1;

                if(assets.length>0){
                    var grid = getAssetGrid().html(gridTmpl(assets));
                    grid.find('.asset-box').each(function (i, box) {
                        $(box).data(assets[i]);
                    });

                    loadPage(0);

                    grid.find('.page-num').on('click', function () {
                        loadPage(Number($(this).text()) - 1);
                    });

                    grid.niceScroll();
                }else{
                    if(isMyAssetsShown){
                        getAssetGrid().html($('#no-my-items-template').html());
                    }else{
                        getAssetGrid().html($('#no-search-template').html());
                    }
                }

                //TODO: move this.
                $('#ul-modal-tags').niceScroll();
            },
            dataType: 'json'
        });
    };

    //loads all asset names and loads the first page.
    loadPages();

    $('a[data-toggle="tab"]').on('shown', function (e) {
        isMyAssetsShown = ($(this).attr('id') == 'my-tab');
        if (!tabSwitched) {
            tabSwitched = true;
            loadPages(queryToBeLoaded, tagToBeLoaded);
            queryToBeLoaded = null;
            tagToBeLoaded = null;
        }
    });

    // load list of all tags
    $.ajax({
        url: API_URL + 'tag/' + type,
        success: function (data) {
            var tags = $('#ul-modal-tags').html(tagTmpl(data));
            tags.find('.tag-box').on('click', function () {
                var tagName = $(this).find('.tag-box-name').text();
                var a = $(this).find('a');

                if (a.hasClass('selected')) {
                    a.removeClass('selected');
                    loadPages();
                } else {
                    $('.tag-box > a').removeClass('selected');
                    a.addClass('selected');
                    if (STORE_ASSET.is(":visible")) {
                        loadPages(null, tagName);
                    } else {
                        tagToBeLoaded = tagName;
                        STORE_TAB.tab('show');
                    }
                }
                SEARCH_TEXT.val('');

            });
            $('#tag-num-span').text(data.length);
        },
        dataType: 'json'
    });


    EXT_FORM.validate({
        rules: {
            "add-ext-url": {
                required: true,
                url2: true
            }
        }
    });

    EXT_FORM.on('submit', function () {
        return false;
    });

    var submitExtUrl = function () {
        if (EXT_FORM.valid()) {
            var gadgetInfo = {};
            gadgetInfo.attributes = {};
            gadgetInfo.attributes.overview_url = ADD_EXT_URL.val();
            var event = jQuery.Event('assetSelect');
            $(document).trigger(event, gadgetInfo);
            ADD_EXT_URL.val('');
        }
    };

    MY_ASSET.on('click', fireEvent);
    STORE_ASSET.on('click', fireEvent);
    ADD_EXT_BTN.on('click', submitExtUrl);
    ADD_EXT_URL.on('keypress', function (e) {
        if (e.keyCode === 13) {
            submitExtUrl();
        }
    });

    SEARCH_TEXT.on('keypress', function (e) {
        if (e.keyCode === 13) {
            var query = SEARCH_TEXT.val();
            $('.tag-box > a').removeClass('selected');
            if (STORE_ASSET.is(":visible")) {
                loadPages(query);
            } else {
                queryToBeLoaded = query;
                STORE_TAB.tab('show');
            }
        }
    });

    //exposing function to global scope.
    window.addListener = addListener;

    parent['onShowAssetLoad'] && parent['onShowAssetLoad']();
});

