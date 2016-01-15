import {
  NavController,
  Config,
  Page,
  ViewController
} from 'ionic/ionic';


export function run() {
  describe("NavController", () => {
    let nav;

    class FirstPage {}
    class SecondPage {}
    class ThirdPage {}

    function mockTransitionFn(enteringView, leavingView, opts, cb) {
      let destroys = [];

      nav._views.forEach(view => {
        if (view) {
          if (view.shouldDestroy) {
            destroys.push(view);

          } else if (view.state === 2 && view.shouldCache) {
            view.shouldCache = false;
          }
        }
      });

      destroys.forEach(view => {
        nav._remove(view);
        view.destroy();
      });
      cb();
    }

    function mockCanGoBackFn() {
      return true;
    }

    beforeEach(() => {
      nav = new NavController(null, null, new Config(), null, null, null, null, null, null, null);
      nav._renderer = {
        setElementAttribute: function(){},
        setElementStyle: function(){}
      };
    });

    it('should exist', () => {
      expect(nav).not.toBeUndefined();
    });

    describe("getActive", () => {
      it('should return null if there is no active view', () => {
        var active = nav.getActive();
        expect(active).toBe(null);
      });

      it('should return the last active page', () => {
        let activeView = new ViewController();
        activeView.state = 1; // ACTIVE_STATE
        nav._add(activeView);

        expect(nav.getActive()).toBe(activeView);

        let secondActiveView = new ViewController();
        secondActiveView.state = 1; // ACTIVE_STATE
        nav._add(secondActiveView);

        expect(nav.getActive()).toBe(secondActiveView);
      });

      it('should return the last active page thats not shouldDestroy', () => {
        let view1 = new ViewController();
        view1.state = 1; // ACTIVE_STATE
        nav._add(view1);
        expect(nav.getActive()).toBe(view1);

        let view2 = new ViewController();
        view2.state = 1; // ACTIVE_STATE
        view2.shouldDestroy = true;
        nav._add(view2);
        expect(nav.getActive()).toBe(view1);
      });
    });

    describe("push", () => {
      it('should return a rejected Promise if page is falsy', done => {
        let s = jasmine.createSpy('success');
        let f = jasmine.createSpy('fail');

        let promise = nav.push(undefined, {}, {});

        promise.then(s, f).then(() => {
          expect(s).not.toHaveBeenCalled();
          expect(f).toHaveBeenCalled();
          done();
        });
      });

      it('should throw an error if page truthy, but is not a function', () => {
        let push = () => nav.push({}, {}, {});
        expect(push).toThrow();

        push = () => nav.push("string", {}, {});
        expect(push).toThrow();

        push = () => nav.push(42, {}, {});
        expect(push).toThrow();

        push = () => nav.push(true, {}, {});
        expect(push).toThrow();
      });

      it('to add the pushed page to the nav stack', (done) => {
        expect(FirstPage).toBeDefined();
        expect(nav._views.length).toBe(0);

        spyOn(nav, '_add').and.callThrough();

        nav._transition = mockTransitionFn;
        nav.push(FirstPage, {}, {}).then(() => {
          expect(nav._add).toHaveBeenCalled();
          expect(nav._views.length).toBe(1);
          done();
        });
      });
    });

    describe("setPages", () => {
      it('should return a resolved Promise if components is falsy', done => {
        let s = jasmine.createSpy('success');
        let f = jasmine.createSpy('fail');

        let promise = nav.setPages();

        promise.then(s, f).then(() => {
          expect(s).toHaveBeenCalled();
          expect(f).not.toHaveBeenCalled();
          done();
        });
      });

      it('replace views with the supplied views', () => {
        let vc1 = new ViewController(),
            vc2 = new ViewController(),
            vc3 = new ViewController();
        nav._views = [vc1, vc2, vc3];
        let arr = [{page: FirstPage}, {page:SecondPage}, {page:ThirdPage}];

        nav._transition = mockTransitionFn;
        nav.setPages(arr);

        //_views[0] will be transitioned out of
        expect(nav._views[1].componentType).toBe(FirstPage);
        expect(nav._views[2].componentType).toBe(SecondPage);
        expect(nav._views[3].componentType).toBe(ThirdPage);
      });

    });

    describe("insert", () => {
      it('insert page at the specified index', () => {
        let view1 = new ViewController();
        view1._loaded = true;
        let view2 = new ViewController();
        view2._loaded = true;
        let view3 = new ViewController();
        view3._loaded = true;

        nav._views = [view1, view2, view3];
        expect(nav._views[2].componentType).toBeUndefined();
        nav.insert(2, FirstPage);
        expect(nav._views[2].componentType).toBe(FirstPage);
      });

      it('push page if index >= _views.length', () => {
        let view1 = new ViewController();
        view1._loaded = true;
        let view2 = new ViewController();
        view2._loaded = true;
        let view3 = new ViewController();
        view3._loaded = true;

        nav._views = [view1, view2, view3];
        spyOn(nav, 'push').and.callThrough();
        nav.insert(2, FirstPage);
        expect(nav.push).not.toHaveBeenCalled();

        nav._transition = mockTransitionFn;
        nav.insert(4, FirstPage);
        expect(nav._views[4].componentType).toBe(FirstPage);
        expect(nav.push).toHaveBeenCalled();

        nav.setTransitioning(false);

        nav.insert(10, FirstPage);
        expect(nav._views[5].componentType).toBe(FirstPage);
      });

      it('another insert happened before last insert rendered, abort previous insert enter', () => {
        let view1 = new ViewController();
        view1._loaded = true;
        view1.state = NavController.STATE_ABORT;
        let view2 = new ViewController();
        view2._loaded = true;
        nav._views = [view1, view2];
      });

    });

    describe("setRoot", () => {
      it('remove previous views and set root', () => {
        let vc1 = new ViewController(),
            vc2 = new ViewController(),
            vc3 = new ViewController();
        nav._views = [vc1, vc2, vc3];
        expect(nav._views.length).toBe(3);

        nav._transition = mockTransitionFn;
        nav.setRoot(FirstPage);
        //_views[0] will be transitioned out of
        expect(nav._views.length).toBe(2);
        expect(nav._views[1].componentType).toBe(FirstPage);
      });
    });

    describe("first", () => {
      it('should get the first item', () => {
        let vc1 = new ViewController(),
            vc2 = new ViewController(FirstPage),
            vc3 = new ViewController(SecondPage);
        nav._views = [vc1, vc2, vc3];

        expect(nav.first()).toBe(vc1);
      });
      it('should get the first item that isnt being destroyed', () => {
        let vc1 = new ViewController(),
            vc2 = new ViewController(),
            vc3 = new ViewController();
        vc1.shouldDestroy = true;
        nav._views = [vc1, vc2, vc3];

        expect(nav.first()).toBe(vc2);
      });
    });

    describe("popTo", () => {
      it('should popTo 1st view', () => {
        let vc1 = new ViewController(FirstPage),
            vc2 = new ViewController(SecondPage),
            vc3 = new ViewController(ThirdPage);
        nav._views = [vc1, vc2, vc3];

        nav._transition = mockTransitionFn;
        nav.popTo(vc1);

        expect(nav._views.length).toBe(1);
        expect(nav._views[0].componentType).toBe(FirstPage);
      });
    });

    describe("remove", () => {
      it('should remove the view at the specified index', () => {
        let vc1 = new ViewController(),
            vc2 = new ViewController(FirstPage),
            vc3 = new ViewController(SecondPage);
        nav._views = [vc1, vc2, vc3];
        expect(nav._views.length).toBe(3);
        expect(nav._views[1].componentType).toBe(FirstPage);

        nav.remove(1);

        expect(nav._views.length).toBe(2);
        expect(nav._views[1].componentType).toBe(SecondPage);
      });

      it('should pop if index is of active view', () => {
        let vc1 = new ViewController(),
            vc2 = new ViewController(FirstPage),
            vc3 = new ViewController(SecondPage);

        vc3.state = 1; //ACTIVE_STATE
        nav._views = [vc1, vc2, vc3];

        spyOn(nav, 'pop').and.callThrough();

        nav.remove(1);
        expect(nav.pop).not.toHaveBeenCalled();

        nav.remove(1);
        expect(nav.pop).toHaveBeenCalled();

      });
    });

    describe("_setZIndex", () => {
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

  });
}
