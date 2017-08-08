import {
  MockView1,
  MockView2,
  MockView3,
  MockView4,
  MockView5,
  mockNavController,
  mockView,
  mockViews
} from '../../util/mock-providers';
import { NavControllerBase } from '../nav-controller-base';
import { DIRECTION_BACK, DIRECTION_FORWARD, NavOptions,  } from '../nav-util';
import { ViewController } from '../view-controller';


describe('NavController', () => {

  describe('push and pop', () => {

    it('should push multiple times and pop multiple times', (done: Function) => {
      let push1Done = jasmine.createSpy('PushDone');
      let push2Done = jasmine.createSpy('PushDone');
      let push3Done = jasmine.createSpy('PushDone');
      let push4Done = jasmine.createSpy('PushDone');
      let pop1Done = jasmine.createSpy('PopDone');
      let pop2Done = jasmine.createSpy('PopDone');
      let pop3Done = jasmine.createSpy('PopDone');


      let hasCompleted = true;
      let requiresTransition = true;

      // Push 1
      nav.push(MockView1, null, { animate: false }, push1Done).then(() => {
        expect(push1Done).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView1', undefined, DIRECTION_FORWARD
        );
        expect(nav.length()).toEqual(1);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        // Push 2
        return nav.push(MockView2, null, { animate: false }, push2Done);
      }).then(() => {
        expect(push2Done).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView2', 'MockView1', DIRECTION_FORWARD
        );
        expect(nav.length()).toEqual(2);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        expect(nav.getByIndex(1).component).toEqual(MockView2);
        // Push 3
        return nav.push(MockView3, null, { animate: false }, push3Done);
      }).then(() => {
        expect(push3Done).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView3', 'MockView2', DIRECTION_FORWARD
        );
        expect(nav.length()).toEqual(3);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        expect(nav.getByIndex(1).component).toEqual(MockView2);
        expect(nav.getByIndex(2).component).toEqual(MockView3);
        // Push 4
        return nav.push(MockView4, null, { animate: false }, push4Done);
      }).then(() => {
        expect(push4Done).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView4', 'MockView3', DIRECTION_FORWARD
        );
        expect(nav.length()).toEqual(4);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        expect(nav.getByIndex(1).component).toEqual(MockView2);
        expect(nav.getByIndex(2).component).toEqual(MockView3);
        expect(nav.getByIndex(3).component).toEqual(MockView4);
        // Pop 1
        return nav.pop({ animate: false }, pop1Done);
      }).then(() => {
        expect(pop1Done).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView3', 'MockView4', DIRECTION_BACK
        );
        expect(nav.length()).toEqual(3);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        expect(nav.getByIndex(1).component).toEqual(MockView2);
        expect(nav.getByIndex(2).component).toEqual(MockView3);
        // Pop 2
        return nav.pop({ animate: false }, pop2Done);
      }).then(() => {
        expect(pop2Done).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView2', 'MockView3', DIRECTION_BACK
        );
        expect(nav.length()).toEqual(2);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        expect(nav.getByIndex(1).component).toEqual(MockView2);
        // Pop 3
        return nav.pop({ animate: false }, pop3Done);
      }).then(() => {
        expect(pop3Done).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView1', 'MockView2', DIRECTION_BACK
        );
        expect(nav.length()).toEqual(1);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    }, 10000);
  });

  describe('push', () => {

    it('should push a component as the first view', (done: Function) => {

      nav.push(MockView1, null, null, trnsDone).then(() => {
        let hasCompleted = true;
        let requiresTransition = true;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView1', undefined, DIRECTION_FORWARD
        );
        expect(nav.length()).toEqual(1);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        expect(nav.isTransitioning()).toEqual(false);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    }, 10000);

    it('should push a component as the second view at the end', (done: Function) => {
      mockViews(nav, [mockView(MockView1)]);

      nav.push(MockView2, null, null, trnsDone).then(() => {
        let hasCompleted = true;
        let requiresTransition = true;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView2', 'MockView1', DIRECTION_FORWARD
        );
        expect(nav.length()).toEqual(2);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        expect(nav.getByIndex(1).component).toEqual(MockView2);
        expect(nav.isTransitioning()).toEqual(false);

        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    }, 10000);

    it('should push a ViewController as the second view and fire lifecycles', (done: Function) => {
      let view1 = mockView();
      let view2 = mockView();

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);

      mockViews(nav, [view1]);

      nav.push(view2, null, null, trnsDone).then(() => {
        expect(instance1.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance1.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewCanLeave).toHaveBeenCalled();
        expect(instance1.ionViewWillLeave).toHaveBeenCalled();
        expect(instance1.ionViewDidLeave).toHaveBeenCalled();
        expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

        expect(instance2.ionViewDidLoad).toHaveBeenCalled();
        expect(instance2.ionViewCanEnter).toHaveBeenCalled();
        expect(instance2.ionViewWillEnter).toHaveBeenCalled();
        expect(instance2.ionViewDidEnter).toHaveBeenCalled();
        expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewWillLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewDidLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewWillUnload).not.toHaveBeenCalled();

        let hasCompleted = true;
        let requiresTransition = true;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView', 'MockView', DIRECTION_FORWARD
        );
        expect(nav.length()).toEqual(2);

        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    }, 10000);
  });

  describe('insert', () => {

    it('should not modify the view id', (done) => {
      let view = mockView(MockView4);
      view.id = 'custom_id';
      nav.insert(0, view).then(() => {
        expect(view.id).toEqual('custom_id');
        done();
      }).catch(err => {
        fail(err);
        done();
      });
      expect(view.id).toEqual('custom_id');
    }, 10000);


    it('should insert at the begining with no async transition', (done: Function) => {
      let view4 = mockView(MockView4);
      let instance4 = spyOnLifecycles(view4);
      let opts: NavOptions = {};

      mockViews(nav, [mockView(MockView1), mockView(MockView2), mockView(MockView3)]);

      nav.insert(0, view4, null, opts, trnsDone).then(() => {
        expect(instance4.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance4.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance4.ionViewWillLeave).not.toHaveBeenCalled();
        expect(instance4.ionViewDidLeave).not.toHaveBeenCalled();
        expect(instance4.ionViewWillUnload).not.toHaveBeenCalled();

        let hasCompleted = true;
        let requiresTransition = false;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, undefined, undefined, undefined
        );
        expect(nav.length()).toEqual(4);
        expect(nav.first().component).toEqual(MockView4);
        expect(nav.last().component).toEqual(MockView3);

        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    }, 10000);

    it('should insert at the end when given -1', (done: Function) => {
      let opts: NavOptions = {};
      mockViews(nav, [mockView(MockView1)]);

      nav.insert(-1, MockView2, null, opts, trnsDone).then(() => {
        let hasCompleted = true;
        let requiresTransition = true;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView2', 'MockView1', DIRECTION_FORWARD
        );
        expect(nav.length()).toEqual(2);
        expect(nav.last().component).toEqual(MockView2);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    }, 10000);

    it('should insert at the end when given a number greater than actual length', (done: Function) => {
      mockViews(nav, [mockView(MockView1)]);

      nav.insert(9999, MockView2, null, null, trnsDone).then(() => {
        let hasCompleted = true;
        let requiresTransition = true;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView2', 'MockView1', DIRECTION_FORWARD
        );
        expect(nav.length()).toEqual(2);
        expect(nav.last().component).toEqual(MockView2);

        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    }, 10000);

    it('should not insert if null view', (done: Function) => {
      mockViews(nav, [mockView(MockView1)]);

      nav.insert(-1, null, null, null, trnsDone).then(() => {
        fail('it should not succeed');
        done();
      }).catch((err: Error) => {
        let hasCompleted = false;
        let requiresTransition = false;
        let rejectReason = 'invalid views to insert';
        expect(err).toEqual(rejectReason);
        expect(trnsDone).toHaveBeenCalledWith(hasCompleted, requiresTransition, rejectReason);
        expect(nav.length()).toEqual(1);
        expect(nav.last().component).toEqual(MockView1);
        done();
      });
    }, 10000);

    it('should not insert any view in the stack if canLeave returns false', (done: Function) => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      mockViews(nav, [view1, view2]);

      let instance2 = spyOnLifecycles(view2);

      let count = 0;
      instance2.ionViewCanLeave = function () {
        count++;
        return (count === 3);
      };

      nav.push(view3).then(() => {
        expect(nav.length()).toEqual(2);
        return nav.push(view3);
      }).then(() => {
        expect(nav.length()).toEqual(2);
        return nav.push(view3);
      }).then(() => {
        expect(nav.length()).toEqual(3);
        done();
      }).catch(err => fail(err));

    }, 10000);

    it('should not remove any view from the stack if canLeave returns false', (done) => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      mockViews(nav, [view1, view2]);

      let instance2 = spyOnLifecycles(view2);

      let count = 0;
      instance2.ionViewCanLeave = function () {
        count++;
        return (count === 3);
      };

      nav.pop().then(() => {
        expect(nav.length()).toEqual(2);
        return nav.pop();
      }).then(() => {
        expect(nav.length()).toEqual(2);
        return nav.pop();
      }).then(() => {
        expect(nav.length()).toEqual(1);
        done();
      }).catch(err => fail(err));
    }, 10000);

  });

  describe('insertPages', () => {

    it('should insert all pages in the middle', (done: Function) => {
      let view4 = mockView(MockView4);
      let instance4 = spyOnLifecycles(view4);
      mockViews(nav, [mockView(MockView1), mockView(MockView2), mockView(MockView3)]);

      nav.insertPages(1, [view4, mockView(MockView5)], null, trnsDone).then(() => {
        expect(instance4.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance4.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance4.ionViewWillLeave).not.toHaveBeenCalled();
        expect(instance4.ionViewDidLeave).not.toHaveBeenCalled();
        expect(instance4.ionViewWillUnload).not.toHaveBeenCalled();

        let hasCompleted = true;
        let requiresTransition = false;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, undefined, undefined, undefined
        );
        expect(nav.length()).toEqual(5);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        expect(nav.getByIndex(1).component).toEqual(MockView4);
        expect(nav.getByIndex(2).component).toEqual(MockView5);
        expect(nav.getByIndex(3).component).toEqual(MockView2);
        expect(nav.getByIndex(4).component).toEqual(MockView3);

        expect(nav.getByIndex(1)._nav).toEqual(nav);
        expect(nav.getByIndex(2)._nav).toEqual(nav);

        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    }, 10000);
  });

  describe('pop', () => {

    it('should not pop when no views in the stack', (done) => {
      nav.pop(null, trnsDone).then(() => {
        fail('it should not succeed');
        done();
      }).catch((err) => {
        let hasCompleted = false;
        let requiresTransition = false;
        let rejectReason = 'no views in the stack to be removed';
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, rejectReason
        );
        expect(err).toEqual(rejectReason);
        expect(nav.length()).toEqual(0);
        expect(nav.isTransitioning()).toEqual(false);
        done();
      });
    }, 10000);

    it('should remove the last view and fire lifecycles', (done: Function) => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      mockViews(nav, [view1, view2]);
      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);

      nav.pop(null, trnsDone).then(() => {

        expect(instance1.ionViewDidLoad).toHaveBeenCalled();
        expect(instance1.ionViewCanEnter).toHaveBeenCalled();
        expect(instance1.ionViewWillEnter).toHaveBeenCalled();
        expect(instance1.ionViewDidEnter).toHaveBeenCalled();
        expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

        expect(instance2.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance2.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewCanLeave).toHaveBeenCalled();
        expect(instance2.ionViewWillLeave).toHaveBeenCalled();
        expect(instance2.ionViewDidLeave).toHaveBeenCalled();
        expect(instance2.ionViewWillUnload).toHaveBeenCalled();

        let hasCompleted = true;
        let requiresTransition = true;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView1', 'MockView2', DIRECTION_BACK
        );
        expect(nav.length()).toEqual(1);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        expect(nav.isTransitioning()).toEqual(false);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
        });
    }, 10000);

  });

  describe('popTo', () => {

    it('should pop to a view', (done: Function) => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      nav.popTo(view2, null, trnsDone).then(() => {

        let hasCompleted = true;
        let requiresTransition = true;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView2', 'MockView3', DIRECTION_BACK
        );
        expect(nav.length()).toEqual(2);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        expect(nav.getByIndex(1).component).toEqual(MockView2);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    }, 10000);

    it('should pop to using an index number', (done: Function) => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      let view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      nav.popTo(1, null, trnsDone).then(() => {

        let hasCompleted = true;
        let requiresTransition = true;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView2', 'MockView4', DIRECTION_BACK
        );
        expect(nav.length()).toEqual(2);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        expect(nav.getByIndex(1).component).toEqual(MockView2);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
        });
    }, 10000);

    it('should pop to first using an index number', (done: Function) => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      let view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);
      let instance4 = spyOnLifecycles(view4);

      nav.popTo(0, null, trnsDone).then(() => {

        expect(instance1.ionViewDidLoad).toHaveBeenCalled();
        expect(instance1.ionViewCanEnter).toHaveBeenCalled();
        expect(instance1.ionViewWillEnter).toHaveBeenCalled();
        expect(instance1.ionViewDidEnter).toHaveBeenCalled();
        expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

        expect(instance2.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance2.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewWillLeave).toHaveBeenCalled();
        expect(instance2.ionViewDidLeave).toHaveBeenCalled();
        expect(instance2.ionViewWillUnload).toHaveBeenCalled();

        expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance3.ionViewWillLeave).toHaveBeenCalled();
        expect(instance3.ionViewDidLeave).toHaveBeenCalled();
        expect(instance3.ionViewWillUnload).toHaveBeenCalled();

        expect(instance4.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance4.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewCanLeave).toHaveBeenCalled();
        expect(instance4.ionViewWillLeave).toHaveBeenCalled();
        expect(instance4.ionViewDidLeave).toHaveBeenCalled();
        expect(instance4.ionViewWillUnload).toHaveBeenCalled();

        let hasCompleted = true;
        let requiresTransition = true;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView1', 'MockView4', DIRECTION_BACK
        );
        expect(nav.length()).toEqual(1);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
        });
    }, 10000);

  });

  describe('popToRoot', () => {

    it('should pop to the first view', (done: Function) => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      let view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);
      let instance4 = spyOnLifecycles(view4);

      nav.popToRoot(null, trnsDone).then(() => {

        expect(instance1.ionViewDidLoad).toHaveBeenCalled();
        expect(instance1.ionViewCanEnter).toHaveBeenCalled();
        expect(instance1.ionViewWillEnter).toHaveBeenCalled();
        expect(instance1.ionViewDidEnter).toHaveBeenCalled();
        expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

        expect(instance2.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance2.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewWillLeave).toHaveBeenCalled();
        expect(instance2.ionViewDidLeave).toHaveBeenCalled();
        expect(instance2.ionViewWillUnload).toHaveBeenCalled();

        expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance3.ionViewWillLeave).toHaveBeenCalled();
        expect(instance3.ionViewDidLeave).toHaveBeenCalled();
        expect(instance3.ionViewWillUnload).toHaveBeenCalled();

        expect(instance4.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance4.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewCanLeave).toHaveBeenCalled();
        expect(instance4.ionViewWillLeave).toHaveBeenCalled();
        expect(instance4.ionViewDidLeave).toHaveBeenCalled();
        expect(instance4.ionViewWillUnload).toHaveBeenCalled();

        let hasCompleted = true;
        let requiresTransition = true;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView1', 'MockView4', DIRECTION_BACK
        );
        expect(nav.length()).toEqual(1);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
        });
    }, 10000);

    it('should not pop first view if it\'s the only view', (done: Function) => {
      let view1 = mockView(MockView1);
      mockViews(nav, [view1]);

      nav.popToRoot(null, trnsDone).then(() => {
        let hasCompleted = true;
        let requiresTransition = false;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, undefined, undefined, undefined
        );
        expect(nav.length()).toEqual(1);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    }, 10000);

  });

  describe('remove', () => {

    it('should remove the first three views in the beginning, no last view transition', (done: Function) => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      let view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);
      let instance4 = spyOnLifecycles(view4);

      nav.remove(0, 3, null, trnsDone).then(() => {

        expect(instance1.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance1.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewWillLeave).toHaveBeenCalled();
        expect(instance1.ionViewDidLeave).toHaveBeenCalled();
        expect(instance1.ionViewWillUnload).toHaveBeenCalled();

        expect(instance2.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance2.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewWillLeave).toHaveBeenCalled();
        expect(instance2.ionViewDidLeave).toHaveBeenCalled();
        expect(instance2.ionViewWillUnload).toHaveBeenCalled();

        expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance3.ionViewWillLeave).toHaveBeenCalled();
        expect(instance3.ionViewDidLeave).toHaveBeenCalled();
        expect(instance3.ionViewWillUnload).toHaveBeenCalled();

        expect(instance4.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance4.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance4.ionViewWillLeave).not.toHaveBeenCalled();
        expect(instance4.ionViewDidLeave).not.toHaveBeenCalled();
        expect(instance4.ionViewWillUnload).not.toHaveBeenCalled();

        let hasCompleted = true;
        let requiresTransition = false;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, undefined, undefined, undefined
        );
        expect(nav.length()).toEqual(1);
        expect(nav.getByIndex(0).component).toEqual(MockView4);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
        });
    }, 10000);

    it('should remove two views in the middle', (done: Function) => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      let view4 = mockView(MockView4);
      let view5 = mockView(MockView5);
      mockViews(nav, [view1, view2, view3, view4, view5]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);
      let instance4 = spyOnLifecycles(view4);
      let instance5 = spyOnLifecycles(view5);

      nav.remove(2, 2, null, trnsDone).then(() => {

        expect(instance1.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance1.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

        expect(instance2.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance2.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewWillLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewDidLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewWillUnload).not.toHaveBeenCalled();

        expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance3.ionViewWillLeave).toHaveBeenCalled();
        expect(instance3.ionViewDidLeave).toHaveBeenCalled();
        expect(instance3.ionViewWillUnload).toHaveBeenCalled();

        expect(instance4.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance4.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance4.ionViewWillLeave).toHaveBeenCalled();
        expect(instance4.ionViewDidLeave).toHaveBeenCalled();
        expect(instance4.ionViewWillUnload).toHaveBeenCalled();

        expect(instance5.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance5.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance5.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance5.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance5.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance5.ionViewWillLeave).not.toHaveBeenCalled();
        expect(instance5.ionViewDidLeave).not.toHaveBeenCalled();
        expect(instance5.ionViewWillUnload).not.toHaveBeenCalled();

        let hasCompleted = true;
        let requiresTransition = false;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, undefined, undefined, undefined
        );
        expect(nav.length()).toEqual(3);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        expect(nav.getByIndex(1).component).toEqual(MockView2);
        expect(nav.getByIndex(2).component).toEqual(MockView5);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
        });
    }, 10000);

    it('should remove the last two views at the end', (done: Function) => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      let view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);
      let instance4 = spyOnLifecycles(view4);

      nav.remove(2, 2, null, trnsDone).then(() => {

        expect(instance1.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance1.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

        expect(instance2.ionViewDidLoad).toHaveBeenCalled();
        expect(instance2.ionViewCanEnter).toHaveBeenCalled();
        expect(instance2.ionViewWillEnter).toHaveBeenCalled();
        expect(instance2.ionViewDidEnter).toHaveBeenCalled();
        expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewWillLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewDidLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewWillUnload).not.toHaveBeenCalled();

        expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance3.ionViewWillLeave).toHaveBeenCalled();
        expect(instance3.ionViewDidLeave).toHaveBeenCalled();
        expect(instance3.ionViewWillUnload).toHaveBeenCalled();

        expect(instance4.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance4.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance4.ionViewCanLeave).toHaveBeenCalled();
        expect(instance4.ionViewWillLeave).toHaveBeenCalled();
        expect(instance4.ionViewDidLeave).toHaveBeenCalled();
        expect(instance4.ionViewWillUnload).toHaveBeenCalled();

        let hasCompleted = true;
        let requiresTransition = true;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView2', 'MockView4', DIRECTION_BACK
        );
        expect(nav.length()).toEqual(2);
        expect(nav.getByIndex(0).component).toEqual(MockView1);
        expect(nav.getByIndex(1).component).toEqual(MockView2);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
        });
    }, 10000);

  });

  describe('setRoot', () => {

    it('should set a ViewController as the root when its the last view, no transition', (done: Function) => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);

      nav.setRoot(view3, null, null, trnsDone).then(() => {
        expect(instance1.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance1.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewWillLeave).toHaveBeenCalled();
        expect(instance1.ionViewDidLeave).toHaveBeenCalled();
        expect(instance1.ionViewWillUnload).toHaveBeenCalled();

        expect(instance2.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance2.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewWillLeave).toHaveBeenCalled();
        expect(instance2.ionViewDidLeave).toHaveBeenCalled();
        expect(instance2.ionViewWillUnload).toHaveBeenCalled();

        expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance3.ionViewWillLeave).not.toHaveBeenCalled();
        expect(instance3.ionViewDidLeave).not.toHaveBeenCalled();
        expect(instance3.ionViewWillUnload).not.toHaveBeenCalled();

        let hasCompleted = true;
        let requiresTransition = false;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, undefined, undefined, undefined
        );
        expect(nav.length()).toEqual(1);
        expect(nav.getByIndex(0).component).toEqual(MockView3);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    }, 10000);

    it('should set a ViewController as the root when its the middle view, with transition', (done: Function) => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);

      nav.setRoot(view2, null, null, trnsDone).then(() => {
        expect(instance1.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance1.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewWillLeave).toHaveBeenCalled();
        expect(instance1.ionViewDidLeave).toHaveBeenCalled();
        expect(instance1.ionViewWillUnload).toHaveBeenCalled();

        expect(instance2.ionViewDidLoad).toHaveBeenCalled();
        expect(instance2.ionViewCanEnter).toHaveBeenCalled();
        expect(instance2.ionViewWillEnter).toHaveBeenCalled();
        expect(instance2.ionViewDidEnter).toHaveBeenCalled();
        expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewWillLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewDidLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewWillUnload).not.toHaveBeenCalled();

        expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewCanLeave).toHaveBeenCalled();
        expect(instance3.ionViewWillLeave).toHaveBeenCalled();
        expect(instance3.ionViewDidLeave).toHaveBeenCalled();
        expect(instance3.ionViewWillUnload).toHaveBeenCalled();

        let hasCompleted = true;
        let requiresTransition = true;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView2', 'MockView3', DIRECTION_BACK
        );
        expect(nav.length()).toEqual(1);
        expect(nav.getByIndex(0).component).toEqual(MockView2);

        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    }, 10000);

    it('should set a ViewController as the root when its the first view, with transition', (done: Function) => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);

      nav.setRoot(view1, null, null, trnsDone).then(() => {
        expect(instance1.ionViewDidLoad).toHaveBeenCalled();
        expect(instance1.ionViewCanEnter).toHaveBeenCalled();
        expect(instance1.ionViewWillEnter).toHaveBeenCalled();
        expect(instance1.ionViewDidEnter).toHaveBeenCalled();
        expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
        expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

        expect(instance2.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance2.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
        expect(instance2.ionViewWillLeave).toHaveBeenCalled();
        expect(instance2.ionViewDidLeave).toHaveBeenCalled();
        expect(instance2.ionViewWillUnload).toHaveBeenCalled();

        expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
        expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
        expect(instance3.ionViewCanLeave).toHaveBeenCalled();
        expect(instance3.ionViewWillLeave).toHaveBeenCalled();
        expect(instance3.ionViewDidLeave).toHaveBeenCalled();
        expect(instance3.ionViewWillUnload).toHaveBeenCalled();

        let hasCompleted = true;
        let requiresTransition = true;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView1', 'MockView3', DIRECTION_BACK
        );
        expect(nav.length()).toEqual(1);
        expect(nav.getByIndex(0).component).toEqual(MockView1);

        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    }, 10000);

    it('should set a page component as the root, with transition', (done: Function) => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);

      nav.setRoot(MockView4, null, null, trnsDone).then(() => {
        expect(instance1.ionViewWillUnload).toHaveBeenCalled();
        expect(instance2.ionViewWillUnload).toHaveBeenCalled();
        expect(instance3.ionViewWillUnload).toHaveBeenCalled();

        let hasCompleted = true;
        let requiresTransition = true;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView4', 'MockView3', DIRECTION_BACK
        );
        expect(nav.length()).toEqual(1);
        expect(nav.getByIndex(0).component).toEqual(MockView4);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    }, 10000);
  });

  describe('setPages', () => {

    it('should set the pages from an array, starting at the root, with transition', (done: Function) => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      mockViews(nav, [view1, view2]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);

      nav.setPages([{page: MockView4}, {page: MockView5}], null, trnsDone).then(() => {
        expect(instance1.ionViewWillUnload).toHaveBeenCalled();
        expect(instance2.ionViewWillUnload).toHaveBeenCalled();

        let hasCompleted = true;
        let requiresTransition = true;
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, 'MockView5', 'MockView2', DIRECTION_BACK
        );
        expect(nav.length()).toEqual(2);
        expect(nav.getByIndex(0).component).toEqual(MockView4);
        expect(nav.getByIndex(1).component).toEqual(MockView5);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    }, 10000);

  });

  describe('_nextTrns', () => {

    it('should not start next transition when already transitioning', () => {
      nav.setTransitioning(true);
      expect(nav._nextTrns()).toEqual(false);
    });

    it('should not start next transition nothing in the queue', () => {
      expect(nav._nextTrns()).toEqual(false);
    });

  });

  describe('destroy', () => {

    it('should not crash when destroyed while transitioning', (done) => {
      let view1 = mockView(MockView1);
      nav.push(view1).then((succeded: boolean) => {
        expect(succeded).toEqual(false);
        done();
      }).catch(() => {
        fail('should never get here');
        done();
      });
      nav.destroy();
    }, 10000);
  });

  describe('canSwipeBack', () => {
    it('should not swipe back when its not enabled', () => {
      nav._sbEnabled = false;

      const view1 = mockView();
      const view2 = mockView();
      mockViews(nav, [view1, view2]);

      const result = nav.canSwipeBack();
      expect(result).toEqual(false);
    });

    it('should not swipe back if its the portal', () => {
      nav._sbEnabled = true;
      nav._isPortal = true;

      const view1 = mockView();
      const view2 = mockView();
      mockViews(nav, [view1, view2]);

      const result = nav.canSwipeBack();
      expect(result).toEqual(false);
    });

    it('should not swipe back if it has a child nav', () => {
      nav._sbEnabled = true;
      nav.registerChildNav(mockNavController());

      const view1 = mockView();
      const view2 = mockView();
      mockViews(nav, [view1, view2]);

      const result = nav.canSwipeBack();
      expect(result).toEqual(false);
    });

    it('should swipe back when has a view to go back to', () => {
      nav._sbEnabled = true;
      const view1 = mockView();
      const view2 = mockView();
      mockViews(nav, [view1, view2]);

      const result = nav.canSwipeBack();
      expect(result).toEqual(true);
    });
  });


  let nav: NavControllerBase;
  let trnsDone: jasmine.Spy;

  function spyOnLifecycles(view: ViewController) {
    let instance = view.instance = {
      ionViewDidLoad: () => {},
      ionViewCanEnter: () => { return true; },
      ionViewWillEnter: () => {},
      ionViewDidEnter: () => {},
      ionViewCanLeave: () => {},
      ionViewWillLeave: () => { return true; },
      ionViewDidLeave: () => {},
      ionViewWillUnload: () => {},
    };
    spyOn(instance, 'ionViewDidLoad');
    spyOn(instance, 'ionViewCanEnter');
    spyOn(instance, 'ionViewWillEnter');
    spyOn(instance, 'ionViewDidEnter');
    spyOn(instance, 'ionViewCanLeave');
    spyOn(instance, 'ionViewWillLeave');
    spyOn(instance, 'ionViewDidLeave');
    spyOn(instance, 'ionViewWillUnload');

    return instance;
  }

  beforeEach(() => {
    trnsDone = jasmine.createSpy('TransitionDone');
    nav = mockNavController();
  });

});
