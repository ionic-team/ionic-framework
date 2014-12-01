IonicModule
.controller('$ionSlideBox', [
  '$scope',
  '$element',
  '$log',
  '$document',
  '$$q',
  '$timeout',
  '$interval',
  '$$ionicAttachDrag',
  '$rootScope',
function(scope, element, $log, $document, $$q, $timeout, $interval, $$ionicAttachDrag, $rootScope) {
  var self = this;
  var SLIDE_TRANSITION_DURATION = 250;
  var SLIDE_SUCCESS_VELOCITY = (1 / 4); // pixels / ms

  var container = jqLite(element[0].querySelector('.slider-slides'));

  // Live-updated list of slides
  var slideNodes = container[0].getElementsByTagName('ion-slide');

  // If we're already sliding and a new selection is triggered, add it to the queue,
  // to be taken off once the current slide animation is done
  var slideQueue = [];

  // Whether we're currently sliding through the slideQueue
  var isSliding = false;

  var slideCount = 0;
  var selectedIndex = -1;
  var isLoop = false;

  self.element = element;

  self.autoPlay = autoPlay;
  self.count = count;
  self.enableSlide = enableSlide;
  self.isValidIndex = isValidIndex;
  self.loop = loop;
  self.next = next;
  self.onAddSlide = onAddSlide;
  self.onRemoveSlide = onRemoveSlide;
  self.previous = previous;
  self.select = select;
  self.selected = selected;

  $$ionicAttachDrag(scope, container, {
    getDistance: function () { return container.prop('offsetWidth'); },
    onDragStart: onDragStart,
    onDrag: onDrag,
    onDragEnd: onDragEnd
  });

  /****** DEPRECATED, as of v1.0.0-beta14 ********/
  self.update = deprecated.method(
    '$ionicSlideBoxDelegate.update() has been deprecated! Slidebox updates on its own now.',
    $log.warn,
    angular.noop
  );
  self.currentIndex = deprecated.method(
     '$ionicSlideBoxDelegate.currentIndex() has been deprecated! Use self.selected() instead.',
     $log.warn,
     self.selected
  );
  self.slide = deprecated.method(
     '$ionicSlideBoxDelegate.slide(newIndex[, speed]) has been deprecated! Use self.select(newIndex[, speed]) instead.',
     $log.warn,
     self.select
  );
  self.slidesCount = deprecated.method(
     '$ionicSlideBoxDelegate.slidesCount() has been deprecated! Use self.count() instead.',
     $log.warn,
     self.count
  );
  self.stop = deprecated.method(
    '$ionicSlideBoxDelegate.stop() has been deprecated! Use $ionicSlideBoxDelegate.autoPlay(0) to stop instead.',
    $log.warn,
    function stopDeprecated() {
      self._stoppedInterval = self.autoPlayInterval;
      self.autoPlay(0);
    }
  );
  self.start = deprecated.method(
    '$ionicSlideBoxDelegate.start() has been deprecated! Use $ionicSlideBoxDelegate.autoPlay(newInterval) to start instead.',
    $log.warn,
    function startDeprecated() {
      self.autoPlay(self._stoppedInterval);
    }
  );

  /***************************
   * Public Methods
   ***************************/

  function autoPlay(newInterval) {
    self.autoPlayInterval = newInterval;
    $interval.cancel(self.autoPlayTimeout);

    if (angular.isNumber(newInterval) && newInterval > 0) {
      self.autoPlayTimeout = $interval(function() {
        self.select(self.next());
      }, newInterval);
    }
  }

  function count() {
    return slideCount;
  }

  function enableSlide(enable) {
    if (arguments.length) self.dragDisabled = !enable;
    return !self.dragDisabled;
  }

  function isValidIndex(index) {
    return index > -1 && index < self.count();
  }

  function loop(loopValue) {
    if (arguments.length) isLoop = !!loopValue;
    return isLoop;
  }

  // gives the next index relative to the given index (default selectedIndex)
  function next(index) {
    index = arguments.length ? index : selectedIndex;
    var nextIndex = index + 1;
    if (nextIndex >= self.count()) {
      // We can only have a next if there's more than one item
      if (isLoop && self.count() > 1) return 0;
      return -1;
    }
    return nextIndex;
  }

  // Called by ionSlide directive
  function onAddSlide() {
    slideCount++;
    // If we're waiting for a certain slide to be added so we can select it,
    // or we just have selectedIndex at -1, go ahead and select.
    if ((!angular.isNumber(scope.selected) || scope.selected < self.count()) &&
        !self.isValidIndex(selectedIndex)) {
      enqueueSelect(self.isValidIndex(scope.selected) ? scope.selected : 0);

    } else if (self.isValidIndex(selectedIndex)) {
      // 'Refresh' the selection at end of digest when a new slide is added
      enqueueSelect(selectedIndex);
    }
  }

  // Called by ionSlide directive
  function onRemoveSlide() {
    slideCount--;
    if (selectedIndex >= self.count()) {
      enqueueSelect( Math.max(selectedIndex - 1, 0) );

    } else if (self.isValidIndex(selectedIndex)) {
      // 'Refresh' the selection at end of digest when a slide is removed
      enqueueSelect(selectedIndex);
    }
  }

  // gives the previous index relative to the given index (default selectedIndex)
  function previous(index) {
    index = arguments.length ? index : selectedIndex;
    var previousIndex = index - 1;
    if (previousIndex < 0) {
      // EDGE CASE: If there are only two slides and loop is enabled, we cannot have a previous
      // because previous === next. Only loop with previous if we have at least 3 slides
      if (isLoop && slideCount > 2) {
        return self.count() - 1;
      }
      return -1;
    }
    return previousIndex;
  }

  // adds data to the queue for selection.
  // Index can be either a number or a getter (to be called when starting the slide)
  function select(newIndex, transitionDuration, isDrag) {
    slideQueue.unshift([
      angular.isFunction(newIndex) ? newIndex : function() { return newIndex; },
      transitionDuration || SLIDE_TRANSITION_DURATION,
      !!isDrag
    ]);
    if (!isSliding) {
      runSelectQueue();
    }
  }

  function selected() {
    return selectedIndex;
  }

  /***************************
   * Private Methods
   ***************************/

  // If slides are added or removed, we only want to re-set the selected index
  // once per digest.
  function enqueueSelect(index) {
    enqueueSelect.index = index;
    if (!enqueueSelect.queued) {
      enqueueSelect.queued = true;
      scope.$$postDigest(function() {
        enqueueSelect.queued = false;
        select(enqueueSelect.index);
      });
    }
  }

  // Recursively takes an item off slideQueue array, selects it,
  // then repeats until nothing is left in the slideQueue.
  // Once slideQueue is empty, publishes the select data to scope.
  function runSelectQueue() {
    isSliding = slideQueue.length > 0;
    if (isSliding) {
      var data = slideQueue.pop();
      data[0] = data[0](); //index is a getter
      slideTo.apply(null, data).then(runSelectQueue);
    } else {
      // Publish the data to scope once we're all done
      scope.$evalAsync(function() {
        scope.selected = selectedIndex;
        scope.onSlideChanged({
          $index: selectedIndex, //DEPRECATED $index
          $slideIndex: selectedIndex
        });
      });
    }
  }

  function slideTo(newIndex, duration, isDrag) {
    // Immediately finish invalid selection
    if (!self.isValidIndex(newIndex)) return $$q.when();

    var deferred = $$q.defer();
    var delta = getDelta(selectedIndex, newIndex);
    var width = (slideNodes[selectedIndex] || slideNodes[newIndex] || {}).offsetWidth || 0;
    var direction;
    var translatePx;

    element.triggerHandler('$ionSlideBox.slide', newIndex);

    // We're interested in isDrag, because a failed drag is the only case
    // where we want to run a slide animation yet have no change in selectedIndex
    if (!isDrag && (delta === 0 || selectedIndex === -1)) {
      // Instantly slide over if there's no change or we don't already have a selected index
      finishSliding();
    } else {
      // Make sure the newIndex is one of the three displayed slides before
      // trying to transition to it
      if (delta < 0) {
        direction = 'previous';
        translatePx = width;
        setDisplayedSlides(newIndex, selectedIndex, self.next());
      } else if (delta > 0) {
        direction = 'next';
        translatePx = -width;
        setDisplayedSlides(self.previous(), selectedIndex, newIndex);
      } else {
        direction = '';
        translatePx = 0;
        setDisplayedSlides(self.previous(), selectedIndex, self.next());
      }

      container.css(ionic.CSS.TRANSITION_DURATION, duration + 'ms');
      // Wait for transitionDuration css to apply...
      ionic.requestAnimationFrame(function() {
        container.css(ionic.CSS.TRANSFORM, 'translate3d(' + translatePx + 'px,0,0)');
        $timeout(finishSliding, duration, false);
      });
    }

    return deferred.promise;

    function finishSliding() {
      container.css(ionic.CSS.TRANSITION_DURATION, '0ms');
      // Wait for transitionDuration css to apply...
      ionic.requestAnimationFrame(function() {
        setSelectedSlide(newIndex);
        deferred.resolve();
      });
    }
  }

  function setSelectedSlide(newIndex) {
    selectedIndex = newIndex;
    setDisplayedSlides(self.previous(newIndex), newIndex, self.next(newIndex));
    container.css(ionic.CSS.TRANSFORM, '');
  }

  /**
   * setDisplayedSlides: set css to show only the three given slide indexes
   * note: prev & next could both be -1 if there's only one slide in the slidebox
   */
  var currentDisplayed = [];
  function setDisplayedSlides(previous, selected, next) {
    var newDisplayed = [
      previous !== -1 && slideNodes[previous],
      selected !== -1 && slideNodes[selected],
      next !== -1 && slideNodes[next]
    ];
    var oldSlide;

    // Hide & disconnect the currently displayed slides that aren't part of the new slides.
    for (var i = 0; i < currentDisplayed.length; i++) {
      oldSlide = currentDisplayed[i];
      if (oldSlide && newDisplayed.indexOf(oldSlide) === -1) {
        oldSlide.removeAttribute('slide-display');
        ionic.Utils.disconnectScope( jqLite(oldSlide).data('$ionSlideScope') );
      }
    }

    setDisplay(newDisplayed[0], 'previous');
    setDisplay(newDisplayed[1], 'selected');
    setDisplay(newDisplayed[2], 'next');

    function setDisplay(slide, display) {
      if (!slide) return;
      var slideScope = jqLite(slide).data('$ionSlideScope');
      if (slideScope) {
        ionic.Utils.reconnectScope(slideScope);
        // Digest the slide so it updates before being shown
        if (!$rootScope.$$phase) slideScope.$digest();
      }
      slide.setAttribute('slide-display', display);
    }

    // Save the now displayed slides so we can check next time
    currentDisplayed = newDisplayed;
  }

  function getDelta(fromIndex, toIndex) {
    var difference = toIndex - fromIndex;
    if (!isLoop) return difference;

    // If looping is on, check for the looped difference.
    // For example, going from the first item to the last item
    // is actually a change of -1.
    var loopedDifference = 0;
    if (toIndex > fromIndex) {
      loopedDifference = toIndex - fromIndex - self.count();
    } else {
      loopedDifference = self.count() - fromIndex + toIndex;
    }
    if (Math.abs(loopedDifference) < Math.abs(difference)) {
      return loopedDifference;
    }
    return difference;
  }


  /********** DRAGGING **********/
  var dragWidth;
  function onDragStart() {
    if (self.dragDisabled || !self.count()) return false;
    if (!isSliding) {
      // Make sure that the correct slides are to the left and right
      // before we start dragging
      setSelectedSlide(selectedIndex);
    }
    dragWidth = slideNodes[selectedIndex].offsetWidth;
  }

  // percent is negative 0-1 for backward slide
  // positive 0-1 for forward slide
  function onDrag(percent) {
    // Only follow user's finger if we aren't currently sliding
    if (!isSliding) {
      container.css(ionic.CSS.TRANSFORM, 'translate3d(' + (-percent * dragWidth) + 'px,0,0)');
    }
  }

  function onDragEnd(percent, velocity) {
    var isSuccess = Math.abs(percent) > 0.5 || velocity > SLIDE_SUCCESS_VELOCITY;

    if (isSuccess) {
      var distanceRemaining = (1 - Math.abs(percent)) * dragWidth;
      var transitionDuration = Math.min((distanceRemaining / velocity) - 34, SLIDE_TRANSITION_DURATION);

      self.select(function getIndex() {
        // This will be called once this dragend is reached in the select queue.
        var nextIndex = percent > 0 ? self.next() : self.previous();
        return self.isValidIndex(nextIndex) ? nextIndex : selectedIndex;
      }, transitionDuration, true);

    } else if (!isSliding) {
      // If the drag failed, then just slide back to current slide being the center.
      slideTo(selectedIndex, SLIDE_TRANSITION_DURATION, true);
    }
  }

}]);
