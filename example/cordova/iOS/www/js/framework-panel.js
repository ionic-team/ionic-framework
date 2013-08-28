(function(window, document, framework) {

  var 
  el,
  styleElement,
  isPanelOpen;

  function onTap(e) {
    var el = e.target;
    return togglePanel(e, el, el.dataset.togglePanel);
		
    if(e.target) {
      if(el.dataset.togglePanel) {
      }
      while(el.parentElement) {
        el = el.parentElement;
        if(el.dataset.togglePanel) {
          return togglePanel(e, el, el.dataset.togglePanel);
        }
      }
    }
  }

  function togglePanel(e, el, panelName) {
    var styles = "";

    if(isPanelOpen) {
      // there is a panel already open, so close it
      isPanelOpen = false;
    } else {
      // open the panel
      styles = "section .panel-content ~ * { width:" + document.width + "px !important; \
                -webkit-transform: translate3d(17em,0,0); \
                -moz-transform: translate3d(17em,0,0); \
                transform: translate3d(17em,0,0); }";
      isPanelOpen = true;
    }

    setStyles(styles);
  }

  function setStyles(styles) {
    // get the <style> from the head that will be used by the panel
    if(!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "panel-styles";
      styleElement.innerHTML = styles;
      document.head.appendChild(styleElement);
    } else {
      styleElement.innerHTML = styles;
    }
  }
  
  //framework.onGesture("tap", onTap, document.getElementById('open-panel'));

})(this, document, FM = this.FM || {});
