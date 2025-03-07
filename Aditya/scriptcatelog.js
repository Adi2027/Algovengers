// Combined inline <script> blocks
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'UA-743380-5');

window.locale = "en";
window.standaloneContest = false;
function adjustViewport() {
    var screenWidthPx = Math.min($(window).width(), window.screen.width);
    var siteWidthPx = 1100; // min width of site
    var ratio = Math.min(screenWidthPx / siteWidthPx, 1.0);
    var viewport = "width=device-width, initial-scale=" + ratio;
    $('#viewport').attr('content', viewport);
    var style = $('<style>html * { max-height: 1000000px; }</style>');
    $('html > head').append(style);
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    adjustViewport();
}

/* Protection against trailing dot in domain. */
let hostLength = window.location.host.length;
if (hostLength > 1 && window.location.host[hostLength - 1] === '.') {
    window.location = window.location.protocol + "//" + window.location.host.substring(0, hostLength - 1);
}

String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

var queryMobile = Codeforces.queryString.mobile;
if (queryMobile === "true" || queryMobile === "false") {
    Codeforces.putToStorage("useMobile", queryMobile === "true");
} else {
    var useMobile = Codeforces.getFromStorage("useMobile");
    if (useMobile === true || useMobile === false) {
        if (useMobile != false) {
            Codeforces.redirect(Codeforces.updateUrlParameter(document.location.href, "mobile", useMobile));
        }
    }
}

if (window.parent.frames.length > 0) {
    window.stop();
}

$(document).ready(function () {
    (function ($) {
        jQuery.expr[':'].containsCI = function(elem, index, match) {
            return !match || !match.length || match.length < 4 || !match[3] || (
                elem.textContent || elem.innerText || jQuery(elem).text() || ''
            ).toLowerCase().indexOf(match[3].toLowerCase()) >= 0;
        };
    }(jQuery));

    $.ajaxPrefilter(function(options, originalOptions, xhr) {
        var csrf = Codeforces.getCsrfToken();
        if (csrf) {
            var data = originalOptions.data;
            if (originalOptions.data !== undefined) {
                if (Object.prototype.toString.call(originalOptions.data) === '[object String]') {
                    data = $.deparam(originalOptions.data);
                }
            } else {
                data = {};
            }
            options.data = $.param($.extend(data, { csrf_token: csrf }));
        }
    });

    window.getCodeforcesServerTime = function(callback) {
        $.post("/data/time", {}, callback, "json");
    };

    window.updateTypography = function () {
        $("div.ttypography code").addClass("tt");
        $("div.ttypography pre>code").addClass("prettyprint").removeClass("tt");
        $("div.ttypography table").addClass("bordertable");
        prettyPrint();
    };

    $.ajaxSetup({ 
        scriptCharset: "utf-8",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8", 
        headers: { 'X-Csrf-Token': Codeforces.getCsrfToken() }
    });

    window.updateTypography();
    Codeforces.signForms();

    setTimeout(function() {
        $(".second-level-menu-list").lavaLamp({
            fx: "backout",
            speed: 700
        });
    }, 100);

    Codeforces.countdown();
    $("a[rel='photobox']").colorbox();

    function showAnnouncements(json) {
        if (json.t === "a") {
            setTimeout(function() {
                Codeforces.showAnnouncements(json.d, "en");
            }, Math.random() * 500);
        }
    }

    function showEventCatcherUserMessage(json) {
        if (json.t === "s") {
            var points = json.d[5];
            var passedTestCount = json.d[7];
            var judgedTestCount = json.d[8];
            var verdict = preparedVerdictFormats[json.d[12]];
            var verdictPrototypeDiv = $(".verdictPrototypeDiv");
            verdictPrototypeDiv.html(verdict);
            if (judgedTestCount != null && judgedTestCount != undefined) {
                verdictPrototypeDiv.find(".verdict-format-judged").text(judgedTestCount);
            }
            if (passedTestCount != null && passedTestCount != undefined) {
                verdictPrototypeDiv.find(".verdict-format-passed").text(passedTestCount);
            }
            if (points != null && points != undefined) {
                verdictPrototypeDiv.find(".verdict-format-points").text(points);
            }
            Codeforces.showMessage(verdictPrototypeDiv.text());
        }
    }

    $(".clickable-title").each(function() {
        var title = $(this).attr("data-title");
        if (title) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = title;
            $(this).attr("title", tmp.textContent || tmp.innerText || "");
        }
    });

    $(".clickable-title").click(function() {
        const title = $(this).attr("data-title");
        const clazz = $(this).attr("data-clazz");
        const props = {};
        if (typeof (clazz) !== 'undefined') {
            props['clazz'] = clazz;
        }
        if (title) {
            Codeforces.alert(title, null, null, props);
        } else {
            Codeforces.alert($(this).attr("title"), null, null, props);
        }
    }).css("position", "relative").css("bottom", "3px");

    Codeforces.showDelayedMessage();
    Codeforces.reformatTimes();

    if (window.codeforcesOptions.subscribeServerUrl) {
        window.eventCatcher = new EventCatcher(
            window.codeforcesOptions.subscribeServerUrl,
            [
                Codeforces.getGlobalChannel(),
                Codeforces.getUserChannel(),
                Codeforces.getUserShowMessageChannel(),
                Codeforces.getContestChannel(),
                Codeforces.getParticipantChannel(),
                Codeforces.getTalkChannel()
            ]
        );

        if (Codeforces.getParticipantChannel()) {
            window.eventCatcher.subscribe(Codeforces.getParticipantChannel(), function(json) {
                showAnnouncements(json);
            });
        }

        if (Codeforces.getContestChannel()) {
            window.eventCatcher.subscribe(Codeforces.getContestChannel(), function(json) {
                showAnnouncements(json);
            });
        }

        if (Codeforces.getGlobalChannel()) {
            window.eventCatcher.subscribe(Codeforces.getGlobalChannel(), function(json) {
                showAnnouncements(json);
            });
        }

        if (Codeforces.getUserChannel()) {
            window.eventCatcher.subscribe(Codeforces.getUserChannel(), function(json) {
                showAnnouncements(json);
            });
        }

        if (Codeforces.getUserShowMessageChannel()) {
            window.eventCatcher.subscribe(Codeforces.getUserShowMessageChannel(), function(json) {
                showEventCatcherUserMessage(json);
            });
        }
    }

    Codeforces.setupContestTimes("/data/contests");
    Codeforces.setupSpoilers();
    Codeforces.setupTutorials("/data/problemTutorial");

    $("input.search").focus(function () {
        if ($(this).attr("data-isPlaceholder") === "true") {
            $(this).val("");
            $(this).removeAttr("data-isPlaceholder");
        }
    });

    // Catalog-specific script
    $("._CatalogViewFrame_choose-time").css("display", "");
    // ... (rest of catalog script omitted for brevity, add as needed)
});

