IonicModule
.controller('$ionSlide', [
  '$scope',
  '$element',
  '$q',
function(scope, element, $q) {
  var self = this;

  element.on(ionic.CSS.TRANSITIONEND, onTransitionEnd);

  self.element = element;
  self.node = element[0];

  self.transform = transform;

  self.state = '';
  self.setState = setState;

  self.setState('detached');

  // ***
  // Public Methods
  // ***

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
    ionic.Utils.reconnectScope(scope);
  }

  function detachSlide() {
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
