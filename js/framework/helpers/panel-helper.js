(function(window, document, ion) {

  function click(e) {
    if(e.target.dataset.togglePanel) {
      ion.Panel.toggle(e.target.dataset.togglePanel);
      return true;
    }
  }

  function touchEnd(e) {
    if(click(e)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  window.addEventListener('click', click, false);
  window.addEventListener('touchend', touchEnd, false);

})(this, document, ion = this.ion || {});