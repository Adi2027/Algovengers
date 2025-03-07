// Ensure jQuery is available or provide a fallback
if (typeof jQuery === 'undefined') {
    console.error('jQuery is not loaded. Please include jQuery before this script.');
    var $ = function(selector) { return { css: function() {}, text: function() {}, html: function() {} }; }; // Fallback
} else {
    var $ = jQuery;
}

// Initialize dataLayer for Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() { 
    if (window.dataLayer) {
        dataLayer.push(arguments);
    } else {
        console.warn('dataLayer is not available for gtag.');
    }
}
gtag('js', new Date());
gtag('config', 'UA-743380-5');

// Define Codeforces namespace if not present
if (typeof Codeforces === "undefined") {
    window.Codeforces = {};
}

// Utility functions
Codeforces.updateUrlParameter = function(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
};

Codeforces.getFromStorage = function(key) {
    return localStorage.getItem(key) === "true";
};

Codeforces.putToStorage = function(key, value) {
    localStorage.setItem(key, value);
};

Codeforces.queryString = {
    mobile: (new URLSearchParams(window.location.search)).get("mobile") || null
};

Codeforces.redirect = function(url) {
    window.location.href = url;
};

// Document ready function with error handling
$(document).ready(function() {
    try {
        // Mobile detection and storage
        if (Codeforces.queryString.mobile === "true" || Codeforces.queryString.mobile === "false") {
            Codeforces.putToStorage("useMobile", Codeforces.queryString.mobile === "true");
        } else {
            var useMobile = Codeforces.getFromStorage("useMobile");
            if (useMobile === true || useMobile === false) {
                if (useMobile) {
                    Codeforces.redirect(Codeforces.updateUrlParameter(document.location.href, "mobile", useMobile));
                }
            }
        }

        // Mobile switch handlers
        $(".switchToMobile").click(function(e) {
            e.preventDefault();
            Codeforces.redirect(Codeforces.updateUrlParameter(document.location.href, "mobile", "true"));
        });

        $(".switchToDesktop").click(function(e) {
            e.preventDefault();
            Codeforces.redirect(Codeforces.updateUrlParameter(document.location.href, "mobile", "false"));
        });

        // Standings link hover effect
        $(".rtable td a").hover(
            function() {
                $(this).css("color", "#003087");
            },
            function() {
                $(this).css("color", "#0066cc");
            }
        );

        // Simulate server time update
        window.getCodeforcesServerTime = function(callback) {
            var serverTime = new Date("Mar 07, 2025 13:38:02").getTime();
            if (typeof callback === 'function') {
                callback({ time: serverTime });
            } else {
                console.warn('Callback is not a function in getCodeforcesServerTime');
            }
        };

        // Update footer server time dynamically
        function updateServerTime() {
            getCodeforcesServerTime(function(data) {
                var date = new Date(data.time);
                $(".format-timewithseconds").text(date.toLocaleString("en", { timeZone: "UTC", hour12: false }));
            });
        }
        updateServerTime();
        setInterval(updateServerTime, 1000);

        // Registration countdown
        function startRegistrationCountdown() {
            var endTime = new Date("Mar 07, 2025 13:35:00").getTime() + 5 * 60 * 1000; // 5-minute contest
            var timer = setInterval(function() {
                var now = new Date().getTime();
                var distance = endTime - now;

                if (distance < 0) {
                    clearInterval(timer);
                    $(".rtable td span").html("Contest Closed");
                } else {
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    $(".rtable td span").html(`Until closing ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
                }
            }, 1000);
        }
        if ($(".rtable td span").length) {
            startRegistrationCountdown();
        }

        // Search input focus behavior
        $("input.search").focus(function() {
            if ($(this).attr("data-isPlaceholder") === "true") {
                $(this).val("");
                $(this).removeAttr("data-isPlaceholder");
            }
        });

        // Form submission handler
        $("form").submit(function(e) {
            e.preventDefault();
            var query = $(".search").val().trim();
            if (query) {
                window.location.href = "/search?query=" + encodeURIComponent(query);
            } else {
                console.warn('Search query is empty');
            }
        });

        // Adjust viewport for mobile devices
        function adjustViewport() {
            var screenWidthPx = Math.min($(window).width(), window.screen.width);
            var siteWidthPx = 1100;
            var ratio = Math.min(screenWidthPx / siteWidthPx, 1.0);
            $('meta[name="viewport"]').attr('content', "width=device-width, initial-scale=" + ratio);
        }
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            adjustViewport();
        }

        // Protection against trailing dot in domain
        let hostLength = window.location.host.length;
        if (hostLength > 1 && window.location.host[hostLength - 1] === '.') {
            window.location = window.location.protocol + "//" + window.location.host.substring(0, hostLength - 1);
        }

        // Service Worker registration
        if ('serviceWorker' in navigator && 'fetch' in window && 'caches' in window) {
            navigator.serviceWorker.register('/service-worker-75176.js')
                .then(function(registration) {
                    console.log('Service worker registered: ', registration);
                })
                .catch(function(error) {
                    console.error('Service worker registration failed: ', error);
                });
        }
    } catch (error) {
        console.error('An error occurred in document.ready: ', error);
    }
});