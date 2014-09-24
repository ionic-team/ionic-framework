IonicModule
.controller('$ionSlide', [
  '$scope',
  '$element',
  '$q',
  SlideController
]);

function SlideController(scope, element, $q) {
  var self = this;

  scope.$on('$destroy', function() {
    element.removeData();
    detachSlide();
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

  function onAdded(parentElement) {
    self.parentElement = parentElement;

    // Set default state
    self.setState('detached');
  }
  function onRemoved() {
    self.setState('detached');
  }

  var isTransforming;
  function transform(percent) {
    if (!isTransforming) {
      self.element.addClass('no-animate');
      isTransforming = true;
    }

    var startPercent = self.state === 'left' ? -1 :
      self.state === 'right' ? 1 :
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

    switch(newState) {
      case 'detached':
        detachSlide();
        break;
      case 'left':
      case 'right':
      case 'shown':
        attachSlide();
        break;
    }

    self.previousState = self.state;
    self.state = newState;

    return getTransitionPromise();
  }

  // ***
  // Private Methods
  // ***

  function attachSlide() {
    if (!self.element[0].parentNode) {
      self.parentElement.append(self.element);
      ionic.Utils.reconnectScope(scope);
    }
  }

  function detachSlide() {
    // Don't use self.element.remove(), that will destroy the element's data
    var parent = self.element[0].parentNode;
    if (parent) {
      parent.removeChild(self.element[0]);
      ionic.Utils.disconnectScope(scope);
    }
  }

  var transitionDeferred;
  function getTransitionPromise() {
    // If we aren't transitioning to or from shown, there's no transition, so instantly resolve.
    if (self.previousState !== 'shown' && self.state !== 'shown') {
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

}
