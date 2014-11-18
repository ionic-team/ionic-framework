IonicModule
.controller('$ionSlideBox', [
  '$scope',
  '$element',
  '$$ionicAttachDrag',
  '$interval',
  '$rootScope',
  '$timeout',
function(scope, element, $$ionicAttachDrag, $interval, $rootScope, $timeout) {
  var self = this;

  var relevantSlides = {
    previous: null,
    selected: null,
    next: null
  };
  var oldRelevantSlides = relevantSlides;

  // This is a live nodeList that is updated whenever child ion-slides
  // are added or removed
  var slideNodes = element[0].getElementsByTagName('ion-slide');
  var slideList = ionic.Utils.list(slideNodes);

  var slidesParent = angular.element(element[0].querySelector('.slider-slides'));

  // Successful slide requires velocity to be greater than this amount
  var SLIDE_SUCCESS_VELOCITY = (1 / 4); // pixels / ms
  var SLIDE_TRANSITION_DURATION = 250; //ms

  $$ionicAttachDrag(scope, element, {
    getDistance: function() { return slidesParent.prop('offsetWidth'); },
    onDragStart: onDragStart,
    onDrag: onDrag,
    onDragEnd: onDragEnd
  });

  // At the very end of every digest, check if slides changed
  // This is because our nodes won't be added until after data has been processed
  // (eg you add a slide to data with ng-if, then the ng-if processes and the element
  // now exists)
  $rootScope.$watch(function() {
    if (!checkSlidesChanged.queued) {
      $rootScope.$$postDigest(checkSlidesChanged);
    }
    return true;
  });

  self.element = element;
  self.isRelevant = isRelevant;
  self.previous = previous;
  self.next = next;

  // Methods calling straight back to Utils.list
  self.at = at;
  self.count = slideList.count;
  self.indexOf = indexOf;
  self.isInRange = slideList.isInRange;
  self.loop = slideList.loop;
  self.delta = slideList.delta;

  self.enableSlide = enableSlide;
  self.autoPlay = autoPlay;
  self.selected = selected;
  self.select = select;
  self.onDragStart = onDragStart;
  self.onDrag = onDrag;
  self.onDragEnd = onDragEnd;

  // ***
  // Public Methods
  // ***
  function at(index) {
    return jqLite( slideList.at(index) ).controller('ionSlide');
  }

  function indexOf(slide) {
    return slide && slideList.indexOf(slide.node) || -1;
  }


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

  function selected() {
    return self.isInRange(scope.selectedIndex) ? scope.selectedIndex : -1;
  }

  /*
   * Select and change slides
   */
  function select(newIndex, transitionDuration) {
    if (!self.isInRange(newIndex)) return;

    scope.selectedIndex = newIndex;

    oldRelevantSlides = relevantSlides;
    relevantSlides = {
      previous: self.at(self.previous()),
      selected: self.at(newIndex),
      next: self.at(self.next())
    };

    if (oldRelevantSlides.next === relevantSlides.next &&
        oldRelevantSlides.previous === relevantSlides.previous &&
        oldRelevantSlides.selected === relevantSlides.selected) {
      // do nothing;
      return;
    }


    slidesParent.css(
      ionic.CSS.TRANSITION_DURATION,
      (transitionDuration || SLIDE_TRANSITION_DURATION) + 'ms'
    );

    var delta = self.delta(scope.selectedIndex, newIndex);
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

  function onDragStart() {
    if (self.dragDisabled) return false;
  }

  // percent is negative 0-1 for backward slide
  // positive 0-1 for forward slide
  function onDrag(percent) {
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

  function checkSlidesChanged() {
    checkSlidesChanged.queued = false;

    // If one of the child nodes was destroyed but not yet removed
    // from the DOM, we'll enqueue a new digest to re-check
    // once the element is actually removed.
    for (var i = 0; i < slideNodes.length; i++) {
      if (angular.element(slideNodes[i]).scope().$$destroyed) {
        $timeout(angular.noop);
        break;
      }
    }

    if (!relevantSlides.selected) {
      if (!angular.isNumber(scope.selectedIndex) || scope.selectedIndex === -1) {
        self.select(0);
      } else if (self.isInRange(scope.selectedIndex)) {
        // If we are waiting for a certain scope.selectedIndex that isn't yet selected, select it now.
        self.select(scope.selectedIndex);
      }

    } else if (relevantSlides.selected !== self.at(scope.selectedIndex) ||
               relevantSlides.next !== self.next() ||
               relevantSlides.previous !== self.previous()) {
      // If the next, previous, or selected item has been moved or removed,
      // find what to reselect.
      var newIndex = self.indexOf(relevantSlides.selected);
      if (newIndex === -1) {
        // If the selected slide was removed, try to select the nearest available slide
        self.select(scope.selectedIndex > 0 ? scope.selectedIndex - 1 : scope.selectedIndex);
      } else {
        // Else, reselect the selected slide.
        self.select(newIndex);
      }
    }

  }

  function arrangeSlides() {
    relevantSlides.previous && relevantSlides.previous.setState('previous');
    relevantSlides.selected && relevantSlides.selected.setState('selected');
    relevantSlides.next && relevantSlides.next.setState('next');

    if (oldRelevantSlides) {
      var oldShown = oldRelevantSlides.selected;
      var delta = self.delta(self.indexOf(oldRelevantSlides.selected), self.indexOf(relevantSlides.selected));
      if (Math.abs(delta) > 1) {
        // If we're changing by more than one slide, we need to manually transition
        // the current slide out and then put it into its new state.
        oldShown.setState(delta > 1 ? 'previous' : 'next').then(function() {
          oldShown.setState(
            relevantSlides.previous === oldShown ?  'previous' :
            relevantSlides.next === oldShown ? 'next' :
            'detached'
          );
        });
      } else {
        detachIfUnused(oldRelevantSlides.selected);
      }
      //Additionally, we need to detach both of the old slides.
      detachIfUnused(oldRelevantSlides.previous);
      detachIfUnused(oldRelevantSlides.next);
    }

    function detachIfUnused(oldSlide) {
      if (oldSlide && oldSlide !== relevantSlides.previous &&
          oldSlide !== relevantSlides.selected &&
          oldSlide !== relevantSlides.next) {
        oldSlide.setState('detached');
      }
    }
  }

}]);
