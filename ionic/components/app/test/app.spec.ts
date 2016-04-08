import {IonicApp, Nav, Tabs, Tab, NavOptions, Config, ViewController} from '../../../../ionic';

export function run() {


describe('IonicApp', () => {

  describe('getActiveNav', () => {

    it('should get active NavController when using tabs with nested nav', () => {
      let nav = mockNav();
      app.setRootNav(nav);

      let tabs = mockTabs();
      let tab1 = mockTab(tabs);
      let tab2 = mockTab(tabs);
      nav.registerChildNav(tabs);

      tab2.setSelected(true);
      let nav2 = mockNav();
      let nav3 = mockNav();
      let nav4 = mockNav();
      tab1.registerChildNav(nav4);
      tab2.registerChildNav(nav2);
      tab2.registerChildNav(nav3);

      expect(app.getActiveNav()).toBe(nav3);
    });

    it('should get active NavController when using tabs', () => {
      let nav = mockNav();
      app.setRootNav(nav);

      let tabs = mockTabs();
      let tab1 = mockTab(tabs);
      let tab2 = mockTab(tabs);
      let tab3 = mockTab(tabs);
      nav.registerChildNav(tabs);

      tab2.setSelected(true);

      expect(app.getActiveNav()).toBe(tab2);

      tab2.setSelected(false);
      tab3.setSelected(true);
      expect(app.getActiveNav()).toBe(tab3);
    });

    it('should get active NavController when nested 3 deep', () => {
      let nav1 = mockNav();
      let nav2 = mockNav();
      let nav3 = mockNav();
      app.setRootNav(nav1);

      nav1.registerChildNav(nav2);
      nav2.registerChildNav(nav3);

      expect(app.getActiveNav()).toBe(nav3);
    });

    it('should get active NavController when nested 2 deep', () => {
      let nav1 = mockNav();
      let nav2 = mockNav();
      app.setRootNav(nav1);

      nav1.registerChildNav(nav2);
      expect(app.getActiveNav()).toBe(nav2);
    });

    it('should get active NavController when only one nav controller', () => {
      let nav = mockNav();
      app.setRootNav(nav);
      expect(app.getActiveNav()).toBe(nav);
    });

    it('should set/get the root nav controller', () => {
      let nav = mockNav();
      app.setRootNav(nav);
      expect(app.getRootNav()).toBe(nav);
    });

    it('should not get an active NavController if there is not root set', () => {
      expect(app.getActiveNav()).toBeNull();
      expect(app.getRootNav()).toBeNull();
    });

  });

  var app: IonicApp;
  var config: Config;

  function mockNav(): Nav {
    return new Nav(null,null,null,config,null,null,null,null,null,null);
  }

  function mockTabs(): Tabs {
    return new Tabs(null, null, null, config, null, null, null);
  }

  function mockTab(parentTabs: Tabs): Tab {
    return new Tab(parentTabs,null,config,null,null,null,null,null,null);
  }

  beforeEach(() => {
    config = new Config();
    app = new IonicApp(config, null);
  });

});


}