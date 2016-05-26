import {LifeCycleEvent, ViewController} from '../../../../src';

export function run() {
  describe('ViewController', () => {

    afterEach(() => {
      if ( subscription ){
        subscription.unsubscribe();
      }
    });

    describe('loaded', () => {
      it('should emit LifeCycleEvent when called with component data', (done) => {
        // arrange
        let viewController = new ViewController(FakePage);
        var observable = viewController.getPageDidLoadObservable();
        subscription = observable.subscribe((event:LifeCycleEvent) => {
          expect(event.componentType['name']).toEqual('FakePage');
          done();
        }, err => {
          done(err);
        });

        // act
        viewController.loaded();
      }, 10000);
    });

    describe('willEnter', () => {
      it('should emit LifeCycleEvent when called with component data', (done) => {
        // arrange
        let viewController = new ViewController(FakePage);
        var observable = viewController.getPageWillEnterObservable();
        subscription = observable.subscribe((event:LifeCycleEvent) => {
          expect(event.componentType['name']).toEqual('FakePage');
          done();
        }, err => {
          done(err);
        });

        // act
        viewController.willEnter();
      }, 10000);
    });

    describe('didEnter', () => {
      it('should emit LifeCycleEvent when called with component data', (done) => {
        // arrange
        let viewController = new ViewController(FakePage);
        var observable = viewController.getPageDidEnterObservable();
        subscription = observable.subscribe((event:LifeCycleEvent) => {
          expect(event.componentType['name']).toEqual('FakePage');
          done();
        }, err => {
          done(err);
        });

        // act
        viewController.didEnter();
      }, 10000);
    });

    describe('willLeave', () => {
      it('should emit LifeCycleEvent when called with component data', (done) => {
        // arrange
        let viewController = new ViewController(FakePage);
        var observable = viewController.getPageWillLeaveObservable();
        subscription = observable.subscribe((event:LifeCycleEvent) => {
          expect(event.componentType['name']).toEqual('FakePage');
          done();
        }, err => {
          done(err);
        });

        // act
        viewController.willLeave();
      }, 10000);
    });

    describe('didLeave', () => {
      it('should emit LifeCycleEvent when called with component data', (done) => {
        // arrange
        let viewController = new ViewController(FakePage);
        var observable = viewController.getPageDidLeaveObservable();
        subscription = observable.subscribe((event:LifeCycleEvent) => {
          expect(event.componentType['name']).toEqual('FakePage');
          done();
        }, err => {
          done(err);
        });

        // act
        viewController.didLeave();
      }, 10000);
    });

    describe('willUnload', () => {
      it('should emit LifeCycleEvent when called with component data', (done) => {
        // arrange
        let viewController = new ViewController(FakePage);
        var observable = viewController.getPageWillUnloadObservable();
        subscription = observable.subscribe((event:LifeCycleEvent) => {
          expect(event.componentType['name']).toEqual('FakePage');
          done();
        }, err => {
          done(err);
        });

        // act
        viewController.willUnload();
      }, 10000);
    });

    describe('destroy', () => {
      it('should emit LifeCycleEvent when called with component data', (done) => {
        // arrange
        let viewController = new ViewController(FakePage);
        var observable = viewController.getPageDidUnloadObservable();
        subscription = observable.subscribe((event:LifeCycleEvent) => {
          expect(event.componentType['name']).toEqual('FakePage');
          done();
        }, err => {
          done(err);
        });

        // act
        viewController.destroy();
      }, 10000);
    });
  });

  let subscription = null;
  class FakePage{}
}
