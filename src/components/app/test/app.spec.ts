import { App } from '../app';
import { ClickBlock } from '../click-block';
import { Config } from '../../../config/config';
import { MockPlatform, mockApp, mockConfig, mockElementRef, mockNavController, mockPlatform, mockRenderer, mockTab, mockTabs, mockView, mockViews } from '../../../util/mock-providers';
import { OverlayPortal } from '../overlay-portal';
import { PORTAL_MODAL } from '../app-constants';


describe('App', () => {

  describe('goBack', () => {

    it('should not select the previous tab', (done: Function) => {
      const nav = mockNavController();
      app.registerRootNav(nav);

      const tabs = mockTabs();
      const tab1 = mockTab(tabs);
      const tab2 = mockTab(tabs);

      tab1.root = 'Page1';
      tab2.root = 'Page2';

      nav.registerChildNav(tabs);

      tabs.select(tab1).then(() => {
        return tabs.select(tab2);
      }).then(() => {
        expect(tabs._selectHistory).toEqual([tab1.id, tab2.id]);
        spyOn(plt, 'exitApp');
        spyOn(tabs, 'select');
        spyOn(tab1, 'pop');
        spyOn(tab2, 'pop');
        spyOn(portal, 'pop');
        return app.goBack();
      }).then(() => {
        expect(tabs.select).not.toHaveBeenCalled();
        expect(tab1.pop).not.toHaveBeenCalled();
        expect(tab2.pop).not.toHaveBeenCalled();
        expect(portal.pop).not.toHaveBeenCalled();
        expect(plt.exitApp).toHaveBeenCalled();
        done();
      }).catch((err: Error) => {
        done(err);
      });
    });

    it('should pop from the active tab, when tabs is nested is the root nav', () => {
      const nav = mockNavController();
      app.registerRootNav(nav);

      const tabs = mockTabs();
      mockTab(tabs);
      nav.registerChildNav(tabs);

      const tab1 = mockTab(tabs);
      const tab2 = mockTab(tabs);

      tab2.setSelected(true);

      spyOn(plt, 'exitApp');
      spyOn(tab1, 'pop').and.returnValue(Promise.resolve());
      spyOn(tab2, 'pop').and.returnValue(Promise.resolve());
      spyOn(portal, 'pop');

      const view1 = mockView();
      const view2 = mockView();
      tab2._views = [view1, view2];
      tab1._views = [mockView()];

      app.goBack();

      expect(tab1.pop).not.toHaveBeenCalled();
      expect(tab2.pop).toHaveBeenCalled();
      expect(portal.pop).not.toHaveBeenCalled();
      expect(plt.exitApp).not.toHaveBeenCalled();
    });

    it('should pop from the active tab, when tabs is the root', () => {
      const tabs = mockTabs();
      mockTab(tabs);
      app.registerRootNav(tabs);

      const tab1 = mockTab(tabs);
      const tab2 = mockTab(tabs);

      tab2.setSelected(true);

      spyOn(plt, 'exitApp');
      spyOn(tab1, 'pop').and.returnValue(Promise.resolve());
      spyOn(tab2, 'pop').and.returnValue(Promise.resolve());

      const view1 = mockView();
      const view2 = mockView();
      tab2._views = [view1, view2];

      app.goBack();

      expect(tab1.pop).not.toHaveBeenCalled();
      expect(tab2.pop).toHaveBeenCalled();
      expect(plt.exitApp).not.toHaveBeenCalled();
    });

    it('should pop the root nav when nested nav has less than 2 views', () => {
      const rootNav = mockNavController();
      app.registerRootNav(rootNav);

      const nestedNav = mockNavController();
      nestedNav.parent = rootNav;
      rootNav.registerChildNav(nestedNav);

      spyOn(plt, 'exitApp');
      spyOn(rootNav, 'pop').and.returnValue(Promise.resolve());
      spyOn(nestedNav, 'pop').and.returnValue(Promise.resolve());
      spyOn(portal, 'pop').and.returnValue(Promise.resolve());

      const rootView1 = mockView();
      const rootView2 = mockView();
      mockViews(rootNav, [rootView1, rootView2]);

      const nestedView1 = mockView();
      mockViews(nestedNav, [nestedView1]);

      app.goBack();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(rootNav.pop).toHaveBeenCalled();
      expect(nestedNav.pop).not.toHaveBeenCalled();
      expect(plt.exitApp).not.toHaveBeenCalled();
    });

    it('should pop a view from the nested nav that has more than 1 view', () => {
      const rootNav = mockNavController();
      const nestedNav = mockNavController();
      app.registerRootNav(rootNav);
      rootNav.registerChildNav(nestedNav);

      spyOn(plt, 'exitApp');
      spyOn(rootNav, 'pop');
      spyOn(nestedNav, 'pop').and.returnValue(Promise.resolve());
      spyOn(portal, 'pop');

      const rootView1 = mockView();
      const rootView2 = mockView();
      mockViews(rootNav, [rootView1, rootView2]);

      const nestedView1 = mockView();
      const nestedView2 = mockView();
      mockViews(nestedNav, [nestedView1, nestedView2]);

      app.goBack();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(rootNav.pop).not.toHaveBeenCalled();
      expect(nestedNav.pop).toHaveBeenCalled();
      expect(plt.exitApp).not.toHaveBeenCalled();
    });

    it('should pop the overlay in the portal of the root nav', (done: Function) => {
      const nav = mockNavController();
      app.registerRootNav(nav);

      spyOn(plt, 'exitApp');
      spyOn(nav, 'pop');
      spyOn(portal, 'pop').and.returnValue(Promise.resolve());

      const view1 = mockView();
      const view2 = mockView();
      mockViews(nav, [view1, view2]);

      const overlay1 = mockView();
      mockViews(portal, [overlay1]);

      app.goBack().then(() => {
        expect(portal.pop).toHaveBeenCalled();
        expect(nav.pop).not.toHaveBeenCalled();
        expect(plt.exitApp).not.toHaveBeenCalled();
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
        });
    });

    it('should pop the second view in the root nav', () => {
      const nav = mockNavController();
      app.registerRootNav(nav);

      spyOn(plt, 'exitApp');
      spyOn(nav, 'pop').and.returnValue(Promise.resolve());
      spyOn(portal, 'pop');

      const view1 = mockView();
      const view2 = mockView();
      mockViews(nav, [view1, view2]);

      app.goBack();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(nav.pop).toHaveBeenCalled();
      expect(plt.exitApp).not.toHaveBeenCalled();
    });

    it('should exit app when only one view in the root nav', () => {
      const nav = mockNavController();
      app.registerRootNav(nav);

      spyOn(plt, 'exitApp');
      spyOn(nav, 'pop');
      spyOn(portal, 'pop');

      const view1 = mockView();
      mockViews(nav, [view1]);

      expect(app.getActiveNavs(nav.id)[0]).toBe(nav);
      expect(nav.first()).toBe(view1);

      app.goBack();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(nav.pop).not.toHaveBeenCalled();
      expect(plt.exitApp).toHaveBeenCalled();
    });

    it('should not exit app when only one view in the root nav, but navExitApp config set', () => {
      const nav = mockNavController();
      app.registerRootNav(nav);

      spyOn(plt, 'exitApp');
      spyOn(nav, 'pop');
      spyOn(portal, 'pop');

      config.set('navExitApp', false);

      const view1 = mockView();
      mockViews(nav, [view1]);

      expect(app.getActiveNavs(nav.id)[0]).toBe(nav);
      expect(nav.first()).toBe(view1);

      app.goBack();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(nav.pop).not.toHaveBeenCalled();
      expect(plt.exitApp).not.toHaveBeenCalled();
    });

    it('should not go back if app is not enabled', () => {
      const nav = mockNavController();
      app.registerRootNav(nav);

      spyOn(plt, 'exitApp');
      spyOn(nav, 'pop');
      spyOn(portal, 'pop');

      const view1 = mockView();
      mockViews(nav, [view1]);

      app.setEnabled(false, 10000);

      app.goBack();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(nav.pop).not.toHaveBeenCalled();
      expect(plt.exitApp).not.toHaveBeenCalled();
    });

    it('should not go back if there is no root nav', () => {
      spyOn(plt, 'exitApp');

      app.goBack();

      expect(plt.exitApp).not.toHaveBeenCalled();
    });

    it('should first pop the from the nav controller with the most recent view, then pop subsequent views, and eventually exit the app when there isnt anything left to pop', () => {
      const nav = mockNavController();
      app.registerRootNav(nav);

      const navTwo = mockNavController();
      app.registerRootNav(navTwo);

      spyOn(plt, 'exitApp');
      spyOn(nav, 'pop').and.returnValue(Promise.resolve());
      spyOn(navTwo, 'pop').and.returnValue(Promise.resolve());
      spyOn(portal, 'pop');

      const view1 = mockView();
      const view2 = mockView();
      mockViews(nav, [view1, view2]);

      const view3 = mockView();
      view3._ts = view3._ts + 1000;
      const view4 = mockView();
      view4._ts = view4._ts + 1000;
      mockViews(navTwo, [view3, view4]);

      app.goBack();

      mockViews(navTwo, [view3]);

      expect(portal.pop).not.toHaveBeenCalled();
      expect(nav.pop).not.toHaveBeenCalled();
      expect(navTwo.pop).toHaveBeenCalled();
      expect(plt.exitApp).not.toHaveBeenCalled();

      app.goBack();
      expect(nav.pop).toHaveBeenCalled();

      mockViews(nav, [view1]);

      app.goBack();
      expect(plt.exitApp).toHaveBeenCalled();
    });
  });

  describe('getActiveNavs', () => {

    it('should get active NavController when using tabs with nested nav', () => {
      const nav = mockNavController();
      app.registerRootNav(nav);

      const tabs = mockTabs();
      const tab1 = mockTab(tabs);
      const tab2 = mockTab(tabs);
      nav.registerChildNav(tabs);

      tab2.setSelected(true);
      const nav2 = mockNavController();
      nav2.name = 'nav2';
      const nav3 = mockNavController();
      nav3.name = 'nav3';
      const nav4 = mockNavController();
      nav4.name = 'nav4';

      tab1.registerChildNav(nav4);
      // tab 2 registers two child navs!!
      tab2.registerChildNav(nav2);
      tab2.registerChildNav(nav3);

      const activeNavs = app.getActiveNavs(nav.id);
      expect(activeNavs.length).toEqual(2);
      expect(activeNavs[0]).toEqual(nav2);
      expect(activeNavs[1]).toEqual(nav3);

      const activeNavsTwo = app.getActiveNavs();
      expect(activeNavsTwo.length).toEqual(2);
      expect(activeNavsTwo[0]).toEqual(nav2);
      expect(activeNavsTwo[1]).toEqual(nav3);
    });

    it('should get active NavController when using tabs, nested in a root nav', () => {
      const nav = mockNavController();
      app.registerRootNav(nav);

      const tabs = mockTabs();
      mockTab(tabs);
      const tab2 = mockTab(tabs);
      const tab3 = mockTab(tabs);
      nav.registerChildNav(tabs);

      tab2.setSelected(true);

      expect(app.getActiveNavs(nav.id)[0]).toBe(tab2);
      expect(app.getActiveNavs()[0]).toBe(tab2);

      tab2.setSelected(false);
      tab3.setSelected(true);
      expect(app.getActiveNavs(nav.id)[0]).toBe(tab3);
      expect(app.getActiveNavs()[0]).toBe(tab3);
    });

    it('should get active tab NavController when using tabs, and tabs is the root', () => {
      const tabs = mockTabs();
      mockTab(tabs);
      const tab2 = mockTab(tabs);
      const tab3 = mockTab(tabs);
      app.registerRootNav(tabs);

      tab2.setSelected(true);

      expect(app.getActiveNavs(tabs.id)[0]).toBe(tab2);
      expect(app.getActiveNavs()[0]).toBe(tab2);

      tab2.setSelected(false);
      tab3.setSelected(true);
      expect(app.getActiveNavs(tabs.id)[0]).toBe(tab3);
      expect(app.getActiveNavs()[0]).toBe(tab3);
    });

    it('should get active NavController when nested 3 deep', () => {
      const nav1 = mockNavController();
      const nav2 = mockNavController();
      const nav3 = mockNavController();
      app.registerRootNav(nav1);

      nav1.registerChildNav(nav2);
      nav2.registerChildNav(nav3);

      expect(app.getActiveNavs(nav1.id)[0]).toBe(nav3);
      expect(app.getActiveNavs()[0]).toBe(nav3);
      expect(app.getActiveNavs().length).toBe(1);
    });

    it('should get active NavController when nested 2 deep', () => {
      const nav1 = mockNavController();
      const nav2 = mockNavController();
      app.registerRootNav(nav1);

      nav1.registerChildNav(nav2);

      const activeNav = app.getActiveNavs(nav1.id)[0];

      expect(activeNav).toBe(nav2);

      expect(app.getActiveNavs()[0]).toBe(nav2);
    });

    it('should get active NavController when only one nav controller', () => {
      const nav = mockNavController();
      app.registerRootNav(nav);
      expect(app.getActiveNavs(nav.id)[0]).toBe(nav);
      expect(app.getActiveNavs()[0]).toBe(nav);
    });

    it('should set/get the root nav controller', () => {
      const nav = mockNavController();
      app.registerRootNav(nav);
      expect(app.getRootNavById(nav.id)).toBe(nav);
    });

    it('should not get an active NavController if there is not root set', () => {
      const activeNavs = app.getActiveNavs();
      const rootNav = app.getRootNavById('');
      expect(activeNavs.length).toEqual(0);
      expect(rootNav).toBeFalsy();
    });

    it('should just work when there are multiple active navs', () => {
      const rootNavOne = mockNavController();
      const rootNavTwo = mockNavController();

      app.registerRootNav(rootNavOne);
      app.registerRootNav(rootNavTwo);

      const childNavOne = mockNavController();
      const childNavTwo = mockNavController();

      rootNavOne.registerChildNav(childNavOne);
      rootNavTwo.registerChildNav(childNavTwo);

      const activeNavOne = app.getActiveNavs(rootNavOne.id)[0];
      const activeNavTwo = app.getActiveNavs(rootNavTwo.id)[0];

      expect(activeNavOne).toBe(childNavOne);
      expect(activeNavTwo).toBe(childNavTwo);

      expect(app.getActiveNavs()[0]).toBe(childNavOne);
      expect(app.getActiveNavs()[1]).toBe(childNavTwo);
    });

    it('should get the active nav when no id is provided assuming there is one nav', () => {
      const rootNavOne = mockNavController();
      app.registerRootNav(rootNavOne);

      const childNavOne = mockNavController();
      rootNavOne.registerChildNav(childNavOne);

      const result = app.getActiveNavs()[0];

      expect(result).toEqual(childNavOne);
    });

    it('should return the all the active navs when there is not an id passed', () => {
      const rootNavOne = mockNavController();
      app.registerRootNav(rootNavOne);

      const rootNavTwo = mockNavController();
      app.registerRootNav(rootNavTwo);

      const childNavOne = mockNavController();
      rootNavOne.registerChildNav(childNavOne);

      const childChildNavOne = mockNavController();
      childNavOne.registerChildNav(childChildNavOne);

      const childNavTwo = mockNavController();
      rootNavTwo.registerChildNav(childNavTwo);

      const childChildNavTwo = mockNavController();
      childNavTwo.registerChildNav(childChildNavTwo);

      const results = app.getActiveNavs();
      expect(results.length).toEqual(2);
      expect(results[0]).toEqual(childChildNavOne);
      expect(results[1]).toEqual(childChildNavTwo);

      const withIdResultsOne = app.getActiveNavs(rootNavOne.id);
      expect(withIdResultsOne.length).toEqual(1);
      expect(withIdResultsOne[0]).toEqual(childChildNavOne);

      const withIdResultsTwo = app.getActiveNavs(rootNavTwo.id);
      expect(withIdResultsTwo.length).toEqual(1);
      expect(withIdResultsTwo[0]).toEqual(childChildNavTwo);
    });
  });

  describe('getActiveNav', () => {
    it('should get active NavController when using tabs with nested nav', () => {
      const nav = mockNavController();
      app.registerRootNav(nav);

      const tabs = mockTabs();
      const tab1 = mockTab(tabs);
      const tab2 = mockTab(tabs);
      nav.registerChildNav(tabs);

      tab2.setSelected(true);
      const nav2 = mockNavController();
      nav2.name = 'nav2';
      const nav3 = mockNavController();
      nav3.name = 'nav3';
      const nav4 = mockNavController();
      nav4.name = 'nav4';

      tab1.registerChildNav(nav4);
      // tab 2 registers two child navs!!
      tab2.registerChildNav(nav2);
      tab2.registerChildNav(nav3);

      const activeNav = app.getActiveNav();
      expect(activeNav).toEqual(nav2);
    });

    it('should get active NavController when using tabs, nested in a root nav', () => {
      const nav = mockNavController();
      app.registerRootNav(nav);

      const tabs = mockTabs();
      mockTab(tabs);
      const tab2 = mockTab(tabs);
      const tab3 = mockTab(tabs);
      nav.registerChildNav(tabs);

      tab2.setSelected(true);

      expect(app.getActiveNav()).toBe(tab2);

      tab2.setSelected(false);
      tab3.setSelected(true);
      expect(app.getActiveNav()).toBe(tab3);
    });

    it('should get active tab NavController when using tabs, and tabs is the root', () => {
      const tabs = mockTabs();
      mockTab(tabs);
      const tab2 = mockTab(tabs);
      const tab3 = mockTab(tabs);
      app.registerRootNav(tabs);

      tab2.setSelected(true);

      expect(app.getActiveNav()).toBe(tab2);

      tab2.setSelected(false);
      tab3.setSelected(true);
      expect(app.getActiveNav()).toBe(tab3);
    });

    it('should get active NavController when nested 3 deep', () => {
      const nav1 = mockNavController();
      const nav2 = mockNavController();
      const nav3 = mockNavController();
      app.registerRootNav(nav1);

      nav1.registerChildNav(nav2);
      nav2.registerChildNav(nav3);

      expect(app.getActiveNav()).toBe(nav3);
    });

    it('should get active NavController when nested 2 deep', () => {
      const nav1 = mockNavController();
      const nav2 = mockNavController();
      app.registerRootNav(nav1);

      nav1.registerChildNav(nav2);

      const activeNav = app.getActiveNav();

      expect(activeNav).toBe(nav2);
    });

    it('should get active NavController when only one nav controller', () => {
      const nav = mockNavController();
      app.registerRootNav(nav);
      expect(app.getActiveNav()).toBe(nav);
    });

    it('should not get an active NavController if there is not root set', () => {
      const activeNav = app.getActiveNav();
      expect(activeNav).toBeFalsy();
    });

    it('should just work when there are multiple active navs', () => {
      const rootNavOne = mockNavController();
      const rootNavTwo = mockNavController();

      app.registerRootNav(rootNavOne);
      app.registerRootNav(rootNavTwo);

      const childNavOne = mockNavController();
      const childNavTwo = mockNavController();

      rootNavOne.registerChildNav(childNavOne);
      rootNavTwo.registerChildNav(childNavTwo);

      const activeNavOne = app.getActiveNav();

      expect(activeNavOne).toBe(childNavOne);
    });

    it('should get the active nav when no id is provided assuming there is one nav', () => {
      const rootNavOne = mockNavController();
      app.registerRootNav(rootNavOne);

      const childNavOne = mockNavController();
      rootNavOne.registerChildNav(childNavOne);

      const result = app.getActiveNav();

      expect(result).toEqual(childNavOne);
    });
  });

  describe('getRootNavs', () => {
    it('should return an array of navs', () => {
      const rootNavOne = mockNavController();
      app.registerRootNav(rootNavOne);
      const rootNavTwo = mockNavController();
      app.registerRootNav(rootNavTwo);

      const results = app.getRootNavs();
      expect(results.length).toEqual(2);
    });
  });

  describe('getRootNav', () => {
    it('should return the single root nav', () => {
      const rootNavOne = mockNavController();
      app.registerRootNav(rootNavOne);
      const result = app.getRootNav();
      expect(result).toEqual(rootNavOne);
    });

    it('should return the first nav in the list for backwards compatibility', () => {
      const rootNavOne = mockNavController();
      app.registerRootNav(rootNavOne);
      const rootNavTwo = mockNavController();
      app.registerRootNav(rootNavTwo);

      const result = app.getRootNav();
      expect(result).toEqual(rootNavOne);
    });
  });

  describe('setEnabled', () => {

    it('should disable click block when app is enabled', (done) => {
      plt = mockPlatform();
      app._clickBlock = new ClickBlock(app, mockConfig(), plt, mockElementRef(), mockRenderer());

      spyOn(app._clickBlock, '_activate');

      app.setEnabled(true);

      expect(app._clickBlock._activate).not.toHaveBeenCalledWith();

      plt.flushTimeouts(() => {
        expect(app._clickBlock._activate).toHaveBeenCalledWith(false);
        done();
      });
    });

    it('should enable click block when false is passed with duration', () => {
      // arrange
      const mockClickBlock: any = {
        activate: () => {}
      };

      spyOn(mockClickBlock, 'activate');

      app._clickBlock = mockClickBlock;

      // act
      app.setEnabled(false, 200);

      // assert
      expect(mockClickBlock.activate).toHaveBeenCalledWith(true, 200 + 64, 0);
    });

    it('should enable click block when false is passed w/o duration', () => {
      // arrange
      const mockClickBlock: any = {
        activate: () => {}
      };

      spyOn(mockClickBlock, 'activate');

      app._clickBlock = mockClickBlock;

      // act
      app.setEnabled(false);

      // assert
      // 700 is the default
      expect(mockClickBlock.activate).toHaveBeenCalledWith(true, 700 + 64, 0);
    });

    it('should enable click block when false is passed with a duration of 0 and with a minDuration', () => {
      // arrange
      const mockClickBlock: any = {
        activate: () => {}
      };

      spyOn(mockClickBlock, 'activate');

      app._clickBlock = mockClickBlock;

      // act
      app.setEnabled(false, 0, 400);

      // assert
      expect(mockClickBlock.activate).toHaveBeenCalledWith(true, 64, 400);
    });

    it('should enable click block when false is passed with a null duration and a minDuration', () => {
      // arrange
      const mockClickBlock: any = {
        activate: () => {}
      };

      spyOn(mockClickBlock, 'activate');

      app._clickBlock = mockClickBlock;

      // act
      app.setEnabled(false, null, 400);

      // assert
      expect(mockClickBlock.activate).toHaveBeenCalledWith(true, 64, 400);
    });

    it('should enable click block when false is passed with a duration and a minDuration', () => {
      // arrange
      const mockClickBlock: any = {
        activate: () => {}
      };

      spyOn(mockClickBlock, 'activate');

      app._clickBlock = mockClickBlock;

      // act
      app.setEnabled(false, 200, 400);

      // assert
      expect(mockClickBlock.activate).toHaveBeenCalledWith(true, 200 + 64, 400);
    });
  });

  describe('getNavByIdOrName', () => {
    it('should return a basic root nav', () => {
      const nav = mockNavController();
      app.registerRootNav(nav);
      const result = app.getNavByIdOrName(nav.id);
      expect(result).toEqual(nav);
    });

    it('should return a child nav', () => {
      const rootNav = mockNavController();
      app.registerRootNav(rootNav);

      const childNav = mockNavController();
      childNav.parent = rootNav;
      rootNav.registerChildNav(childNav);

      const childChildNav = mockNavController();
      childChildNav.parent = childNav;
      childNav.registerChildNav(childChildNav);


      const expectedChildNav = app.getNavByIdOrName(childNav.id);
      expect(expectedChildNav).toEqual(childNav);

      const expectedChildChildNav = app.getNavByIdOrName(childChildNav.id);
      expect(expectedChildChildNav).toEqual(childChildNav);
    });

    it('should return a child nav when there is a tabs in there', () => {
      const rootNav = mockNavController();
      app.registerRootNav(rootNav);

      const tabs = mockTabs();
      tabs.parent = rootNav;
      rootNav.registerChildNav(tabs);

      const tab1 = mockTab(tabs);
      const tab2 = mockTab(tabs);
      const tab3 = mockTab(tabs);

      const tabChildNav = mockNavController();
      tabChildNav.parent = tab2;
      tab2.registerChildNav(tabChildNav);

      const tabChildChildNav = mockNavController();
      tabChildChildNav.parent = tabChildNav;
      tabChildNav.registerChildNav(tabChildChildNav);

      const expectedTab1 = app.getNavByIdOrName(tab1.id);
      expect(expectedTab1).toEqual(tab1);

      const expectedTab2 = app.getNavByIdOrName(tab2.id);
      expect(expectedTab2).toEqual(tab2);

      const expectedTab3 = app.getNavByIdOrName(tab3.id);
      expect(expectedTab3).toEqual(tab3);

      const expectedTabChildNav = app.getNavByIdOrName(tabChildNav.id);
      expect(expectedTabChildNav).toEqual(tabChildNav);

      const expectedTabChildChildNav = app.getNavByIdOrName(tabChildChildNav.id);
      expect(expectedTabChildChildNav).toEqual(tabChildChildNav);
    });

    it('should return a basic root nav when the are multiple root navs', () => {
      const rootNavOne = mockNavController();
      const rootNavTwo = mockNavController();
      const rootNavThree = mockNavController();
      app.registerRootNav(rootNavOne);
      app.registerRootNav(rootNavTwo);
      app.registerRootNav(rootNavThree);

      const expectedRootNavOne = app.getNavByIdOrName(rootNavOne.id);
      expect(expectedRootNavOne).toEqual(rootNavOne);

      const expectedRootNavTwo = app.getNavByIdOrName(rootNavTwo.id);
      expect(expectedRootNavTwo).toEqual(rootNavTwo);

      const expectedRootNavThree = app.getNavByIdOrName(rootNavThree.id);
      expect(expectedRootNavThree).toEqual(rootNavThree);
    });

    it('should return a proper navs when there are multiple root navs with nested navs', () => {
      const rootNavOne = mockNavController();
      const rootNavTwo = mockNavController();
      const rootNavThree = mockNavController();
      app.registerRootNav(rootNavOne);
      app.registerRootNav(rootNavTwo);
      app.registerRootNav(rootNavThree);

      const childNavOne = mockNavController();
      childNavOne.parent = rootNavOne;
      rootNavOne.registerChildNav(childNavOne);

      const childChildNavOne = mockNavController();
      childChildNavOne.parent = childNavOne;
      childNavOne.registerChildNav(childChildNavOne);

      const childNavTwo = mockNavController();
      childNavOne.parent = rootNavTwo;
      rootNavTwo.registerChildNav(childNavTwo);

      const childChildNavTwo = mockNavController();
      childChildNavTwo.parent = childNavTwo;
      childNavTwo.registerChildNav(childChildNavTwo);

      const childNavThree = mockNavController();
      childNavThree.parent = rootNavThree;
      rootNavThree.registerChildNav(childNavThree);

      const childChildNavThree = mockNavController();
      childChildNavThree.parent = childNavThree;
      childNavThree.registerChildNav(childChildNavThree);

      const expectedRootNavOne = app.getNavByIdOrName(rootNavOne.id);
      expect(expectedRootNavOne).toEqual(rootNavOne);

      const expectedChildNavOne = app.getNavByIdOrName(childNavOne.id);
      expect(expectedChildNavOne).toEqual(childNavOne);

      const expectedChildChildNavOne = app.getNavByIdOrName(childChildNavOne.id);
      expect(expectedChildChildNavOne).toEqual(childChildNavOne);

      const expectedRootNavTwo = app.getNavByIdOrName(rootNavTwo.id);
      expect(expectedRootNavTwo).toEqual(rootNavTwo);

      const expectedChildNavTwo = app.getNavByIdOrName(childNavTwo.id);
      expect(expectedChildNavTwo).toEqual(childNavTwo);

      const expectedChildChildNavTwo = app.getNavByIdOrName(childChildNavTwo.id);
      expect(expectedChildChildNavTwo).toEqual(childChildNavTwo);

      const expectedRootNavThree = app.getNavByIdOrName(rootNavThree.id);
      expect(expectedRootNavThree).toEqual(rootNavThree);

      const expectedChildNavThree = app.getNavByIdOrName(childNavThree.id);
      expect(expectedChildNavThree).toEqual(childNavThree);

      const expectedChildChildNavThree = app.getNavByIdOrName(childChildNavThree.id);
      expect(expectedChildChildNavThree).toEqual(childChildNavThree);
    });
  });

  let app: App;
  let config: Config;
  let plt: MockPlatform;
  let portal: OverlayPortal;

  beforeEach(() => {
    config = mockConfig();
    plt = mockPlatform();
    app = mockApp(config, plt);
    portal = app._appRoot._getPortal(PORTAL_MODAL);
  });

});
