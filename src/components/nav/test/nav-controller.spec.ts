import { Renderer } from '@angular/core';
import { App, Config, Form, Keyboard, MenuController, NavOptions, Platform, Tabs, ViewController } from '../../../../src';
import { NavControllerBase } from '../../../../src/components/nav/nav-controller-base';
import { STATE_ACTIVE, STATE_INACTIVE, STATE_INIT_ENTER, STATE_INIT_LEAVE, STATE_TRANS_ENTER, STATE_TRANS_LEAVE, STATE_REMOVE, STATE_REMOVE_AFTER_TRANS, STATE_CANCEL_ENTER, STATE_FORCE_ACTIVE } from '../../../../src/components/nav/nav-controller-base';
import { mockNavController, mockElementRef, mockTransition } from '../../../../src/util/mock-providers';

export function run() {

describe('NavController', () => {

  describe('pop', () => {

    it('should do nothing if its the first view in the stack', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_ACTIVE;
      nav._views = [view1];

      expect(nav.length()).toBe(1);

      nav.pop();

      expect(nav.length()).toBe(1);
      expect(nav.getByIndex(0).state).toBe(STATE_ACTIVE);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
    });

  });

  describe('popToRoot', () => {

    it('should go back to root', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_INACTIVE;
      let view3 = new ViewController(Page3);
      view3.state = STATE_INACTIVE;
      let view4 = new ViewController(Page4);
      view4.state = STATE_ACTIVE;
      nav._views = [view1, view2, view3, view4];

      nav.popToRoot();
      expect(nav.length()).toBe(2);
      expect(nav.getByIndex(0).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_INIT_LEAVE);
      expect(nav.getByIndex(1).componentType).toBe(Page4);

      expect(view2.state).toBe(STATE_REMOVE);
      expect(view3.state).toBe(STATE_REMOVE);
    });

  });

  describe('popTo', () => {

    it('should go back two views', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_INACTIVE;
      let view3 = new ViewController(Page3);
      view3.state = STATE_INACTIVE;
      let view4 = new ViewController(Page4);
      view4.state = STATE_ACTIVE;
      nav._views = [view1, view2, view3, view4];

      nav.popTo(view2);

      expect(nav.length()).toBe(3);
      expect(nav.getByIndex(0).state).toBe(STATE_INACTIVE);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(1).componentType).toBe(Page2);
      expect(view3.state).toBe(STATE_REMOVE);
      expect(nav.getByIndex(2).state).toBe(STATE_INIT_LEAVE);
      expect(nav.getByIndex(2).componentType).toBe(Page4);
    });

  });

  describe('remove', () => {

    it('should create opts if passed in arg is undefined or null', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_ACTIVE;
      nav._views = [view1, view2];

      nav.remove(1, 1, null);
    });

  });

  describe('_remove', () => {

    it('should reassign activily transitioning leave that isnt getting removed, to become force active', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_TRANS_LEAVE;
      let view3 = new ViewController(Page3);
      view3.state = STATE_TRANS_ENTER;
      nav._views = [view1, view2, view3];

      nav._remove(2, 1);

      expect(nav.getByIndex(0).state).toBe(STATE_INACTIVE);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_FORCE_ACTIVE);
      expect(nav.getByIndex(1).componentType).toBe(Page2);
      expect(nav.getByIndex(2).state).toBe(STATE_REMOVE_AFTER_TRANS);
      expect(nav.getByIndex(2).componentType).toBe(Page3);
    });

    it('should reassign activily transitioning views that should be removed to STATE_REMOVE_AFTER_TRANS', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_TRANS_ENTER;
      let view3 = new ViewController(Page3);
      view3.state = STATE_TRANS_LEAVE;
      nav._views = [view1, view2, view3];

      nav._remove(1, 2);
      expect(nav.getByIndex(0).state).toBe(STATE_INACTIVE);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_REMOVE_AFTER_TRANS);
      expect(nav.getByIndex(1).componentType).toBe(Page2);
      expect(nav.getByIndex(2).state).toBe(STATE_REMOVE_AFTER_TRANS);
      expect(nav.getByIndex(2).componentType).toBe(Page3);
    });

    it('should keep same init leave, but set previous init enter to inactive', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_INIT_ENTER;
      let view3 = new ViewController(Page3);
      view3.state = STATE_INIT_LEAVE;
      nav._views = [view1, view2, view3];

      nav._remove(1, 1);
      expect(nav.length()).toBe(3);
      expect(view1.state).toBe(STATE_INIT_ENTER);
      expect(view2.state).toBe(STATE_CANCEL_ENTER);
      expect(view3.state).toBe(STATE_INIT_LEAVE);

      expect(nav.getByIndex(0).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_CANCEL_ENTER);
      expect(nav.getByIndex(1).componentType).toBe(Page2);
      expect(nav.getByIndex(2).state).toBe(STATE_INIT_LEAVE);
      expect(nav.getByIndex(2).componentType).toBe(Page3);
    });

    it('should set to pop the active and enter the previous', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_ACTIVE;
      nav._views = [view1, view2];

      nav._remove(1, 1);
      expect(view1.state).toBe(STATE_INIT_ENTER);
      expect(view2.state).toBe(STATE_INIT_LEAVE);
    });

    it('should set to remove 2 views before active one, active stays the same', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_INACTIVE;
      let view3 = new ViewController(Page3);
      view3.state = STATE_INACTIVE;
      let view4 = new ViewController(Page4);
      view4.state = STATE_INACTIVE;
      let view5 = new ViewController(Page5);
      view5.state = STATE_ACTIVE;
      nav._views = [view1, view2, view3, view4, view5];

      nav._remove(2, 2);
      expect(nav.length()).toBe(3);
      expect(view1.state).toBe(STATE_INACTIVE);
      expect(view2.state).toBe(STATE_INACTIVE);
      expect(view3.state).toBe(STATE_REMOVE);
      expect(view4.state).toBe(STATE_REMOVE);
      expect(view5.state).toBe(STATE_ACTIVE);

      expect(nav.getByIndex(0).state).toBe(STATE_INACTIVE);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_INACTIVE);
      expect(nav.getByIndex(1).componentType).toBe(Page2);
      expect(nav.getByIndex(2).state).toBe(STATE_ACTIVE);
      expect(nav.getByIndex(2).componentType).toBe(Page5);
    });

    it('should set to remove all views other than the first', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_INACTIVE;
      let view3 = new ViewController(Page3);
      view3.state = STATE_INACTIVE;
      let view4 = new ViewController(Page4);
      view4.state = STATE_ACTIVE;
      nav._views = [view1, view2, view3, view4];

      nav._remove(1, 9999);
      expect(nav.length()).toBe(2);
      expect(view1.state).toBe(STATE_INIT_ENTER);
      expect(view2.state).toBe(STATE_REMOVE);
      expect(view3.state).toBe(STATE_REMOVE);
      expect(view4.state).toBe(STATE_INIT_LEAVE);

      expect(nav.getByIndex(0).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_INIT_LEAVE);
      expect(nav.getByIndex(1).componentType).toBe(Page4);
    });

    it('should set to remove 3 views and enter the first inactive one, remove includes active one', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_INACTIVE;
      let view3 = new ViewController(Page3);
      view3.state = STATE_INACTIVE;
      let view4 = new ViewController(Page4);
      view4.state = STATE_ACTIVE;
      nav._views = [view1, view2, view3, view4];

      nav._remove(1, 3);
      expect(nav.length()).toBe(2);
      expect(view1.state).toBe(STATE_INIT_ENTER);
      expect(view2.state).toBe(STATE_REMOVE);
      expect(view3.state).toBe(STATE_REMOVE);
      expect(view4.state).toBe(STATE_INIT_LEAVE);

      expect(nav.getByIndex(0).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_INIT_LEAVE);
      expect(nav.getByIndex(1).componentType).toBe(Page4);
    });

    it('should set to remove the active and enter the previous', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_ACTIVE;
      nav._views = [view1, view2];

      nav._remove(1, 1);
      expect(view1.state).toBe(STATE_INIT_ENTER);
      expect(view2.state).toBe(STATE_INIT_LEAVE);
    });

    it('should set to remove the only view in the stack', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_ACTIVE;
      nav._views = [view1];

      nav._remove(0, 1);
      expect(nav.getByIndex(0).state).toBe(STATE_INIT_LEAVE);
    });

    it('should call willLeave/didLeave/destroy on views with STATE_REMOVE', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_INACTIVE;
      let view3 = new ViewController(Page3);
      view3.state = STATE_INACTIVE;
      let view4 = new ViewController(Page4);
      view4.state = STATE_ACTIVE;
      nav._views = [view1, view2, view3, view4];

      spyOn(view1, 'fireWillLeave');
      spyOn(view1, 'fireDidLeave');
      spyOn(view1, 'destroy');

      spyOn(view2, 'fireWillLeave');
      spyOn(view2, 'fireDidLeave');
      spyOn(view2, 'destroy');

      spyOn(view3, 'fireWillLeave');
      spyOn(view3, 'fireDidLeave');
      spyOn(view3, 'destroy');

      spyOn(view4, 'fireWillLeave');
      spyOn(view4, 'fireDidLeave');
      spyOn(view4, 'destroy');

      nav._remove(1, 3);
      expect(nav.length()).toBe(2);
      expect(view1.state).toBe(STATE_INIT_ENTER);
      expect(view2.state).toBe(STATE_REMOVE);
      expect(view3.state).toBe(STATE_REMOVE);
      expect(view4.state).toBe(STATE_INIT_LEAVE);

      expect(view1.fireWillLeave).not.toHaveBeenCalled();
      expect(view1.fireDidLeave).not.toHaveBeenCalled();
      expect(view1.destroy).not.toHaveBeenCalled();

      expect(view2.fireWillLeave).toHaveBeenCalled();
      expect(view2.fireDidLeave).toHaveBeenCalled();
      expect(view2.destroy).toHaveBeenCalled();

      expect(view3.fireWillLeave).toHaveBeenCalled();
      expect(view3.fireDidLeave).toHaveBeenCalled();
      expect(view3.destroy).toHaveBeenCalled();

      expect(view4.fireWillLeave).not.toHaveBeenCalled();
      expect(view4.fireDidLeave).not.toHaveBeenCalled();
      expect(view4.destroy).not.toHaveBeenCalled();
    });
  });

  describe('_cleanup', () => {
    it('should destroy views that are inactive after the active view', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_ACTIVE;
      let view3 = new ViewController(Page3);
      view3.state = STATE_INACTIVE;
      let view4 = new ViewController(Page4);
      view4.state = STATE_TRANS_ENTER;
      let view5 = new ViewController(Page5);
      view5.state = STATE_INACTIVE;
      nav._views = [view1, view2, view3, view4, view5];
      nav._cleanup();

      expect(nav.length()).toBe(3);
      expect(nav.getByIndex(0).state).toBe(STATE_INACTIVE);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_ACTIVE);
      expect(nav.getByIndex(1).componentType).toBe(Page2);
      expect(nav.getByIndex(2).state).toBe(STATE_TRANS_ENTER);
      expect(nav.getByIndex(2).componentType).toBe(Page4);
    });

    it('should not destroy any views since the last is active', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_ACTIVE;
      nav._views = [view1, view2];
      nav._cleanup();
      expect(nav.length()).toBe(2);
    });

    it('should call destroy for each view to be destroyed', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_ACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_INACTIVE;
      let view3 = new ViewController(Page3);
      view3.state = STATE_INACTIVE;
      nav._views = [view1, view2, view3];

      spyOn(view1, 'destroy');
      spyOn(view2, 'destroy');
      spyOn(view3, 'destroy');

      nav._cleanup();

      expect(nav.length()).toBe(1);
      expect(view1.destroy).not.toHaveBeenCalled();
      expect(view2.destroy).toHaveBeenCalled();
      expect(view3.destroy).toHaveBeenCalled();
    });

    it('should reset zIndexes if their is a negative zindex', () => {
      let view1 = new ViewController(Page1);
      view1.setPageRef( mockElementRef() );
      view1.state = STATE_INACTIVE;
      view1.zIndex = -1;

      let view2 = new ViewController(Page2);
      view2.setPageRef( mockElementRef() );
      view2.state = STATE_INACTIVE;
      view2.zIndex = 0;

      let view3 = new ViewController(Page3);
      view3.setPageRef( mockElementRef() );
      view3.state = STATE_ACTIVE;
      view3.zIndex = 1;

      nav._views = [view1, view2, view3];
      nav._cleanup();

      expect(view1.zIndex).toEqual(100);
      expect(view2.zIndex).toEqual(101);
      expect(view3.zIndex).toEqual(102);
    });
  });

  describe('_postRender', () => {
    it('should immediately call done when enteringView state is inactive', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      var wasCalled = false;
      var done = () => {
        wasCalled = true;
      };
      nav._beforeTrans = () => {}; // prevent running beforeTrans for tests

      nav._postRender(1, view1, null, false, null, done);

      expect(wasCalled).toBe(true);
    });

    it('should call willEnter on entering view', () => {
      let enteringView = new ViewController(Page1);
      let leavingView = new ViewController(Page2);
      var navOptions: NavOptions = {};
      var done = () => {};
      nav._beforeTrans = () => {}; // prevent running beforeTrans for tests

      spyOn(enteringView, 'fireWillEnter');

      nav._postRender(1, enteringView, leavingView, false, navOptions, done);

      expect(enteringView.fireWillEnter).toHaveBeenCalled();
    });

    it('should not call willEnter on entering view when it is being preloaded', () => {
      let enteringView = new ViewController(Page1);
      let leavingView = new ViewController(Page2);
      var navOptions: NavOptions = {
        preload: true
      };
      var done = () => {};
      nav._beforeTrans = () => {}; // prevent running beforeTrans for tests

      spyOn(enteringView, 'fireWillEnter');

      nav._postRender(1, enteringView, leavingView, false, navOptions, done);

      expect(enteringView.fireWillEnter).not.toHaveBeenCalled();
    });

    it('should call willLeave on leaving view', () => {
      let enteringView = new ViewController(Page1);
      let leavingView = new ViewController(Page2);
      var navOptions: NavOptions = {};
      var done = () => {};
      nav._beforeTrans = () => {}; // prevent running beforeTrans for tests

      spyOn(leavingView, 'fireWillLeave');

      nav._postRender(1, enteringView, leavingView, false, navOptions, done);

      expect(leavingView.fireWillLeave).toHaveBeenCalled();
    });

    it('should not call willEnter when the leaving view has fireOtherLifecycles not true', () => {
      let enteringView = new ViewController(Page1);
      let leavingView = new ViewController(Page2);
      var navOptions: NavOptions = {};
      var done = () => {};
      nav._beforeTrans = () => {}; // prevent running beforeTrans for tests

      spyOn(enteringView, 'fireWillEnter');
      spyOn(leavingView, 'fireWillLeave');

      leavingView.fireOtherLifecycles = false;

      nav._postRender(1, enteringView, leavingView, false, navOptions, done);

      expect(enteringView.fireWillEnter).not.toHaveBeenCalled();
      expect(leavingView.fireWillLeave).toHaveBeenCalled();
    });

    it('should not call willLeave when the entering view has fireOtherLifecycles not true', () => {
      let enteringView = new ViewController(Page1);
      let leavingView = new ViewController(Page2);
      var navOptions: NavOptions = {};
      var done = () => {};
      nav._beforeTrans = () => {}; // prevent running beforeTrans for tests

      spyOn(enteringView, 'fireWillEnter');
      spyOn(leavingView, 'fireWillLeave');

      enteringView.fireOtherLifecycles = false;

      nav._postRender(1, enteringView, leavingView, false, navOptions, done);

      expect(enteringView.fireWillEnter).toHaveBeenCalled();
      expect(leavingView.fireWillLeave).not.toHaveBeenCalled();
    });

    it('should not call willLeave on leaving view when it is being preloaded', () => {
      let enteringView = new ViewController(Page1);
      let leavingView = new ViewController(Page2);
      var navOptions: NavOptions = {
        preload: true
      };
      var done = () => {};
      nav._beforeTrans = () => {}; // prevent running beforeTrans for tests

      spyOn(leavingView, 'fireWillLeave');

      nav._postRender(1, enteringView, leavingView, false, navOptions, done);

      expect(leavingView.fireWillLeave).not.toHaveBeenCalled();
    });

    it('should set animate false when preloading', () => {
      let enteringView = new ViewController(Page1);
      let leavingView = new ViewController(Page2);
      var navOptions: NavOptions = {
        preload: true
      };
      var done = () => {};
      nav._beforeTrans = () => {}; // prevent running beforeTrans for tests

      nav._postRender(1, enteringView, leavingView, false, navOptions, done);

      expect(navOptions.animate).toBe(false);
    });

    it('should set domShow true when isAlreadyTransitioning', () => {
      let enteringView = new ViewController(Page1);
      let leavingView = new ViewController(Page2);
      let isAlreadyTransitioning = true;
      var navOptions: NavOptions = {};
      var done = () => {};
      nav._beforeTrans = () => {}; // prevent running beforeTrans for tests
      nav._renderer = null;

      spyOn(enteringView, 'domShow');
      spyOn(leavingView, 'domShow');

      nav._postRender(1, enteringView, leavingView, isAlreadyTransitioning, navOptions, done);

      expect(enteringView.domShow).toHaveBeenCalledWith(true, nav._renderer);
      expect(leavingView.domShow).toHaveBeenCalledWith(true, nav._renderer);
    });

    it('should set domShow true when isAlreadyTransitioning false for the entering/leaving views', () => {
      let view1 = new ViewController(Page1);
      let view2 = new ViewController(Page2);
      let view3 = new ViewController(Page3);
      let isAlreadyTransitioning = false;
      var navOptions: NavOptions = {};
      var done = () => {};
      nav._beforeTrans = () => {}; // prevent running beforeTrans for tests
      nav._renderer = null;
      nav._views = [view1, view2, view3];

      spyOn(view1, 'domShow');
      spyOn(view2, 'domShow');
      spyOn(view3, 'domShow');

      nav._postRender(1, view3, view2, isAlreadyTransitioning, navOptions, done);

      expect(view1.domShow).toHaveBeenCalledWith(false, nav._renderer);
      expect(view2.domShow).toHaveBeenCalledWith(true, nav._renderer);
      expect(view3.domShow).toHaveBeenCalledWith(true, nav._renderer);
    });

    it('should set domShow true when isAlreadyTransitioning false for views when nav is a portal', () => {
      let view1 = new ViewController(Page1);
      let view2 = new ViewController(Page2);
      let view3 = new ViewController(Page3);
      let view4 = new ViewController(Page4);
      let isAlreadyTransitioning = false;
      var navOptions: NavOptions = {};
      var done = () => {};
      nav._beforeTrans = () => {}; // prevent running beforeTrans for tests
      nav._renderer = null;
      nav._views = [view1, view2, view3, view4];

      nav._isPortal = true;

      spyOn(view1, 'domShow');
      spyOn(view2, 'domShow');
      spyOn(view3, 'domShow');
      spyOn(view4, 'domShow');

      nav._postRender(1, view4, view3, isAlreadyTransitioning, navOptions, done);

      expect(view1.domShow).toHaveBeenCalledWith(true, nav._renderer);
      expect(view2.domShow).toHaveBeenCalledWith(true, nav._renderer);
      expect(view3.domShow).toHaveBeenCalledWith(true, nav._renderer);
      expect(view4.domShow).toHaveBeenCalledWith(true, nav._renderer);
    });

  });

  describe('_setZIndex', () => {

    it('should set zIndex off of the previous view to the entering view is loaded and the leavingView is not loaded', () => {
      let leavingView = new ViewController();
      leavingView.zIndex = 100;
      leavingView.fireLoaded();
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());

      nav._views = [leavingView, enteringView];

      nav._setZIndex(enteringView, leavingView, 'forward');
      expect(enteringView.zIndex).toEqual(101);
    });

    it('should set zIndex 100 when leaving view is not loaded', () => {
      let leavingView = new ViewController();
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());

      nav._views = [leavingView, enteringView];

      nav._setZIndex(enteringView, leavingView, 'forward');
      expect(enteringView.zIndex).toEqual(100);
    });

    it('should set zIndex 100 on first entering view', () => {
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());
      nav._setZIndex(enteringView, null, 'forward');
      expect(enteringView.zIndex).toEqual(100);
    });

    it('should set zIndex 1 on second entering view', () => {
      let leavingView = new ViewController();
      leavingView.zIndex = 0;
      leavingView.fireLoaded();
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());
      nav._setZIndex(enteringView, leavingView, 'forward');
      expect(enteringView.zIndex).toEqual(1);
    });

    it('should set zIndex 0 on entering view going back', () => {
      let leavingView = new ViewController();
      leavingView.zIndex = 1;
      leavingView.fireLoaded();
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());
      nav._setZIndex(enteringView, leavingView, 'back');
      expect(enteringView.zIndex).toEqual(0);
    });

    it('should set zIndex 9999 on first entering portal view', () => {
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());
      nav._isPortal = true;
      nav._setZIndex(enteringView, null, 'forward');
      expect(enteringView.zIndex).toEqual(9999);
    });

    it('should set zIndex 10000 on second entering portal view', () => {
      let leavingView = new ViewController();
      leavingView.zIndex = 9999;
      leavingView.fireLoaded();
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());
      nav._isPortal = true;
      nav._setZIndex(enteringView, leavingView, 'forward');
      expect(enteringView.zIndex).toEqual(10000);
    });

    it('should set zIndex 9999 on entering portal view going back', () => {
      let leavingView = new ViewController();
      leavingView.zIndex = 10000;
      leavingView.fireLoaded();
      let enteringView = new ViewController();
      enteringView.setPageRef(mockElementRef());
      nav._isPortal = true;
      nav._setZIndex(enteringView, leavingView, 'back');
      expect(enteringView.zIndex).toEqual(9999);
    });

  });

  describe('_setAnimate', () => {

    it('should be unchanged when the nav is a portal', () => {
      nav._views = [new ViewController()];
      nav._init = false;
      nav._isPortal = true;
      let opts: NavOptions = {};
      nav._setAnimate(opts);
      expect(opts.animate).toBeUndefined();
    });

    it('should not animate when theres only 1 view, and nav hasnt initialized yet', () => {
      nav._views = [new ViewController()];
      nav._init = false;
      let opts: NavOptions = {};
      nav._setAnimate(opts);
      expect(opts.animate).toEqual(false);
    });

    it('should be unchanged when theres only 1 view, and nav has already initialized', () => {
      nav._views = [new ViewController()];
      nav._init = true;
      let opts: NavOptions = {};
      nav._setAnimate(opts);
      expect(opts.animate).toBeUndefined();
    });

    it('should not animate with config animate = false, and has initialized', () => {
      nav.config.set('animate', false);
      nav._init = true;
      let opts: NavOptions = {};
      nav._setAnimate(opts);
      expect(opts.animate).toEqual(false);
    });

    it('should not animate with config animate = false, and has not initialized', () => {
      nav.config.set('animate', false);
      nav._init = false;
      let opts: NavOptions = {};
      nav._setAnimate(opts);
      expect(opts.animate).toEqual(false);
    });

  });

  describe('_afterTrans', () => {

    it('should call didEnter/didLeave', () => {
      let enteringView = new ViewController();
      let leavingView = new ViewController();
      let navOpts: NavOptions = {};
      let hasCompleted = true;
      let doneCalled = false;
      let done = () => {doneCalled = true; };

      spyOn(enteringView, 'fireDidEnter');
      spyOn(leavingView, 'fireDidLeave');

      nav._init = true;
      nav._afterTrans(enteringView, leavingView, navOpts, hasCompleted, done);

      expect(enteringView.fireDidEnter).toHaveBeenCalled();
      expect(leavingView.fireDidLeave).toHaveBeenCalled();
      expect(doneCalled).toBe(true);
    });

    it('should not call didEnter/didLeave when preloaded', () => {
      let enteringView = new ViewController();
      let leavingView = new ViewController();
      let navOpts: NavOptions = {
        preload: true
      };
      let hasCompleted = true;
      let doneCalled = false;
      let done = () => {doneCalled = true; };

      spyOn(enteringView, 'fireDidEnter');
      spyOn(leavingView, 'fireDidLeave');

      nav._init = true;
      nav._afterTrans(enteringView, leavingView, navOpts, hasCompleted, done);

      expect(enteringView.fireDidEnter).not.toHaveBeenCalled();
      expect(leavingView.fireDidLeave).not.toHaveBeenCalled();
      expect(doneCalled).toBe(true);
    });

    it('should not call didLeave when enteringView set fireOtherLifecycles to false', () => {
      let enteringView = new ViewController();
      let leavingView = new ViewController();
      let navOpts: NavOptions = {};
      let hasCompleted = true;
      let doneCalled = false;
      let done = () => {doneCalled = true; };

      enteringView.fireOtherLifecycles = false;

      spyOn(enteringView, 'fireDidEnter');
      spyOn(leavingView, 'fireDidLeave');

      nav._afterTrans(enteringView, leavingView, navOpts, hasCompleted, done);

      expect(enteringView.fireDidEnter).toHaveBeenCalled();
      expect(leavingView.fireDidLeave).not.toHaveBeenCalled();
      expect(doneCalled).toBe(true);
    });

    it('should not call didEnter when leavingView set fireOtherLifecycles to false', () => {
      let enteringView = new ViewController();
      let leavingView = new ViewController();
      let navOpts: NavOptions = {};
      let hasCompleted = true;
      let doneCalled = false;
      let done = () => {doneCalled = true; };

      leavingView.fireOtherLifecycles = false;

      spyOn(enteringView, 'fireDidEnter');
      spyOn(leavingView, 'fireDidLeave');

      nav._init = true;
      nav._afterTrans(enteringView, leavingView, navOpts, hasCompleted, done);

      expect(enteringView.fireDidEnter).not.toHaveBeenCalled();
      expect(leavingView.fireDidLeave).toHaveBeenCalled();
      expect(doneCalled).toBe(true);
    });

    it('should not call didEnter/didLeave when not hasCompleted', () => {
      let enteringView = new ViewController();
      let leavingView = new ViewController();
      let navOpts: NavOptions = {};
      let hasCompleted = false;
      let doneCalled = false;
      let done = () => {doneCalled = true; };

      spyOn(enteringView, 'fireDidEnter');
      spyOn(leavingView, 'fireDidLeave');

      nav._afterTrans(enteringView, leavingView, navOpts, hasCompleted, done);

      expect(enteringView.fireDidEnter).not.toHaveBeenCalled();
      expect(leavingView.fireDidLeave).not.toHaveBeenCalled();
      expect(doneCalled).toBe(true);
    });

  });

  describe('_transFinish', () => {

    it('should remove entering view if it was already set to cancel', () => {
      let enteringView = new ViewController(Page1);
      let leavingView = new ViewController(Page2);
      enteringView.state = STATE_CANCEL_ENTER;
      let direction = 'foward';
      let updateUrl = false;
      let hasCompleted = true;

      spyOn(nav, 'remove');

      nav._transFinish(1, enteringView, leavingView, direction, updateUrl, hasCompleted);

      expect(nav.remove).toHaveBeenCalled();
      expect(enteringView.state).toBe(STATE_CANCEL_ENTER);
    });

    it('should not entering/leaving state, after transition that isnt the most recent, and state already changed', () => {
      let enteringView = new ViewController(Page1);
      enteringView.state = 234234;
      let leavingView = new ViewController(Page2);
      leavingView.state = 234234;
      let direction = 'foward';
      let updateUrl = false;
      let hasCompleted = true;

      nav._transIds = 2;

      nav._transFinish(1, enteringView, leavingView, direction, updateUrl, hasCompleted);

      expect(enteringView.state).toBe(234234);
      expect(leavingView.state).toBe(234234);
    });

    it('should set entering/leaving to inactive, after transition that isnt the most recent', () => {
      let enteringView = new ViewController(Page1);
      enteringView.state = STATE_TRANS_ENTER;
      let leavingView = new ViewController(Page2);
      leavingView.state = STATE_TRANS_LEAVE;
      let direction = 'foward';
      let updateUrl = false;
      let hasCompleted = true;

      nav._transIds = 2;

      nav._transFinish(1, enteringView, leavingView, direction, updateUrl, hasCompleted);

      expect(enteringView.state).toBe(STATE_INACTIVE);
      expect(leavingView.state).toBe(STATE_INACTIVE);
    });

    it('should set entering active, leaving inactive, after transition', () => {
      let enteringView = new ViewController(Page1);
      enteringView.state = STATE_TRANS_ENTER;
      let leavingView = new ViewController(Page2);
      leavingView.state = STATE_TRANS_LEAVE;
      let direction = 'foward';
      let updateUrl = false;
      let hasCompleted = true;

      nav._transIds = 1;

      nav._transFinish(1, enteringView, leavingView, direction, updateUrl, hasCompleted);

      expect(enteringView.state).toBe(STATE_ACTIVE);
      expect(leavingView.state).toBe(STATE_INACTIVE);
    });

    it('should set entering inactive, leaving active, after transition has not completed', () => {
      let enteringView = new ViewController(Page1);
      enteringView.state = STATE_TRANS_ENTER;
      let leavingView = new ViewController(Page2);
      leavingView.state = STATE_TRANS_LEAVE;
      let direction = 'back';
      let updateUrl = false;
      let hasCompleted = false;

      nav._transIds = 1;

      nav._transFinish(1, enteringView, leavingView, direction, updateUrl, hasCompleted);

      expect(enteringView.state).toBe(STATE_INACTIVE);
      expect(leavingView.state).toBe(STATE_ACTIVE);
    });

    it('should run cleanup when most recent transition and has completed', () => {
      let enteringView = new ViewController(Page1);
      enteringView.state = STATE_TRANS_ENTER;
      let leavingView = new ViewController(Page2);
      leavingView.state = STATE_TRANS_LEAVE;
      let direction = 'back';
      let updateUrl = false;
      let hasCompleted = true;

      spyOn(nav, '_cleanup');

      nav._transIds = 1;

      nav._transFinish(1, enteringView, leavingView, direction, updateUrl, hasCompleted);

      expect(nav._cleanup).toHaveBeenCalled();
    });

    it('should not run cleanup when most not recent transition', () => {
      let enteringView = new ViewController(Page1);
      enteringView.state = STATE_TRANS_ENTER;
      let leavingView = new ViewController(Page2);
      leavingView.state = STATE_TRANS_LEAVE;
      let direction = 'back';
      let updateUrl = false;
      let hasCompleted = true;

      spyOn(nav, '_cleanup');

      nav._transIds = 1;

      nav._transFinish(2, enteringView, leavingView, direction, updateUrl, hasCompleted);

      expect(nav._cleanup).not.toHaveBeenCalled();
    });

    it('should not run cleanup when it hasnt completed transition, but is the most recent', () => {
      let enteringView = new ViewController(Page1);
      enteringView.state = STATE_TRANS_ENTER;
      let leavingView = new ViewController(Page2);
      leavingView.state = STATE_TRANS_LEAVE;
      let direction = 'back';
      let updateUrl = false;
      let hasCompleted = false;

      spyOn(nav, '_cleanup');

      nav._transIds = 1;

      nav._transFinish(1, enteringView, leavingView, direction, updateUrl, hasCompleted);

      expect(nav._cleanup).not.toHaveBeenCalled();
    });

    it('should set transitioning is over when most recent transition finishes', () => {
      let enteringView = new ViewController(Page1);
      enteringView.state = STATE_TRANS_ENTER;
      let leavingView = new ViewController(Page2);
      leavingView.state = STATE_TRANS_LEAVE;
      let direction = 'back';
      let updateUrl = false;
      let hasCompleted = true;

      spyOn(nav, 'setTransitioning');

      nav._transIds = 1;

      nav._transFinish(1, enteringView, leavingView, direction, updateUrl, hasCompleted);

      expect(nav.setTransitioning).toHaveBeenCalledWith(false);
    });

    it('should set transitioning is not over if its not the most recent transition', () => {
      let enteringView = new ViewController(Page1);
      enteringView.state = STATE_TRANS_ENTER;
      let leavingView = new ViewController(Page2);
      leavingView.state = STATE_TRANS_LEAVE;
      let direction = 'back';
      let updateUrl = false;
      let hasCompleted = true;

      spyOn(nav, 'setTransitioning');

      nav._transIds = 2;

      nav._transFinish(1, enteringView, leavingView, direction, updateUrl, hasCompleted);

      expect(nav.setTransitioning).not.toHaveBeenCalled();
    });

    it('should re-enable the app when transition time <= 0', () => {
      // arrange
      let enteringView = new ViewController(Page1);
      enteringView.state = 234234;
      let leavingView = new ViewController(Page2);
      leavingView.state = 234234;
      nav._transIds = 1;

      let direction = 'forward';
      let updateUrl = false;
      let hasCompleted = true;

      spyOn(nav._app, 'setEnabled');
      spyOn(nav, 'setTransitioning');

      // act
      nav._transFinish(nav._transIds, enteringView, leavingView, direction, updateUrl, hasCompleted);

      // assert
      expect(nav._app.setEnabled).toHaveBeenCalledWith(true);
      expect(nav.setTransitioning).toHaveBeenCalledWith(false);
    });

    it('should not re-enable app when transition time > 0', () => {
      // arrange
      let enteringView = new ViewController(Page1);
      enteringView.state = 235234;
      let leavingView = new ViewController(Page2);
      leavingView.state = 235234;
      nav._transIds = 1;

      let direction = 'forward';
      let updateUrl = false;
      let hasCompleted = true;

      spyOn(nav._app, 'setEnabled');
      spyOn(nav, 'setTransitioning');

      nav.getLongestTrans = () => { return 50; };

      // act
      nav._transFinish(nav._transIds, enteringView, leavingView, direction, updateUrl, hasCompleted);

      // assert
      expect(nav._app.setEnabled).not.toHaveBeenCalled();
      expect(nav.setTransitioning).toHaveBeenCalledWith(false);
    });

  });

  describe('_insert', () => {

    it('should push page when previous transition is still actively transitioning', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_TRANS_ENTER;
      let view2 = new ViewController(Page2);
      view2.state = STATE_TRANS_LEAVE;
      nav._views = [view1, view2];

      let view3 = new ViewController(Page3);
      nav._insert(-1, [view3]);

      expect(nav.getByIndex(0).state).toBe(STATE_TRANS_ENTER);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_TRANS_LEAVE);
      expect(nav.getByIndex(1).componentType).toBe(Page2);
      expect(nav.getByIndex(2).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(2).componentType).toBe(Page3);
    });

    it('should push page when previous transition views init, but havent transitioned yet', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INIT_LEAVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_INIT_ENTER;
      nav._views = [view1, view2];

      let view3 = new ViewController(Page3);
      nav._insert(-1, [view3]);

      expect(nav.getByIndex(0).state).toBe(STATE_INIT_LEAVE);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_INACTIVE);
      expect(nav.getByIndex(1).componentType).toBe(Page2);
      expect(nav.getByIndex(2).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(2).componentType).toBe(Page3);
    });

    it('should insert multiple pages, back to back, with a starting active page', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_ACTIVE;
      nav._views = [view1];

      let view2 = new ViewController(Page2);
      nav._insert(-1, [view2]);

      expect(nav.getByIndex(0).state).toBe(STATE_INIT_LEAVE);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(1).componentType).toBe(Page2);

      let view3 = new ViewController(Page3);
      nav._insert(-1, [view3]);

      expect(nav.getByIndex(0).state).toBe(STATE_INIT_LEAVE);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_INACTIVE);
      expect(nav.getByIndex(1).componentType).toBe(Page2);
      expect(nav.getByIndex(2).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(2).componentType).toBe(Page3);
    });

    it('should insert multiple pages, back to back, no starting active page', () => {
      let view1 = new ViewController(Page1);
      nav._insert(-1, [view1]);
      expect(nav.getByIndex(0).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(0).componentType).toBe(Page1);

      let view2 = new ViewController(Page2);
      nav._insert(-1, [view2]);

      expect(nav.getByIndex(0).state).toBe(STATE_INACTIVE);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(1).componentType).toBe(Page2);

      let view3 = new ViewController(Page3);
      nav._insert(1, [view3]);

      expect(nav.getByIndex(0).state).toBe(STATE_INACTIVE);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(1).componentType).toBe(Page3);
      expect(nav.getByIndex(2).state).toBe(STATE_INACTIVE);
      expect(nav.getByIndex(2).componentType).toBe(Page2);
    });

    it('should push a page, and abort previous init', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INIT_LEAVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_INIT_ENTER;
      nav._views = [view1, view2];

      let view3 = new ViewController(Page3);
      nav._insert(-1, [view3]);
      expect(nav.length()).toBe(3);

      expect(nav.getByIndex(0).state).toBe(STATE_INIT_LEAVE);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_INACTIVE);
      expect(nav.getByIndex(1).componentType).toBe(Page2);
      expect(nav.getByIndex(2).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(2).componentType).toBe(Page3);
    });

    it('should insert a page between the first and second', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;
      let view2 = new ViewController(Page2);
      view2.state = STATE_ACTIVE;
      nav._views = [view1, view2];

      let view3 = new ViewController(Page3);
      nav._insert(1, [view3]);
      expect(nav.length()).toBe(3);

      expect(nav.getByIndex(0).state).toBe(STATE_INACTIVE);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(1).componentType).toBe(Page3);
      expect(nav.getByIndex(2).state).toBe(STATE_INIT_LEAVE);
      expect(nav.getByIndex(2).componentType).toBe(Page2);
    });

    it('should insert a page before the first', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_ACTIVE;
      nav._views = [view1];

      let view2 = new ViewController(Page2);
      nav._insert(0, [view2]);
      expect(nav.getByIndex(0).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(0).componentType).toBe(Page2);
      expect(nav.getByIndex(1).state).toBe(STATE_INIT_LEAVE);
      expect(nav.getByIndex(1).componentType).toBe(Page1);
    });

    it('should insert 3 pages', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_ACTIVE;
      nav._views = [view1];

      let insertViews = [
        new ViewController(Page2),
        new ViewController(Page3),
        new ViewController(Page4)
      ];
      nav._insert(-1, insertViews);
      expect(nav.length()).toBe(4);
      expect(nav.getByIndex(0).state).toBe(STATE_INIT_LEAVE);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_INACTIVE);
      expect(nav.getByIndex(1).componentType).toBe(Page2);
      expect(nav.getByIndex(2).state).toBe(STATE_INACTIVE);
      expect(nav.getByIndex(2).componentType).toBe(Page3);
      expect(nav.getByIndex(3).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(3).componentType).toBe(Page4);
    });

    it('should push the second page', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_ACTIVE;
      nav._views = [view1];

      let view2 = new ViewController(Page2);
      nav._insert(-1, [view2]);
      expect(nav.length()).toBe(2);
      expect(nav.getByIndex(0).state).toBe(STATE_INIT_LEAVE);
      expect(nav.getByIndex(0).componentType).toBe(Page1);
      expect(nav.getByIndex(1).state).toBe(STATE_INIT_ENTER);
      expect(nav.getByIndex(1).componentType).toBe(Page2);
    });

    it('should push the first page, using a number greater than the length', () => {
      let view1 = new ViewController(Page1);
      nav._insert(8675309, [view1]);

      expect(nav.length()).toBe(1);
      expect(nav.getByIndex(0).state).toBe(STATE_INIT_ENTER);
    });

    it('should push the first page, using -1', () => {
      let view1 = new ViewController(Page1);
      nav._insert(-1, [view1]);

      expect(nav.getByIndex(0).id).toBeDefined();
      expect(nav.length()).toBe(1);
      expect(nav.getByIndex(0).state).toBe(STATE_INIT_ENTER);
    });

  });

  describe('getActive', () => {
    it('should getActive()', () => {
      expect(nav.getActive()).toBe(null);
      let view1 = new ViewController(Page1);
      view1.state = STATE_INIT_ENTER;
      nav._views = [view1];
      expect(nav.getActive()).toBe(null);
      view1.state = STATE_ACTIVE;
      expect(nav.getActive()).toBe(view1);
    });
  });

  describe('getByState', () => {
    it('should getByState()', () => {
      expect(nav.getByState(null)).toBe(null);

      let view1 = new ViewController(Page1);
      view1.state = STATE_INIT_ENTER;
      let view2 = new ViewController(Page2);
      view2.state = STATE_INIT_ENTER;
      nav._views = [view1, view2];

      expect(nav.getByState(8675309)).toBe(null);
      expect(nav.getByState(STATE_INIT_ENTER)).toBe(view2);

      view2.state = STATE_INACTIVE;
      expect(nav.getByState(STATE_INIT_ENTER)).toBe(view1);

      view2.state = STATE_ACTIVE;
      expect(nav.getActive()).toBe(view2);
    });
  });

  describe('getPrevious', () => {
    it('should getPrevious()', () => {
      expect(nav.getPrevious(null)).toBe(null);

      let view1 = new ViewController(Page1);
      let view2 = new ViewController(Page2);
      nav._views = [view1, view2];

      expect(nav.getPrevious(view1)).toBe(null);
      expect(nav.getPrevious(view2)).toBe(view1);
    });
  });

  describe('first', () => {
    it('should get first()', () => {
      expect(nav.first()).toBe(null);
      let view1 = new ViewController(Page1);
      view1.setNav(nav);
      let view2 = new ViewController(Page2);
      view2.setNav(nav);
      nav._views = [view1];

      expect(nav.first()).toBe(view1);
      expect(view1.isFirst()).toBe(true);

      nav._views = [view1, view2];
      expect(nav.first()).toBe(view1);
      expect(view1.isFirst()).toBe(true);
      expect(view2.isFirst()).toBe(false);
    });
  });

  describe('last', () => {
    it('should get last()', () => {
      expect(nav.last()).toBe(null);
      let view1 = new ViewController(Page1);
      view1.setNav(nav);
      let view2 = new ViewController(Page2);
      view2.setNav(nav);
      nav._views = [view1];

      expect(nav.last()).toBe(view1);
      expect(view1.isLast()).toBe(true);

      nav._views = [view1, view2];
      expect(nav.last()).toBe(view2);
      expect(view1.isLast()).toBe(false);
      expect(view2.isLast()).toBe(true);
    });
  });

  describe('indexOf', () => {
    it('should get indexOf()', () => {
      let view1 = new ViewController(Page1);
      let view2 = new ViewController(Page2);

      expect(nav.length()).toBe(0);
      expect(nav.indexOf(view1)).toBe(-1);

      nav._views = [view1, view2];
      expect(nav.indexOf(view1)).toBe(0);
      expect(nav.indexOf(view2)).toBe(1);
      expect(nav.length()).toBe(2);
    });
  });

  describe('getByIndex', () => {
    it('should get getByIndex()', () => {
      expect(nav.getByIndex(-99)).toBe(null);
      expect(nav.getByIndex(99)).toBe(null);

      let view1 = new ViewController(Page1);
      let view2 = new ViewController(Page2);
      nav._views = [view1, view2];

      expect(nav.getByIndex(-1)).toBe(null);
      expect(nav.getByIndex(0)).toBe(view1);
      expect(nav.getByIndex(1)).toBe(view2);
      expect(nav.getByIndex(2)).toBe(null);
    });
  });

  /* private method */
  describe('_beforeTrans', () => {

    it('shouldnt disable app on short transition', () => {
      // arrange
      let executeAssertions = () => {
        // assertions triggerd by callbacks
        expect(nav._app.setEnabled).toHaveBeenCalledWith(true, 50);
        expect(nav.setTransitioning).toHaveBeenCalledWith(false, 50);
      };
      nav._createTrans = mockTransition(executeAssertions, 50);

      spyOn(nav._app, 'setEnabled');
      spyOn(nav, 'setTransitioning');

      let view1 = new ViewController(Page1);
      let view2 = new ViewController(Page2);

      // act
      nav._beforeTrans(view1, view2, {}, () => {});
    });

    it('should disable app on longer transition', () => {
      // arrange
      let executeAssertions = () => {
        // assertions triggerd by callbacks
        expect(nav._app.setEnabled).toHaveBeenCalledWith(false, 200);
        expect(nav.setTransitioning).toHaveBeenCalledWith(true, 200);
      };

      nav._createTrans = mockTransition(executeAssertions, 200);

      spyOn(nav._app, 'setEnabled');
      spyOn(nav, 'setTransitioning');

      let view1 = new ViewController(Page1);
      let view2 = new ViewController(Page2);

      // act
      nav._beforeTrans(view1, view2, {}, () => {});
    });

    it('should disable app w/ padding when keyboard is open', () => {
      // arrange
      let executeAssertions = () => {
        // assertions triggerd by callbacks
        expect(nav._app.setEnabled.calls.mostRecent().args[0]).toEqual(false);
        expect(nav._app.setEnabled.calls.mostRecent().args[1]).toBeGreaterThan(200);

        expect(nav.setTransitioning.calls.mostRecent().args[0]).toEqual(true);
        expect(nav.setTransitioning.calls.mostRecent().args[1]).toBeGreaterThan(200);
      };

      nav._createTrans = mockTransition(executeAssertions, 200);

      nav._keyboard.isOpen = () => true;

      spyOn(nav._app, 'setEnabled');
      spyOn(nav, 'setTransitioning');

      let view1 = new ViewController(Page1);
      let view2 = new ViewController(Page2);

      // act
      nav._beforeTrans(view1, view2, {}, () => {});
    });

    it('shouldnt update app enabled when parent transition is occurring', () => {
      // arrange
      let executeAssertions = () => {
        // assertions triggerd by callbacks
        expect(nav._app.setEnabled).not.toHaveBeenCalled();
        expect(nav.setTransitioning.calls.mostRecent().args[0]).toEqual(true);
      };

      nav._createTrans = mockTransition(executeAssertions, 200);

      spyOn(nav._app, 'setEnabled');
      spyOn(nav, 'setTransitioning');

      nav.getLongestTrans = () => { return Date.now() + 100; };

      let view1 = new ViewController(Page1);
      let view2 = new ViewController(Page2);

      // act
      nav._beforeTrans(view1, view2, {}, () => {});
    });

    it('should not begin transition when entering stated is inactive', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_INACTIVE;

      let wasDoneCalled = false;
      let done = () => {
        wasDoneCalled = true;
      };

      nav._beforeTrans(view1, null, {}, done);

      expect(wasDoneCalled).toEqual(true);
      expect(view1.state).toEqual(STATE_INACTIVE);
    });

    it('should not begin transition when entering state is canceled', () => {
      let view1 = new ViewController(Page1);
      view1.state = STATE_CANCEL_ENTER;

      let wasDoneCalled = false;
      let done = () => {
        wasDoneCalled = true;
      };

      nav._beforeTrans(view1, null, {}, done);

      expect(wasDoneCalled).toEqual(true);
      expect(view1.state).toEqual(STATE_CANCEL_ENTER);
    });
  });

  /* private method */
  describe('getLongestTrans', () => {
    it('should return 0 when transition end time is less than 0', () => {
      // arrange
      nav.parent = null;
      // act
      let returnedValue = nav.getLongestTrans(Date.now());
      // asssert
      expect(returnedValue).toEqual(0);
    });

    it('should return 0 when transition end time is less than now', () => {
      // arrange
      nav.parent = {
        trnsTime: Date.now() - 5
      };
      // act
      let returnedValue = nav.getLongestTrans(Date.now());
      // asssert
      expect(returnedValue).toEqual(0);
    });

    it('should return 0 when parent transition time not set', () => {
      // arrange
      nav.parent = {
        trnsTime: undefined
      };
      // act
      let returnedValue = nav.getLongestTrans(Date.now());
      // asssert
      expect(returnedValue).toEqual(0);
    });

    it('should return transitionEndTime when transition end time is greater than now', () => {
      // arrange
      let expectedReturnValue = Date.now() + 100;
      nav.parent = {
        trnsTime: expectedReturnValue
      };
      // act
      let returnedValue = nav.getLongestTrans(Date.now());
      // asssert
      expect(returnedValue).toEqual(expectedReturnValue);
    });

    it('should return the greatest end of transition time if found on first parent', () => {
      // arrange
      let expectedReturnValue = Date.now() + 100;
      let firstParent: any = {
        trnsTime: expectedReturnValue
      };
      let secondParent: any = {
        trnsTime: Date.now() + 50
      };
      let thirdParent: any = {
        trnsTime: Date.now()
      };
      let fourthParent: any = {
        trnsTime: Date.now() + 20
      };
      firstParent.parent = secondParent;
      secondParent.parent = thirdParent;
      thirdParent.parent = fourthParent;
      nav.parent = firstParent;
      // act
      let returnedValue = nav.getLongestTrans(Date.now());
      // asssert
      expect(returnedValue).toEqual(expectedReturnValue);
    });

    it('should return the greatest end of transition time if found on middle parent', () => {
      // arrange
      let expectedReturnValue = Date.now() + 100;
      let firstParent: any = {
        trnsTime: Date.now()
      };
      let secondParent: any = {
        trnsTime: Date.now() + 50
      };
      let thirdParent: any = {
        trnsTime: expectedReturnValue
      };
      let fourthParent = {
        trnsTime: Date.now() + 20
      };
      firstParent.parent = secondParent;
      secondParent.parent = thirdParent;
      thirdParent.parent = fourthParent;
      nav.parent = firstParent;
      // act
      let returnedValue = nav.getLongestTrans(Date.now());
      // asssert
      expect(returnedValue).toEqual(expectedReturnValue);
    });

    it('should return the greatest end of transition time if found on last parent', () => {
      // arrange
      let expectedReturnValue = Date.now() + 100;
      let firstParent: any = {
        trnsTime: Date.now()
      };
      let secondParent: any = {
        trnsTime: Date.now() + 50
      };
      let thirdParent: any = {
        trnsTime: Date.now() + 20
      };
      let fourthParent = {
        trnsTime: expectedReturnValue
      };
      firstParent.parent = secondParent;
      secondParent.parent = thirdParent;
      thirdParent.parent = fourthParent;
      nav.parent = firstParent;
      // act
      let returnedValue = nav.getLongestTrans(Date.now());
      // asssert
      expect(returnedValue).toEqual(expectedReturnValue);
    });
  });

  // setup stuff
  let nav: NavControllerBase;

  class Page1 {}
  class Page2 {}
  class Page3 {}
  class Page4 {}
  class Page5 {}

  beforeEach(() => {
    nav = mockNavController();
  });

});
}
