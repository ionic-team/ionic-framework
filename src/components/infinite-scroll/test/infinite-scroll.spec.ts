import { Content } from '../../content/content';
import { InfiniteScroll } from '../infinite-scroll';
import { mockConfig, mockElementRef, mockRenderer, mockZone } from '../../../util/mock-providers';


describe('Infinite Scroll', () => {

  describe('_onScroll', () => {

    it('should not set loading state when does not meet threshold', () => {
      setInfiniteScrollHeight(25);
      content.getContentDimensions = function() {
        return mockGetContentDimensions(1000, 350, 500);
      };

      inf.threshold = '100px';

      setInfiniteScrollTop(300);

      var result = inf._onScroll();
      expect(result).toEqual(6);
    });

    it('should set loading state when meets threshold', () => {
      setInfiniteScrollHeight(25);
      content.getContentDimensions = function() {
        return mockGetContentDimensions(1000, 500, 500);
      };
      inf.threshold = '100px';

      setInfiniteScrollTop(300);

      var result = inf._onScroll();
      expect(result).toEqual(5);
    });

    it('should not run if there is not infinite element height', () => {
      setInfiniteScrollTop(0);
      var result = inf._onScroll();
      expect(result).toEqual(3);
    });

    it('should not run again if ran less than 32ms ago', () => {
      inf._lastCheck = Date.now();
      var result = inf._onScroll();
      expect(result).toEqual(2);
    });

    it('should not run if state is disabled', () => {
      inf.state = 'disabled';
      var result = inf._onScroll();
      expect(result).toEqual(1);
    });

    it('should not run if state is loading', () => {
      inf.state = 'loading';
      var result = inf._onScroll();
      expect(result).toEqual(1);
    });

    it('should not run if not enabled', () => {
      inf.state = 'disabled';
      var result = inf._onScroll();
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


  let config = mockConfig();
  let inf: InfiniteScroll;
  let content: Content;
  let contentElementRef;
  let infiniteElementRef;

  beforeEach(() => {
    contentElementRef = mockElementRef();
    content = new Content(config, contentElementRef, mockRenderer(), null, null, null, null, null);
    content._scrollEle = document.createElement('div');
    content._scrollEle.className = 'scroll-content';

    infiniteElementRef = mockElementRef();
    inf = new InfiniteScroll(content, mockZone(), infiniteElementRef);
  });

  function setInfiniteScrollTop(scrollTop) {
    infiniteElementRef.nativeElement.scrollTop = scrollTop;
  }

  function setInfiniteScrollHeight(scrollHeight) {
    infiniteElementRef.nativeElement.scrollHeight = scrollHeight;
  }

  function mockGetContentDimensions(scrollHeight, scrollTop, contentHeight) {
    return {
          scrollHeight: scrollHeight,
          scrollTop: scrollTop,
          contentHeight: contentHeight,

          contentTop: null,
          contentBottom: null,
          contentWidth: null,
          contentLeft: null,
          contentRight: null,
          scrollBottom: null,
          scrollWidth: null,
          scrollLeft: null,
          scrollRight: null
        };
  }

});
