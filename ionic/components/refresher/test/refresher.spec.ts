import {Refresher, Content, Config, Ion} from '../../../../ionic';

export function run() {

describe('Refresher', () => {

  describe('_onEnd', () => {

    it('should set to refreshing if state=ready', () => {
      refresher.state = 'ready';
      refresher._onEnd();
      expect(refresher.state).toEqual('refreshing');
    });

    it('should set to canelling if state=pulling on release', () => {
      refresher.state = 'pulling';
      refresher._onEnd();
      expect(refresher.state).toEqual('cancelling');
    });

    it('should do nothing if state=cancelling', () => {
      refresher.state = 'cancelling';
      var results = refresher._onEnd();
      expect(refresher.state).toEqual('cancelling');
    });

    it('should do nothing if state=completing', () => {
      refresher.state = 'completing';
      var results = refresher._onEnd();
      expect(refresher.state).toEqual('completing');
    });

    it('should do nothing if state=refreshing', () => {
      refresher.state = 'refreshing';
      var results = refresher._onEnd();
      expect(refresher.state).toEqual('refreshing');
    });

    it('should do nothing if state=inactive', () => {
      refresher.state = 'inactive';
      refresher._onEnd();
      expect(refresher.state).toEqual('inactive');
    });

  });

  describe('_onMoveInZone', () => {

    it('should set ready state when pulling down and it went past the pull min', () => {
      refresher.state = 'inactive';

      refresher.pullMin = 100;
      refresher.pullMax = 200;
      refresher.deltaY = 100;
      let result = refresher._onMoveInZone();

      expect(result).toEqual(4);
      expect(refresher.state).toEqual('ready');
      expect(refresher.progress).toEqual(1);
    });

    it('should set begin refreshing when pulling down and it went past the pull max', () => {
      refresher.state = 'inactive';

      refresher.pullMin = 100;
      refresher.pullMax = 200;
      refresher.deltaY = 250;
      let result = refresher._onMoveInZone();

      expect(result).toEqual(3);
      expect(refresher.state).toEqual('refreshing');
      expect(refresher.progress).toEqual(2.5);
    });

    it('should set pulling state when pulling down, but not past the pull min', () => {
      refresher.state = 'inactive';

      refresher.pullMin = 100;
      refresher.pullMax = 200;
      refresher.deltaY = 50;
      let result = refresher._onMoveInZone();

      expect(result).toEqual(2);
      expect(refresher.state).toEqual('pulling');
      expect(refresher.progress).toEqual(0.5);
    });

  });

  describe('_onMove', () => {

    it('should set scrollElement inline styles when pulling down, but not past threshold', () => {
      setContentScrollTop(0);
      refresher.startY = 100;
      refresher.pullMin = 80;
      let result = refresher._onMove( touchEv(125) );

      expect(getScrollElementStyles().transform).toEqual('translateY(25px) translateZ(0px)');
      expect(getScrollElementStyles().transitionDuration).toEqual('0ms');
      expect(getScrollElementStyles().overflow).toEqual('hidden');
    });

    it('should set scrollElement inline styles when pulling up above startY', () => {
      refresher.state = 'inactive';
      refresher._appliedStyles = false;

      setContentScrollTop(1);
      refresher.startY = 100;
      let result = refresher._onMove( touchEv(95) );

      expect(result).toEqual(6);
    });

    it('should not pull when scrolling down, state=inactive, deltaY>0, scrollTop>0', () => {
      refresher.state = 'inactive';

      setContentScrollTop(50);
      refresher.startY = 100;
      let result = refresher._onMove( touchEv(125) );

      expect(refresher.state).toEqual('inactive');
      expect(refresher.progress).toEqual(0);
      expect(refresher.startY).toEqual(null);
      expect(result).toEqual(7);
    });

    it('should reset styles when _appliedStyles=true, delta<=0', () => {
      refresher._appliedStyles = true;

      refresher.startY = 100;
      let result = refresher._onMove( touchEv(85) );

      expect(refresher.state).toEqual('inactive');
      expect(getScrollElementStyles().transform).toEqual('translateZ(0px)');
      expect(getScrollElementStyles().transitionDuration).toEqual('');
      expect(getScrollElementStyles().overflow).toEqual('');
      expect(result).toEqual(5);
    });

    it('should not run when scrollTop is > 0', () => {
      setContentScrollTop(50);
      refresher.startY = 100;

      var results = refresher._onMove(touchEv(80));
      expect(results).toEqual(6);
    });

    it('should not run when scrolling up, but isnt actively dragging', () => {
      setContentScrollTop(1);
      refresher.startY = 100;
      refresher._isDragging = false

      var results = refresher._onMove(touchEv(85));
      expect(results).toEqual(6);
    });

    it('should set the deltaY', () => {
      setContentScrollTop(1);
      refresher.startY = 100;
      refresher._onMove( touchEv(133) );
      expect(refresher.deltaY).toEqual(33);

      refresher._lastCheck = 0; // force allow next check
      refresher.startY = 100;

      var results = refresher._onMove( touchEv(50) );
      expect(results).toEqual(6);
      expect(refresher.deltaY).toEqual(-50);
    });

    it('should not run if it already ran less than 16ms ago', () => {
      refresher.startY = 100;
      var results = refresher._onMove(touchEv(88));
      expect(results).toEqual(6);

      results = refresher._onMove(touchEv(88));
      expect(results).toEqual(3);
    });

    it('should not run if state=refreshing', () => {
      refresher.startY = 100;
      refresher.state = 'refreshing';
      var results = refresher._onMove( touchEv(88) );
      expect(results).toEqual(2);
    });

    it('should not run if state=completing', () => {
      refresher.startY = 100;
      refresher.state = 'completing';
      var results = refresher._onMove( touchEv(88) );
      expect(results).toEqual(2);
    });

    it('should not run if state=cancelling', () => {
      refresher.startY = 100;
      refresher.state = 'cancelling';
      var results = refresher._onMove( touchEv(88) );
      expect(results).toEqual(2);
    });

    it('should not run if no startY', () => {
      refresher.startY = null;
      var results = refresher._onMove( touchEv(88) );
      expect(results).toEqual(2);
    });

    it('should not run if multiple touches', () => {
      var results = refresher._onMove({
        touches: [{},{}]
      });
      expect(results).toEqual(1);
    });

  });


  let config = new Config();
  let refresher: Refresher;
  let content: Content;
  let contentElementRef;
  let zone = {
    run: function(cb) {cb()},
    runOutsideAngular: function(cb) {cb()}
  };

  beforeEach(() => {
    contentElementRef = mockElementRef();
    content = new Content(contentElementRef, config, null, null, null);
    content.scrollElement = document.createElement('scroll-content');

    refresher = new Refresher(content, zone, mockElementRef());
  });

  function touchEv(y: number) {
    return {
      type: 'mockTouch',
      touches: [{clientY: y}],
      preventDefault: function(){}
    }
  }

  function mockElementRef() {
    return {
      nativeElement: {
        classList: { add: function(){}, remove: function(){} },
        scrollTop: 0,
        hasAttribute: function(){},
        children: {length: 1 }
      }
    }
  }

  function setContentScrollTop(scrollTop) {
    content.getContentDimensions = function() {
      return {
        scrollTop: scrollTop
      };
    };
  }

  function getScrollElementStyles() {
    return content.scrollElement.style;
  }

});

}
