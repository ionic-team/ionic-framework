IonicModule
.controller('$ionSlideBox', [
  '$scope',
  '$element',
  '$$ionicAttachDrag',
  '$interval',
  /*
   * This can be abstracted into a controller that will work for views, tabs, and
   * slidebox.
   */
function(scope, element, $$ionicAttachDrag, $interval) {
  var self = this;
  var slideList = ionic.Utils.list([]);
  var slidesParent = angular.element(element[0].querySelector('.slider-slides'));

  // Successful slide requires velocity to be greater than this amount
  var SLIDE_SUCCESS_VELOCITY = (1 / 4); // pixels / ms
  var SLIDE_TRANSITION_DURATION = 250; //ms

  $$ionicAttachDrag(scope, element, {
    getDistance: function() { return slidesParent.prop('offsetWidth'); },
    onDrag: onDrag,
    onDragEnd: onDragEnd
  });

  self.element = element;
  self.isRelevant = isRelevant;
  self.previous = previous;
  self.next = next;

  // Methods calling straight back to Utils.list
  self.at = slideList.at;
  self.count = slideList.count;
  self.indexOf = slideList.indexOf;
  self.isInRange = slideList.isInRange;
  self.loop = slideList.loop;
  self.delta = slideList.delta;

  self.update = update;
  self.enableSlide = enableSlide;
  self.autoPlay = autoPlay;
  self.add = add;
  self.remove = remove;
  self.move = move;
  self.selected = selected;
  self.select = select;
  self.onDrag = onDrag;
  self.onDragEnd = onDragEnd;

  // ***
  // Public Methods
  // ***

  // Gets whether the given index is relevant to selected
  // That is, whether the given index is previous, selected, or next
  function isRelevant(index) {
    return slideList.isRelevant(index, scope.selectedIndex);
  }

  // Gets the index to the previous of the given slide, default scope.selectedIndex
  function previous(index) {
    index = arguments.length ? index : scope.selectedIndex;
    // If we only have two slides and loop is enabled, we cannot have a previous
    // because previous === next. In this case, return -1.
    if (self.loop() && self.count() === 2) {
      return -1;
    }
    return slideList.previous(index);
  }

  // Gets the index to the next of the given slide, default scope.selectedIndex
  function next(index) {
    index = arguments.length ? index : scope.selectedIndex;
    return slideList.next(index);
  }

  function update() {
    var selectedIndex = scope.selectedIndex;
    for (var i = self.count() - 1; i >= 0; i--) {
      slideList.remove(i);
    }
    var slideNodes = element[0].querySelectorAll('ion-slide');
    for (var j = 0, jj = slideNodes.length; j < jj; j++) {
      slideList.add(jqLite(slideNodes[j]).controller('ionSlide'));
    }
    self.select(selectedIndex);
  }

  function enableSlide(isEnabled) {
    if (arguments.length) {
      self.dragDisabled = !isEnabled;
    }
    return !!self.dragDisabled;
  }

  function autoPlay(newInterval) {
    $interval.cancel(self.autoPlayTimeout);

    if (angular.isNumber(newInterval) && newInterval > 0) {
      self.autoPlayTimeout = $interval(function() {
        self.select(self.next());
      }, newInterval);
    }
  }

  /*
   * Add/remove/move slides
   */
  function add(slide, index) {
    var newIndex = slideList.add(slide, index);
    slide.onAdded();

    // If we are waiting for a certain scope.selectedIndex and this is it,
    // select the slide
    if (scope.selectedIndex === index) {
      self.select(newIndex);
    // If we don't have a selectedIndex yet, select the first one available
    } else if (!isNumber(scope.selectedIndex) || scope.selectedIndex === -1) {
      self.select(newIndex);
    } else if (newIndex === self.previous() || newIndex === self.next()) {
      // if the new slide is adjacent to selected, refresh the selection
      enqueueRefresh();
    }
  }
  function remove(slide) {
    var index = self.indexOf(slide);
    if (index === -1) return;

    var isSelected = self.selected() === index;
    slideList.remove(index);
    slide.onRemoved();

    if (isSelected) {
      self.select( self.isInRange(scope.selectedIndex) ? scope.selectedIndex : scope.selectedIndex - 1 );
    }
  }
  function move(slide, targetIndex) {
    var index = self.indexOf(slide);
    if (index === -1) return;

    // If the slide is current, next, or previous, save so we can re-select after moving.
    var isRelevant = self.selected() === index || self.isRelevant(targetIndex);
    slideList.remove(index);
    slideList.add(slide, targetIndex);

    if (isRelevant) {
      self.select(targetIndex);
    }
  }

  function selected() {
    return self.isInRange(scope.selectedIndex) ? scope.selectedIndex : -1;
  }

  /*
   * Select and change slides
   */
  function select(newIndex, transitionDuration) {
    if (!self.isInRange(newIndex)) return;

    var delta = self.delta(scope.selectedIndex, newIndex);

    slidesParent.css(
      ionic.CSS.TRANSITION_DURATION,
      (transitionDuration || SLIDE_TRANSITION_DURATION) + 'ms'
    );
    scope.selectedIndex = newIndex;

    if (self.isInRange(scope.selectedIndex) && Math.abs(delta) > 1) {
      // if the new slide is > 1 away, then it is currently not attached to the DOM.
      // Attach it in the position from which it will slide in.
      self.at(newIndex).setState(delta > 1 ? 'next' : 'previous');
      // Wait one frame so the new slide can 'settle' in its new place and
      // be ready to properly transition in
      ionic.requestAnimationFrame(doSelect);
    } else {
      doSelect();
    }

    function doSelect() {
      // If a new selection has happened before this frame, abort.
      if (scope.selectedIndex !== newIndex) return;
      scope.$evalAsync(function() {
        if (scope.selectedIndex !== newIndex) return;
        arrangeSlides(newIndex);
      });
    }
  }

  // percent is negative 0-1 for backward slide
  // positive 0-1 for forward slide
  function onDrag(percent) {
    if (self.dragDisabled) return;

    var target = self.at(percent > 0 ? self.next() : self.previous());
    var current = self.at(self.selected());

    target && target.transform(percent);
    current && current.transform(percent);
  }

  function onDragEnd(percent, velocity) {
    var nextIndex = -1;
    if (Math.abs(percent) > 0.5 || velocity > SLIDE_SUCCESS_VELOCITY) {
      nextIndex = percent > 0 ? self.next() : self.previous();
    }

    // Select a new slide if it's avaiable
    if (self.isInRange(nextIndex)) {
      var distanceRemaining = (1 - Math.abs(percent)) * slidesParent.prop('offsetWidth');
      var transitionDuration = Math.min(
        distanceRemaining / velocity,
        SLIDE_TRANSITION_DURATION
      );
      self.select(nextIndex, transitionDuration);
    } else {
      self.select(scope.selectedIndex);
    }
  }

  // ***
  // Private Methods
  // ***

  var oldSlides;
  function arrangeSlides(newShownIndex) {
    var newSlides = {
      previous: self.at(self.previous(newShownIndex)),
      selected: self.at(newShownIndex),
      next: self.at(self.next(newShownIndex))
    };

    newSlides.previous && newSlides.previous.setState('previous');
    newSlides.selected && newSlides.selected.setState('selected');
    newSlides.next && newSlides.next.setState('next');

    if (oldSlides) {
      var oldShown = oldSlides.selected;
      var delta = self.delta(self.indexOf(oldSlides.selected), self.indexOf(newSlides.selected));
      if (Math.abs(delta) > 1) {
        // If we're changing by more than one slide, we need to manually transition
        // the current slide out and then put it into its new state.
        oldShown.setState(delta > 1 ? 'previous' : 'next').then(function() {
          oldShown.setState(
            newSlides.previous === oldShown ?  'previous' :
            newSlides.next === oldShown ? 'next' :
            'detached'
          );
        });
      } else {
        detachIfUnused(oldSlides.selected);
      }
      //Additionally, we need to detach both of the old slides.
      detachIfUnused(oldSlides.previous);
      detachIfUnused(oldSlides.next);
    }

    function detachIfUnused(oldSlide) {
      if (oldSlide && oldSlide !== newSlides.previous &&
          oldSlide !== newSlides.selected &&
          oldSlide !== newSlides.next) {
        oldSlide.setState('detached');
      }
    }

    oldSlides = newSlides;
  }

  // When adding/moving slides, we sometimes need to refresh
  // the currently selected slides to reflect new data.
  // We don't want to refresh more than once per digest cycle,
  // so we do this.
  function enqueueRefresh() {
    if (!enqueueRefresh.queued) {
      enqueueRefresh.queued = true;
      scope.$$postDigest(function() {
        self.select(scope.selectedIndex);
        enqueueRefresh.queued = false;
      });
    }
  }
}]);
