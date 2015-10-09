// import {
//   ddescribe,
//   describe,
//   xdescribe,
//   it,
//   iit,
//   xit,
//   expect,
//   beforeEach,
//   afterEach,
//   AsyncTestCompleter,
//   inject,
//   beforeEachBindings
// } from 'angular2/test';

// import {Compiler} from 'angular2/angular2';

import {
  NavController,
  IonicConfig,
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
      nav = new NavController(null, null, new IonicConfig(), null, null, null, null, null);
    });

    it('should exist', () => {
      expect(nav).not.toBeUndefined();
    });

    describe("getActive", () => {
      it('should return null if there is no active view', () => {
        var active = nav.getActive();
        expect(active).toBe(null);
      });

      it('should return the first active page', () => {
        let activeView = new ViewController();
        activeView.state = 1; // ACTIVE_STATE

        nav._add(activeView);
        var active = nav.getActive();

        expect(active).toBe(activeView);

        let secondActiveView = new ViewController();
        secondActiveView.state = 1; // ACTIVE_STATE

        nav._add(secondActiveView);
        active = nav.getActive();

        expect(active).toBe(activeView);
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

        nav.transition = mockTransitionFn;
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

        nav.transition = mockTransitionFn;
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

        nav.transition = mockTransitionFn;
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

        nav.transition = mockTransitionFn;
        nav.setRoot(FirstPage);
        //_views[0] will be transitioned out of
        expect(nav._views.length).toBe(2);
        expect(nav._views[1].componentType).toBe(FirstPage);
      });
    });

  });
}
