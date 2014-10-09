IonicModule
.controller('$ionSlide', [
  '$scope',
  '$element',
  '$q',
function(scope, element, $q) {
  var self = this;

  scope.$on('$destroy', function() {
    // Re-attach the element so it can be properly removed
    attachSlide();
  });
  element.on(ionic.CSS.TRANSITIONEND, onTransitionEnd);

  self.element = element;

  self.onAdded = onAdded;
  self.onRemoved = onRemoved;

  self.transform = transform;

  self.state = '';
  self.setState = setState;

  // ***
  // Public Methods
  // ***

  function onAdded() {
    // Set default state
    self.setState('detached');
  }
  function onRemoved() {
    self.setState('detached');
  }

  var isTransforming;
  // percent is negative 0-1 for dragging left
  // percent is positive 0-1 for dragging right
  function transform(percent) {
    if (!isTransforming) {
      self.element.addClass('no-animate');
      isTransforming = true;
    }

    var startPercent = self.state === 'previous' ? -1 :
      self.state === 'next' ? 1 :
      0;
    self.element.css(
      ionic.CSS.TRANSFORM,
      'translate3d(' + (100 * (startPercent - percent)) + '%, 0, 0)'
    );
  }

  function setState(newState) {
    if (newState !== self.state) {
      self.state && self.element.attr('slide-previous-state', self.state);
      self.element.attr('slide-state', newState);
    }
    self.element.css(ionic.CSS.TRANSFORM, '');
    self.element.removeClass('no-animate');
    isTransforming = false;

    self.previousState = self.state;
    self.state = newState;

    switch(newState) {
      case 'detached':
        detachSlide();
        break;
      case 'previous':
      case 'next':
      case 'selected':
        attachSlide();
        break;
    }

    return getTransitionPromise();
  }

  // ***
  // Private Methods
  // ***

  function attachSlide() {
    // if (!self.element[0].parentNode) {
    //   self.parentElement.append(self.element);
    //   ionic.Utils.reconnectScope(scope);
    // }
    ionic.Utils.reconnectScope(scope);
  }

  function detachSlide() {
    // Don't use self.element.remove(), that will destroy the element's data
    // var parent = self.element[0].parentNode;
    // if (parent) {
    //   parent.removeChild(self.element[0]);
    //   ionic.Utils.disconnectScope(scope);
    // }
    ionic.Utils.disconnectScope(scope);
  }

  var transitionDeferred;
  function getTransitionPromise() {
    // If we aren't transitioning to or from selected, there's no transition, so instantly resolve.
    if (self.previousState !== 'selected' && self.state !== 'selected') {
      return $q.when();
    }

    // Interrupt current promise if a new state was set.
    transitionDeferred && transitionDeferred.reject();
    transitionDeferred = $q.defer();

    return transitionDeferred.promise;
  }

  function onTransitionEnd(ev) {
    if (ev.target !== element[0]) return; //don't let the event bubble up from children
    transitionDeferred && transitionDeferred.resolve();
  }

}]);
