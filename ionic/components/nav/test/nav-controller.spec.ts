import {NavController, Config, ViewController} from 'ionic/ionic';

export function run() {
  describe('NavController', () => {

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
        expect(nav.length()).toBe(2);
        expect(view1.state).toBe(STATE_INIT_ENTER);
        expect(view2.state).toBe(STATE_REMOVE);
        expect(view3.state).toBe(STATE_INIT_LEAVE);

        expect(nav.getByIndex(0).state).toBe(STATE_INIT_ENTER);
        expect(nav.getByIndex(0).componentType).toBe(Page1);
        expect(nav.getByIndex(1).state).toBe(STATE_INIT_LEAVE);
        expect(nav.getByIndex(1).componentType).toBe(Page3);
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
    });

    describe('_setZIndex', () => {
      it('should set zIndex 10 on first entering view', () => {
        let enteringView = new ViewController();
        enteringView.setPageRef({});
        nav._setZIndex(enteringView, null, 'forward');
        expect(enteringView.zIndex).toEqual(10);
      });

      it('should set zIndex 1 on second entering view', () => {
        let leavingView = new ViewController();
        leavingView.zIndex = 0;
        leavingView._loaded = true;
        let enteringView = new ViewController();
        enteringView.setPageRef({});
        nav._setZIndex(enteringView, leavingView, 'forward');
        expect(enteringView.zIndex).toEqual(1);
      });

      it('should set zIndex 0 on entering view going back', () => {
        let leavingView = new ViewController();
        leavingView.zIndex = 1;
        leavingView._loaded = true;
        let enteringView = new ViewController();
        enteringView.setPageRef({});
        nav._setZIndex(enteringView, leavingView, 'back');
        expect(enteringView.zIndex).toEqual(0);
      });
    });

    describe('_transComplete', () => {

      it('should not entering/leaving state, after transition that isnt the most recent, and state already changed', () => {
        let enteringView = new ViewController(Page1);
        enteringView.state = 'somethingelse';
        let leavingView = new ViewController(Page2);
        leavingView.state = 'somethingelse';

        nav._transIds = 2;

        nav._transComplete(1, enteringView, leavingView);

        expect(enteringView.state).toBe('somethingelse');
        expect(leavingView.state).toBe('somethingelse');
      });

      it('should set entering/leaving to inactive, after transition that isnt the most recent', () => {
        let enteringView = new ViewController(Page1);
        enteringView.state = STATE_TRANS_ENTER;
        let leavingView = new ViewController(Page2);
        leavingView.state = STATE_TRANS_LEAVE;

        nav._transIds = 2;

        nav._transComplete(1, enteringView, leavingView);

        expect(enteringView.state).toBe(STATE_INACTIVE);
        expect(leavingView.state).toBe(STATE_INACTIVE);
      });

      it('should set entering active, leaving inactive, after transition', () => {
        let enteringView = new ViewController(Page1);
        enteringView.state = STATE_TRANS_ENTER;
        let leavingView = new ViewController(Page2);
        leavingView.state = STATE_TRANS_LEAVE;

        nav._transIds = 1;

        nav._transComplete(1, enteringView, leavingView);

        expect(enteringView.state).toBe(STATE_ACTIVE);
        expect(leavingView.state).toBe(STATE_INACTIVE);
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

        let view2 = new ViewController(Page2)
        nav._insert(-1, [view2]);
        expect(nav.length()).toBe(2);
        expect(nav.getByIndex(0).state).toBe(STATE_INIT_LEAVE);
        expect(nav.getByIndex(0).componentType).toBe(Page1);
        expect(nav.getByIndex(1).state).toBe(STATE_INIT_ENTER);
        expect(nav.getByIndex(1).componentType).toBe(Page2);
      });

      it('should push the first page, using a number greater than the length', () => {
        let view1 = new ViewController(Page1)
        nav._insert(8675309, [view1]);

        expect(nav.length()).toBe(1);
        expect(nav.getByIndex(0).state).toBe(STATE_INIT_ENTER);
      });

      it('should push the first page, using -1', () => {
        let view1 = new ViewController(Page1)
        nav._insert(-1, [view1]);

        expect(nav.getByIndex(0).id).toBeDefined();
        expect(nav.length()).toBe(1);
        expect(nav.getByIndex(0).state).toBe(STATE_INIT_ENTER);
      });

    });

    it('should getActive()', () => {
      expect(nav.getActive()).toBe(null);
      let view1 = new ViewController(Page1);
      view1.state = STATE_INIT_ENTER;
      nav._views = [view1];
      expect(nav.getActive()).toBe(null);
      view1.state = STATE_ACTIVE;
      expect(nav.getActive()).toBe(view1);
    });

    it('should getByState()', () => {
      expect(nav.getByState()).toBe(null);

      let view1 = new ViewController(Page1);
      view1.state = STATE_INIT_ENTER;
      let view2 = new ViewController(Page2);
      view2.state = STATE_INIT_ENTER;
      nav._views = [view1, view2];

      expect(nav.getByState('whatever')).toBe(null);
      expect(nav.getByState(STATE_INIT_ENTER)).toBe(view2);

      view2.state = STATE_INACTIVE;
      expect(nav.getByState(STATE_INIT_ENTER)).toBe(view1);

      view2.state = STATE_ACTIVE;
      expect(nav.getActive()).toBe(view2);
    });

    it('should getPrevious()', () => {
      expect(nav.getPrevious(null)).toBe(null);

      let view1 = new ViewController(Page1);
      let view2 = new ViewController(Page2);
      nav._views = [view1, view2];

      expect(nav.getPrevious(view1)).toBe(null);
      expect(nav.getPrevious(view2)).toBe(view1);
    });

    it('should get first()', () => {
      expect(nav.first()).toBe(null);
      let view1 = new ViewController(Page1);
      let view2 = new ViewController(Page2);
      nav._views = [view1];
      expect(nav.first()).toBe(view1);
      nav._views = [view1, view2];
      expect(nav.first()).toBe(view1);
    });

    it('should get last()', () => {
      expect(nav.last()).toBe(null);
      let view1 = new ViewController(Page1);
      let view2 = new ViewController(Page2);
      nav._views = [view1];
      expect(nav.last()).toBe(view1);
      nav._views = [view1, view2];
      expect(nav.last()).toBe(view2);
    });

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

    // setup stuff
    let nav;
    let config = new Config();

    class Page1 {}
    class Page2 {}
    class Page3 {}
    class Page4 {}
    class Page5 {}

    beforeEach(() => {
      let elementRef = {
        nativeElement: document.createElement('div')
      };
      nav = new NavController(null, null, config, null, elementRef, null, null, null, null, null);
      nav._renderer = {
        setElementAttribute: function(){},
        setElementClass: function(){},
        setElementStyle: function(){}
      };
    });

  });
}

const STATE_ACTIVE = 'active';
const STATE_INACTIVE = 'inactive';
const STATE_INIT_ENTER = 'init_enter';
const STATE_INIT_LEAVE = 'init_leave';
const STATE_TRANS_ENTER = 'trans_enter';
const STATE_TRANS_LEAVE = 'trans_leave';
const STATE_REMOVE = 'remove';
const STATE_REMOVE_AFTER_TRANS = 'remove_after_trans';
const STATE_FORCE_ACTIVE = 'force_active';
