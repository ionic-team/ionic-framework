(function(window) {

  iconic = window.iconic || {};

  // add tap events to links
  function onToggleTap(e) {
    if(e.currentTarget.control) {
      e.currentTarget.control.checked = !e.currentTarget.control.checked;
      e.stopPropagation();
    }
  }
  
  ionic.ResetToggles = function() {
    var
    x,
    toggles = document.getElementsByClassName("toggle");

    for(x = 0; x < toggles.length; x++) {
      if(!toggles[x].hasTap) {
        ionic.on('tap', onToggleTap, toggles[x]);
        toggles[x].hasTap = true;
      }
    }
  };

  ionic.ResetToggles();

})(this);
