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
        viewController.fireWillEnter();
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
        viewController.fireDidEnter();
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
        viewController.fireWillLeave();
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
        viewController.fireDidLeave();
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
        viewController.fireWillUnload();
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
        viewController.destroy();
      }, 10000);
    });
  });

  let subscription: any = null;
  class FakePage {}
}
