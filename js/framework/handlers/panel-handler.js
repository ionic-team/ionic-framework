(function(window, document, ion) {

  function click(e) {
    if(e.target.dataset.panelToggle) {

      var options = {
        direction: (e.target.dataset.panelDirection === "right" ? "right" : "left")
      };

      ion.Panel.toggle(e.target.dataset.panelToggle, options);
      
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  window.addEventListener('click', click, false);
  window.addEventListener('touchend', click, false);

})(this, document, ion = this.ion || {});