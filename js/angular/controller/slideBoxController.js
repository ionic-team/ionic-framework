IonicModule
.controller('$ionSlideBox', [
  '$scope',
  '$element',
  '$$ionicAttachDrag',
  SlideBoxController
]);

/*
 * This can be abstracted into a controller that will work for views, tabs, and slidebox.
 */
function SlideBoxController(scope, element, $$ionicAttachDrag) {
  var self = this;
  var slideList = ionic.Utils.list([]);
  var selectedIndex = -1;
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
  self.left = left;
  self.right = right;

  // Methods calling straight back to Utils.list
  self.at = slideList.at;
  self.count = slideList.count;
  self.indexOf = slideList.indexOf;
  self.isInRange = slideList.isInRange;
  self.loop = slideList.loop;
  self.delta = slideList.delta;

  self.add = add;
  self.remove = remove;
  self.move = move;
  self.shown = shown;
  self.select = select;
  self.onDrag = onDrag;
  self.onDragEnd = onDragEnd;

  // ***
  // Public Methods
  // ***

  // Gets whether the given index is relevant to selected
  // That is, whether the given index is left, shown, or right
  function isRelevant(index) {
    return slideList.isRelevant(index, selectedIndex);
  }

  // Gets the index to the left of the given slide, default selectedIndex
  function left(index) {
    return slideList.left(arguments.length ? index : selectedIndex);
  }

  // Gets the index to the right of the given slide, default selectedIndex
  function right(index) {
    return slideList.right(arguments.length ? index : selectedIndex);
  }

  /*
   * Add/remove/move slides
   */
  function add(slide, index) {
    var newIndex = slideList.add(slide, index);
    slide.onAdded(slidesParent);

    if (selectedIndex === -1) {
      self.select(newIndex);
    } else if (newIndex === self.left() || newIndex === self.right()) {
      // if the new slide is adjacent to selected, refresh the selection
      enqueueRefresh();
    }
  }
  function remove(slide) {
    var index = self.indexOf(slide);
    if (index === -1) return;

    var isSelected = self.shown() === index;
    slideList.remove(index);
    slide.onRemoved();

    if (isSelected) {
      self.select( self.isInRange(selectedIndex) ? selectedIndex : selectedIndex - 1 );
    }
  }
  function move(slide, targetIndex) {
    var index = self.indexOf(slide);
    if (index === -1) return;

    // If the slide is current, right, or left, save so we can re-select after moving.
    var isRelevant = self.isRelevant(targetIndex);
    slideList.remove(index);
    slideList.add(slide, targetIndex);

    if (isRelevant) {
      enqueueRefresh();
    }
  }

  function shown() {
    return selectedIndex;
  }

  /*
   * Select and change slides
   */
  function select(newIndex, transitionDuration) {
    if (!self.isInRange(newIndex)) return;

    var delta = self.delta(selectedIndex, newIndex);

    slidesParent.css(
      ionic.CSS.TRANSITION_DURATION,
      (transitionDuration || SLIDE_TRANSITION_DURATION) + 'ms'
    );
    selectedIndex = newIndex;

    if (self.isInRange(selectedIndex) && Math.abs(delta) > 1) {
      // if the new slide is > 1 away, then it is currently not attached to the DOM.
      // Attach it in the position from which it will slide in.
      self.at(newIndex).setState(delta > 1 ? 'right' : 'left');
      // Wait one frame so the new slide can 'settle' in its new place and
      // be ready to properly transition in
      ionic.requestAnimationFrame(doSelect);
    } else {
      doSelect();
    }

    function doSelect() {
      // If a new selection has happened before this frame, abort.
      if (selectedIndex !== newIndex) return;
      scope.$evalAsync(function() {
        if (selectedIndex !== newIndex) return;
        arrangeSlides(newIndex);
      });
    }
  }

  function onDrag(percent) {
    var target = self.at(percent > 0 ? self.right() : self.left());
    var current = self.at(self.shown());

    target && target.transform(percent);
    current && current.transform(percent);
  }

  function onDragEnd(percent, velocity) {
    var nextIndex = -1;
    if (Math.abs(percent) > 0.5 || velocity > SLIDE_SUCCESS_VELOCITY) {
      nextIndex = percent > 0 ? self.right() : self.left();
    }
    var transitionDuration = Math.min(
      slidesParent.prop('offsetWidth') / (3.5 * velocity),
      SLIDE_TRANSITION_DURATION
    );

    // Select a new slide if it's avaiable
    self.select(
      self.isInRange(nextIndex) ? nextIndex : self.shown(),
      transitionDuration
    );
  }

  // ***
  // Private Methods
  // ***

  var oldSlides;
  function arrangeSlides(newShownIndex) {
    var newSlides = {
      left: self.at(self.left(newShownIndex)),
      shown: self.at(newShownIndex),
      right: self.at(self.right(newShownIndex))
    };

    newSlides.left && newSlides.left.setState('left');
    newSlides.shown && newSlides.shown.setState('shown');
    newSlides.right && newSlides.right.setState('right');

    if (oldSlides) {
      var oldShown = oldSlides.shown;
      var delta = self.delta(self.indexOf(oldSlides.shown), self.indexOf(newSlides.shown));
      if (Math.abs(delta) > 1) {
        // If we're changing by more than one slide, we need to manually transition
        // the current slide out and then put it into its new state.
        oldShown.setState(delta > 1 ? 'left' : 'right').then(function() {
          oldShown.setState(
            newSlides.left === oldShown ?  'left' :
            newSlides.right === oldShown ? 'right' :
            'detached'
          );
        });
      } else {
        detachIfUnused(oldSlides.shown);
      }
      //Additionally, we need to detach both of the old slides.
      detachIfUnused(oldSlides.left);
      detachIfUnused(oldSlides.right);
    }

    function detachIfUnused(oldSlide) {
      if (oldSlide && oldSlide !== newSlides.left &&
          oldSlide !== newSlides.shown &&
          oldSlide !== newSlides.right) {
        oldSlide.setState('detached');
      }
    }

    oldSlides = newSlides;
  }

  // When adding/moving slides, we sometimes need to refresh
  // the currently shown slides to reflect new data.
  // We don't want to refresh more than once per digest cycle,
  // so we do this.
  function enqueueRefresh() {
    if (!enqueueRefresh.queued) {
      enqueueRefresh.queued = true;
      scope.$$postDigest(function() {
        self.select(selectedIndex);
        enqueueRefresh.queued = false;
      });
    }
  }
}
