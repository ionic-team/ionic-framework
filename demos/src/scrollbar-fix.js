(function(){

  function hasScrollbar() {

    if (typeof window.top.innerWidth === 'number') {
        return window.top.innerWidth > window.top.document.documentElement.clientWidth;  
    }

    // rootElem for quirksmode
    var rootElem = window.top.document.documentElement || window.top.document.body;

    // Check overflow style property on body for fauxscrollbars
    var overflowStyle;

    if (typeof rootElem.currentStyle !== 'undefined') {
        overflowStyle = rootElem.currentStyle.overflow;
    }

    overflowStyle = overflowStyle || window.top.getComputedStyle(rootElem, '').overflow;

    // Also need to check the Y axis overflow
    var overflowYStyle;

    if (typeof rootElem.currentStyle !== 'undefined') {
        overflowYStyle = rootElem.currentStyle.overflowY;
    }

    overflowYStyle = overflowYStyle || window.top.getComputedStyle(rootElem, '').overflowY;

    var contentOverflows = rootElem.scrollHeight > rootElem.clientHeight;
    var overflowShown = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle);
    var alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll';

    return (contentOverflows && overflowShown) || (alwaysShowScroll)
  }


  if (hasScrollbar() === true) {
    setTimeout(function() {
      var body = document.getElementsByTagName('body')[0];
      body.className = body.className + ' has-scrollbar';
    }, 500);
  }

})();