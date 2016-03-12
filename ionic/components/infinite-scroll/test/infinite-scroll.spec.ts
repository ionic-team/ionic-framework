import {InfiniteScroll, Content, Config} from '../../../../ionic';

export function run() {

describe('Infinite Scroll', () => {

  describe('_onScroll', () => {

    it('should not set loading state when does not meet threshold', () => {
      setInfiniteScrollHeight(25);
      content.getContentDimensions = function() {
        return { scrollHeight: 1000, scrollTop: 350, contentHeight: 500 };
      };
      inf.threshold = '100px';

      setInfiniteScrollTop(300);

      var result = inf._onScroll(scrollEv());
      expect(result).toEqual(6);
    });

    it('should set loading state when meets threshold', () => {
      setInfiniteScrollHeight(25);
      content.getContentDimensions = function() {
        return { scrollHeight: 1000, scrollTop: 500, contentHeight: 500 };
      };
      inf.threshold = '100px';

      setInfiniteScrollTop(300);

      var result = inf._onScroll(scrollEv());
      expect(result).toEqual(5);
    });

    it('should not run if there is not infinite element height', () => {
      setInfiniteScrollTop(0);
      var result = inf._onScroll(scrollEv());
      expect(result).toEqual(3);
    });

    it('should not run again if ran less than 32ms ago', () => {
      inf._lastCheck = Date.now();
      var result = inf._onScroll(scrollEv());
      expect(result).toEqual(2);
    });

    it('should not run if state is disabled', () => {
      inf.state = 'disabled';
      var result = inf._onScroll(scrollEv());
      expect(result).toEqual(1);
    });

    it('should not run if state is loading', () => {
      inf.state = 'loading';
      var result = inf._onScroll(scrollEv());
      expect(result).toEqual(1);
    });

    it('should not run if not enabled', () => {
      inf.state = 'disabled';
      var result = inf._onScroll(scrollEv());
      expect(result).toEqual(1);
    });

  });

  describe('threshold', () => {

    it('should set by percent', () => {
      inf.threshold = '10%';
      expect(inf._thr).toEqual('10%');
      expect(inf._thrPx).toEqual(0);
      expect(inf._thrPc).toEqual(0.1);
    });

    it('should set by pixels', () => {
      inf.threshold = '10';
      expect(inf._thr).toEqual('10');
      expect(inf._thrPx).toEqual(10);
      expect(inf._thrPc).toEqual(0);

      inf.threshold = '10px';
      expect(inf._thr).toEqual('10px');
      expect(inf._thrPx).toEqual(10);
      expect(inf._thrPc).toEqual(0);
    });

  });


  let config = new Config();
  let inf: InfiniteScroll;
  let content: Content;
  let contentElementRef;
  let infiniteElementRef;
  let zone = {
    run: function(cb) {cb()},
    runOutsideAngular: function(cb) {cb()}
  };

  beforeEach(() => {
    contentElementRef = mockElementRef();
    content = new Content(contentElementRef, config, null, null, null);
    content.scrollElement = document.createElement('scroll-content');

    infiniteElementRef = mockElementRef();
    inf = new InfiniteScroll(content, zone, infiniteElementRef);
  });

  function scrollEv() {
    return {}
  }

  function mockElementRef() {
    return {
      nativeElement: {
        classList: { add: function(){}, remove: function(){} },
        scrollTop: 0,
        hasAttribute: function(){}
      }
    }
  }

  function setInfiniteScrollTop(scrollTop) {
    infiniteElementRef.nativeElement.scrollTop = scrollTop;
  }

  function setInfiniteScrollHeight(scrollHeight) {
    infiniteElementRef.nativeElement.scrollHeight = scrollHeight;
  }

  function getScrollElementStyles() {
    return content.scrollElement.style;
  }

});

}
