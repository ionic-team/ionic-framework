import {
  ddescribe,
  describe,
  xdescribe,
  it,
  iit,
  xit,
  expect,
  beforeEach,
  afterEach,
  AsyncTestCompleter,
  inject,
  beforeEachBindings
} from 'angular2/test';

import {Compiler} from 'angular2/angular2';

import {
  NavController,
  IonicConfig,
  Page,
  ViewController
} from 'ionic/ionic';


@Page({
  template: ''
})
class SomePage {}

export function run() {
  describe("NavController", () => {
    let nav;

    beforeEach(inject([Compiler], compiler => {
      nav = new NavController(null, null, new IonicConfig(), null, compiler, null, null, null);
    }));

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

        nav.add(activeView);
        var active = nav.getActive();

        expect(active).toBe(activeView);

        let secondActiveView = new ViewController();
        secondActiveView.state = 1; // ACTIVE_STATE

        nav.add(secondActiveView);
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

      it('be successful', () => {
        expect(SomePage).toBeDefined();

        nav.push(SomePage, {}, {});
      });

    })
  });

}
