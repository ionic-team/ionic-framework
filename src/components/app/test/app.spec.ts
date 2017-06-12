import { App } from '../app';
import { ClickBlock } from '../click-block';
import { Config } from '../../../config/config';
import { mockApp, mockConfig, mockElementRef, mockNavController, mockPlatform, MockPlatform, mockRenderer, mockTab, mockTabs, mockView, mockViews } from '../../../util/mock-providers';
import { OverlayPortal } from '../overlay-portal';
import { PORTAL_MODAL } from '../app-constants';


describe('App', () => {

  describe('goBack', () => {

    it('should not select the previous tab', () => {
      const nav = mockNavController();
      app.registerRootNav(nav);

      const tabs = mockTabs();
      const tab1 = mockTab(tabs);
      const tab2 = mockTab(tabs);

      tab1.root = 'Page1';
      tab2.root = 'Page2';

      nav.registerChildNav(tabs);

      tabs.select(tab1);
      tabs.select(tab2);

      expect(tabs._selectHistory).toEqual([tab1.id, tab2.id]);

      spyOn(plt, 'exitApp');
      spyOn(tabs, 'select');
      spyOn(tab1, 'pop');
      spyOn(tab2, 'pop');
      spyOn(portal, 'pop');

      app.goBack();

      expect(tabs.select).not.toHaveBeenCalled();
      expect(tab1.pop).not.toHaveBeenCalled();
      expect(tab2.pop).not.toHaveBeenCalled();
      expect(portal.pop).not.toHaveBeenCalled();
      expect(plt.exitApp).toHaveBeenCalled();
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
      const nestedNav = mockNavController();
      rootNav.registerChildNav(nestedNav);
      nestedNav.parent = rootNav;
      app.registerRootNav(rootNav);

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
      let rootNav = mockNavController();
      let nestedNav = mockNavController();
      app.registerRootNav(rootNav);
      rootNav.registerChildNav(nestedNav);

      spyOn(plt, 'exitApp');
      spyOn(rootNav, 'pop');
      spyOn(nestedNav, 'pop');
      spyOn(portal, 'pop');

      let rootView1 = mockView();
      let rootView2 = mockView();
      mockViews(rootNav, [rootView1, rootView2]);

      let nestedView1 = mockView();
      let nestedView2 = mockView();
      mockViews(nestedNav, [nestedView1, nestedView2]);

      app.goBack();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(rootNav.pop).not.toHaveBeenCalled();
      expect(nestedNav.pop).toHaveBeenCalled();
      expect(plt.exitApp).not.toHaveBeenCalled();
    });

    it('should pop the overlay in the portal of the root nav', (done: Function) => {
      let nav = mockNavController();
      app.registerRootNav(nav);

      spyOn(plt, 'exitApp');
      spyOn(nav, 'pop');
      spyOn(portal, 'pop').and.returnValue(Promise.resolve());

      let view1 = mockView();
      let view2 = mockView();
      mockViews(nav, [view1, view2]);

      let overlay1 = mockView();
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
      let nav = mockNavController();
      app.registerRootNav(nav);

      spyOn(plt, 'exitApp');
      spyOn(nav, 'pop');
      spyOn(portal, 'pop');

      let view1 = mockView();
      let view2 = mockView();
      mockViews(nav, [view1, view2]);

      app.goBack();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(nav.pop).toHaveBeenCalled();
      expect(plt.exitApp).not.toHaveBeenCalled();
    });

    it('should exit app when only one view in the root nav', () => {
      let nav = mockNavController();
      app.registerRootNav(nav);

      spyOn(plt, 'exitApp');
      spyOn(nav, 'pop');
      spyOn(portal, 'pop');

      let view1 = mockView();
      mockViews(nav, [view1]);

      expect(app.getActiveNav(nav.id)).toBe(nav);
      expect(nav.first()).toBe(view1);

      app.goBack();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(nav.pop).not.toHaveBeenCalled();
      expect(plt.exitApp).toHaveBeenCalled();
    });

    it('should not exit app when only one view in the root nav, but navExitApp config set', () => {
      let nav = mockNavController();
      app.registerRootNav(nav);

      spyOn(plt, 'exitApp');
      spyOn(nav, 'pop');
      spyOn(portal, 'pop');

      config.set('navExitApp', false);

      let view1 = mockView();
      mockViews(nav, [view1]);

      expect(app.getActiveNav(nav.id)).toBe(nav);
      expect(nav.first()).toBe(view1);

      app.goBack();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(nav.pop).not.toHaveBeenCalled();
      expect(plt.exitApp).not.toHaveBeenCalled();
    });

    it('should not go back if app is not enabled', () => {
      let nav = mockNavController();
      app.registerRootNav(nav);

      spyOn(plt, 'exitApp');
      spyOn(nav, 'pop');
      spyOn(portal, 'pop');

      let view1 = mockView();
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

  });

  describe('getActiveNav', () => {

    it('should get active NavController when using tabs with nested nav', () => {
      let nav = mockNavController();
      app.registerRootNav(nav);

      let tabs = mockTabs();
      let tab1 = mockTab(tabs);
      let tab2 = mockTab(tabs);
      nav.registerChildNav(tabs);

      tab2.setSelected(true);
      let nav2 = mockNavController();
      let nav3 = mockNavController();
      let nav4 = mockNavController();
      tab1.registerChildNav(nav4);
      tab2.registerChildNav(nav2);
      tab2.registerChildNav(nav3);

      expect(app.getActiveNav(nav.id)).toBe(nav3);
    });

    it('should get active NavController when using tabs, nested in a root nav', () => {
      let nav = mockNavController();
      app.registerRootNav(nav);

      let tabs = mockTabs();
      mockTab(tabs);
      let tab2 = mockTab(tabs);
      let tab3 = mockTab(tabs);
      nav.registerChildNav(tabs);

      tab2.setSelected(true);

      expect(app.getActiveNav(nav.id)).toBe(tab2);

      tab2.setSelected(false);
      tab3.setSelected(true);
      expect(app.getActiveNav(nav.id)).toBe(tab3);
    });

    it('should get active tab NavController when using tabs, and tabs is the root', () => {
      let tabs = mockTabs();
      mockTab(tabs);
      let tab2 = mockTab(tabs);
      let tab3 = mockTab(tabs);
      app.registerRootNav(tabs);

      tab2.setSelected(true);

      expect(app.getActiveNav(tabs.id)).toBe(tab2);

      tab2.setSelected(false);
      tab3.setSelected(true);
      expect(app.getActiveNav(tabs.id)).toBe(tab3);
    });

    it('should get active NavController when nested 3 deep', () => {
      let nav1 = mockNavController();
      let nav2 = mockNavController();
      let nav3 = mockNavController();
      app.registerRootNav(nav1);

      nav1.registerChildNav(nav2);
      nav2.registerChildNav(nav3);

      expect(app.getActiveNav(nav1.id)).toBe(nav3);
    });

    it('should get active NavController when nested 2 deep', () => {
      let nav1 = mockNavController();
      let nav2 = mockNavController();
      app.registerRootNav(nav1);

      nav1.registerChildNav(nav2);

      const activeNav = app.getActiveNav(nav1.id);

      expect(activeNav).toBe(nav2);
    });

    it('should get active NavController when only one nav controller', () => {
      let nav = mockNavController();
      app.registerRootNav(nav);
      expect(app.getActiveNav(nav.id)).toBe(nav);
    });

    it('should set/get the root nav controller', () => {
      let nav = mockNavController();
      app.registerRootNav(nav);
      expect(app.getRootNavById(nav.id)).toBe(nav);
    });

    it('should not get an active NavController if there is not root set', () => {
      const activeNav = app.getActiveNav('');
      const rootNav = app.getRootNavById('');
      expect(activeNav).toBeFalsy();
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

      const activeNavOne = app.getActiveNav(rootNavOne.id);
      const activeNavTwo = app.getActiveNav(rootNavTwo.id);

      expect(activeNavOne).toBe(childNavOne);
      expect(activeNavTwo).toBe(childNavTwo);
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
      let mockClickBlock: any = {
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
      let mockClickBlock: any = {
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
      let mockClickBlock: any = {
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
      let mockClickBlock: any = {
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
      let mockClickBlock: any = {
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

  var app: App;
  var config: Config;
  var plt: MockPlatform;
  var portal: OverlayPortal;

  beforeEach(() => {
    config = mockConfig();
    plt = mockPlatform();
    app = mockApp(config, plt);
    portal = app._appRoot._getPortal(PORTAL_MODAL);
  });

});
