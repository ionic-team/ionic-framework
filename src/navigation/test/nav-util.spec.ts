import { convertToView, convertToViews, DIRECTION_BACK, DIRECTION_FORWARD, setZIndex } from '../nav-util';
import { mockDeepLinker, mockNavController, MockView, mockRenderer, mockView, mockViews } from '../../util/mock-providers';
import { ViewController } from '../view-controller';


describe('NavUtil', () => {

  describe('convertToViews', () => {

    it('should convert all page components', () => {
      let linker = mockDeepLinker();
      let pages = [{ page: MockView }, { page: MockView }, { page: MockView }];
      let views = convertToViews(linker, pages);
      expect(views.length).toEqual(3);
      expect(views[0].component).toEqual(MockView);
      expect(views[1].component).toEqual(MockView);
      expect(views[2].component).toEqual(MockView);
    });

    it('should convert all string names', () => {
      let linker = mockDeepLinker({
        links: [{ component: MockView, name: 'someName' }]
      });
      let pages = ['someName', 'someName', 'someName'];
      let views = convertToViews(linker, pages);
      expect(views.length).toEqual(3);
      expect(views[0].component).toEqual(MockView);
      expect(views[1].component).toEqual(MockView);
      expect(views[2].component).toEqual(MockView);
    });

    it('should convert all page string names', () => {
      let linker = mockDeepLinker({
        links: [{ component: MockView, name: 'someName' }]
      });
      let pages = [{ page: 'someName' }, { page: 'someName' }, { page: 'someName' }];
      let views = convertToViews(linker, pages);
      expect(views.length).toEqual(3);
      expect(views[0].component).toEqual(MockView);
      expect(views[1].component).toEqual(MockView);
      expect(views[2].component).toEqual(MockView);
    });

    it('should convert all ViewControllers', () => {
      let pages = [mockView(MockView), mockView(MockView), mockView(MockView)];
      let linker = mockDeepLinker();
      let views = convertToViews(linker, pages);
      expect(views.length).toEqual(3);
      expect(views[0].component).toEqual(MockView);
      expect(views[1].component).toEqual(MockView);
      expect(views[2].component).toEqual(MockView);
    });

  });

  describe('convertToView', () => {

    it('should return new ViewController instance from page component link config name', () => {
      let linker = mockDeepLinker({
        links: [{ component: MockView, name: 'someName' }]
      });
      let outputView = convertToView(linker, 'someName', null);
      expect(outputView.component).toEqual(MockView);
    });

    it('should return new ViewController instance from page component', () => {
      let linker = mockDeepLinker();
      let outputView = convertToView(linker, MockView, null);
      expect(outputView.component).toEqual(MockView);
    });

    it('should return existing ViewController instance', () => {
      let linker = mockDeepLinker();
      let inputView = new ViewController(MockView);
      let outputView = convertToView(linker, inputView, null);
      expect(outputView).toEqual(inputView);
    });

    it('should return null for null/undefined/number', () => {
      let linker = mockDeepLinker();
      let outputView = convertToView(linker, null, null);
      expect(outputView).toEqual(null);

      outputView = convertToView(linker, undefined, undefined);
      expect(outputView).toEqual(null);

      outputView = convertToView(linker, 8675309, null);
      expect(outputView).toEqual(null);
    });

  });

  describe('setZIndex', () => {

    it('should set zIndex 100 when leaving view doesnt have a zIndex', () => {
      let leavingView = mockView();
      let enteringView = mockView();

      let nav = mockNavController();
      mockViews(nav, [leavingView, enteringView]);

      setZIndex(nav, enteringView, leavingView, DIRECTION_FORWARD, mockRenderer());
      expect(enteringView._zIndex).toEqual(100);
    });

    it('should set zIndex 100 on first entering view', () => {
      let enteringView = mockView();
      let nav = mockNavController();
      setZIndex(nav, enteringView, null, DIRECTION_FORWARD, mockRenderer());
      expect(enteringView._zIndex).toEqual(100);
    });

    it('should set zIndex 101 on second entering view', () => {
      let leavingView = mockView();
      leavingView._zIndex = 100;
      let enteringView = mockView();
      let nav = mockNavController();
      setZIndex(nav, enteringView, leavingView, DIRECTION_FORWARD, mockRenderer());
      expect(enteringView._zIndex).toEqual(101);
    });

    it('should set zIndex 100 on entering view going back', () => {
      let leavingView = mockView();
      leavingView._zIndex = 101;
      let enteringView = mockView();
      let nav = mockNavController();
      setZIndex(nav, enteringView, leavingView, DIRECTION_BACK, mockRenderer());
      expect(enteringView._zIndex).toEqual(100);
    });

    it('should set zIndex 9999 on first entering portal view', () => {
      let enteringView = mockView();
      let nav = mockNavController();
      nav._isPortal = true;
      setZIndex(nav, enteringView, null, DIRECTION_FORWARD, mockRenderer());
      expect(enteringView._zIndex).toEqual(9999);
    });

  });

});
