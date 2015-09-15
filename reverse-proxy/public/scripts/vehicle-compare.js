$(document).off("pageshow", ".ui-page[data-url*='/en/mobile/vehicles/2015/renegade/compare/']").on("pageshow", ".ui-page[data-url*='/en/mobile/vehicles/2015/renegade/compare/']", function(e) {
    var url = $.mobile.activePage.attr("data-url").replace(window.location.search, ""),
        pageURL = url.replace(/-/g, "_").split("/");

    if(pageURL.indexOf('chevrolet_trax') > 0){
        context.pageName = "compare:trax";
        context.pageType = 'vehicles';
    }else if(pageURL.indexOf('honda_hrv') > 0){
        context.pageName = "compare:hrv";
        context.pageType = 'vehicles';
    }else{
        context.pageName = "compare";
        context.pageType = "comparePage";
    }

    context.year = pageURL[4];
    context.vehicle = pageURL[5];
    context.model = $('.change-model-content').eq(0).find('.model-content-container').eq(0).find('span[data-model]').data('model');
    var Context = {
        'year': context.year,
        'vehicle': context.vehicle,
        'model': context.model
    }
    context.trim = Vehicles.getTrim(Context);
    context.myc = Vehicles.getModelYearCode(Context);
    context.llp = Vehicles.getLLP(Context);
    context.ccode = Vehicles.getCcode(Context);

    mGlobal.ctaUpdate.inventoryCount($(e.target).find(":jqmData(component='inventoryCount')"));
    mGlobal.ctaUpdate.bmo($(e.target).find(":jqmData(component='ctaBMO')"));

    DATALAYER.set({
        "pageType": "competitive-compare",
        "pageName": "renegade",
        "vehicle": context.vehicle,
        "year": context.year,
        "trim": context.trim
    });

    var modelNameForPT = "";
    /* swipe icon hide after time delay*/
    $(".swipe_icon").show().delay(2000).fadeOut('slow');

    /*update context*/
    $('.dare-to-compare-body span.price[data-model]').each(function(index, value) {
        $(this).text(Vehicles.getMSRP({
            year: $(this).data('year'),
            vehicle: $(this).data('vehicle'),
            model: $(this).data('model')
        }));
    });

    /*initialize royal slider*/
    var props = {
        keyboardNavEnabled: !0,
        arrowsNavAutoHide: !1,
        /*autoScaleSlider: !0,
         autoScaleSliderWidth: 200,
         autoScaleSliderheight: 200, */
        loop: !1,
        navigateByClick: !1,
        controlsInside: !1,
        controlNavigation: "none",
        autoHeight: true,
        autoScaleSlider: false,
        imageScaleMode: 'none',
        imageAlignCenter: false
    };
    pageURL.indexOf('chevrolet_trax') > 0 || pageURL.indexOf('honda_hrv') > 0 ?  props['numImagesToPreload'] = 12 : '';
    $(".slider-wrapper").royalSlider(props);

    mGlobal.comapreRenegadeUpdateInventoryCount = function() {
        var zip = $.cookie('zipcode');

        // early exit if zip is not there in cookie
        if (zip === null) {
            $('.dare-to-compare').find(".searchInventory-cta-button .button-text").text("Search inventory available near you");
            return;
        }

        if (context.vehicle !== "") {
            var myc = Vehicles.getModelYearCode(context).replace(/\bCU/, "IU"),
                _inventoryCount = 0,
                vehDispName = Vehicles.getDescription({
                    year: context.year,
                    vehicle: context.vehicle
                }).replace(context.year + " ", ""),
                zipDistance = (context.brand === "fiatusa") ? 200 : 50;

            $.getJSON("/hostd/getsearchinventory.json?src=sape&inventoryType=N&sortOrder=ASC&modelYearCode=" +
                    myc + "&zipCode=" + zip + "&zipDistance=" + zipDistance,
                function(D) {
                    _inventory = D[0].data.inventoryVehicles;
                    _inventoryCount = _inventory.length;

                    // Update text
                    if (_inventoryCount > 1) {
                        $('.dare-to-compare').find(".searchInventory-cta-button .button-text").text(vehDispName + " vehicles near you");
                    } else if (_inventoryCount === 1) {
                        $('.dare-to-compare').find(".searchInventory-cta-button .button-text").text(vehDispName + " vehicle near you");
                    } else {
                        $('.dare-to-compare').find(".searchInventory-cta-button .button-text").text("Search inventory available near you");
                    }

                    // Update Count if its not zero else keep empty
                    if (_inventoryCount !== 0) {
                        $('.dare-to-compare').find(".searchInventory-cta-button span.count").text(_inventoryCount);
                    }
                });
        }
    };

    mGlobal.comapreRenegadeUpdateInventoryCount();

    /*invoke function after slider is initialized*/
    var slider = $(".slider-wrapper").data('royalSlider');

    var swipeAnalyticsHandler = function(ev, nextPrev) {

        var comparisionAttribute = $(ev).closest(".ui-collapsible-content").prev().find(".ui-btn-text").clone().children().remove().end().text();

        var lid = "";
        if (nextPrev == "next") {
            lid = comparisionAttribute + "_" + $(slider.currSlide.holder).prev().find('.features-header').text();
        } else if (nextPrev == "prev") {
            lid = comparisionAttribute + "_" + $(slider.currSlide.holder).next().find('.features-header').text();
        } else if (nextPrev == "swipe_next") {
            if ($(slider.currSlide.holder).prev().length > 1) {
                lid = comparisionAttribute + "_" + $(slider.currSlide.holder).prev().next().find('.features-header').text();
            } else {
                lid = comparisionAttribute + "_" + $(slider.currSlide.holder).find('.features-header').text();
            }

        } else {
            if ($(slider.currSlide.holder).next().length > 1) {
                lid = comparisionAttribute + "_" + $(slider.currSlide.holder).next().find('.features-header').text();
            } else {
                lid = comparisionAttribute + "_" + $(slider.currSlide.holder).find('.features-header').text();
            }
        }

        lid = lid.toLowerCase().replace(/ /g, "_").replace(/\//g, "_").trim() + "_" + nextPrev;

        var lpos = comparisionAttribute.toLowerCase().replace(/ /g, "_").replace(/\//g, "_").trim() + "_content_mobile";

        linkTrack(lpos, lid);

        /*Adobe Analytics Link Track*/

        if(pageURL.indexOf('chevrolet_trax') > 0 || pageURL.indexOf('honda_hrv') > 0){
            var compareProps = {};
            compareProps.lid = lid.replace('compare_available_features:_', '');
            compareProps.lpos = 'compare-content-mobile';
            compareProps.vars = {'eVar75' : compareProps.lpos +':'+ compareProps.lid};
            DATALAYER.linkTrack(this, compareProps);
        }else{
            var props = {
                "lpos": lpos,
                "lid": lid
            };
        DATALAYER.linkTrack(this, props);
        }
    };

    var modelChangeAnalyticsHandler = function(ev, model, modelChange) {
        var lid = $(ev).closest('.ui-collapsible').find(".ui-collapsible-heading .ui-btn-text").clone().children().remove().end().text();
        lid = lid.toLowerCase().replace(/ /g, "_").replace(/\//g, "_").trim() + "_change_model_" + model;
        linkTrack("content_mobile", lid);

        //Adobe Analytics Link Track
        DATALAYER.linkTrack(this, {
            "lpos": "content_mobile",
            "lid": lid
        });

        if (modelChange) {
            var trackPathOverride = '/' + context.brand + '/en/mobile/vehicles/' + context.year + '/' + context.vehicle + "/" + modelNameForPT + '/index.html';
            pageTrack(trackPathOverride, true);
        }
    };

    $('.slider-wrapper .rsArrowRight').on('click', function(event) {
        swipeAnalyticsHandler(this, "next");
    });

    $('.slider-wrapper .rsArrowLeft').on('click', function(event) {
        swipeAnalyticsHandler(this, "prev");
    });

    $('.features-wrapper').on("swipeleft", function(event) {
        if ($(".slider-wrapper .rsArrowRight").is(":visible")) {
            swipeAnalyticsHandler(this, "swipe_next");
        }
    });

    $('.features-wrapper').on("swiperight", function(event) {
        if ($(".slider-wrapper .rsArrowLeft").is(":visible")) {
            swipeAnalyticsHandler(this, "swipe_prev");
        }
    });

    $("div.absolute-content").off("swipeleft").on("swipeleft", function(event) {
        if ($(".slider-wrapper .rsArrowRight").is(":visible")) {
            slider.next(swipeAnalyticsHandler(this, "swipe_next"));
        }
    });

    $("div.absolute-content").off("swiperight").on("swiperight", function(event) {
        if ($(".slider-wrapper .rsArrowLeft").is(":visible")) {
            slider.prev(swipeAnalyticsHandler(this, "swipe_prev"));
        }
    });

    /*update disclaimers for tooltip*/
    mGlobal.updateDisclaimers.init();

    $('.dare-to-compare-body').find('div[data-role="collapsible"]').find('h3').on("click", function() {

        var collapsed = $(this).hasClass('ui-collapsible-heading-collapsed');
        var status = collapsed ? "collapse" : "expand";
        var lid = $(this).find(".ui-btn-text").clone().children().remove().end().text();
        var lpos = lid.toLowerCase().replace(/ /g, "_").trim() + "_content_mobile"
        lid = context.year + "_" + context.model + "_" + lid.toLowerCase().replace(/ /g, "_").trim() + "_" + status;

        linkTrack(lpos, lid);
        //Adobe Analytics Link Track
        DATALAYER.linkTrack(this, {
            "lpos": lpos,
            "lid": lid
        });

        /*    var trackPathOverride = '/' + context.brand + '/en/mobile/vehicles/' + context.year + '/' + context.vehicle + "/" + modelNameForPT + '/index.html';
         pageTrack(trackPathOverride, true); */

    });

    /*update required function on accordoin expand*/
    $('.dare-to-compare-body').off("expand").on("expand", ".ui-collapsible", function(e) {
        e.preventDefault();
        topValue = $(this).position().top;
        if (window.innerHeight > window.innerWidth) {
            $.mobile.silentScroll(topValue - 50);
        } else {
            $.mobile.silentScroll(topValue - 5);
        }

        //var
        slider = $(this).find(".slider-wrapper").data('royalSlider');

        $("div.absolute-content").off("swipeleft").on("swipeleft", function(event) {
            if ($(".slider-wrapper .rsArrowRight").is(":visible")) {
                slider.next(swipeAnalyticsHandler(this, "swipe_next"));
            }

        });

        $("div.absolute-content").off("swiperight").on("swiperight", function(event) {
            if ($(".slider-wrapper .rsArrowLeft").is(":visible")) {
                slider.prev(swipeAnalyticsHandler(this, "swipe_prev"));
            }

        });

        slider.updateSliderSize(true);
        mGlobal.updateDisclaimers.init();

    });

    /*on change model click*/
    $(".change-model-header").on('click', function(event) {

        $(this).find('.indicator-arrow').toggleClass('arrow-up');

        var $ModelContent = $(this).parent().find(".change-model-content");
        var $competitorVehicleImage = $(this).parents('.content-wrapper').find('.slider-wrapper .competitor-vehicle-image');
        var $sliderWrapper = $(this).parents('.content-wrapper').find('.slider-wrapper');
        var slider = $sliderWrapper.data('royalSlider');
        var $absoluteContent = $(this).parents('.absolute-content');

        $ModelContent.slideToggle("slow", function() {
            if ($ModelContent.is(':visible')) {

                modelChangeAnalyticsHandler(event.target, "expand", false);

                $competitorVehicleImage.animate({
                    marginTop: $ModelContent.height() + 70
                }, 100);
                $sliderWrapper.animate({
                    height: $absoluteContent.height() + 70
                });
            } else {

                modelChangeAnalyticsHandler(event.target, "collapse", false)
                $competitorVehicleImage.animate({
                    marginTop: '35px'
                }, 100);

                $sliderWrapper.animate({
                    height: $absoluteContent.height()
                });
            }
        });

        slider.updateSliderSize(true);
        $("div.absolute-content").off("swipeleft").on("swipeleft", function(event) {
            if ($(".slider-wrapper .rsArrowRight").is(":visible")) {
                slider.next(swipeAnalyticsHandler(this, "swipe_next"));
            }

        });
        $("div.absolute-content").off("swiperight").on("swiperight", function(event) {
            if ($(".slider-wrapper .rsArrowLeft").is(":visible")) {
                slider.prev(swipeAnalyticsHandler(this, "swipe_prev"));
            }
        });
    });

    /* function to toggle the renegade models*/
    $('.model-content-container').on('click', function(event) {

        var modalName = $(this).data('modelid');
        var selectedModel = $(this).find('span[data-model]').data('model');

        context.model = selectedModel;
        modelNameForPT = modalName;
        modelChangeAnalyticsHandler(event.target, modalName, true);

        var Context = {
            'year': context.year,
            'vehicle': context.vehicle,
            'model': context.model
        }
        context.trim = Vehicles.getTrim(Context);

        context.llp = Vehicles.getLLP(Context);
        context.ccode = Vehicles.getCcode(Context);

        $(this).closest('.dare-to-compare-body > div').fadeOut();

        var $visibleChangeModel = $(this).closest("div.dare-to-compare-body").find("div[data-model-id='" + modalName + "'] div.ui-collapsible-set > div:not(.ui-collapsible-collapsed) .change-model-content");
        var $competitorVehicleImage = $visibleChangeModel.parents('.content-wrapper').find('.slider-wrapper .competitor-vehicle-image');
        var $sliderWrapper = $visibleChangeModel.parents('.content-wrapper').find('.slider-wrapper');
        var slider = $sliderWrapper.data('royalSlider');

        $(this).closest(".dare-to-compare-body").find("div[data-model-id='" + modalName + "']").fadeIn('slow', function() {

            if ($visibleChangeModel.is(':visible')) {
                $competitorVehicleImage.animate({
                    marginTop: $(this).parent().find('.change-model-content').height() + 70
                }, 100);

                $sliderWrapper.animate({
                    height: $visibleChangeModel.parent().parent().height() + 70
                });
            } else {
                $competitorVehicleImage.animate({
                    marginTop: '35px'
                }, 100);

                $sliderWrapper.animate({
                    height: $visibleChangeModel.parent().parent().eq(0).height()
                });
            }
            slider.updateSliderSize(true);

            $("div.absolute-content").off("swipeleft").on("swipeleft", function(event) {
                if ($(".slider-wrapper .rsArrowRight").is(":visible")) {
                    slider.next(swipeAnalyticsHandler(this, "swipe_next"));
                }

            });
            $("div.absolute-content").off("swiperight").on("swiperight", function(event) {
                if ($(".slider-wrapper .rsArrowLeft").is(":visible")) {
                    slider.prev(swipeAnalyticsHandler(this, "swipe_prev"));
                }
            });

            mGlobal.updateDisclaimers.init();
        });
    });

});