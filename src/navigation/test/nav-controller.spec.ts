import { mockNavController, mockView, mockViews,
         MockView1, MockView2, MockView3, MockView4, MockView5 } from '../../util/mock-providers';
import { NavControllerBase } from '../nav-controller-base';
import { NavOptions, DIRECTION_FORWARD, DIRECTION_BACK } from '../nav-util';
import { ViewController } from '../view-controller';


describe('NavController', () => {

  describe('push and pop', () => {

    it('should push multiple times and pop multiple times', () => {
      let push1Done = jasmine.createSpy('PushDone');
      let push2Done = jasmine.createSpy('PushDone');
      let push3Done = jasmine.createSpy('PushDone');
      let push4Done = jasmine.createSpy('PushDone');
      let pop1Done = jasmine.createSpy('PopDone');
      let pop2Done = jasmine.createSpy('PopDone');
      let pop3Done = jasmine.createSpy('PopDone');

      // Push 1
      nav.push(MockView1, null, { animate: false }, push1Done);

      let hasCompleted = true;
      let requiresTransition = true;
      expect(push1Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'MockView1', undefined, DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(1);
      expect(nav.getByIndex(0).component).toEqual(MockView1);

      // Push 2
      nav.push(MockView2, null, { animate: false }, push2Done);

      expect(push2Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'MockView2', 'MockView1', DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(2);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);

      // Push 3
      nav.push(MockView3, null, { animate: false }, push3Done);

      expect(push3Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'MockView3', 'MockView2', DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(3);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);
      expect(nav.getByIndex(2).component).toEqual(MockView3);

      // Push 4
      nav.push(MockView4, null, { animate: false }, push4Done);

      expect(push4Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'MockView4', 'MockView3', DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(4);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);
      expect(nav.getByIndex(2).component).toEqual(MockView3);
      expect(nav.getByIndex(3).component).toEqual(MockView4);

      // Pop 1
      nav.pop({ animate: false }, pop1Done);

      expect(pop1Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'MockView3', 'MockView4', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(3);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);
      expect(nav.getByIndex(2).component).toEqual(MockView3);

      // Pop 2
      nav.pop({ animate: false }, pop2Done);

      expect(pop2Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'MockView2', 'MockView3', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(2);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);

      // Pop 3
      nav.pop({ animate: false }, pop3Done);

      expect(pop3Done).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'MockView1', 'MockView2', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(1);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
    });

  });

  describe('push', () => {

    it('should push a component as the first view', () => {
      nav.push(MockView1, null, null, trnsDone);

      let hasCompleted = true;
      let requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'MockView1', undefined, DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(1);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.isTransitioning()).toEqual(false);
    });

    it('should push a component as the second view at the end', () => {
      mockViews(nav, [mockView(MockView1)]);
      nav.push(MockView2, null, null, trnsDone);

      let hasCompleted = true;
      let requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'MockView2', 'MockView1', DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(2);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);
      expect(nav.isTransitioning()).toEqual(false);
    });

    it('should push a ViewController as the second view and fire lifecycles', () => {
      let view1 = mockView();
      let view2 = mockView();

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);

      mockViews(nav, [view1]);
      nav.push(view2, null, null, trnsDone);

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
    });

  });

  describe('insert', () => {

    it('should insert at the begining with no async transition', () => {
      let view4 = mockView(MockView4);
      let instance4 = spyOnLifecycles(view4);
      let opts: NavOptions = {};

      mockViews(nav, [mockView(MockView1), mockView(MockView2), mockView(MockView3)]);
      nav.insert(0, view4, null, opts, trnsDone);

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
    });

    it('should insert at the end when given -1', () => {
      let opts: NavOptions = {};
      mockViews(nav, [mockView(MockView1)]);
      nav.insert(-1, MockView2, null, opts, trnsDone);

      let hasCompleted = true;
      let requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'MockView2', 'MockView1', DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(2);
      expect(nav.last().component).toEqual(MockView2);
    });

    it('should insert at the end when given a number greater than actual length', () => {
      mockViews(nav, [mockView(MockView1)]);
      nav.insert(9999, MockView2, null, null, trnsDone);

      let hasCompleted = true;
      let requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'MockView2', 'MockView1', DIRECTION_FORWARD
      );
      expect(nav.length()).toEqual(2);
      expect(nav.last().component).toEqual(MockView2);
    });

    it('should not insert if null view', () => {
      mockViews(nav, [mockView(MockView1)]);
      nav.insert(-1, null, null, null, trnsDone);

      let hasCompleted = false;
      let requiresTransition = false;
      let rejectReason = 'invalid views to insert';
      expect(trnsDone).toHaveBeenCalledWith(hasCompleted, requiresTransition, rejectReason);
      expect(nav.length()).toEqual(1);
      expect(nav.last().component).toEqual(MockView1);
    });

  });

  describe('insertPages', () => {

    it('should insert all pages in the middle', () => {
      let view4 = mockView(MockView4);
      let instance4 = spyOnLifecycles(view4);
      mockViews(nav, [mockView(MockView1), mockView(MockView2), mockView(MockView3)]);
      nav.insertPages(1, [view4, mockView(MockView5)], null, trnsDone);

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
    });

  });

  describe('pop', () => {

    it('should not pop when no views in the stack', () => {
      nav.pop(null, trnsDone);

      let hasCompleted = false;
      let requiresTransition = false;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'no views in the stack to be removed'
      );
      expect(nav.length()).toEqual(0);
      expect(nav.isTransitioning()).toEqual(false);
    });

    it('should remove the last view and fire lifecycles', () => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      mockViews(nav, [view1, view2]);
      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);

      nav.pop(null, trnsDone);

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
    });

  });

  describe('popTo', () => {

    it('should pop to a view', () => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      nav.popTo(view2, null, trnsDone);

      let hasCompleted = true;
      let requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'MockView2', 'MockView3', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(2);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);
    });

    it('should pop to using an index number', () => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      let view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      nav.popTo(1, null, trnsDone);

      let hasCompleted = true;
      let requiresTransition = true;
      expect(trnsDone).toHaveBeenCalledWith(
        hasCompleted, requiresTransition, 'MockView2', 'MockView4', DIRECTION_BACK
      );
      expect(nav.length()).toEqual(2);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView2);
    });

    it('should pop to first using an index number', () => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      let view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);
      let instance4 = spyOnLifecycles(view4);

      nav.popTo(0, null, trnsDone);

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
    });

  });

  describe('popToRoot', () => {

    it('should pop to the first view', () => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      let view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);
      let instance4 = spyOnLifecycles(view4);

      nav.popToRoot(null, trnsDone);

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
    });

  });

  describe('remove', () => {

    it('should remove the first three views in the beginning, no last view transition', () => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      let view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);
      let instance4 = spyOnLifecycles(view4);

      nav.remove(0, 3, null, trnsDone);

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
    });

    it('should remove two views in the middle', () => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      let view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);
      let instance4 = spyOnLifecycles(view4);

      nav.remove(1, 2, null, trnsDone);

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
      expect(nav.length()).toEqual(2);
      expect(nav.getByIndex(0).component).toEqual(MockView1);
      expect(nav.getByIndex(1).component).toEqual(MockView4);
    });

    it('should remove the last two views at the end', () => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      let view4 = mockView(MockView4);
      mockViews(nav, [view1, view2, view3, view4]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);
      let instance4 = spyOnLifecycles(view4);

      nav.remove(2, 2, null, trnsDone);

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
    });

  });

  describe('setRoot', () => {

    it('should set a ViewController as the root when its the last view, no transition', () => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);

      nav.setRoot(view3, null, null, trnsDone);

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
    });

    it('should set a ViewController as the root when its the middle view, with transition', () => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);

      nav.setRoot(view2, null, null, trnsDone);

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
    });

    it('should set a ViewController as the root when its the first view, with transition', () => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);

      nav.setRoot(view1, null, null, trnsDone);

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
    });

    it('should set a page component as the root, with transition', () => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      let view3 = mockView(MockView3);
      mockViews(nav, [view1, view2, view3]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);
      let instance3 = spyOnLifecycles(view3);

      nav.setRoot(MockView4, null, null, trnsDone);

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
    });

  });

  describe('setPages', () => {

    it('should set the pages from an array, starting at the root, with transition', () => {
      let view1 = mockView(MockView1);
      let view2 = mockView(MockView2);
      mockViews(nav, [view1, view2]);

      let instance1 = spyOnLifecycles(view1);
      let instance2 = spyOnLifecycles(view2);

      nav.setPages([{page: MockView4}, {page: MockView5}], null, trnsDone);

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
    });

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

  // describe('_cleanup', () => {
  //   it('should destroy views that are inactive after the active view', () => {
  //     let view1 = new ViewController(Page1);
  //     view1.state = STATE_INACTIVE;
  //     let view2 = new ViewController(Page2);
  //     view2.state = STATE_ACTIVE;
  //     let view3 = new ViewController(Page3);
  //     view3.state = STATE_INACTIVE;
  //     let view4 = new ViewController(Page4);
  //     view4.state = STATE_TRANS_ENTER;
  //     let view5 = new ViewController(Page5);
  //     view5.state = STATE_INACTIVE;
  //     nav._views = [view1, view2, view3, view4, view5];
  //     nav._cleanup();

  //     expect(nav.length()).toBe(3);
  //     expect(nav.getByIndex(0).state).toBe(STATE_INACTIVE);
  //     expect(nav.getByIndex(0).component).toBe(Page1);
  //     expect(nav.getByIndex(1).state).toBe(STATE_ACTIVE);
  //     expect(nav.getByIndex(1).component).toBe(Page2);
  //     expect(nav.getByIndex(2).state).toBe(STATE_TRANS_ENTER);
  //     expect(nav.getByIndex(2).component).toBe(Page4);
  //   });

  //   it('should not destroy any views since the last is active', () => {
  //     let view1 = new ViewController(Page1);
  //     view1.state = STATE_INACTIVE;
  //     let view2 = new ViewController(Page2);
  //     view2.state = STATE_ACTIVE;
  //     nav._views = [view1, view2];
  //     nav._cleanup();
  //     expect(nav.length()).toBe(2);
  //   });

  //   it('should call destroy for each view to be destroyed', () => {
  //     let view1 = new ViewController(Page1);
  //     view1.state = STATE_ACTIVE;
  //     let view2 = new ViewController(Page2);
  //     view2.state = STATE_INACTIVE;
  //     let view3 = new ViewController(Page3);
  //     view3.state = STATE_INACTIVE;
  //     nav._views = [view1, view2, view3];

  //     spyOn(view1, 'destroy');
  //     spyOn(view2, 'destroy');
  //     spyOn(view3, 'destroy');

  //     nav._cleanup();

  //     expect(nav.length()).toBe(1);
  //     expect(view1._willUnload).not.toHaveBeenCalled();
  //     expect(view2._willUnload).toHaveBeenCalled();
  //     expect(view3._willUnload).toHaveBeenCalled();
  //   });

  //   it('should reset zIndexes if their is a negative zindex', () => {
  //     let view1 = new ViewController(Page1);
  //     view1._setPageElementRef( mockElementRef() );
  //     view1.state = STATE_INACTIVE;
  //     view1._zIndex = -1;

  //     let view2 = new ViewController(Page2);
  //     view2._setPageElementRef( mockElementRef() );
  //     view2.state = STATE_INACTIVE;
  //     view2._zIndex = 0;

  //     let view3 = new ViewController(Page3);
  //     view3._setPageElementRef( mockElementRef() );
  //     view3.state = STATE_ACTIVE;
  //     view3._zIndex = 1;

  //     nav._views = [view1, view2, view3];
  //     nav._cleanup();

  //     expect(view1._zIndex).toEqual(100);
  //     expect(view2._zIndex).toEqual(101);
  //     expect(view3._zIndex).toEqual(102);
  //   });
  // });

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
