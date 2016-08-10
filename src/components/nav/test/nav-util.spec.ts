import { ViewController } from '../../../../src';
import { setZIndex, DIRECTION_BACK, DIRECTION_FORWARD } from '../../../../src/components/nav/nav-util';
import { mockNavController, mockElementRef, mockRenderer } from '../../../../src/util/mock-providers';

export function run() {

describe('NavUtils', () => {

  describe('setZIndex', () => {

    it('should set zIndex off of the previous view to the entering view is loaded and the leavingView is not loaded', () => {
      let leavingView = new ViewController();
      leavingView.zIndex = 100;
      leavingView.fireLoaded();
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());

      let nav = mockNavController();
      nav._views = [leavingView, enteringView];

      setZIndex(nav, enteringView, leavingView, DIRECTION_FORWARD, mockRenderer());
      expect(enteringView.zIndex).toEqual(101);
    });

    it('should set zIndex 100 when leaving view is not loaded', () => {
      let leavingView = new ViewController();
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());

      let nav = mockNavController();
      nav._views = [leavingView, enteringView];

      setZIndex(nav, enteringView, leavingView, DIRECTION_FORWARD, mockRenderer());
      expect(enteringView.zIndex).toEqual(100);
    });

    it('should set zIndex 100 on first entering view', () => {
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());
      let nav = mockNavController();
      setZIndex(nav, enteringView, null, DIRECTION_FORWARD, mockRenderer());
      expect(enteringView.zIndex).toEqual(100);
    });

    it('should set zIndex 1 on second entering view', () => {
      let leavingView = new ViewController();
      leavingView.zIndex = 0;
      leavingView.fireLoaded();
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());
      let nav = mockNavController();
      setZIndex(nav, enteringView, leavingView, DIRECTION_FORWARD, mockRenderer());
      expect(enteringView.zIndex).toEqual(1);
    });

    it('should set zIndex 0 on entering view going back', () => {
      let leavingView = new ViewController();
      leavingView.zIndex = 1;
      leavingView.fireLoaded();
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());
      let nav = mockNavController();
      setZIndex(nav, enteringView, leavingView, DIRECTION_BACK, mockRenderer());
      expect(enteringView.zIndex).toEqual(0);
    });

    it('should set zIndex 9999 on first entering portal view', () => {
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());
      let nav = mockNavController();
      nav._isPortal = true;
      setZIndex(nav, enteringView, null, DIRECTION_FORWARD, mockRenderer());
      expect(enteringView.zIndex).toEqual(9999);
    });

    it('should set zIndex 10000 on second entering portal view', () => {
      let leavingView = new ViewController();
      leavingView.zIndex = 9999;
      leavingView.fireLoaded();
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());
      let nav = mockNavController();
      nav._isPortal = true;
      setZIndex(nav, enteringView, leavingView, DIRECTION_FORWARD, mockRenderer());
      expect(enteringView.zIndex).toEqual(10000);
    });

    it('should set zIndex 9999 on entering portal view going back', () => {
      let leavingView = new ViewController();
      leavingView.zIndex = 10000;
      leavingView.fireLoaded();
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());
      let nav = mockNavController();
      nav._isPortal = true;
      setZIndex(nav, enteringView, leavingView, DIRECTION_BACK, mockRenderer());
      expect(enteringView.zIndex).toEqual(9999);
    });

  });

});
}
