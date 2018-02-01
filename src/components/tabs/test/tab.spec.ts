import { mockTab, mockTabs, mockView, mockViews } from '../../../util/mock-providers';

describe('tab', () => {
  describe('load', () => {
    it('should measure and refresh the tabs', (done: Function) => {
      // TODO - this test is super leaky but I cant come up with a better way short term
      const tabs = mockTabs();
      const tab = mockTab(tabs, false);

      spyOn(tab, 'push');
      spyOn(tab, 'popTo');
      tab.load({}).then(() => {
        expect(tab.push).not.toHaveBeenCalled();
        expect(tab.popTo).not.toHaveBeenCalled();
        done();
      }).catch((err: Error) => {
        done(err);
      });
    });

    it('should reuse the view if its the top view in the stack', (done: Function) => {
      const tabs = mockTabs();
      const tab = mockTab(tabs, false);

      const mockViewOne = mockView('one');
      const mockViewTwo = mockView('two');
      mockViews(tab, [mockViewOne, mockViewTwo]);

      tab._segment = {
        name: 'someValue',
        data: {},
        id: 'taco',
        type: 'tab',
        navId: null,
        secondaryId: null
      };

      mockViewTwo.id = tab._segment.name;

      spyOn(tab, 'push');
      spyOn(tab, 'popTo');

      tab.load({}).then(() => {
        expect(tab.push).not.toHaveBeenCalled();
        expect(tab.popTo).not.toHaveBeenCalled();
        done();
      }).catch((err: Error) => {
        done(err);
      });
    });

    it('should pop back to a previous view if the view exists in the stack', (done: Function) => {
      const tabs = mockTabs();
      const tab = mockTab(tabs, false);

      const mockViewOne = mockView('one');
      const mockViewTwo = mockView('two');
      mockViews(tab, [mockViewOne, mockViewTwo]);

      tab._segment = {
        name: 'someValue',
        data: {},
        id: 'taco',
        type: 'tab',
        navId: null,
        secondaryId: null
      };

      mockViewOne.id = tab._segment.name;

      spyOn(tab, 'push');
      spyOn(tab, 'popTo').and.returnValue(Promise.resolve());

      tab.load({}).then(() => {
        expect(tab.push).not.toHaveBeenCalled();
        expect(tab.popTo).toHaveBeenCalled();
        done();
      }).catch((err: Error) => {
        done(err);
      });
    });

    it('should push the view if it doesnt exist already', (done: Function) => {
      const tabs = mockTabs();
      const tab = mockTab(tabs, false);
      const spy = jasmine.createSpy('done');

      const mockViewOne = mockView('one');
      const mockViewTwo = mockView('two');
      mockViews(tab, [mockViewOne, mockViewTwo]);

      tab._segment = {
        name: 'someValue',
        data: {},
        id: 'taco',
        type: 'tab',
        navId: null,
        secondaryId: null
      };

      spyOn(tab, 'push').and.returnValue(Promise.resolve());
      spyOn(tab, 'popTo');

      const result = tab.load({});
      result.then(() => {
        expect(tab.push).toHaveBeenCalled();
        expect(tab.popTo).not.toHaveBeenCalled();
        expect(spy).not.toHaveBeenCalled();
        done();
      });
    });

  });
});
