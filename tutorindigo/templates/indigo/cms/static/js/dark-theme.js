$(document).ready(function() {
    'use strict';

    const themeCookie = 'selected-paragon-theme-variant';

    function applyThemeOnPage(){
      const theme = $.cookie(themeCookie) || 'dark';

      if (!$.cookie(themeCookie)) {
        $.cookie(themeCookie, theme, { domain: window.location.hostname, expires: 90, path: '/' });
        window.localStorage.setItem(themeCookie, theme);
        $('body').addClass("indigo-dark-theme");
        $("#toggle-switch-input").prop("checked", true);
      }
      {% if INDIGO_ENABLE_DARK_TOGGLE %}
      $('body').toggleClass("indigo-dark-theme", theme === 'dark');       // append or remove dark-class based on cookie-value
      {% endif %}
      updateAccessibility();
    }

    function setThemeToggleBtnState(){
      const theme = $.cookie(themeCookie) || 'dark';
      $("#toggle-switch-input").prop("checked", theme === 'dark');
      updateAccessibility();
    }

    function updateAccessibility() {
      const theme = $.cookie(themeCookie) || 'dark';
      const textWrapper = $('#theme-label');
      if (theme === 'dark') {
        textWrapper.text('Switch to Light Mode');
        textWrapper.attr('aria-checked', 'true');
      } else {
        textWrapper.text('Switch to Dark Mode');
        textWrapper.attr('aria-checked', 'false');
      }
    }

    // Listener for updating the theme inside an iframe
    window.addEventListener("message", function(e){
      if (e.data && e.data["indigo-toggle-dark"]){
        applyThemeOnPage();
      }
    });

    applyThemeOnPage();  // loading theme on page load
    setThemeToggleBtnState(); // check/uncheck toggle btn based on theme
});
