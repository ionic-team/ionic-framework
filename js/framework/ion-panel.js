(function(window, document, ion) {

  var 
  x,
  isPanelOpen,

  PANEL_ACTIVE = "ion-panel-active",
  PANEL_OPENED = "ion-panel-opened";

  ion.Panel = {

    toggle: function(panelId) {
      if(isPanelOpen) {
        this.close();
      } else {
        this.open(panelId);
      }
    },

    open: function(panelId) {
      // see if there is an element with this id
      var panel = document.getElementById(panelId);
      if(panel) {
        // this element is a panel, open it!

        // remember that a panel is currently open
        isPanelOpen = true;

        // find all the panels that are or were once active
        var panelsActive = document.getElementsByClassName(PANEL_ACTIVE);

        // remove the panel-active css classes from each of the previously active panels
        for(x=0; x<panelsActive.length; x++) {
          panelsActive[x].classList.remove(PANEL_ACTIVE);
        }

        // activate the panel we want open by adding the panel-active css classes
        panel.classList.add(PANEL_ACTIVE);

        // add to <body> that there is a panel open
        document.body.classList.add(PANEL_OPENED);
      }
    },

    close: function() {
      if(isPanelOpen) {
        // there is a panel already open, so close it
        isPanelOpen = false;

        // remove from <body> so that no panels should be open
        document.body.classList.remove(PANEL_OPENED);
      }
    }

  };

  window.addEventListener("popstate", ion.Panel.close, false);

})(this, document, ion = this.ion || {});
