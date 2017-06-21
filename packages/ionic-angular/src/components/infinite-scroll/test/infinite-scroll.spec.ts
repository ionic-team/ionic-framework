import { Content, ScrollEvent } from '../../content/content';
import { DomController } from '../../../platform/dom-controller';
import { InfiniteScroll } from '../infinite-scroll';
import { mockConfig, mockDomController, mockElementRef, mockElementRefEle, mockPlatform, mockRenderer, mockZone } from '../../../util/mock-providers';


describe('Infinite Scroll', () => {

  describe('_onScroll', () => {

    it('should not set loading state when does not meet threshold', () => {
      setInfiniteScrollHeight(25);
      content.getContentDimensions = function() {
        return mockGetContentDimensions(1000, 350, 500);
      };

      inf.threshold = '100px';

      setInfiniteScrollTop(300);

      var result = inf._onScroll(ev);
      expect(result).toEqual(6);
    });

    it('should set loading state when meets threshold', () => {
      setInfiniteScrollHeight(25);
      content.getContentDimensions = function() {
        return mockGetContentDimensions(1000, 500, 500);
      };
      inf.threshold = '100px';

      setInfiniteScrollTop(300);

      var result = inf._onScroll(ev);
      expect(result).toEqual(5);
    });

    it('should not run if there is not infinite element height', () => {
      setInfiniteScrollTop(0);
      var result = inf._onScroll(ev);
      expect(result).toEqual(3);
    });

    it('should not run again if ran less than 32ms ago', () => {
      ev.timeStamp = Date.now();
      inf._lastCheck = Date.now();
      var result = inf._onScroll(ev);
      expect(result).toEqual(2);
    });

    it('should not run if state is disabled', () => {
      inf.state = 'disabled';
      var result = inf._onScroll(ev);
      expect(result).toEqual(1);
    });

    it('should not run if state is loading', () => {
      inf.state = 'loading';
      var result = inf._onScroll(ev);
      expect(result).toEqual(1);
    });

    it('should not run if not enabled', () => {
      inf.state = 'disabled';
      var result = inf._onScroll(ev);
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

  describe('position', () => {

    it('should default to bottom', () => {
      expect(inf._position).toEqual('bottom');
    });

    it('should set to top', () => {
      inf.position = 'top';
      expect(inf._position).toEqual('top');
    });

    it('should set to bottom', () => {
      inf.position = 'bottom';
      expect(inf._position).toEqual('bottom');
    });

    it('should not set to anything else', () => {
      inf.position = 'derp';
      expect(inf._position).toEqual('bottom');
    });

  });


  let config = mockConfig();
  let inf: InfiniteScroll;
  let content: Content;
  let contentElementRef: any;
  let infiniteElementRef: any;
  let ev: ScrollEvent = (<any>{});
  let dom: DomController;

  beforeEach(() => {
    contentElementRef = mockElementRef();
    dom = mockDomController();
    content = new Content(config, mockPlatform(), dom, contentElementRef, mockRenderer(), null, null, mockZone(), null, null);
    let ele = document.createElement('div');
    ele.className = 'scroll-content';
    content._scrollContent = mockElementRefEle(ele);

    infiniteElementRef = mockElementRef();

    inf = new InfiniteScroll(content, mockZone(), infiniteElementRef, dom);
  });

  function setInfiniteScrollTop(scrollTop: any) {
    infiniteElementRef.nativeElement.scrollTop = scrollTop;
  }

  function setInfiniteScrollHeight(scrollHeight: any) {
    infiniteElementRef.nativeElement.scrollHeight = scrollHeight;
  }

  function mockGetContentDimensions(scrollHeight: any, scrollTop: any, contentHeight: any): any {
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