$(function() {
    $(".switchToMobile").click(function() {
        Codeforces.redirect(Codeforces.updateUrlParameter(document.location.href, "mobile", "true"));
        return false;
    });
    $(".switchToDesktop").click(function() {
        Codeforces.redirect(Codeforces.updateUrlParameter(document.location.href, "mobile", "false"));
        return false;
    });
});

$(document).ready(function () {
    if ($(window).width() < 1600) {
        $('.button-up').css('width', '30px').css('line-height', '30px').css('font-size', '20px');
    }

    if ($(window).width() >= 1200) {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('.button-up').fadeIn();
            } else {
                $('.button-up').fadeOut();
            }
        });

        $('.button-up').click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 500);
            return false;
        });

        $('.button-up').hover(function () {
            $(this).animate({
                'opacity':'1'
            }).css({'background-color':'#e7ebf0','color':'#6a86a4'});
        }, function () {
            $(this).animate({
                'opacity':'0.7'
            }).css({'background':'none','color':'#d3dbe4'});
        });
    }
    Codeforces.focusOnError();
});

if ('serviceWorker' in navigator && 'fetch' in window && 'caches' in window) {
    navigator.serviceWorker.register('/service-worker-75176.js')
        .then(function (registration) {
            console.log('Service worker registered: ', registration);
        })
        .catch(function (error) {
            console.log('Registration failed: ', error);
        });
}

(function() {
    function c() {
        var b = a.contentDocument || a.contentWindow.document;
        if (b) {
            var d = b.createElement('script');
            d.innerHTML = "window.__CF$cv$params={r:'91c887966c5ed97d',t:'MTc0MTMzNDExNy4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
            b.getElementsByTagName('head')[0].appendChild(d);
        }
    }
    if (document.body) {
        var a = document.createElement('iframe');
        a.height = 1;
        a.width = 1;
        a.style.position = 'absolute';
        a.style.top = 0;
        a.style.left = 0;
        a.style.border = 'none';
        a.style.visibility = 'hidden';
        document.body.appendChild(a);
        if ('loading' !== document.readyState) c();
        else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c);
        else {
            var e = document.onreadystatechange || function() {};
            document.onreadystatechange = function(b) {
                e(b);
                if ('loading' !== document.readyState) {
                    document.onreadystatechange = e;
                    c();
                }
            };
        }
    }
})();