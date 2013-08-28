(function(window, document, ion) {

  function click(e) {
    if(e.target.dataset.togglePanel) {
      ion.Panel.toggle(e.target.dataset.togglePanel);
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  window.addEventListener('click', click, false);
  window.addEventListener('touchend', click, false);

})(this, document, ion = this.ion || {});