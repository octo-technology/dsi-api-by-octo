$(document).ready(function() {

    var OCTO_APIM_APP = OCTO_APIM_APP || {};

    OCTO_APIM_APP.app = {
        conf: { // three json config files to be loaded at init
            cms: null,
            quizz: null,
            vendorSolutions: null
        },
        lang: "FR",
        currentNav: 'NAVQUIZZ',
        hasToDisplayQuizz: false,
        quizzId: "ID1",
        apims: [],
        history: [],
        _parameter: function (url, name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\#&?]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(url);
            if (results == null)
                return "";
            else
                return results[1];
        },
        _getCMSValue: function (section, key) {
            var domSection = this.conf.cms[section];
            if( (domSection[key + '-' + this.lang]) != null) {
                return domSection[key + '-' + this.lang];
            } else {
                return domSection[key];
            }
        },
        _setCMSValue: function (selector, section, key) {
            var domSection = this.conf.cms[section];
            $(selector).html(domSection[key + '-' + this.lang]);
        },
        _paralaxHook: function() {
            var baseHeight = 0;
            var decalage = $(window).scrollTop() / 3 - baseHeight;
            $('#home-bg-container div').css('background-position-y', decalage + 'px');
        },
        _resizeVideoContainerHook: function() {
            $('header').fadeIn();
            var windowHeight = $(window).height();
            $('#home-bg-container').css('height', ''+ windowHeight +'px');
            $('#nav-overlay').css('height', ''+ windowHeight +'px');
            $('#section-intro').css('height', ''+ windowHeight +'px');
            if($(window).width()>=992) {
                windowHeight -=200;
            } else if($(window).width()>=768) {
                windowHeight -=50;
            } else {
                windowHeight -=150;
            }
            $('#section-quizz').css('height', ''+ windowHeight +'px');
            $('#section-intro-solutions').css('height', ''+ windowHeight +'px');
        },
        _stickyMenuHook: function() {
            var menu = $('header:eq(1)');
            var $window = $(window);

            var window_top_position = $window.scrollTop();
            if(window_top_position >= 200) {
                menu.addClass('in-view');
            } else {
                menu.removeClass('in-view');
                $('.navbar-collapse').collapse('hide');
            }
        },
        _overlayMenuHook: function() {
            var $window = $(window);

            var window_top_position = $window.scrollTop();
            if(window_top_position >=  ($(window).height()/2)) {
                $('#nav-overlay .blog-link').css('color', '#0e2356');
                $('#nav-overlay .contact-link').css('color', '#0e2356');
            } else {
                $('#nav-overlay .blog-link').css('color', '#FFF');
                $('#nav-overlay .contact-link').css('color', '#FFF');
            }
        },
        _backHistoryHook: function() {
            var back = this.history.shift();
            if(back[0]=='NAVINTRO') {
                this.displayIntro();
            } else if(back[0]=='NAVQUIZZ') {
                this.displayQuizz(back[1],back[2]);
            } else {
                this.displayAllSolutions();
            }
        },
        _animateShapes: function() {
            if ( $('.shapes').length ) {

                var pathC = anime.path('.shape-c path');
                anime({
                    targets: '.shape-c .icon',
                    translateX: pathC('x'),
                    translateY: pathC('y'),
                    easing: 'linear',
                    duration: 50000,
                    direction: 'reverse',
                    loop: true
                });

                var pathTarget = anime.path('.shape-target path');
                anime({
                    targets: '.shape-target .icon',
                    translateX: pathTarget('x'),
                    translateY: pathTarget('y'),
                    easing: 'linear',
                    duration: 55000,
                    loop: true
                });

                var pathLogo = anime.path('.shape-logo path');
                anime({
                    targets: '.shape-logo .icon',
                    translateX: pathLogo('x'),
                    translateY: pathLogo('y'),
                    rotate: pathLogo('angle'),
                    easing: 'linear',
                    duration: 58000,
                    direction: 'reverse',
                    loop: true
                });

                var pathPlay = anime.path('.shape-play path');
                anime({
                    targets: '.shape-play .icon',
                    translateX: pathPlay('x'),
                    translateY: pathPlay('y'),
                    rotate: 360,
                    easing: 'linear',
                    duration: 52000,
                    loop: true
                });
            }
        },
        _reDisplay: function() {
            this.displayHome();
            switch (this.currentNav) {
                case 'NAVQUIZZ':
                    if(this.hasToDisplayQuizz) {
                        this.displayQuizz(this.quizzId);
                    } else {
                        this.displayIntro();
                    }
                    break;
                case 'NAVBENCHMARK':
                    this.displayAllSolutions();
                    break;
            }
        },
        displayHome: function() {
            $("header:first-of-type").hide();
            $("footer:first-of-type").hide();
            this._setCMSValue('.button-quizz a', 'home', 'header-menu-quizz');
            this._setCMSValue('.button-solutions a', 'home', 'header-menu-solutions');
            this._setCMSValue('.button-publications a', 'home', 'header-menu-publications');
            this._setCMSValue('.button-download a', 'home', 'header-menu-download');

            this._setCMSValue('#button-legal a', 'home', 'footer-button-legal');
            this._setCMSValue('#button-press a', 'home', 'footer-button-press');
            this._setCMSValue('#button-blog a', 'home', 'footer-button-blog');
            this._setCMSValue('#button-contact a', 'home', 'footer-button-contact');
            $("header:first-of-type").fadeIn();
            $("footer:first-of-type").fadeIn();
        },
        displayIntro: function() {
            this._setCMSValue('.button-quizz a', 'home', 'header-menu-quizz');
            this._setCMSValue('.start-quizz-bloc h2', 'home', 'bloc-quizz-title');
            this._setCMSValue('.start-quizz-bloc h3', 'home', 'bloc-quizz-subtitle');
            this._setCMSValue('.solutions-bloc h2', 'home', 'bloc-solutions-title');
            this._setCMSValue('.solutions-bloc h3', 'home', 'bloc-solutions-subtitle');

            $("#section-intro").hide();
            $("#section-intro-solutions").hide();
            this.quizzId = "ID1";
            $("form").hide();
            $("#section-quizz").hide();
            $("#section-solutions").hide();

            if($(window).width()<768) {
                $("#home-bg").css('background-image', 'url(' + this._getCMSValue('home', 'background-image-mobile') + ')');
            } else {
                $("#home-bg").css('background-image', 'url(' + this._getCMSValue('home', 'background-image') + ')');
            }
            $("#home-bg").removeClass("transparent");
            $("#home-bg-open").addClass("transparent");
            $("#home-bg-solutions").addClass("transparent");
            $("#section-intro").fadeIn();
        },
        displayQuizz: function(id, value) {
            var self = this;
            if(!id) {
                id = "ID1";
            }
            self.currentNav = 'NAVQUIZZ';
            this.hasToDisplayQuizz = true;
            this.quizzId = id;
            $("form").hide();

            if(self.conf.quizz.quizz[id].type == "leaf") {
                var apims = self.conf.quizz.quizz[id].apim;
                var fail = self.conf.quizz.quizz[id].fail;
                if(fail) {
                    self.displayFail(fail);
                    $(".return-button").click(function() {
                        self._backHistoryHook();
                    });
                } else {
                    self.displayQuizzSolutions(apims);
                    $(".return-button").click(function() {
                        self._backHistoryHook();
                    });
                }
            } else {
                $("#form-" + id).show();
                var html = this._generateQuizzBloc(id, value);

                $("#section-quizz").html(html);

                $("input[type=radio]").click(function(e) {
                    e.preventDefault();
                    var current = $(this);
                    var ID = current.attr("id");

                    self.history.unshift(['NAVQUIZZ', id, current.attr("value")]);
                    self.displayQuizz(current.attr("id"), value);
                });

                $(".return-button").click(function() {
                    self._backHistoryHook();
                });

                $("#section-intro").hide();
                $("#section-intro-solutions").hide();
                $("#section-solutions").hide();
                if($(window).width()<768) {
                    $("#home-bg").css('background-image', 'url(' + self._getCMSValue('home', 'background-image-mobile') + ')');
                } else {
                    $("#home-bg").css('background-image', 'url(' + self._getCMSValue('home', 'background-image') + ')');
                }
                $("#home-bg").removeClass("transparent");
                $("#home-bg-open").addClass("transparent");
                $("#home-bg-solutions").addClass("transparent");
                $("#section-quizz").fadeIn();
            }
        },
        start: function() {

            // init quizz form
            var self = this;
            $("section").hide();
            $("input[type=radio]").removeAttr('checked');

            $("#logo-octo").click(function(e) {
                e.preventDefault();
                self.currentNav = 'NAVQUIZZ';
                self.hasToDisplayQuizz = false;
                window.location.hash = '';
                app._reDisplay();
                $(".button-solutions").removeClass("active");
                $(".button-quizz").removeClass("active");
                $(".scroll-to-link").hide();
            });

            $(".button-quizz").click(function(e) {
                e.preventDefault();
                self.history.unshift(['NAVINTRO']);
                window.location.hash = 'display=NAVQUIZZ'+self.lang;
                app.displayQuizz();
                $(".button-solutions").removeClass("active");
                $(".button-quizz").addClass("active");
                $(".scroll-to-link").hide();
            });

            $(".button-solutions").click(function(e) {
                e.preventDefault();
                window.location.hash = 'display=NAVBENCHMARK'+self.lang;
                app.displayAllSolutions();
                $(".button-quizz").removeClass("active");
                $(".button-solutions").addClass("active");
            });

            $("#navbar a").click(function(e) {
                $("#bg").fadeIn();
            });

            $(".button-lang-fr").click(function(e) {
                e.preventDefault();
                self.lang = "FR";
                window.location.hash = 'display='+self.currentNav+'FR';
                self._reDisplay();
                $(".button-lang-en").removeClass("active");
                $(".button-lang-fr").addClass("active");
            });

            $(".button-lang-en").click(function(e) {
                e.preventDefault();
                self.lang = "EN";
                window.location.hash = 'display='+self.currentNav+'EN';
                self._reDisplay();
                $(".button-lang-fr").removeClass("active");
                $(".button-lang-en").addClass("active");
            });

            $("#nav-overlay .scroll-to-link").click(function(e) {
                e.preventDefault();
                var scrollTo = $("#nav-overlay .scroll-to-link").offset().top +50;
                $('html, body').animate({
                    scrollTop: scrollTo
                }, 200);
            });

            $(".start-quizz-bloc").click(function() {
                self.history.unshift(['NAVINTRO']);
                self.displayQuizz();
                $(".button-solutions").removeClass("active");
                $(".button-quizz").addClass("active");
            });

            $(".solutions-bloc").click(function() {
                app.displayAllSolutions();
                $(".button-quizz").removeClass("active");
                $(".button-solutions").addClass("active");
            });

            $(".footer-warning a").click(function() {
                $(".footer-warning").hide();
            });

            $("form").submit(function(e) {
                e.preventDefault();
            });

            var loadedCmsConfig = $.ajax({
                url: "./conf/conf-cms.json",
                type: 'GET',
                dataType: 'json',
                crossDomain: true,
                cache: false,
            });
            var loadedQuizzConfig = $.ajax({
                url: "./conf/conf-quizz.json",
                type: 'GET',
                dataType: 'json',
                crossDomain: true,
                cache: false,
            });
            var loadedVendorSolutions = $.ajax({
                url: "./conf/conf-vendorsolutions.json",
                type: 'GET',
                dataType: 'json',
                crossDomain: true,
                cache: false,
            });
            $.when(loadedCmsConfig, loadedQuizzConfig, loadedVendorSolutions).then(function (cmsConfig, quizzConfig, vendorSolutions) {
                console.log('json config file loaded');
                self.conf.cms = cmsConfig[0];
                self.conf.quizz = quizzConfig[0];
                self.conf.vendorSolutions = vendorSolutions[0];

                // override all app backgrounds if specified in url
                var specifiedImg = self._parameter(window.location, 'bg');
                if (specifiedImg != "") {
                    self.conf.cms.home["background-image"] = specifiedImg;
                    self.conf.cms.home["background-image-mobile"] = specifiedImg;
                    self.conf.cms["section-quizz"]["background-image"] = specifiedImg;
                    self.conf.cms["section-intro-solutions"]["background-image"] = specifiedImg;
                }

                var displayParam = self._parameter(window.location, 'display');
                if (displayParam != "") {
                    switch (displayParam) {
                    case 'NAVQUIZZFR':
                        self.currentNav = 'NAVQUIZZ';
                        $(".button-solutions").removeClass("active");
                        $(".button-quizz").addClass("active");
                        self.lang = "FR";
                        $(".button-lang-en").removeClass("active");
                        $(".button-lang-fr").addClass("active");
                        break;
                    case 'NAVQUIZZEN':
                        self.currentNav = 'NAVQUIZZ';
                        $(".button-solutions").removeClass("active");
                        $(".button-quizz").addClass("active");
                        self.lang = "EN";
                        $(".button-lang-en").addClass("active");
                        $(".button-lang-fr").removeClass("active");
                        break;
                    case 'NAVBENCHMARKFR':
                        self.currentNav = 'NAVBENCHMARK';
                        $(".button-quizz").removeClass("active");
                        $(".button-solutions").addClass("active");
                        self.lang = "FR";
                        $(".button-lang-en").removeClass("active");
                        $(".button-lang-fr").addClass("active");
                        break;
                    case 'NAVBENCHMARKEN':
                        self.currentNav = 'NAVBENCHMARK';
                        $(".button-quizz").removeClass("active");
                        $(".button-solutions").addClass("active");
                        self.lang = "EN";
                        $(".button-lang-en").addClass("active");
                        $(".button-lang-fr").removeClass("active");
                        break;
                    }
                }

                self._reDisplay();
                self._animateShapes();
                self._resizeVideoContainerHook();
                self._paralaxHook();
                self._stickyMenuHook();

                $('header:eq(1)').on('hidden.bs.collapse', function () {
                    self._stickyMenuHook();
                });

                $(window).resize(function() {
                    self._resizeVideoContainerHook();
                });
                $(window).scroll(function() {
                    self._paralaxHook();
                    self._stickyMenuHook();
                    self._overlayMenuHook();
                });

            }, function (xhr, textStatus, thrownError) {
                if (loadedCmsConfig.readyState != 4) {
                    console.log("ajax error loading conf-cms.json");
                    loadedQuizzConfig.abort();
                }
                if (loadedQuizzConfig.readyState != 4) {
                    console.log("ajax error loading conf-quizz.json");
                    loadedQuizzConfig.abort();
                }
                if (loadedVendorSolutions.readyState != 4) {
                    console.log("ajax error loading conf-vendorsolutions.json");
                    loadedVendorSolutions.abort();
                }
                console.log("ajax error loading config");
                console.log(xhr.status);
                console.log(thrownError);
            });
            console.log("app initialized...");
        },
        displayAllSolutions: function() {
            this.currentNav = 'NAVBENCHMARK';
            $("#section-intro").hide();
            $("#section-quizz").hide();
            $("#home-bg").addClass("transparent");
            $("#home-bg-open").addClass("transparent");
            $("#home-bg-solutions").removeClass("transparent");
            this._setCMSValue('#section-intro-solutions h1', 'home', 'section-intro-solutions-title');
            this._setCMSValue('#section-intro-solutions p', 'home', 'section-intro-solutions-subtitle');

            this.displaySolutionsDetailed([
                "3SCALE",
                "APIGEE",
                "AWS",
                "AXWAY",
                "BROADCOM",
                "GRAVITEE",
                "IBM",
                "KONG",
                "MICROSOFT",
                "MULESOFT",
                "AG",
                "TIBCO",
                "TYK",
                "WSO2"
            ]);
            $("#section-intro-solutions").fadeIn();
            $("#section-solutions").fadeIn();
        },
        displayFail: function(failID) {
            var fail = null;
            for(var i = 0; i < this.conf.quizz.fails.length; i++) {
                if(this.conf.quizz.fails[i].id==failID) {
                    fail = this.conf.quizz.fails[i];
                    break;
                }
            }
            var htmlfail = '<div class="row">';

            htmlfail += '<div class="col-md-6">';
            htmlfail += '<div class="bloc">';
            htmlfail += '<h2>' + fail.name + '</h2>';
            htmlfail += '<h3 class="card-text">' + fail["description-" + this.lang] + '</h3>';
            htmlfail += '</div>';
            htmlfail += '</div>';

            htmlfail += '</div>';
            htmlfail += '<a class="return-button" href="#"><span class="icon icon-shape-chevron"></span> ' + this._getCMSValue('home', 'section-quizz-return-button') + '</a>';
            $("form").hide();
            $("#section-quizz").html(htmlfail);
        },
        displayQuizzSolutions: function(apims) {
            this.apims = apims;
            var self = this;
            var htmlapims = '<div class="row">';
            for(var i = 0; i < apims.length; i++) {
                var apim = apims[i];
                for(var j = 0; j < self.conf.vendorSolutions.length; j++) {
                    if(apim == self.conf.vendorSolutions[j].id) {
                        htmlapims += self._generateSummarySolutionBloc(self.conf.vendorSolutions[j]);
                        if(i != 0 && (i + 1) % 3 === 0) {
                            htmlapims += '</div>';
                            htmlapims += '<div class="row">';
                        }
                    }
                }
            }
            htmlapims += '</div>';
            htmlapims += '<a class="return-button" href="#"><span class="icon icon-shape-chevron"></span> ' + this._getCMSValue('home', 'section-quizz-return-button') + '</a>';
            $("form").hide();
            $("#home-bg").addClass("transparent");
            $("#home-bg-open").removeClass("transparent");
            $("#home-bg-solutions").addClass("transparent");
            $("#section-quizz").html(htmlapims);
            //-- generate matching solutions in section-solution --
            this.displaySolutionsDetailed(apims);
            $("#section-solutions").fadeIn();

            // for all apims, attach event on click to go to detail bloc
            apims.forEach(function(apim) {
                var scrollTo = "#bloc-solution-" + apim;
                $("#" + apim + "").click(function(e) {
                    e.preventDefault();
                    $('html, body').animate({
                        scrollTop: $(scrollTo).offset().top -70
                    }, 200);

                });
            });

            $(".scroll-to-link").fadeIn();
        },
        displaySolutionsDetailed: function(apims) {
            this.apims = apims;
            var self = this;
            var htmlapims = '';
            for(var i = 0; i < apims.length; i++) {
                var apim = apims[i];
                for(var j = 0; j < self.conf.vendorSolutions.length; j++) {
                    if(apim == self.conf.vendorSolutions[j].id) {
                        htmlapims += '<div class="row">';
                        htmlapims += self._generateDetailedSolutionBloc(self.conf.vendorSolutions[j]);
                        htmlapims += '</div>';
                    }
                }
            }

            $("#solutionsplaceholder").html(htmlapims);

            // for all apims, attach event on click to display pros & cons
            apims.forEach(function(apim) {
                var selectorCons = "#bloc-solution-" + apim + " .button-cons";
                var selectorPros = "#bloc-solution-" + apim + " .button-pros";
                $(selectorCons).click(function(e) {
                    e.preventDefault();
                    $("#bloc-solution-" + apim + " .bloc-pros").hide();
                    $("#bloc-solution-" + apim + " .bloc-cons").fadeIn();
                    $(selectorPros).removeClass("active");
                    $(selectorCons).addClass("active");
                });
                $(selectorPros).click(function(e) {
                    e.preventDefault();
                    $("#bloc-solution-" + apim + " .bloc-cons").hide();
                    $("#bloc-solution-" + apim + " .bloc-pros").fadeIn();
                    $(selectorCons).removeClass("active");
                    $(selectorPros).addClass("active");
                });
            });

            $("#section-solutions").fadeIn();
            $("#solutionsplaceholder").fadeIn();

            $(".scroll-to-link").fadeIn();
        },
        _generateQuizzBloc: function(quizzID, value) {
            var self = this;
            var question = this.conf.quizz.quizz[quizzID];

            var html = '<div class="row">';
            html += '<div class="col-md-6">';
            html += '<div class="bloc">';

            html += '<form id="form-' + quizzID + '" class="needs-validation">';
            html += '<h1 class="mb-3">' + question["question-" + self.lang] + '</h1>';
            for(var i = 0; i < question.answers.length; i++) {
                var answer = question.answers[i];
                var id = 'ID' + answer.goto + '';
                html += '<div class="form-check">';
                if(answer.goto == value) {
                    html += '<input class="form-check-input" type="radio" name="radio-' + quizzID + '" id="' + id + '" value="' + answer.goto + '" checked>';
                } else {
                    html += '<input class="form-check-input" type="radio" name="radio-' + quizzID + '" id="' + id + '" value="' + answer.goto + '">';
                }
                html += '<label class="form-check-label" for="' + id + '">';
                html += '' + answer["answer-" + self.lang] + '';
                html += '</label>';
                html += '</div>';
            }
            html += '</form>';

            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '<a class="return-button" href="#"><span class="icon icon-shape-chevron"></span> ' + this._getCMSValue('home', 'section-quizz-return-button') + '</a>';

            return html;
        },
        _generateSummarySolutionBloc: function(apim) {
            var html = '<div class="col-md-4">';
            html += '<div id="'+apim.id+'" class="bloc bloc-apim">';
            html += '<div class="logo-container"><img src="' + apim.logo + '" alt="' + apim.name + '"></div>';
            html += '<h3>' + this._getCMSValue('home', 'bloc-solutions-button-knowmore') + '</h3>';
            html += '</div>';
            html += '</div>';
            return html;
        },
        _generateDetailedSolutionBloc: function(apim) {

            var html = '';
            html += '<div class="col-md-12">';
            html += '<div class="bloc-edito" id="bloc-solution-' + apim.id + '">';
            html += '<h2>' + apim.name + '.</h2>';
            html += '<p>' + apim["description-" + this.lang] + '</p>';

            html += '<ul class="nav nav-tabs">';
            html += '<li class="nav-item">';
            html += '<a class="nav-link active button-pros" href="#"><img src="./skin2/img/plus-jaune.png" alt="cons- '+ apim.name + '"></a>';
            html += '</li>';
            html += '<li class="nav-item">';
            html += '<a class="nav-link button-cons" href="#"><img src="./skin2/img/moins-jaune.png" alt="cons- \'+ apim.name + \'"></a>';
            html += '</li>';
            html += '</ul>';

            html += '<div class="bloc">';
            html += '<ul class="bloc-pros">';
            for(var i = 0; i < apim["pros-" + this.lang].length; i++) {
                html += '<li>';
                html += '&gt;&nbsp;' + apim["pros-" + this.lang][i] + '<br />';
                html += '</li>';
            }
            html += '</ul>';

            html += '<ul class="bloc-cons">';
            for(var i = 0; i < apim["cons-" + this.lang].length; i++) {
                html += '<li>';
                html += '&gt;&nbsp;' + apim["cons-" + this.lang][i] + '<br />';
                html += '</li>';
            }
            html += '</ul>';
            html += '</div>';

            html += '</div>';
            html += '</div>';

            return html;
        }
    }

    var app = OCTO_APIM_APP.app || new OCTO_APIM_APP.app();
    app.start();
});
