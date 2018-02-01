import { DIRECTION_BACK, DIRECTION_FORWARD, convertToView, convertToViews, setZIndex } from '../nav-util';
import { MockView, mockDeepLinker, mockNavController, mockRenderer, mockView, mockViews } from '../../util/mock-providers';
import { ViewController } from '../view-controller';


describe('NavUtil', () => {

  describe('convertToViews', () => {

    it('should convert all page components', (done) => {
      let linker = mockDeepLinker();
      let pages = [{ page: MockView }, { page: MockView }, { page: MockView }];

      convertToViews(linker, pages).then(views => {
        expect(views.length).toEqual(3);
        expect(views[0].component).toEqual(MockView);
        expect(views[1].component).toEqual(MockView);
        expect(views[2].component).toEqual(MockView);

        done();
      });
    });

    it('should convert all string names', (done) => {
      let linker = mockDeepLinker({
        links: [{ component: MockView, name: 'someName' }]
      });
      let pages = ['someName', 'someName', 'someName'];

      convertToViews(linker, pages).then(views => {
        expect(views.length).toEqual(3);
        expect(views[0].component).toEqual(MockView);
        expect(views[1].component).toEqual(MockView);
        expect(views[2].component).toEqual(MockView);

        done();
      });
    });

    it('should convert all page string names', (done) => {
      let linker = mockDeepLinker({
        links: [{ component: MockView, name: 'someName' }]
      });
      let pages = [{ page: 'someName' }, { page: 'someName' }, { page: 'someName' }];

      convertToViews(linker, pages).then(views => {
        expect(views.length).toEqual(3);
        expect(views[0].component).toEqual(MockView);
        expect(views[1].component).toEqual(MockView);
        expect(views[2].component).toEqual(MockView);

        done();
      });
    });

    it('should convert all ViewControllers', (done) => {
      let pages = [mockView(MockView), mockView(MockView), mockView(MockView)];
      let linker = mockDeepLinker();

      convertToViews(linker, pages).then(views => {
        expect(views.length).toEqual(3);
        expect(views[0].component).toEqual(MockView);
        expect(views[1].component).toEqual(MockView);
        expect(views[2].component).toEqual(MockView);

        done();
      });
    });

  });

  describe('convertToView', () => {

    it('should return new ViewController instance from page component link config name', (done) => {
      let linker = mockDeepLinker({
        links: [{ component: MockView, name: 'someName' }]
      });

      convertToView(linker, 'someName', null).then(view => {
        expect(view.component).toEqual(MockView);

        done();
      });
    });

    it('should return new ViewController instance from page component', (done) => {
      let linker = mockDeepLinker();

      convertToView(linker, MockView, null).then(view => {
        expect(view.component).toEqual(MockView);

        done();
      });
    });

    it('should return existing ViewController instance', (done) => {
      let linker = mockDeepLinker();
      let inputView = new ViewController(MockView);

      convertToView(linker, inputView, null).then(outputView => {
        expect(outputView).toEqual(inputView);

        done();
      });
    });

    it('should return null for null', (done) => {
      let linker = mockDeepLinker();
      convertToView(linker, null, null).then(view => {
        expect(view).toEqual(null);

        done();
      });
    });

    it('should return null for undefined', (done) => {
      let linker = mockDeepLinker();
      convertToView(linker, undefined, undefined).then(view => {
        expect(view).toEqual(null);

        done();
      });
    });

    it('should return null for number', (done) => {
      let linker = mockDeepLinker();
      convertToView(linker, 8675309, null).then(view => {
        expect(view).toEqual(null);

        done();
      });
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
