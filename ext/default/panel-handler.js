(function(window, document, ion) {

  function click(e) {
    panelToggle(e, e.target);
  }

  function panelToggle(e, el) {
    if(el) {
      if(el.dataset && el.dataset.panelToggle) {

        var options = {
          direction: (el.dataset.panelDirection === "right" ? "right" : "left")
        };

        ion.Panel.toggle(el.dataset.panelToggle, options);

        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      panelToggle(e, el.parentNode);
    }
  }

  window.addEventListener('click', click, false);
  window.addEventListener('touchend', click, false);

})(this, document, ion = this.ion || {});
