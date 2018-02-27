import { mockDocument, mockElement } from '@stencil/core/testing';
import { NavControllerBase } from '../nav';
import { ViewController } from '../view-controller';
import { AnimationControllerImpl } from '../../animation-controller/animation-controller';
import { createConfigController } from '../../../global/config-controller';

import {
  DIRECTION_BACK,
  DIRECTION_FORWARD,
  NavOptions,
  STATE_INITIALIZED,
} from '../nav-util';


describe('NavController', () => {

  describe('push and pop', () => {

    it('should push multiple times and pop multiple times', async () => {
      const push1Done = jest.fn();
      const push2Done = jest.fn();
      const push3Done = jest.fn();
      const push4Done = jest.fn();
      const pop1Done = jest.fn();
      const pop2Done = jest.fn();
      const pop3Done = jest.fn();

      // Push 1
      await nav.push(mockView(MockView1), null, {animate: false}, push1Done);

      const hasCompleted = true;
      const requiresTransition = true;
      expect(push1Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view1', undefined, DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(1);
      expect(nav.getByIndex(0).component).toEqual(MockView1);

      // Push 2
      await nav.push(mockView(MockView2), null, {animate: false}, push2Done);

      expect(push2Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view2', 'mock-view1', DIRECTION_FORWARD
      );

      expect(nav.length()).toEqual(2);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);

      // Push 3
      await nav.push(mockView(MockView3), null, {animate: false}, push3Done);

      expect(push3Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view3', 'mock-view2', DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(3);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);
      expect(nav.getByIndex(2).component).toEqual(MockView3);

      // Push 4
      await nav.push(mockView(MockView4), null, {animate: false}, push4Done);
      expect(push4Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view4', 'mock-view3', DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(4);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);
      expect(nav.getByIndex(2).component).toEqual(MockView3);
      expect(nav.getByIndex(3).component).toEqual(MockView4);

      // Pop 1
      await nav.pop({animate: false}, pop1Done);
      expect(pop1Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view3', 'mock-view4', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(3);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);
      expect(nav.getByIndex(2).component).toEqual(MockView3);

      // Pop 2
      await nav.pop({animate: false}, pop2Done);
      expect(pop2Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view2', 'mock-view3', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(2);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);

      // Pop 3
      await nav.pop({animate: false}, pop3Done);
      expect(pop3Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view1', 'mock-view2', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(1);
      expect(nav.getByIndex(0).component).toEqual(MockView1);

    }, 10000);
  });

  describe('push', () => {

    it('should push a component as the first view', async () => {

      await nav.push(mockView(MockView1), null, null, trnsDone);
      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view1', undefined, DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(1);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.isTransitioning).toEqual(false);


    }, 10000);

    it('should push a component as the second view at the end', async () => {
      mockViews(nav, [mockView(MockView1)]);

      await nav.push(mockView(MockView2), null, null, trnsDone);

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view2', 'mock-view1', DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(2);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);
      expect(nav.isTransitioning).toEqual(false);

    }, 10000);

    it('should push a ViewController as the second view and fire lifecycles', async () => {
      const view1 = mockView();
      const view2 = mockView();

      const instance1 = spyOnLifecycles(view1);
      const instance2 = spyOnLifecycles(view2);

      mockViews(nav, [view1]);

      await nav.push(view2, null, null, trnsDone);

      expect(instance1.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance1.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance1.ionViewCanLeave).toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance2.ionViewDidLoad).toHaveBeenCalled();
      // expect(instance2.ionViewCanEnter).toHaveBeenCalled();
      expect(instance2.ionViewWillEnter).toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).toHaveBeenCalled();
      // expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).not.toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view', 'mock-view', DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(2);


    }, 10000);
  });

  describe('insert', () => {

    it('should not modify the view id', async () => {
      const view = mockView(MockView4);
      view.id = 'custom_id';
      await nav.insert(0, view);

      expect(view.id).toEqual('custom_id');
      expect(view.id).toEqual('custom_id');
    }, 10000);


    it('should insert at the begining with no async transition', async () => {
      const view4 = mockView(MockView4);
      const instance4 = spyOnLifecycles(view4);
      const opts: NavOptions = {};

      mockViews(nav, [mockView(MockView1), mockView(MockView2), mockView(MockView3)]);

      await nav.insert(0, view4, null, opts, trnsDone);
      expect(instance4.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance4.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance4.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewWillUnload).not.toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = false;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, undefined, undefined, undefined
      );
      expect(nav.length()).toEqual(4);
      expect(nav._views[0].component).toEqual(MockView4);
      expect(nav._views[nav._views.length - 1].component).toEqual(MockView3);

    }, 10000);

    it('should insert at the end when given -1', async () => {
      const opts: NavOptions = {};
      mockViews(nav, [mockView(MockView1)]);

      await nav.insert(-1, mockView(MockView2), null, opts, trnsDone);
      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view2', 'mock-view1', DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(2);
      expect(nav._views[nav._views.length - 1].component).toEqual(MockView2);

    }, 10000);

    it('should insert at the end when given a number greater than actual length', async () => {
      mockViews(nav, [mockView(MockView1)]);

      await nav.insert(9999, mockView(MockView2), null, null, trnsDone);
      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view2', 'mock-view1', DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(2);
      expect(nav._views[nav._views.length - 1].component).toEqual(MockView2);

    }, 10000);

    it('should not insert if null view', (done) => {
      mockViews(nav, [mockView(MockView1)]);

      nav.insert(-1, null, null, null, trnsDone).then(() => {
        fail('it should not succeed');
        done();

      }).catch((err: Error) => {
        const hasCompleted = false;
        const requiresTransition = false;
        const rejectReason = new Error('invalid views to insert');
        expect(err).toEqual(rejectReason);
        expect(trnsDone).toHaveBeenCalledWith(hasCompleted, requiresTransition, rejectReason);
        expect(nav.length()).toEqual(1);
        expect(nav._views[nav._views.length - 1].component).toEqual(MockView1);
        done();
      });
    }, 10000);

    // it('should not insert any view in the stack if canLeave returns false', async () => {
    //   const view1 = mockView(MockView1);
    //   const view2 = mockView(MockView2);
    //   const view3 = mockView(MockView3);
    //   mockViews(nav, [view1, view2]);

    //   const instance2 = spyOnLifecycles(view2);

    //   let count = 0;
    //   instance2.ionViewCanLeave = function () {
    //     count++;
    //     return (count === 3);
    //   };

    //   await nav.push(view3);
    //   expect(nav.length()).toEqual(2);
    //   await nav.push(view3);
    //   expect(nav.length()).toEqual(2);
    //   await nav.push(view3);
    //   expect(nav.length()).toEqual(3);

    // }, 10000);

    // it('should not remove any view from the stack if canLeave returns false', async () => {
    //   const view1 = mockView(MockView1);
    //   const view2 = mockView(MockView2);
    //   mockViews(nav, [view1, view2]);

    //   const instance2 = spyOnLifecycles(view2);

    //   let count = 0;
    //   instance2.ionViewCanLeave = function () {
    //     count++;
    //     return (count === 3);
    //   };

    //   await nav.pop();
    //   expect(nav.length()).toEqual(2);
    //   await nav.pop();
    //   expect(nav.length()).toEqual(2);
    //   await nav.pop();
    //   expect(nav.length()).toEqual(1);
    // }, 10000);

  });

  describe('insertPages', () => {

    it('should insert all pages in the middle', async () => {
      const view4 = mockView(MockView4);
      const instance4 = spyOnLifecycles(view4);
      mockViews(nav, [mockView(MockView1), mockView(MockView2), mockView(MockView3)]);

      await nav.insertPages(1, [view4, mockView(MockView5)], null, trnsDone);
      expect(instance4.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance4.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance4.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewWillUnload).not.toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = false;
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

    }, 10000);
  });

  describe('pop', () => {

    it('should not pop when no views in the stack', (done) => {
      nav.pop(null, trnsDone).then(() => {
        fail('it should not succeed');
        done();
      }).catch((err) => {
        const hasCompleted = false;
        const requiresTransition = false;
        const rejectReason = new Error('no views in the stack to be removed');
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, rejectReason
        );
        expect(err).toEqual(rejectReason);
        expect(nav.length()).toEqual(0);
        expect(nav.isTransitioning).toEqual(false);
        done();
      });
    }, 10000);

    it('should remove the last view and fire lifecycles', async () => {
      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      mockViews(nav, [view1, view2]);
      const instance1 = spyOnLifecycles(view1);
      const instance2 = spyOnLifecycles(view2);

      await nav.pop(null, trnsDone);

      expect(instance1.ionViewDidLoad).toHaveBeenCalled();
      // expect(instance1.ionViewCanEnter).toHaveBeenCalled();
      expect(instance1.ionViewWillEnter).toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).toHaveBeenCalled();
      // expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance2.ionViewDidLoad).not.toHaveBeenCalled();
      // expect).not.toHaveBeenCalled();
      expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance2.ionViewCanLeave).toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view1', 'mock-view2', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(1);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.isTransitioning).toEqual(false);


    }, 10000);

  });

  describe('popTo', () => {

    it('should pop to a view', async () => {
      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      const view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      await nav.popTo(view2, null, trnsDone);

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view2', 'mock-view3', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(2);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);


    }, 10000);

    it('should pop to using an index number', async () => {
      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      const view3 = mockView(MockView3);
      const view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      await nav.popTo(1, null, trnsDone);

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view2', 'mock-view4', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(2);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);


    }, 10000);

    it('should pop to first using an index number', async () => {
      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      const view3 = mockView(MockView3);
      const view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      const instance1 = spyOnLifecycles(view1);
      const instance2 = spyOnLifecycles(view2);
      const instance3 = spyOnLifecycles(view3);
      const instance4 = spyOnLifecycles(view4);

      await nav.popTo(0, null, trnsDone);

      expect(instance1.ionViewDidLoad).toHaveBeenCalled();
      // expect(instance1.ionViewCanEnter).toHaveBeenCalled();
      expect(instance1.ionViewWillEnter).toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).toHaveBeenCalled();
      // expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance2.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance2.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();

      expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      expect(instance4.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance4.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance4.ionViewCanLeave).toHaveBeenCalled();
      expect(instance4.ionViewWillLeave).toHaveBeenCalled();
      expect(instance4.ionViewDidLeave).toHaveBeenCalled();
      expect(instance4.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view1', 'mock-view4', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(1);
      expect(nav.getByIndex(0).component).toEqual(MockView1);

    }, 10000);

  });

  describe('popToRoot', () => {

    it('should pop to the first view', async () => {
      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      const view3 = mockView(MockView3);
      const view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      const instance1 = spyOnLifecycles(view1);
      const instance2 = spyOnLifecycles(view2);
      const instance3 = spyOnLifecycles(view3);
      const instance4 = spyOnLifecycles(view4);

      await nav.popToRoot(null, trnsDone);

      expect(instance1.ionViewDidLoad).toHaveBeenCalled();
      // expect(instance1.ionViewCanEnter).toHaveBeenCalled();
      expect(instance1.ionViewWillEnter).toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).toHaveBeenCalled();
      // expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance2.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance2.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();

      expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      expect(instance4.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance4.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance4.ionViewCanLeave).toHaveBeenCalled();
      expect(instance4.ionViewWillLeave).toHaveBeenCalled();
      expect(instance4.ionViewDidLeave).toHaveBeenCalled();
      expect(instance4.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view1', 'mock-view4', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(1);
      expect(nav.getByIndex(0).component).toEqual(MockView1);


    }, 10000);

    it('should not pop first view if it\'s the only view', async () => {
      const view1 = mockView(MockView1);
      mockViews(nav, [view1]);

      await nav.popToRoot(null, trnsDone);
      const hasCompleted = true;
      const requiresTransition = false;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, undefined, undefined, undefined
      );
      expect(nav.length()).toEqual(1);
      expect(nav.getByIndex(0).component).toEqual(MockView1);


    }, 10000);

  });

  describe('remove', () => {

    it('should remove the first three views in the beginning, no last view transition', async () => {
      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      const view3 = mockView(MockView3);
      const view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      const instance1 = spyOnLifecycles(view1);
      const instance2 = spyOnLifecycles(view2);
      const instance3 = spyOnLifecycles(view3);
      const instance4 = spyOnLifecycles(view4);

      await nav.removeIndex(0, 3, null, trnsDone);

      expect(instance1.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance1.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).toHaveBeenCalled();

      expect(instance2.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance2.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();

      expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      expect(instance4.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance4.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance4.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewWillUnload).not.toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = false;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, undefined, undefined, undefined
      );
      expect(nav.length()).toEqual(1);
      expect(nav.getByIndex(0).component).toEqual(MockView4);


    }, 10000);

    it('should remove two views in the middle', async () => {
      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      const view3 = mockView(MockView3);
      const view4 = mockView(MockView4);
      const view5 = mockView(MockView5);
      mockViews(nav, [view1, view2, view3, view4, view5]);

      const instance1 = spyOnLifecycles(view1);
      const instance2 = spyOnLifecycles(view2);
      const instance3 = spyOnLifecycles(view3);
      const instance4 = spyOnLifecycles(view4);
      const instance5 = spyOnLifecycles(view5);

      await nav.removeIndex(2, 2, null, trnsDone);

      expect(instance1.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance1.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance2.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance2.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      expect(instance4.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance4.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance4.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewWillLeave).toHaveBeenCalled();
      expect(instance4.ionViewDidLeave).toHaveBeenCalled();
      expect(instance4.ionViewWillUnload).toHaveBeenCalled();

      expect(instance5.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance5.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance5.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance5.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance5.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance5.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance5.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance5.ionViewWillUnload).not.toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = false;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, undefined, undefined, undefined
      );
      expect(nav.length()).toEqual(3);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);
      expect(nav.getByIndex(2).component).toEqual(MockView5);


    }, 10000);

    it('should remove the last two views at the end', async () => {
      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      const view3 = mockView(MockView3);
      const view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      const instance1 = spyOnLifecycles(view1);
      const instance2 = spyOnLifecycles(view2);
      const instance3 = spyOnLifecycles(view3);
      const instance4 = spyOnLifecycles(view4);

      await nav.removeIndex(2, 2, null, trnsDone);

      expect(instance1.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance1.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance2.ionViewDidLoad).toHaveBeenCalled();
      // expect(instance2.ionViewCanEnter).toHaveBeenCalled();
      expect(instance2.ionViewWillEnter).toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).toHaveBeenCalled();
      // expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      expect(instance4.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance4.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance4.ionViewCanLeave).toHaveBeenCalled();
      expect(instance4.ionViewWillLeave).toHaveBeenCalled();
      expect(instance4.ionViewDidLeave).toHaveBeenCalled();
      expect(instance4.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view2', 'mock-view4', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(2);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);


    }, 10000);

  });

  describe('setRoot', () => {

    it('should set a ViewController as the root when its the last view, no transition', async () => {
      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      const view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      const instance1 = spyOnLifecycles(view1);
      const instance2 = spyOnLifecycles(view2);
      const instance3 = spyOnLifecycles(view3);

      await nav.setRoot(view3, null, null, trnsDone);
      expect(instance1.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance1.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).toHaveBeenCalled();

      expect(instance2.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance2.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();

      expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).not.toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = false;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, undefined, undefined, undefined
      );
      expect(nav.length()).toEqual(1);
      expect(nav.getByIndex(0).component).toEqual(MockView3);


    }, 10000);

    it('should set a ViewController as the root when its the middle view, with transition', async () => {
      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      const view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      const instance1 = spyOnLifecycles(view1);
      const instance2 = spyOnLifecycles(view2);
      const instance3 = spyOnLifecycles(view3);

      await nav.setRoot(view2, null, null, trnsDone);
      expect(instance1.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance1.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).toHaveBeenCalled();

      expect(instance2.ionViewDidLoad).toHaveBeenCalled();
      // expect(instance2.ionViewCanEnter).toHaveBeenCalled();
      expect(instance2.ionViewWillEnter).toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).toHaveBeenCalled();
      // expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view2', 'mock-view3', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(1);
      expect(nav.getByIndex(0).component).toEqual(MockView2);

    }, 10000);

    it('should set a ViewController as the root when its the first view, with transition', async () => {
      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      const view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      const instance1 = spyOnLifecycles(view1);
      const instance2 = spyOnLifecycles(view2);
      const instance3 = spyOnLifecycles(view3);

      await nav.setRoot(view1, null, null, trnsDone);
      expect(instance1.ionViewDidLoad).toHaveBeenCalled();
      // expect(instance1.ionViewCanEnter).toHaveBeenCalled();
      expect(instance1.ionViewWillEnter).toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).toHaveBeenCalled();
      // expect(instance1.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance2.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance2.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance2.ionViewCanLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();

      expect(instance3.ionViewDidLoad).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      // expect(instance3.ionViewCanLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view1', 'mock-view3', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(1);
      expect(nav.getByIndex(0).component).toEqual(MockView1);



    }, 10000);

    it('should set a page component as the root, with transition', async () => {
      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      const view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      const instance1 = spyOnLifecycles(view1);
      const instance2 = spyOnLifecycles(view2);
      const instance3 = spyOnLifecycles(view3);

      await nav.setRoot(mockView(MockView4), null, null, trnsDone);
      expect(instance1.ionViewWillUnload).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view4', 'mock-view3', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(1);
      expect(nav.getByIndex(0).component).toEqual(MockView4);


    }, 10000);
  });

  describe('setPages', () => {

    it('should set the pages from an array, starting at the root, with transition', async () => {
      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      mockViews(nav, [view1, view2]);

      const instance1 = spyOnLifecycles(view1);
      const instance2 = spyOnLifecycles(view2);

      await nav.setPages([{
        page: mockView(MockView4)
      }, {
        page: mockView(MockView5)
      }], null, trnsDone);
      expect(instance1.ionViewWillUnload).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'mock-view5', 'mock-view2', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(2);
      expect(nav.getByIndex(0).component).toEqual(MockView4);
      expect(nav.getByIndex(1).component).toEqual(MockView5);


    }, 10000);

  });


  describe('destroy', () => {

    it('should not crash when destroyed while transitioning', (done) => {
      const view1 = mockView(MockView1);
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
      nav.swipeBackEnabled = false;

      const view1 = mockView();
      const view2 = mockView();
      mockViews(nav, [view1, view2]);

      const result = nav.canSwipeBack();
      expect(result).toEqual(false);
    });

    it('should swipe back when has a view to go back to', () => {
      nav.swipeBackEnabled = true;
      const view1 = mockView();
      const view2 = mockView();
      mockViews(nav, [view1, view2]);

      const result = nav.canSwipeBack();
      expect(result).toEqual(true);
    });
  });


  let nav: NavControllerBase;

  function spyOnLifecycles(view: ViewController) {
    const element = view.element as any;
    Object.assign(element, {
      ionViewDidLoad: () => {
        return;
      },
      ionViewWillEnter: () => {
        return;
      },
      ionViewDidEnter: () => {
        return;
      },
      ionViewWillLeave: () => {
        return;
      },
      ionViewDidLeave: () => {
        return;
      },
      ionViewWillUnload: () => {
        return;
      },
    });


    const instance = {
      ionViewDidLoad: jest.spyOn(element, 'ionViewDidLoad'),
      ionViewWillEnter: jest.spyOn(element, 'ionViewWillEnter'),
      ionViewDidEnter: jest.spyOn(element, 'ionViewDidEnter'),
      ionViewWillLeave: jest.spyOn(element, 'ionViewWillLeave'),
      ionViewDidLeave: jest.spyOn(element, 'ionViewDidLeave'),
      ionViewWillUnload: jest.spyOn(element, 'ionViewWillUnload'),
    };

    element.addEventListener('ionViewDidLoad', element.ionViewDidLoad);
    element.addEventListener('ionViewWillEnter', element.ionViewWillEnter);
    element.addEventListener('ionViewDidEnter', element.ionViewDidEnter);
    element.addEventListener('ionViewWillLeave', element.ionViewWillLeave);
    element.addEventListener('ionViewDidLeave', element.ionViewDidLeave);
    element.addEventListener('ionViewWillUnload', element.ionViewWillUnload);
    return instance;
  }

  let trnsDone: jest.Mock;
  beforeEach(() => {
    trnsDone = jest.fn();
    nav = mockNavController();
  });

});

