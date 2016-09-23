import { mockNavController, mockView, mockViews } from '../../util/mock-providers';


describe('ViewController', () => {

  describe('willEnter', () => {
    it('should emit LifeCycleEvent when called with component data', (done) => {
      // arrange
      let viewController = mockView();
      subscription = viewController.willEnter.subscribe((event) => {
        // assert
        expect(event).toEqual(null);
        done();
      }, (err: any) => {
        done();
      });

      // act
      viewController._willEnter();
    }, 10000);
  });

  describe('didEnter', () => {
    it('should emit LifeCycleEvent when called with component data', (done) => {
      // arrange
      let viewController = mockView();
      subscription = viewController.didEnter.subscribe((event) => {
        // assert
        expect(event).toEqual(null);
        done();
      }, (err: any) => {
        done();
      });

      // act
      viewController._didEnter();
    }, 10000);
  });

  describe('willLeave', () => {
    it('should emit LifeCycleEvent when called with component data', (done) => {
      // arrange
      let viewController = mockView();
      subscription = viewController.willLeave.subscribe((event) => {
        // assert
        expect(event).toEqual(null);
        done();
      }, (err: any) => {
        done();
      });

      // act
      viewController._willLeave();
    }, 10000);
  });

  describe('didLeave', () => {
    it('should emit LifeCycleEvent when called with component data', (done) => {
      // arrange
      let viewController = mockView();
      subscription = viewController.didLeave.subscribe((event) => {
        // assert
        expect(event).toEqual(null);
        done();
      }, (err: any) => {
        done();
      });

      // act
      viewController._didLeave();
    }, 10000);
  });

  describe('willUnload', () => {
    it('should emit LifeCycleEvent when called with component data', (done) => {
      // arrange
      let viewController = mockView();
      subscription = viewController.willUnload.subscribe((event) => {
        expect(event).toEqual(null);
        done();
      }, (err: any) => {
        done();
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
      mockViews(navControllerBase, [viewController]);

      viewController.onDidDismiss((data: any) => {
        expect(data).toEqual('didDismiss data');
        done();
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
