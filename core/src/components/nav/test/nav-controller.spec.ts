import { newSpecPage, mockWindow } from '@stencil/core/testing';

import { ComponentProps } from '../../../interface';
import { Nav } from '../nav';
import { NavOptions } from '../nav-interface';
import { ViewController } from '../view-controller';
import { Config } from '../../../global/config';

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
      const view1 = mockView(MockView1);
      await nav.push(view1, null, { animated: false }, push1Done);

      const hasCompleted = true;
      const requiresTransition = true;
      expect(push1Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view1, undefined, 'forward'
      );
      expect(nav.getLength()).toEqual(1);
      expect(nav['views'][0].component).toEqual(MockView1);

      // Push 2
      const view2 = mockView(MockView2);
      await nav.push(view2, null, { animated: false }, push2Done);

      expect(push2Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view2, view1, 'forward'
      );

      expect(nav.getLength()).toEqual(2);
      expect(nav['views'][0].component).toEqual(MockView1);
      expect(nav['views'][1].component).toEqual(MockView2);

      // Push 3
      const view3 = mockView(MockView3);
      await nav.push(view3, null, { animated: false }, push3Done);

      expect(push3Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view3, view2, 'forward'
      );
      expect(nav.getLength()).toEqual(3);
      expect(nav['views'][0].component).toEqual(MockView1);
      expect(nav['views'][1].component).toEqual(MockView2);
      expect(nav['views'][2].component).toEqual(MockView3);

      // Push 4
      const view4 = mockView(MockView4);
      await nav.push(view4, null, { animated: false }, push4Done);
      expect(push4Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view4, view3, 'forward'
      );
      expect(nav.getLength()).toEqual(4);
      expect(nav['views'][0].component).toEqual(MockView1);
      expect(nav['views'][1].component).toEqual(MockView2);
      expect(nav['views'][2].component).toEqual(MockView3);
      expect(nav['views'][3].component).toEqual(MockView4);

      // Pop 1
      await nav.pop({ animated: false }, pop1Done);
      expect(pop1Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view3, view4, 'back'
      );
      expect(nav.getLength()).toEqual(3);
      expect(nav['views'][0].component).toEqual(MockView1);
      expect(nav['views'][1].component).toEqual(MockView2);
      expect(nav['views'][2].component).toEqual(MockView3);

      // Pop 2
      await nav.pop({ animated: false }, pop2Done);
      expect(pop2Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view2, view3, 'back'
      );
      expect(nav.getLength()).toEqual(2);
      expect(nav['views'][0].component).toEqual(MockView1);
      expect(nav['views'][1].component).toEqual(MockView2);

      // Pop 3
      await nav.pop({ animated: false }, pop3Done);
      expect(pop3Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view1, view2, 'back'
      );
      expect(nav.getLength()).toEqual(1);
      expect(nav['views'][0].component).toEqual(MockView1);

    }, 10000);
  });

  describe('push', () => {

    it('should push a component as the first view', async () => {

      const view1 = mockView(MockView1);
      await nav.push(view1, null, null, trnsDone);
      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view1, undefined, 'forward'
      );
      expect(nav.getLength()).toEqual(1);
      expect(nav['views'][0].component).toEqual(MockView1);
      expect(nav['isTransitioning']).toEqual(false);

    }, 10000);

    it('should push a component as the second view at the end', async () => {
      const view1 = mockView(MockView1);
      mockViews(nav, [view1]);

      const view2 = mockView(MockView2);
      await nav.push(view2, null, null, trnsDone);

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view2, view1, 'forward'
      );
      expect(nav.getLength()).toEqual(2);
      expect(nav['views'][0].component).toEqual(MockView1);
      expect(nav['views'][1].component).toEqual(MockView2);
      expect(nav['isTransitioning']).toEqual(false);

    }, 10000);

    it('should push a ViewController as the second view and fire lifecycles', async () => {
      const view1 = mockView();
      const view2 = mockView();

      const instance1 = spyOnLifecycles(view1);
      const instance2 = spyOnLifecycles(view2);

      mockViews(nav, [view1]);

      await nav.push(view2, null, null, trnsDone);

      expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance2.ionViewWillEnter).toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).not.toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view2, view1, 'forward'
      );
      expect(nav.getLength()).toEqual(2);

    }, 10000);
  });

  describe('insert', () => {

    it('should insert at the begining with no async transition', async () => {
      const view4 = mockView(MockView4);
      const instance4 = spyOnLifecycles(view4);
      const opts: NavOptions = {};

      mockViews(nav, [mockView(MockView1), mockView(MockView2), mockView(MockView3)]);

      await nav.insert(0, view4, null, opts, trnsDone);
      expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewWillUnload).not.toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = false;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, undefined, undefined, undefined
      );
      expect(nav.getLength()).toEqual(4);
      expect(nav['views'][0].component).toEqual(MockView4);
      expect(nav['views'][nav.getLength() - 1].component).toEqual(MockView3);

    }, 10000);

    it('should insert at the end when given -1', async () => {
      const opts: NavOptions = {};
      const view1 = mockView(MockView1);

      mockViews(nav, [view1]);

      const view2 = mockView(MockView2);
      await nav.insert(-1, view2, null, opts, trnsDone);
      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view2, view1, 'forward'
      );
      expect(nav.getLength()).toEqual(2);
      expect(nav['views'][nav.getLength() - 1].component).toEqual(MockView2);

    }, 10000);

    it('should insert at the end when given a number greater than actual length', async () => {
      const view1 = mockView(MockView1);
      mockViews(nav, [view1]);

      const view2 = mockView(MockView2);
      await nav.insert(9999, view2, null, null, trnsDone);
      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view2, view1, 'forward'
      );
      expect(nav.getLength()).toEqual(2);
      expect(nav['views'][nav.getLength() - 1].component).toEqual(MockView2);

    }, 10000);

    it('should not insert if null view', done => {
      mockViews(nav, [mockView(MockView1)]);

      nav.insert(-1, null as any, null, null, trnsDone).then(() => {
        fail('it should not succeed');
        done();

      }).catch((err: Error) => {
        const hasCompleted = false;
        const requiresTransition = false;
        const rejectReason = new Error('invalid views to insert');
        expect(err).toEqual(rejectReason);
        expect(trnsDone).toHaveBeenCalledWith(hasCompleted, requiresTransition, rejectReason);
        expect(nav.getLength()).toEqual(1);
        expect(nav['views'][nav.getLength() - 1].component).toEqual(MockView1);
        done();
      });
    }, 10000);

  });

  describe('insertPages', () => {

    it('should insert all pages in the middle', async () => {
      const view4 = mockView(MockView4);
      const instance4 = spyOnLifecycles(view4);

      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      const view3 = mockView(MockView3);

      mockViews(nav, [view1, view2, view3]);

      const view5 = mockView(MockView5);
      await nav.insertPages(1, [view4, view5], null, trnsDone);
      expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewWillUnload).not.toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = false;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, undefined, undefined, undefined
      );
      expect(nav.getLength()).toEqual(5);
      expect(nav['views'][0].component).toEqual(MockView1);
      expect(nav['views'][1].component).toEqual(MockView4);
      expect(nav['views'][2].component).toEqual(MockView5);
      expect(nav['views'][3].component).toEqual(MockView2);
      expect(nav['views'][4].component).toEqual(MockView3);

      expect(nav['views'][1].nav).toEqual(nav);
      expect(nav['views'][2].nav).toEqual(nav);

    }, 10000);
  });

  describe('pop', () => {

    it('should not pop when no views in the stack', done => {
      nav.pop(null, trnsDone).then(() => {
        fail('it should not succeed');
        done();
      }).catch((err: any) => {
        const hasCompleted = false;
        const requiresTransition = false;
        const rejectReason = new Error('no views in the stack to be removed');
        expect(trnsDone).toHaveBeenCalledWith(
          hasCompleted, requiresTransition, rejectReason
        );
        expect(err).toEqual(rejectReason);
        expect(nav.getLength()).toEqual(0);
        expect(nav['isTransitioning']).toEqual(false);
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

      expect(instance1.ionViewWillEnter).toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view1, view2, 'back'
      );
      expect(nav.getLength()).toEqual(1);
      expect(nav['views'][0].component).toEqual(MockView1);
      expect(nav['isTransitioning']).toEqual(false);

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
        hasCompleted, requiresTransition, view2, view3, 'back'
      );
      expect(nav.getLength()).toEqual(2);
      expect(nav['views'][0].component).toEqual(MockView1);
      expect(nav['views'][1].component).toEqual(MockView2);

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
        hasCompleted, requiresTransition, view2, view4, 'back'
      );
      expect(nav.getLength()).toEqual(2);
      expect(nav['views'][0].component).toEqual(MockView1);
      expect(nav['views'][1].component).toEqual(MockView2);

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

      expect(instance1.ionViewWillEnter).toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();

      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewWillLeave).toHaveBeenCalled();
      expect(instance4.ionViewDidLeave).toHaveBeenCalled();
      expect(instance4.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view1, view4, 'back'
      );
      expect(nav.getLength()).toEqual(1);
      expect(nav['views'][0].component).toEqual(MockView1);

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

      expect(instance1.ionViewWillEnter).toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();

      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewWillLeave).toHaveBeenCalled();
      expect(instance4.ionViewDidLeave).toHaveBeenCalled();
      expect(instance4.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view1, view4, 'back'
      );
      expect(nav.getLength()).toEqual(1);
      expect(nav['views'][0].component).toEqual(MockView1);

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
      expect(nav.getLength()).toEqual(1);
      expect(nav['views'][0].component).toEqual(MockView1);

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

      expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).toHaveBeenCalled();

      expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();

      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance4.ionViewWillUnload).not.toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = false;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, undefined, undefined, undefined
      );
      expect(nav.getLength()).toEqual(1);
      expect(nav['views'][0].component).toEqual(MockView4);

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

      expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewWillLeave).toHaveBeenCalled();
      expect(instance4.ionViewDidLeave).toHaveBeenCalled();
      expect(instance4.ionViewWillUnload).toHaveBeenCalled();

      expect(instance5.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance5.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance5.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance5.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance5.ionViewWillUnload).not.toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = false;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, undefined, undefined, undefined
      );
      expect(nav.getLength()).toEqual(3);
      expect(nav['views'][0].component).toEqual(MockView1);
      expect(nav['views'][1].component).toEqual(MockView2);
      expect(nav['views'][2].component).toEqual(MockView5);

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

      expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance2.ionViewWillEnter).toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      expect(instance4.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance4.ionViewWillLeave).toHaveBeenCalled();
      expect(instance4.ionViewDidLeave).toHaveBeenCalled();
      expect(instance4.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view2, view4, 'back'
      );
      expect(nav.getLength()).toEqual(2);
      expect(nav['views'][0].component).toEqual(MockView1);
      expect(nav['views'][1].component).toEqual(MockView2);

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
      expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).toHaveBeenCalled();

      expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();

      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).not.toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = false;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, undefined, undefined, undefined
      );
      expect(nav.getLength()).toEqual(1);
      expect(nav['views'][0].component).toEqual(MockView3);

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
      expect(instance1.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).toHaveBeenCalled();

      expect(instance2.ionViewWillEnter).toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view2, view3, 'back'
      );
      expect(nav.getLength()).toEqual(1);
      expect(nav['views'][0].component).toEqual(MockView2);

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
      expect(instance1.ionViewWillEnter).toHaveBeenCalled();
      expect(instance1.ionViewDidEnter).toHaveBeenCalled();
      expect(instance1.ionViewWillLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewDidLeave).not.toHaveBeenCalled();
      expect(instance1.ionViewWillUnload).not.toHaveBeenCalled();

      expect(instance2.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance2.ionViewWillLeave).toHaveBeenCalled();
      expect(instance2.ionViewDidLeave).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();

      expect(instance3.ionViewWillEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewDidEnter).not.toHaveBeenCalled();
      expect(instance3.ionViewWillLeave).toHaveBeenCalled();
      expect(instance3.ionViewDidLeave).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view1, view3, 'back'
      );
      expect(nav.getLength()).toEqual(1);
      expect(nav['views'][0].component).toEqual(MockView1);

    }, 10000);

    it('should set a page component as the root, with transition', async () => {
      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      const view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      const instance1 = spyOnLifecycles(view1);
      const instance2 = spyOnLifecycles(view2);
      const instance3 = spyOnLifecycles(view3);

      const view4 = mockView(MockView4);
      await nav.setRoot(view4, null, null, trnsDone);
      expect(instance1.ionViewWillUnload).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();
      expect(instance3.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view4, view3, 'back'
      );
      expect(nav.getLength()).toEqual(1);
      expect(nav['views'][0].component).toEqual(MockView4);

    }, 10000);
  });

  describe('setPages', () => {

    it('should set the pages from an array, starting at the root, with transition', async () => {
      const view1 = mockView(MockView1);
      const view2 = mockView(MockView2);
      mockViews(nav, [view1, view2]);

      const instance1 = spyOnLifecycles(view1);
      const instance2 = spyOnLifecycles(view2);

      const view4 = mockView(MockView4);
      const view5 = mockView(MockView5);

      await nav.setPages([
        { page: view4 },
        { page: view5 }
      ], null, trnsDone);
      expect(instance1.ionViewWillUnload).toHaveBeenCalled();
      expect(instance2.ionViewWillUnload).toHaveBeenCalled();

      const hasCompleted = true;
      const requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, view5, view2, 'back'
      );
      expect(nav.getLength()).toEqual(2);
      expect(nav['views'][0].component).toEqual(MockView4);
      expect(nav['views'][1].component).toEqual(MockView5);

    }, 10000);

  });

  describe('canStart', () => {
    it('should not swipe back when its not enabled', () => {
      nav.swipeGesture = false;

      const view1 = mockView();
      const view2 = mockView();
      mockViews(nav, [view1, view2]);

      const result = nav['canStart']();
      expect(result).toEqual(false);
    });

    it('should swipe back when has a view to go back to', () => {
      nav.swipeGesture = true;
      const view1 = mockView();
      const view2 = mockView();
      mockViews(nav, [view1, view2]);

      const result = nav['canStart']();
      expect(result).toEqual(true);
    });
  });

  function spyOnLifecycles(view: ViewController) {
    const element = view.element as any;
    Object.assign(element, {
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
      ionViewWillEnter: jest.spyOn(element, 'ionViewWillEnter'),
      ionViewDidEnter: jest.spyOn(element, 'ionViewDidEnter'),
      ionViewWillLeave: jest.spyOn(element, 'ionViewWillLeave'),
      ionViewDidLeave: jest.spyOn(element, 'ionViewDidLeave'),
      ionViewWillUnload: jest.spyOn(element, 'ionViewWillUnload'),
    };

    element.dispatchEvent = (ev: CustomEvent) => {
      switch(ev.type) {
        case 'ionViewWillEnter': element.ionViewWillEnter(); break;
        case 'ionViewDidEnter': element.ionViewDidEnter(); break;
        case 'ionViewWillLeave': element.ionViewWillLeave(); break;
        case 'ionViewDidLeave': element.ionViewDidLeave(); break;
        case 'ionViewWillUnload': element.ionViewWillUnload(); break;
      }
    };
    return instance;
  }

  let trnsDone: jest.Mock;
  let nav: Nav;

  beforeEach(async () => {
    trnsDone = jest.fn();
    const config = new Config();
    config.reset({ animated: false });
    const page = await newSpecPage({
      components: [Nav],
      html: `<ion-nav></ion-nav>`,
      autoApplyChanges: true,
      context: {
        config
      }
    });
    nav = page.rootInstance;
  });

  const MockView = 'mock-view';
  const MockView1 = 'mock-view1';
  const MockView2 = 'mock-view2';
  const MockView3 = 'mock-view3';
  const MockView4 = 'mock-view4';
  const MockView5 = 'mock-view5';

  function mockView(component?: any, params?: ComponentProps) {
    if (!component) {
      component = MockView;
    }

    const view = new ViewController(component, params);
    view.element = document.createElement(component) as HTMLElement;
    return view;
  }

  function mockViews(navI: Nav, views: ViewController[]) {
    navI['views'] = views;
    views.forEach(v => {
      v.nav = navI;
    });
  }

  // function mockNavController(): Promise<Nav> {
  //   const navI = new Nav() as any;
  //   navI.animated = false;
  //   navI.el = win.document.createElement('ion-nav');
  //   navI.win = win;
  //   navI.queue = { write: (fn: any) => fn(), read: (fn: any) => fn() };

  //   navI.config = new Config();
  //   navI.config.reset({ animated: false });
  //   navI._viewInit = (enteringView: ViewController) => {
  //     if (!enteringView.element) {
  //       enteringView.element = (typeof enteringView.component === 'string')
  //         ? win.document.createElement(enteringView.component)
  //         : enteringView.element = enteringView.component as HTMLElement;
  //     }
  //     enteringView.state = VIEW_STATE_ATTACHED;
  //   };
  //   return navI;
  // }
});
