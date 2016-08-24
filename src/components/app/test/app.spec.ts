import { App } from '../app';
import { Config } from '../../../config/config';
import { mockApp, mockConfig, mockNavController, mockPlatform, mockTab, mockTabs, mockView, mockViews } from '../../../util/mock-providers';
import { OverlayPortal } from '../../nav/overlay-portal';
import { Platform } from '../../../platform/platform';


describe('App', () => {

  describe('navPop', () => {

    it('should select the previous tab', () => {
      let nav = mockNavController();
      app._setRootNav(nav);

      let tabs = mockTabs();
      let tab1 = mockTab(tabs);
      let tab2 = mockTab(tabs);
      nav.registerChildNav(tabs);

      tabs.select(tab1);
      tabs.select(tab2);

      expect(tabs._selectHistory).toEqual([tab1.id, tab2.id]);

      spyOn(platform, 'exitApp');
      spyOn(tabs, 'select');
      spyOn(tab1, 'pop');
      spyOn(tab2, 'pop');
      spyOn(portal, 'pop');

      app.navPop();

      expect(tabs.select).toHaveBeenCalledWith(tab1);
      expect(tab1.pop).not.toHaveBeenCalled();
      expect(tab2.pop).not.toHaveBeenCalled();
      expect(portal.pop).not.toHaveBeenCalled();
      expect(platform.exitApp).not.toHaveBeenCalled();
    });

    it('should pop from the active tab, when tabs is nested is the root nav', () => {
      let nav = mockNavController();
      app._setRootNav(nav);

      let tabs = mockTabs();
      mockTab(tabs);
      let tab2 = mockTab(tabs);
      mockTab(tabs);
      nav.registerChildNav(tabs);

      tab2.setSelected(true);

      spyOn(platform, 'exitApp');
      spyOn(tab2, 'pop');
      spyOn(portal, 'pop');

      let view1 = mockView();
      let view2 = mockView();
      tab2._views = [view1, view2];

      app.navPop();

      expect(tab2.pop).toHaveBeenCalled();
      expect(portal.pop).not.toHaveBeenCalled();
      expect(platform.exitApp).not.toHaveBeenCalled();
    });

    it('should pop from the active tab, when tabs is the root', () => {
      let tabs = mockTabs();
      mockTab(tabs);
      let tab2 = mockTab(tabs);
      mockTab(tabs);
      app._setRootNav(tabs);

      tab2.setSelected(true);

      spyOn(platform, 'exitApp');
      spyOn(tab2, 'pop');

      let view1 = mockView();
      let view2 = mockView();
      tab2._views = [view1, view2];

      app.navPop();

      expect(tab2.pop).toHaveBeenCalled();
      expect(platform.exitApp).not.toHaveBeenCalled();
    });

    it('should pop the root nav when nested nav has less than 2 views', () => {
      let rootNav = mockNavController();
      let nestedNav = mockNavController();
      rootNav.registerChildNav(nestedNav);
      nestedNav.parent = rootNav;
      app._setRootNav(rootNav);

      spyOn(platform, 'exitApp');
      spyOn(rootNav, 'pop');
      spyOn(nestedNav, 'pop');
      spyOn(portal, 'pop');

      let rootView1 = mockView();
      let rootView2 = mockView();
      mockViews(rootNav, [rootView1, rootView2]);

      let nestedView1 = mockView();
      mockViews(nestedNav, [nestedView1]);

      app.navPop();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(rootNav.pop).toHaveBeenCalled();
      expect(nestedNav.pop).not.toHaveBeenCalled();
      expect(platform.exitApp).not.toHaveBeenCalled();
    });

    it('should pop a view from the nested nav that has more than 1 view', () => {
      let rootNav = mockNavController();
      let nestedNav = mockNavController();
      app._setRootNav(rootNav);
      rootNav.registerChildNav(nestedNav);

      spyOn(platform, 'exitApp');
      spyOn(rootNav, 'pop');
      spyOn(nestedNav, 'pop');
      spyOn(portal, 'pop');

      let rootView1 = mockView();
      let rootView2 = mockView();
      mockViews(rootNav, [rootView1, rootView2]);

      let nestedView1 = mockView();
      let nestedView2 = mockView();
      mockViews(nestedNav, [nestedView1, nestedView2]);

      app.navPop();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(rootNav.pop).not.toHaveBeenCalled();
      expect(nestedNav.pop).toHaveBeenCalled();
      expect(platform.exitApp).not.toHaveBeenCalled();
    });

    it('should pop the overlay in the portal of the root nav', () => {
      let nav = mockNavController();
      app._setRootNav(nav);

      spyOn(platform, 'exitApp');
      spyOn(nav, 'pop');
      spyOn(portal, 'pop');

      let view1 = mockView();
      let view2 = mockView();
      mockViews(nav, [view1, view2]);

      let overlay1 = mockView();
      mockViews(portal, [overlay1]);

      app.navPop();

      expect(portal.pop).toHaveBeenCalled();
      expect(nav.pop).not.toHaveBeenCalled();
      expect(platform.exitApp).not.toHaveBeenCalled();
    });

    it('should pop the second view in the root nav', () => {
      let nav = mockNavController();
      app._setRootNav(nav);

      spyOn(platform, 'exitApp');
      spyOn(nav, 'pop');
      spyOn(portal, 'pop');

      let view1 = mockView();
      let view2 = mockView();
      mockViews(nav, [view1, view2]);

      app.navPop();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(nav.pop).toHaveBeenCalled();
      expect(platform.exitApp).not.toHaveBeenCalled();
    });

    it('should exit app when only one view in the root nav', () => {
      let nav = mockNavController();
      app._setRootNav(nav);

      spyOn(platform, 'exitApp');
      spyOn(nav, 'pop');
      spyOn(portal, 'pop');

      let view1 = mockView();
      mockViews(nav, [view1]);

      expect(app.getActiveNav()).toBe(nav);
      expect(nav.first()).toBe(view1);

      app.navPop();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(nav.pop).not.toHaveBeenCalled();
      expect(platform.exitApp).toHaveBeenCalled();
    });

    it('should not exit app when only one view in the root nav, but navExitApp config set', () => {
      let nav = mockNavController();
      app._setRootNav(nav);

      spyOn(platform, 'exitApp');
      spyOn(nav, 'pop');
      spyOn(portal, 'pop');

      config.set('navExitApp', false);

      let view1 = mockView();
      mockViews(nav, [view1]);

      expect(app.getActiveNav()).toBe(nav);
      expect(nav.first()).toBe(view1);

      app.navPop();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(nav.pop).not.toHaveBeenCalled();
      expect(platform.exitApp).not.toHaveBeenCalled();
    });

    it('should not go back if app is not enabled', () => {
      let nav = mockNavController();
      app._setRootNav(nav);

      spyOn(platform, 'exitApp');
      spyOn(nav, 'pop');
      spyOn(portal, 'pop');

      let view1 = mockView();
      mockViews(nav, [view1]);

      app.setEnabled(false, 10000);

      app.navPop();

      expect(portal.pop).not.toHaveBeenCalled();
      expect(nav.pop).not.toHaveBeenCalled();
      expect(platform.exitApp).not.toHaveBeenCalled();
    });

    it('should not go back if there is no root nav', () => {
      spyOn(platform, 'exitApp');

      app.navPop();

      expect(platform.exitApp).not.toHaveBeenCalled();
    });

  });

  describe('getActiveNav', () => {

    it('should get active NavController when using tabs with nested nav', () => {
      let nav = mockNavController();
      app._setRootNav(nav);

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

      expect(app.getActiveNav()).toBe(nav3);
    });

    it('should get active NavController when using tabs, nested in a root nav', () => {
      let nav = mockNavController();
      app._setRootNav(nav);

      let tabs = mockTabs();
      mockTab(tabs);
      let tab2 = mockTab(tabs);
      let tab3 = mockTab(tabs);
      nav.registerChildNav(tabs);

      tab2.setSelected(true);

      expect(app.getActiveNav()).toBe(tab2);

      tab2.setSelected(false);
      tab3.setSelected(true);
      expect(app.getActiveNav()).toBe(tab3);
    });

    it('should get active tab NavController when using tabs, and tabs is the root', () => {
      let tabs = mockTabs();
      mockTab(tabs);
      let tab2 = mockTab(tabs);
      let tab3 = mockTab(tabs);
      app._setRootNav(tabs);

      tab2.setSelected(true);

      expect(app.getActiveNav()).toBe(tab2);

      tab2.setSelected(false);
      tab3.setSelected(true);
      expect(app.getActiveNav()).toBe(tab3);
    });

    it('should get active NavController when nested 3 deep', () => {
      let nav1 = mockNavController();
      let nav2 = mockNavController();
      let nav3 = mockNavController();
      app._setRootNav(nav1);

      nav1.registerChildNav(nav2);
      nav2.registerChildNav(nav3);

      expect(app.getActiveNav()).toBe(nav3);
    });

    it('should get active NavController when nested 2 deep', () => {
      let nav1 = mockNavController();
      let nav2 = mockNavController();
      app._setRootNav(nav1);

      nav1.registerChildNav(nav2);
      expect(app.getActiveNav()).toBe(nav2);
    });

    it('should get active NavController when only one nav controller', () => {
      let nav = mockNavController();
      app._setRootNav(nav);
      expect(app.getActiveNav()).toBe(nav);
    });

    it('should set/get the root nav controller', () => {
      let nav = mockNavController();
      app._setRootNav(nav);
      expect(app.getRootNav()).toBe(nav);
    });

    it('should not get an active NavController if there is not root set', () => {
      expect(app.getActiveNav()).toBeNull();
      expect(app.getRootNav()).toBeNull();
    });
  });

  describe('setEnabled', () => {
    it('should disable click block when app is enabled', () => {
      // arrange
      let mockClickBlock: any = {
        activate: () => {}
      };

      spyOn(mockClickBlock, 'activate');

      app._clickBlock = mockClickBlock;

      // act
      app.setEnabled(true);

      // assert
      expect(mockClickBlock.activate).toHaveBeenCalledWith(false, 0);
    });

    it('should disable click block when app is disabled but duration of less than 32 passed', () => {
      // arrange
      let mockClickBlock: any = {
        activate: () => {}
      };

      spyOn(mockClickBlock, 'activate');

      app._clickBlock = mockClickBlock;

      // act
      app.setEnabled(false, 20);

      // assert
      expect(mockClickBlock.activate).toHaveBeenCalledWith(false, 0);
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
      expect(mockClickBlock.activate).toHaveBeenCalledWith(true, 200 + 64);
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
      expect(mockClickBlock.activate).toHaveBeenCalledWith(true, 700 + 64);
    });
  });

  var app: App;
  var config: Config;
  var platform: Platform;
  var portal: OverlayPortal;

  beforeEach(() => {
    config = mockConfig();
    platform = mockPlatform();
    app = mockApp(config, platform);
    portal = app._appRoot._getPortal();
  });

});
