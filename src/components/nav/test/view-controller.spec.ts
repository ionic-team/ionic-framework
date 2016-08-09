import { LifeCycleEvent, ViewController } from '../../../../src';

export function run() {
  describe('ViewController', () => {

    afterEach(() => {
      if ( subscription ) {
        subscription.unsubscribe();
      }
    });

    describe('willEnter', () => {
      it('should emit LifeCycleEvent when called with component data', (done) => {
        // arrange
        let viewController = new ViewController(FakePage);
        subscription = viewController.willEnter.subscribe((event: LifeCycleEvent) => {
          // assert
          expect(event).toEqual(null);
          done();
        }, (err: any) => {
          done(err);
        });

        // act
        viewController._fireWillEnter();
      }, 10000);
    });

    describe('didEnter', () => {
      it('should emit LifeCycleEvent when called with component data', (done) => {
        // arrange
        let viewController = new ViewController(FakePage);
        subscription = viewController.didEnter.subscribe((event: LifeCycleEvent) => {
          // assert
          expect(event).toEqual(null);
          done();
        }, (err: any) => {
          done(err);
        });

        // act
        viewController._fireDidEnter();
      }, 10000);
    });

    describe('willLeave', () => {
      it('should emit LifeCycleEvent when called with component data', (done) => {
        // arrange
        let viewController = new ViewController(FakePage);
        subscription = viewController.willLeave.subscribe((event: LifeCycleEvent) => {
          // assert
          expect(event).toEqual(null);
          done();
        }, (err: any) => {
          done(err);
        });

        // act
        viewController._fireWillLeave();
      }, 10000);
    });

    describe('didLeave', () => {
      it('should emit LifeCycleEvent when called with component data', (done) => {
        // arrange
        let viewController = new ViewController(FakePage);
        subscription = viewController.didLeave.subscribe((event: LifeCycleEvent) => {
          // assert
          expect(event).toEqual(null);
          done();
        }, (err: any) => {
          done(err);
        });

        // act
        viewController._fireDidLeave();
      }, 10000);
    });

    describe('willUnload', () => {
      it('should emit LifeCycleEvent when called with component data', (done) => {
        // arrange
        let viewController = new ViewController(FakePage);
        subscription = viewController.willUnload.subscribe((event: LifeCycleEvent) => {
          expect(event).toEqual(null);
          done();
        }, (err: any) => {
          done(err);
        });

        // act
        viewController._fireWillUnload();
      }, 10000);
    });

    describe('destroy', () => {
      it('should emit LifeCycleEvent when called with component data', (done) => {
        // arrange
        let viewController = new ViewController(FakePage);
        subscription = viewController.didUnload.subscribe((event: LifeCycleEvent) => {
          // assert
          expect(event).toEqual(null);
          done();
        }, (err: any) => {
          done(err);
        });

        // act
        viewController._destroy();
      }, 10000);
    });
  });

  let subscription: any = null;
  class FakePage {}
}
