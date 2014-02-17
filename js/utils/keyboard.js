(function(ionic) {

ionic.Platform.ready(function() {
  if (ionic.Platform.is('android')) {
    androidKeyboardFix();
  }
});

function androidKeyboardFix() {
  var rememberedDeviceWidth = window.innerWidth;
  var rememberedDeviceHeight = window.innerHeight;
  var keyboardHeight;

  window.addEventListener('resize', resize);

  function resize() {

    //If the width of the window changes, we have an orientation change
    if (rememberedDeviceWidth !== window.innerWidth) {
      rememberedDeviceWidth = window.innerWidth;
      rememberedDeviceHeight = window.innerHeight;
      console.info('orientation change. deviceWidth =', rememberedDeviceWidth, ', deviceHeight =', rememberedDeviceHeight);

    //If the height changes, and it's less than before, we have a keyboard open
    } else if (rememberedDeviceHeight !== window.innerHeight &&
               window.innerHeight < rememberedDeviceHeight) {
      document.body.classList.add('hide-footer');
      //Wait for next frame so document.activeElement is set
      ionic.requestAnimationFrame(handleKeyboardChange);
    } else {
      //Otherwise we have a keyboard close or a *really* weird resize
      document.body.classList.remove('hide-footer');
    }

    function handleKeyboardChange() {
      //keyboard opens
      keyboardHeight = rememberedDeviceHeight - window.innerHeight;
      var activeEl = document.activeElement;
      if (activeEl) {
        //This event is caught by the nearest parent scrollView
        //of the activeElement
        ionic.trigger('scrollChildIntoView', {
          target: activeEl
        }, true);
      }

    }
  }
}

})(window.ionic);
