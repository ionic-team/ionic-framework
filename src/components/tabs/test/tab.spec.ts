import { mockTab, mockTabs, mockView, mockViews } from '../../../util/mock-providers';

describe('tab', () => {
  describe('load', () => {
    it('should measure and refresh the tabs', () => {
      // TODO - this test is super leaky but I cant come up with a better way short term
      const tabs = mockTabs();
      const tab = mockTab(tabs, false);
      const spy = jasmine.createSpy('done');

      spyOn(tab, 'push');
      spyOn(tab, 'popTo');
      tab.load({}, spy);

      expect(tab.push).not.toHaveBeenCalled();
      expect(tab.popTo).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
    });

    it('should reuse the view if its the top view in the stack', () => {
      const tabs = mockTabs();
      const tab = mockTab(tabs, false);
      const spy = jasmine.createSpy('done');

      const mockViewOne = mockView('one');
      const mockViewTwo = mockView('two');
      mockViews(tab, [mockViewOne, mockViewTwo]);

      tab._lazyRootFromUrl = 'someValue';
      tab._lazyRootFromUrlData = { };

      mockViewTwo.id = tab._lazyRootFromUrl;

      spyOn(tab, 'push');
      spyOn(tab, 'popTo');

      tab.load({}, spy);

      expect(tab.push).not.toHaveBeenCalled();
      expect(tab.popTo).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
    });

    it('should pop back to a previous view if ', () => {
      const tabs = mockTabs();
      const tab = mockTab(tabs, false);
      const spy = jasmine.createSpy('done');

      const mockViewOne = mockView('one');
      const mockViewTwo = mockView('two');
      mockViews(tab, [mockViewOne, mockViewTwo]);

      tab._lazyRootFromUrl = 'someValue';
      tab._lazyRootFromUrlData = { };

      mockViewOne.id = tab._lazyRootFromUrl;

      spyOn(tab, 'push');
      spyOn(tab, 'popTo');

      tab.load({}, spy);

      expect(tab.push).not.toHaveBeenCalled();
      expect(tab.popTo).toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should push the view if it doesnt exist already', () => {
      const tabs = mockTabs();
      const tab = mockTab(tabs, false);
      const spy = jasmine.createSpy('done');

      const mockViewOne = mockView('one');
      const mockViewTwo = mockView('two');
      mockViews(tab, [mockViewOne, mockViewTwo]);

      tab._lazyRootFromUrl = 'someValue';
      tab._lazyRootFromUrlData = { };

      spyOn(tab, 'push');
      spyOn(tab, 'popTo');

      tab.load({}, spy);

      expect(tab.push).toHaveBeenCalled();
      expect(tab.popTo).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

  });
});
