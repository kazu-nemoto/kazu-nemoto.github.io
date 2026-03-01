/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

$(document).ready(function(){
   // Sticky footer
  var bumpIt = function() {
      $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
    },
    didResize = false;

  bumpIt();

  $(window).resize(function() {
    didResize = true;
  });
  setInterval(function() {
    if (didResize) {
      didResize = false;
      bumpIt();
    }
  }, 250);
  // FitVids init
  $("#main").fitVids();

  // init sticky sidebar
  $(".sticky").Stickyfill();

  var stickySideBar = function(){
    var show = $(".author__urls-wrapper button").length === 0 ? $(window).width() > 1024 : !$(".author__urls-wrapper button").is(":visible");
    // console.log("has button: " + $(".author__urls-wrapper button").length === 0);
    // console.log("Window Width: " + windowWidth);
    // console.log("show: " + show);
    //old code was if($(window).width() > 1024)
    if (show) {
      // fix
      Stickyfill.rebuild();
      Stickyfill.init();
      $(".author__urls").show();
    } else {
      // unfix
      Stickyfill.stop();
      $(".author__urls").hide();
    }
  };

  stickySideBar();

  $(window).resize(function(){
    stickySideBar();
  });

  // Follow menu drop down

  $(".author__urls-wrapper button").on("click", function() {
    $(".author__urls").fadeToggle("fast", function() {});
    $(".author__urls-wrapper button").toggleClass("open");
  });

  // init smooth scroll
  $("a").smoothScroll({offset: -20});

  // add lightbox class to all image links
  $("a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif']").addClass("image-popup");

  // Magnific-Popup options
  $(".image-popup").magnificPopup({
    // disableOn: function() {
    //   if( $(window).width() < 500 ) {
    //     return false;
    //   }
    //   return true;
    // },
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
    },
    removalDelay: 500, // Delay in milliseconds before popup is removed
    // Class that is added to body when popup is open.
    // make it unique to apply your CSS animations just to this exact popup
    mainClass: 'mfp-zoom-in',
    callbacks: {
      beforeOpen: function() {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
      }
    },
    closeOnContentClick: true,
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });

});

(function() {
  var typing = document.querySelector(".landing-hero__typing");
  if (!typing) {
    return;
  }

  // mark the page as intro-active so the header/nav are styled correctly
  var landingIntroEl = document.querySelector('.landing-intro');
  document.body.classList.add('landing-intro-active');

  var textNode = typing.querySelector(".landing-hero__text");
  var overlay = typing.querySelector(".landing-hero__overlay");
  var caret = typing.querySelector(".landing-hero__caret");
  var text = typing.getAttribute("data-text") || (textNode ? textNode.textContent.trim() : "");
  var charCount = text.length || 1;
  var duration = Math.max(charCount * 0.16, 1.8);

  if (textNode) {
    textNode.textContent = text;
  }

  if (overlay) {
    overlay.style.animation = "heroReveal " + duration.toFixed(2) + "s steps(" + charCount + ", end) forwards";
    overlay.addEventListener("animationend", function() {
      typing.classList.add("is-complete");
      if (caret) {
        caret.classList.add("is-complete");
      }
      // reveal the landing content (this also triggers the introFlash animation on .landing-intro)
      document.body.classList.add("landing-reveal");

      // once the introFlash animation on the full-screen landing element completes,
      // remove the temporary intro-active state and hide the landing element so the
      // normal header and about content are fully visible.
      if (landingIntroEl) {
        // robust finish routine with fallback timeout
        var finished = false;
        function finishIntro() {
          if (finished) return;
          finished = true;
          document.body.classList.remove('landing-intro-active');
          // graceful fade then remove
          landingIntroEl.style.transition = 'opacity 320ms ease';
          landingIntroEl.style.opacity = '0';
          setTimeout(function() {
            landingIntroEl.style.display = 'none';
            document.body.classList.add('landing-revealed');
          }, 340);
        }

        var onIntroFlashEnd = function(e) {
          // if an animationName is provided, ensure it's the introFlash we care about
          if (e && e.animationName && e.animationName !== 'introFlash') return;
          finishIntro();
          landingIntroEl.removeEventListener('animationend', onIntroFlashEnd);
          clearTimeout(fallbackTimer);
        };
        landingIntroEl.addEventListener('animationend', onIntroFlashEnd);

        // fallback: if animationend doesn't fire, force finish after 1.2s
        var fallbackTimer = setTimeout(function() {
          finishIntro();
        }, 1200);
      } else {
        // fallback: remove intro-active after a short delay matching the CSS flash duration
        setTimeout(function(){
          document.body.classList.remove('landing-intro-active');
          document.body.classList.add('landing-revealed');
        }, 900);
      }
    }, { once: true });
  } else {
    document.body.classList.add("landing-reveal");
    document.body.classList.remove('landing-intro-active');
  }
})();
