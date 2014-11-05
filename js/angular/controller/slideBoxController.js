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

  // This is a live nodeList that is updated whenever child ion-slides
  // are added or removed.
  var slideNodes = element[0].getElementsByTagName('ion-slide');
  var slideList = ionic.Utils.list(slideNodes);

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
  self.onSlidesChanged = ionic.animationFrameThrottle(onSlidesChanged);

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

  scope.$watchCollection(function() { return slideNodes; }, self.onSlidesChanged);

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

  var oldNodes = [];
  function onSlidesChanged() {
    var newSelected = slideNodes[scope.selectedIndex];
    var oldSelected = oldNodes[scope.selectedIndex];
    if (!newSelected && !oldSelected) {
      if (slideNodes[scope.selectedIndex]) {
        // If we don't have a selected slide and are waiting for a certain selectedIndex,
        // then select it now.
        self.select(scope.selectedIndex);
      } else if (slideNodes.length) {
        // If we don't have a selectedIndex yet, go ahead and select the first available
        self.select(0);
      }
    } else {
      if (newSelected !== oldSelected) {
        // If the item at newList[selectedIndex] isn't the same as the item at
        // oldList[selectedIndex], that means the selected slide was either moved
        // in the list or was removed.
        var newIndex = slideList.indexOf(oldSelected);
        if (newIndex === -1) {
          // If the selected slide was removed, try to select the nearest available slide
          self.select(scope.selectedIndex > 0 ? scope.selectedIndex - 1 : scope.selectedIndex);
        } else {
          // If the selected slide moved, select the selected slide's new index
          self.select(newIndex);
        }
      } else {
        // Figure out the next and previous index based upon the old list.
        // That way, if the old list had a previous item that's out of range
        // in the new list, our check below will catch that the next/previous
        // have changed.
        var oldNextIndex = ionic.Utils.list.next(oldNodes, slideList.loop(), scope.selectedIndex);
        var oldPrevIndex = ionic.Utils.list.previous(oldNodes, slideList.loop(), scope.selectedIndex);
        if (slideNodes[self.next()] !== oldNodes[oldNextIndex] ||
            slideNodes[self.previous()] !== oldNodes[oldPrevIndex]) {
          //If the next or previous slides have changed, just refresh selection of the current slide.
          self.select(scope.selectedIndex);
        }
      }
    }
    oldNodes = Array.prototype.slice.call(slideNodes);
  }

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
}]);
