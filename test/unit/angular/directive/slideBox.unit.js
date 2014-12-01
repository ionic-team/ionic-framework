describe('ionSlideBox', function() {

  beforeEach(module('ionic'));
  beforeEach(function() {
    spyOn(ionic, 'requestAnimationFrame').andCallFake(function(cb) {
      cb();
    });
  });

  function setup(attrs, children) {
    var el;
    children = children || ['A','B','C'].map(function(content) {
      return '  <ion-slide>' + content + '</ion-slide>';
    }).join('\n');

    inject(function($compile, $rootScope) {
      el = $compile('<ion-slide-box '+(attrs||'')+'>' +
                      (children||'') +
                    '</ion-slide-box>')($rootScope.$new());
      $rootScope.$apply();
    });

    return el;
  }

  function slides(el) {
    return el.find('ion-slide');
  }
  function slideDisplays(el) {
    var slides = el.find('ion-slide');
    var displays = [];
    for (var i = 0; i < slides.length; i++) {
      displays.push( slides[i].getAttribute('slide-display') || '' );
    }
    return displays;
  }


  describe('directive', function() {
    it('should error with nested ion-slides', function() {
      expect(function() {
        setup('', '<ion-slide> <ion-slide>Nested</ion-slide> </ion-slide>');
      }).toThrow();
    });

    describe('selection', function() {
      it('should select first slide automatically', inject(function($rootScope, $timeout) {
        var el = setup('selected="$root.current"');
        $timeout.flush();
        expect($rootScope.current).toBe(0);
        expect(slideDisplays(el)).toEqual(['selected', 'next', '']);
      }));

      it('should pre-select slide matching binding', inject(function($rootScope, $timeout) {
        $rootScope.current = 1;
        var el = setup('selected="$root.current"');
        $timeout.flush();
        expect($rootScope.current).toBe(1);
        expect(slideDisplays(el)).toEqual(['previous','selected', 'next']);
      }));

      it('should change selection to match binding', inject(function($rootScope, $timeout) {
        var el = setup('selected="$root.current"');
        $timeout.flush();
        expect($rootScope.current).toBe(0);
        $rootScope.$apply('current = 2');
        $timeout.flush();
        expect(slideDisplays(el)).toEqual(['', 'previous', 'selected']);

        // Nothing should change for invalid index
        $rootScope.$apply('current = 3');
        $timeout.flush();
        expect(slideDisplays(el)).toEqual(['', 'previous', 'selected']);

        // Going back to valid index should act as normal
        $rootScope.$apply('current = 1');
        $timeout.flush();
        expect(slideDisplays(el)).toEqual(['previous', 'selected', 'next']);
      }));

      it('should change selection when slides are added', inject(function($rootScope, $timeout) {
        var el = setup('selected="$root.current"',
          '<ion-slide>A</ion-slide><ion-slide ng-if="B">B</ion-slide>');
        $timeout.flush();
        expect(slideDisplays(el)).toEqual(['selected']);
        $rootScope.$apply('B = true');
        expect(slideDisplays(el)).toEqual(['selected', 'next']);
      }));

      it('should change selection when slides are removed', inject(function($rootScope, $timeout) {
        $rootScope.items = [1,2,3];
        var el = setup('selected="$root.current"',
          '<ion-slide ng-repeat="i in items">{{i}}</ion-slide>');
        $timeout.flush();
        expect(slideDisplays(el)).toEqual(['selected', 'next', '']);
        $rootScope.$apply('items.shift()');
        expect(slideDisplays(el)).toEqual(['selected', 'next']);
        $rootScope.$apply('items.pop()');
        expect(slideDisplays(el)).toEqual(['selected']);
      }));

    });

    describe('loop', function() {
      it('should reflect next/prev with loop', inject(function($rootScope, $timeout) {
        $rootScope.shouldLoop = true;
        var el = setup('selected="$root.current" loop="$root.shouldLoop"');
        $timeout.flush();
        expect(slideDisplays(el)).toEqual(['selected', 'next', 'previous']);
      }));
    });

    describe('autoPlay', function() {
      it('should autoPlay with attr', inject(function($rootScope, $timeout, $interval) {
        $rootScope.play = 400;
        var el = setup('selected="$root.current" auto-play="$root.play" loop="$root.loopy"');
        $timeout.flush();
        expect($rootScope.current).toBe(0);
        $interval.flush(400); // autoplay
        $timeout.flush(); // transition
        expect($rootScope.current).toBe(1);

        $rootScope.$apply('play = 333');
        $interval.flush(333); // autoplay
        $timeout.flush(); // transition
        expect($rootScope.current).toBe(2);

        $interval.flush(333); // autoplay
        $timeout.flush(); // transitionkkk
        expect($rootScope.current).toBe(2);

        $rootScope.$apply('loopy = true');
        $interval.flush(333); // autoplay
        $timeout.flush(); // transition
        expect($rootScope.current).toBe(0);

        // turn autoPlay off, no change
        $rootScope.$apply('play = 0');
        $interval.flush(9999);
        $timeout.verifyNoPendingTasks(); //nothing happens
        expect($rootScope.current).toBe(0);
      }));
    });

    describe('onSlideChanged', function() {
      it('should call when selected changes', inject(function($rootScope, $timeout) {
        $rootScope.changed = jasmine.createSpy('changed');
        var el = setup('selected="$root.current" on-slide-changed="changed($slideIndex)"');
        expect($rootScope.changed).not.toHaveBeenCalled();
        $timeout.flush();
        expect($rootScope.changed).toHaveBeenCalledWith(0);

        $rootScope.changed.reset();
        $rootScope.$apply('current = 2');
        expect($rootScope.changed).not.toHaveBeenCalled();
        $timeout.flush();
        expect($rootScope.changed).toHaveBeenCalledWith(2);
      }));
    });

    describe('onSlideStart', function() {
      it('should call when animation starts', inject(function($rootScope, $timeout) {
        $rootScope.start = jasmine.createSpy('start');
        $rootScope.current = 1;
        var el = setup('selected="$root.current" on-slide-start="$root.start($slideIndex)">');
        expect($rootScope.start).toHaveBeenCalledWith(1);
        $timeout.flush();
      }));
    });

  });

  describe('delegate', function() {

    var $del;
    beforeEach(inject(function($ionicSlideBoxDelegate) {
      $del = $ionicSlideBoxDelegate;
    }));

    describe('loop()', function() {
      it('should set & get, false by default', inject(function($timeout) {
        var el = setup();
        $timeout.flush();
        expect($del.loop()).toBe(false);
        expect($del.loop(true)).toBe(true);
        expect($del.loop()).toBe(true);
        expect($del.loop(false)).toBe(false);
        expect($del.loop()).toBe(false);
      }));
    });

    describe('selected()', function() {
      it('should return selected index', inject(function($timeout) {
        setup();
        $timeout.flush();
        expect($del.selected()).toBe(0);
        $del.select(1);
        $timeout.flush();
        expect($del.selected()).toBe(1);
      }));
    });

    describe('next()', function() {

      it('without loop', inject(function($timeout) {
        setup('selected="$root.current"');
        $del.loop(false);
        $timeout.flush();
        expect($del.selected()).toBe(0);
        expect($del.next()).toBe(1);

        $del.select(2);
        $timeout.flush();
        expect($del.selected()).toBe(2);
        expect($del.next()).toBe(-1);
      }));

      it('with loop', inject(function($timeout) {
        setup('selected="$root.current"');
        $del.loop(true);
        $timeout.flush();
        expect($del.selected()).toBe(0);
        expect($del.next()).toBe(1);

        $del.select(2);
        $timeout.flush();
        expect($del.selected()).toBe(2);
        expect($del.next()).toBe(0);
      }));

    });

    describe('previous()', function() {

      it('without loop', inject(function($timeout) {
        setup('selected="$root.current"');
        $del.loop(false);
        $timeout.flush();
        expect($del.selected()).toBe(0);
        expect($del.previous()).toBe(-1);

        $del.select(1);
        $timeout.flush();
        expect($del.selected()).toBe(1);
        expect($del.previous()).toBe(0);
      }));

      it('with loop', inject(function($timeout) {
        setup('selected="$root.current"');
        $del.loop(true);
        $timeout.flush();
        expect($del.selected()).toBe(0);
        expect($del.previous()).toBe(2);

        $del.select(1);
        $timeout.flush();
        expect($del.selected()).toBe(1);
        expect($del.previous()).toBe(0);
      }));

      it('edge case of 2 slides and loop', inject(function($timeout) {
        setup('selected="$root.current"', '<ion-slide>A</ion-slide><ion-slide>B</ion-slide>');
        $del.loop(true);
        $timeout.flush();
        expect($del.selected()).toBe(0);
        expect($del.previous()).toBe(-1);

        $del.select(1);
        $timeout.flush();
        expect($del.selected()).toBe(1);
        expect($del.previous()).toBe(0);
      }));

    });

    describe('count()', function() {

      it('should change with slides', inject(function($timeout, $rootScope) {
        $rootScope.items = [1,2,3];
        setup('','<ion-slide ng-repeat="i in items"></ion-slide>');
        $timeout.flush();
        expect($del.count()).toBe(3);
        $rootScope.$apply('items.pop()');
        expect($del.count()).toBe(2);
        $rootScope.$apply('items.unshift(0)');
        expect($del.count()).toBe(3);
      }));

    });

    describe('autoPlay()', function() {

      it('should start/stop', inject(function($timeout, $interval) {
        var el = setup();
        $del.autoPlay(100);
        $timeout.flush();
        expect($del.selected()).toBe(0);
        $interval.flush(100); // autoplay
        $timeout.flush(); // transition
        expect($del.selected()).toBe(1);

        $del.autoPlay(150);
        $interval.flush(150); // autoplay
        $timeout.flush(); // transition
        expect($del.selected()).toBe(2);

        $interval.flush(150); // autoplay
        $timeout.flush(); // transition
        expect($del.selected()).toBe(2); //boundary

        $del.loop(true);
        $interval.flush(150); // autoplay
        $timeout.flush(); // transition
        expect($del.selected()).toBe(0);

        // turn autoPlay off, no change
        $del.autoPlay(0);
        $interval.flush(9999);
        $timeout.flush();
        expect($del.selected()).toBe(0);
      }));

    });

    describe('select()', function() {
      it('basic', inject(function($timeout, $rootScope) {
        var el = setup('selected="$root.current"');
        $timeout.flush();
        expect($rootScope.current).toBe(0);

        $del.select(2);
        $timeout.flush();
        expect($rootScope.current).toBe(2);
        expect(slideDisplays(el)).toEqual(['', 'previous', 'selected']);

        $del.loop(true);
        $del.select(0);
        $timeout.flush();
        expect($rootScope.current).toBe(0);
        expect(slideDisplays(el)).toEqual(['selected', 'next', 'previous']);
      }));

      it('when queueing, should only publish after final slide', inject(function($timeout, $rootScope) {
        $rootScope.changed = jasmine.createSpy('changed');
        $rootScope.start = jasmine.createSpy('start');
        var el = setup('selected="$root.current" on-slide-changed="$root.changed($slideIndex)" on-slide-start="$root.start($slideIndex)"');
        $timeout.flush();
        $rootScope.changed.reset();
        $rootScope.start.reset();

        $del.select(1);
        $del.select(2);
        $del.select(1);

        expect($rootScope.start).toHaveBeenCalledWith(1);
        $rootScope.start.reset();
        $timeout.flush();

        // Scope data bindings not published
        expect($rootScope.changed).not.toHaveBeenCalled();
        expect($rootScope.current).toBe(0);
        // Elements look different, though.
        expect(slideDisplays(el)).toEqual(['previous', 'selected', 'next']);

        expect($rootScope.start).toHaveBeenCalledWith(2);
        $rootScope.start.reset();
        $timeout.flush();

        expect($rootScope.changed).not.toHaveBeenCalled();
        expect($rootScope.current).toBe(0);
        expect(slideDisplays(el)).toEqual(['', 'previous', 'selected']);

        expect($rootScope.start).toHaveBeenCalledWith(1);
        $rootScope.start.reset();
        $timeout.flush();

        expect($rootScope.changed).toHaveBeenCalledWith(1);
        expect($rootScope.current).toBe(1);
        expect(slideDisplays(el)).toEqual(['previous', 'selected', 'next']);
      }));

    });

  });

});