const MockView = 'mock-view';
const MockView1 = 'mock-view1';
const MockView2 = 'mock-view2';
const MockView3 = 'mock-view3';
const MockView4 = 'mock-view4';
const MockView5 = 'mock-view5';
const dom = mockDocument();

function mockView(component ?: any, data ?: any) {
  if (!component) {
    component = MockView;
  }

  const view = new ViewController(component, data);
  view._lifecycle = function(lifecycle: string) {
    const event = dom.createEvent('CustomEvent');
    event.initCustomEvent(`ionView${lifecycle}`, false, false, null);
    this.element.dispatchEvent(event);
  };
  view.element = mockElement(component) as HTMLElement;
  return view;
}

function mockViews(nav: NavControllerBase, views: ViewController[]) {
  nav._views = views;
  views.forEach(v => {
    v._setNav(nav);
  });
}

function mockNavController(): NavControllerBase {
  const nav = new NavControllerBase() as any;
  nav.el = mockElement('ion-nav') as HTMLElement;
  nav.ionNavChanged = {emit: function() { return; } };
  nav.animationCtrl = new AnimationControllerImpl() as any;
  nav.config = createConfigController({animate: false}, []);
  nav._viewInit = function (enteringView: ViewController) {
    if (!enteringView.element) {
      console.log(enteringView.component);
      enteringView.element = (typeof enteringView.component === 'string')
        ? mockElement(enteringView.component) as HTMLElement
        : enteringView.element = enteringView.component as HTMLElement;
    }
    enteringView._state = STATE_INITIALIZED;
  };
  return nav;
}
