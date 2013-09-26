(function(window, document, ionic) {

  // polyfill use to simulate native "tap"
  function inputTapPolyfill(ele, e) {
    if(ele.type === "radio" || ele.type === "checkbox") {
      ele.checked = !ele.checked;
    } else if(ele.type === "submit" || ele.type === "button") {
      ele.click();
    } else {
      ele.focus();
    }
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  function tapPolyfill(e) {
    // evaluate the actual source event, not the created event by gestures.js
    if(!e.gesture) return;

    var 
    e = e.gesture.srcEvent,
    ele = e.target;

    if(!e) return;

    while(ele) {
      if( ele.tagName === "INPUT" || ele.tagName === "TEXTAREA" || ele.tagName === "SELECT" ) {
        return inputTapPolyfill(ele, e);
      } else if( ele.tagName === "LABEL" ) {
        if(ele.control) {
          return inputTapPolyfill(ele.control, e);
        }
      } else if( ele.tagName === "A" || ele.tagName === "BUTTON" ) {
        ele.click();
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
      ele = ele.parentElement;
    }

    // they didn't tap one of the above elements
    // if the currently active element is an input, and they tapped outside
    // of the current input, then unset its focus (blur) so the keyboard goes away
    var activeElement = document.activeElement;
    if(activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA" || activeElement.tagName === "SELECT")) {
      activeElement.blur();
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
  }

  // global tap event listener polyfill for HTML elements that were "tapped" by the user
  //ionic.on("tap", tapPolyfill, window);

})(this, document, ionic);
