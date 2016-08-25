import { mockView } from '../../util/mock-providers';


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

  afterEach(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  let subscription: any = null;

});
