import { mockNavController, mockView, mockViews } from '../../util/mock-providers';
import { STATE_ATTACHED } from '../nav-util';

describe('ViewController', () => {

  describe('willEnter', () => {
    it('should emit LifeCycleEvent when called with component data', (done: Function) => {
      // arrange
      let viewController = mockView();
      subscription = viewController.willEnter.subscribe((event: any) => {
        // assert
        expect(event).toEqual(null);
        done();
      }, (err: any) => {
        done(err);
      });

      // act
      viewController._state = STATE_ATTACHED;
      viewController._willEnter();
    }, 10000);
  });

  describe('didEnter', () => {
    it('should emit LifeCycleEvent when called with component data', (done: Function) => {
      // arrange
      let viewController = mockView();
      subscription = viewController.didEnter.subscribe((event: any) => {
        // assert
        expect(event).toEqual(null);
        done();
      }, (err: any) => {
        done(err);
      });

      // act
      viewController._state = STATE_ATTACHED;
      viewController._didEnter();
    }, 10000);
  });

  describe('willLeave', () => {
    it('should emit LifeCycleEvent when called with component data', (done: Function) => {
      // arrange
      let viewController = mockView();
      subscription = viewController.willLeave.subscribe((event: any) => {
        // assert
        expect(event).toEqual(null);
        done();
      }, (err: any) => {
        done(err);
      });

      // act
      viewController._state = STATE_ATTACHED;
      viewController._willLeave(false);
    }, 10000);
  });

  describe('didLeave', () => {
    it('should emit LifeCycleEvent when called with component data', (done: Function) => {
      // arrange
      let viewController = mockView();
      subscription = viewController.didLeave.subscribe((event: any) => {
        // assert
        expect(event).toEqual(null);
        done();
      }, (err: any) => {
        done(err);
      });

      // act
      viewController._didLeave();
    }, 10000);
  });

  describe('willUnload', () => {
    it('should emit LifeCycleEvent when called with component data', (done: Function) => {
      // arrange
      let viewController = mockView();
      subscription = viewController.willUnload.subscribe((event: any) => {
        expect(event).toEqual(null);
        done();
      }, (err: any) => {
        done(err);
      });

      // act
      viewController._willUnload();
    }, 10000);
  });

  describe('willDismiss', () => {
    it('should have data in the willDismiss', (done) => {
      // arrange
      let viewController = mockView();
      let navControllerBase = mockNavController();
      navControllerBase._isPortal = true;
      mockViews(navControllerBase, [viewController]);

      viewController.onWillDismiss((data: any) => {
        expect(data).toEqual('willDismiss data');
        done();
      });

      viewController.dismiss('willDismiss data');
    }, 10000);
  });

  describe('didDismiss', () => {
    it('should have data in the didDismiss', (done) => {
      // arrange
      let viewController = mockView();
      let navControllerBase = mockNavController();
      navControllerBase._isPortal = true;
      mockViews(navControllerBase, [viewController]);

      viewController.onDidDismiss((data: any) => {
        expect(data).toEqual('didDismiss data');
        done();
      });

      viewController.dismiss('didDismiss data');
    }, 10000);

    it('should not crash when calling dismiss() twice', (done) => {
      // arrange
      let viewController = mockView();
      let navControllerBase = mockNavController();
      navControllerBase._isPortal = true;
      mockViews(navControllerBase, [viewController]);

      viewController.onDidDismiss((data: any) => {
        expect(data).toEqual('didDismiss data');
        setTimeout(() => {
          viewController.dismiss(); // it should not crash
          done();
        }, 100);
      });

      viewController.dismiss('didDismiss data');
    }, 10000);
  });


  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  let subscription: any = null;

});
