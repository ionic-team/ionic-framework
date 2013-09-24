(function(window, document, ionic) {

  // add tap events to links
  function onLinkTap(e) {
    this.click();
  }
  
  function addTapToLinks() {
    for(var x = 0; x < document.links.length; x++) {
      if(!document.links[x]._hasTap) {
        ionic.on('tap', onLinkTap, document.links[x]);
        document.links[x]._hasTap = true;
      }
    }
  }

  ionic.ResetTap = function() {
    addTapToLinks()
  };

  ionic.ResetTap();

})(this, document, ionic);
