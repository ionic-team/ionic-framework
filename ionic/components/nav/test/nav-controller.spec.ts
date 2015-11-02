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

    // beforeEach(inject([Compiler], compiler => {
    beforeEach(() => {
      nav = new NavController(null, null, new Config(), null, null, null, null, null);
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
      it('should return a rejected Promise if componentType is falsy', done => {
        let s = jasmine.createSpy('success');
        let f = jasmine.createSpy('fail');

        let promise = nav.push(undefined, {}, {});

        promise.then(s, f).then(() => {
          expect(s).not.toHaveBeenCalled();
          expect(f).toHaveBeenCalled();
          done();
        });
      });

      it('should throw an error if componentType truthy, but is not a function', () => {
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

    describe("setViews", () => {
      it('should return a resolved Promise if components is falsy', done => {
        let s = jasmine.createSpy('success');
        let f = jasmine.createSpy('fail');

        let promise = nav.setViews();

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
        let arr = [FirstPage, SecondPage, ThirdPage];

        nav._transition = mockTransitionFn;
        nav.setViews(arr);

        //_views[0] will be transitioned out of
        expect(nav._views[1].componentType).toBe(FirstPage);
        expect(nav._views[2].componentType).toBe(SecondPage);
        expect(nav._views[3].componentType).toBe(ThirdPage);
      });

    });

    describe("insert", () => {
      it('insert page at the specified index', () => {
        nav._views = [{}, {}, {}];
        expect(nav._views[2].componentType).toBeUndefined();
        nav.insert(FirstPage, 2);
        expect(nav._views[2].componentType).toBe(FirstPage);
      });

      it('push page if index >= _views.length', () => {
        nav._views = [{}, {}, {}];
        spyOn(nav, 'push').and.callThrough();
        nav.insert(FirstPage, 2);
        expect(nav.push).not.toHaveBeenCalled();

        nav._transition = mockTransitionFn;
        nav.insert(FirstPage, 4);
        expect(nav._views[4].componentType).toBe(FirstPage);
        expect(nav.push).toHaveBeenCalled();

        nav.insert(FirstPage, 10);
        expect(nav._views[5].componentType).toBe(FirstPage);
        expect(nav.push.calls.count()).toBe(2);
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

    describe("remove", () => {
      it('should remove the view at the specified index', () => {
        let vc1 = new ViewController(),
            vc2 = new ViewController(null, FirstPage),
            vc3 = new ViewController(null, SecondPage);
        nav._views = [vc1, vc2, vc3];
        expect(nav._views.length).toBe(3);
        expect(nav._views[1].componentType).toBe(FirstPage);

        nav.remove(1);

        expect(nav._views.length).toBe(2);
        expect(nav._views[1].componentType).toBe(SecondPage);
      });

      it('should pop if index is of active view', () => {
        let vc1 = new ViewController(),
            vc2 = new ViewController(null, FirstPage),
            vc3 = new ViewController(null, SecondPage);

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
      it('should set zIndex 0 on first entering view', () => {
        let enteringInstance = {};
        nav._setZIndex(enteringInstance, null, 'forward');
        expect(enteringInstance._zIndex).toEqual(0);
      });

      it('should set zIndex 1 on second entering view', () => {
        let leavingInstance = { _zIndex: 0 };
        let enteringInstance = {};
        nav._setZIndex(enteringInstance, leavingInstance, 'forward');
        expect(enteringInstance._zIndex).toEqual(1);
      });

      it('should set zIndex 0 on entering view going back', () => {
        let leavingInstance = { _zIndex: 1 };
        let enteringInstance = {};
        nav._setZIndex(enteringInstance, leavingInstance, 'back');
        expect(enteringInstance._zIndex).toEqual(0);
      });
    });

  });
}
