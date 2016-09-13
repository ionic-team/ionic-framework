import { DeepLinker, normalizeUrl } from '../deep-linker';
import { UrlSerializer } from '../url-serializer';
import { mockApp, mockDeepLinkConfig, mockNavController, mockLocation,
         mockTab, mockTabs, mockViews, mockView, noop,
         MockView1, MockView2, MockView3 } from '../../util/mock-providers';


describe('DeepLinker', () => {

  describe('updateLocation', () => {

    it('should update the browserUrl to / when the passed in url matches indexAliasUrl', () => {
      linker.indexAliasUrl = '/my-special/url';
      linker.updateLocation('/my-special/url', 'forward');
      expect(linker.history[0]).toEqual('/');
    });

    it('should update location.back when back direction and previous url is the same', () => {
      spyOn(linker.location, 'back');
      spyOn(linker.location, 'go');
      spyOn(linker, 'historyPop');
      linker.history = ['first-page', 'some-page', 'current-page'];
      linker.updateLocation('some-page', 'back');
      expect(linker.location.back).toHaveBeenCalled();
      expect(linker.location.go).not.toHaveBeenCalled();
      expect(linker.historyPop).toHaveBeenCalled();
    });

    it('should not update location.go when same as current page', () => {
      spyOn(linker.location, 'back');
      spyOn(linker.location, 'go');
      linker.history = ['current-page'];
      linker.updateLocation('current-page', 'forward');
      expect(linker.location.back).not.toHaveBeenCalled();
      expect(linker.location.go).not.toHaveBeenCalled();
    });

    it('should update location.go when back direction but not actually the previous url', () => {
      spyOn(linker.location, 'back');
      spyOn(linker.location, 'go');
      spyOn(linker, 'historyPush');
      linker.history = ['first-page', 'some-other-page'];
      linker.updateLocation('some-page', 'forward');
      expect(linker.location.back).not.toHaveBeenCalled();
      expect(linker.location.go).toHaveBeenCalledWith('some-page');
      expect(linker.historyPush).toHaveBeenCalledWith('some-page');
    });

    it('should update location.go when forward direction', () => {
      spyOn(linker.location, 'back');
      spyOn(linker.location, 'go');
      spyOn(linker, 'historyPush');
      linker.updateLocation('new-url', 'forward');
      expect(linker.location.back).not.toHaveBeenCalled();
      expect(linker.location.go).toHaveBeenCalledWith('new-url');
      expect(linker.historyPush).toHaveBeenCalledWith('new-url');
    });

  });

  describe('loadViewFromSegment', () => {

    it('should call done if the view is the same as the last one in the stack', () => {
      let nav = mockNavController();
      let view1 = mockView(MockView1);
      view1.id = 'MockPage1';
      let view2 = mockView(MockView2);
      view2.id = 'MockPage2';
      mockViews(nav, [view1, view2]);
      linker.segments = serializer.parse('/MockPage2');

      spyOn(nav, 'push');
      spyOn(nav, 'popTo');

      linker.loadViewFromSegment(nav, noop);

      expect(nav.push).not.toHaveBeenCalled();
      expect(nav.popTo).not.toHaveBeenCalled();
    });

    it('should popTo a view thats already in the stack', () => {
      let nav = mockNavController();
      let view1 = mockView(MockView1);
      view1.id = 'MockPage1';
      let view2 = mockView(MockView2);
      view2.id = 'MockPage2';
      mockViews(nav, [view1, view2]);
      linker.segments = serializer.parse('/MockPage1');

      spyOn(nav, 'push');
      spyOn(nav, 'popTo');

      linker.loadViewFromSegment(nav, noop);

      expect(nav.push).not.toHaveBeenCalled();
      expect(nav.popTo).toHaveBeenCalled();
    });

    it('should push a new page', () => {
      let nav = mockNavController();
      linker.segments = serializer.parse('/MockPage1');

      spyOn(nav, 'push');
      spyOn(nav, 'popTo');

      linker.loadViewFromSegment(nav, noop);

      expect(nav.push).toHaveBeenCalled();
      expect(nav.popTo).not.toHaveBeenCalled();
    });

    it('should call select when its a Tabs nav', () => {
      let tabs = mockTabs();
      mockTab(tabs);
      mockTab(tabs);
      linker.segments = serializer.parse('/MockPage1');

      spyOn(tabs, 'select');

      linker.loadViewFromSegment(tabs, noop);

      expect(tabs.select).toHaveBeenCalled();
    });

    it('should not error when no segment found', () => {
      let calledDone = false;
      let done = () => { calledDone = true; };
      let nav = mockNavController();

      linker.loadViewFromSegment(nav, done);

      expect(calledDone).toEqual(true);
    });

  });

  describe('pathFromNavs', () => {

    it('should climb up through Tab and selected Tabs', () => {
      let nav1 = mockNavController();
      let nav1View1 = mockView(MockView1);
      let nav1View2 = mockView(MockView2);
      mockViews(nav1, [nav1View1, nav1View2]);

      let tabs = mockTabs();
      tabs.parent = nav1;

      mockTab(tabs);
      mockTab(tabs);
      let tab3 = mockTab(tabs);

      let path = linker.pathFromNavs(tab3, MockView3);

      expect(path.length).toEqual(3);
      expect(path[0].id).toEqual('viewtwo');
      expect(path[1].id).toEqual('tab-2');
      expect(path[2].id).toEqual('viewthree');
    });

    it('should climb up two navs to set path', () => {
      let nav1 = mockNavController();
      let nav1View1 = mockView(MockView1);
      mockViews(nav1, [nav1View1]);

      let nav2 = mockNavController();
      nav2.parent = nav1;

      let path = linker.pathFromNavs(nav2, MockView3);

      expect(path.length).toEqual(2);
      expect(path[0].id).toEqual('viewone');
      expect(path[0].name).toEqual('viewone');
      expect(path[1].id).toEqual('viewthree');
      expect(path[1].name).toEqual('viewthree');
    });

    it('should get the path for view and nav', () => {
      let nav = mockNavController();
      let view = MockView1;
      let path = linker.pathFromNavs(nav, view, null);
      expect(path.length).toEqual(1);
      expect(path[0].id).toEqual('viewone');
      expect(path[0].name).toEqual('viewone');
      expect(path[0].component).toEqual(MockView1);
      expect(path[0].data).toEqual(null);
    });

    it('should do nothing if blank nav', () => {
      let path = linker.pathFromNavs(null, null, null);
      expect(path.length).toEqual(0);
    });

  });

  describe('getTabSelector', () => {

    it('should get tab url path selector', () => {
      let tabs = mockTabs();
      let tab1 = mockTab(tabs);
      tab1.tabUrlPath = 'some-tab-url-path';
      tab1.tabTitle = 'My Tab Title';
      expect(linker.getTabSelector(tab1)).toEqual('some-tab-url-path');
    });

    it('should get tab title selector', () => {
      let tabs = mockTabs();
      let tab1 = mockTab(tabs);
      tab1.tabTitle = 'My Tab Title';
      expect(linker.getTabSelector(tab1)).toEqual('my-tab-title');
    });

    it('should get tab-0 selector', () => {
      let tabs = mockTabs();
      let tab1 = mockTab(tabs);
      expect(linker.getTabSelector(tab1)).toEqual('tab-0');
    });

  });

  describe('getSelectedTabIndex', () => {

    it('should select index from tab title', () => {
      let tabs = mockTabs();
      let tab1 = mockTab(tabs);
      let tab2 = mockTab(tabs);
      let tab3 = mockTab(tabs);

      tab1.tabTitle = 'My Account';
      tab2.tabTitle = 'My Contact';
      tab3.tabTitle = 'My Settings!!';

      let selectedIndex = linker.getSelectedTabIndex(tabs, 'my-settings');
      expect(selectedIndex).toEqual(2);
    });

    it('should select index from tab url path', () => {
      let tabs = mockTabs();
      let tab1 = mockTab(tabs);
      let tab2 = mockTab(tabs);
      let tab3 = mockTab(tabs);

      tab1.tabUrlPath = 'account';
      tab2.tabUrlPath = 'contact';
      tab3.tabUrlPath = 'settings';

      let selectedIndex = linker.getSelectedTabIndex(tabs, 'settings');
      expect(selectedIndex).toEqual(2);
    });

    it('should select index 2 from tab-2 format', () => {
      let tabs = mockTabs();
      mockTab(tabs);
      mockTab(tabs);
      mockTab(tabs);

      let selectedIndex = linker.getSelectedTabIndex(tabs, 'tab-2');
      expect(selectedIndex).toEqual(2);
    });

    it('should select index 0 when not found', () => {
      let tabs = mockTabs();
      mockTab(tabs);
      mockTab(tabs);
      mockTab(tabs);

      let selectedIndex = linker.getSelectedTabIndex(tabs, 'notfound');
      expect(selectedIndex).toEqual(0);
    });

  });

  describe('initViews', () => {

    it('should create the ViewController for just the segment', () => {
      // let segment = serializer.parse('/viewone')[0];

      // let views = linker.initViews(segment);
      // expect(views[0].component).toEqual(segment.component);
      // expect(views[0].id).toEqual('VIEWID');
    });

  });

  describe('initNav', () => {

    it('should load root view that contains tabs, and the selected tabs view', () => {
      let nav1 = mockNavController();
      nav1.id = 'nav1';
      nav1.parent = null;
      let tabs = mockTabs();
      tabs.id = 'tabs';
      tabs.parent = nav1;
      let tab1 = mockTab(tabs);
      tab1.id = 'tab1';
      tab1.parent = tabs;
      let tab2 = mockTab(tabs);
      tab2.id = 'tab2';
      tab2.parent = tabs;

      linker.segments = serializer.parse('/viewone/account/viewtwo');

      let navSegment = linker.initNav(nav1);
      expect(navSegment.navId).toEqual('nav1');
      expect(navSegment.id).toEqual('viewone');

      let tabsSegment = linker.initNav(tabs);
      expect(tabsSegment.navId).toEqual('tabs');
      expect(tabsSegment.id).toEqual('account');

      let tabSegment = linker.initNav(tab2);
      expect(tabSegment.navId).toEqual('tab2');
      expect(tabSegment.id).toEqual('viewtwo');
    });

    it('should load root and descendant nav', () => {
      let nav1 = mockNavController();
      nav1.parent = null;
      nav1.id = 'nav1';
      let nav2 = mockNavController();
      nav2.parent = nav1;
      nav2.id = 'nav2';
      let nav3 = mockNavController();
      nav3.parent = nav2;
      nav3.id = 'nav3';

      linker.segments = serializer.parse('/viewone/viewtwo/viewthree');

      let p1 = linker.initNav(nav1);
      expect(p1.navId).toEqual('nav1');
      expect(p1.id).toEqual('viewone');

      let p2 = linker.initNav(nav2);
      expect(p2.navId).toEqual('nav2');
      expect(p2.id).toEqual('viewtwo');

      let p3 = linker.initNav(nav3);
      expect(p3.navId).toEqual('nav3');
      expect(p3.id).toEqual('viewthree');
    });

    it('should load root nav', () => {
      let nav = mockNavController();
      nav.id = 'myNavId';
      linker.segments = serializer.parse('MockPage1');
      let p = linker.initNav(nav);
      expect(p.navId).toEqual('myNavId');
      expect(p.id).toEqual('MockPage1');
    });

    it('should return null when no nav', () => {
      linker.segments = serializer.parse('MockPage1');
      expect(linker.initNav(null)).toEqual(null);
    });

    it('should return null when segments in path', () => {
      let nav = mockNavController();
      linker.segments = [];
      expect(linker.initNav(nav)).toEqual(null);
    });

  });

  describe('createSegmentFromName', () => {

    it('should match by the component class name as a string', () => {
      let segment = serializer.createSegmentFromName('MockView1');
      expect(segment.component).toEqual(MockView1);
    });

    it('should match by the links string name', () => {
      let segment = serializer.createSegmentFromName('viewone');
      expect(segment.component).toEqual(MockView1);
    });

    it('should get no match', () => {
      let segment = serializer.createSegmentFromName('nonofindo');
      expect(segment).toEqual(null);
    });

  });

  describe('urlChange', () => {

    it('should use indexAliasUrl when set and browserUrl is /', () => {
      linker.loadNavFromPath = (nav: any): any => {};
      linker.app.getRootNav = () => {
        return mockNavController();
      };
      spyOn(serializer, 'parse');

      linker.indexAliasUrl = '/tabs-page/recents/tab1-page1';
      linker.urlChange('/');

      expect(serializer.parse).toHaveBeenCalledWith('/tabs-page/recents/tab1-page1');
    });

    it('should use indexAliasUrl when set and browserUrl is /', () => {
      linker.loadNavFromPath = (nav: any): any => {};
      linker.app.getRootNav = () => {
        return mockNavController();
      };
      spyOn(serializer, 'parse');

      linker.indexAliasUrl = '/tabs-page/recents/tab1-page1';
      linker.urlChange('/');

      expect(serializer.parse).toHaveBeenCalledWith('/tabs-page/recents/tab1-page1');
    });

    it('should historyPush if new url', () => {
      spyOn(linker, 'historyPop');
      spyOn(linker, 'historyPush');

      linker.history = ['back-url', 'current-url'];
      linker.urlChange('new-url');

      expect(linker.historyPop).not.toHaveBeenCalled();
      expect(linker.historyPush).toHaveBeenCalled();
    });

    it('should historyPop if back url', () => {
      spyOn(linker, 'historyPop');
      spyOn(linker, 'historyPush');

      linker.history = ['back-url', 'current-url'];
      linker.urlChange('back-url');

      expect(linker.historyPop).toHaveBeenCalled();
      expect(linker.historyPush).not.toHaveBeenCalled();
    });

    it('should do nothing if the url is the same', () => {
      spyOn(linker, 'historyPop');
      spyOn(linker, 'historyPush');

      linker.history = ['current-url'];
      linker.urlChange('current-url');

      expect(linker.historyPop).not.toHaveBeenCalled();
      expect(linker.historyPush).not.toHaveBeenCalled();
    });

  });

  describe('isBackUrl', () => {

    it('should not be the back path when no history', () => {
      expect(linker.isBackUrl('some-page')).toEqual(false);
    });

    it('should not be the back when same as last path', () => {
      linker.history = ['first-page', 'some-page'];
      expect(linker.isBackUrl('some-page')).toEqual(false);
    });

    it('should be the back when same as second to last path', () => {
      linker.history = ['first-page', 'some-page', 'current-page'];
      expect(linker.isBackUrl('some-page')).toEqual(true);
    });

  });

  describe('isCurrentUrl', () => {

    it('should not be the current path when no history', () => {
      expect(linker.isCurrentUrl('some-page')).toEqual(false);
    });

    it('should be the current when same as last path', () => {
      linker.history = ['first-page', 'some-page'];
      expect(linker.isCurrentUrl('some-page')).toEqual(true);
    });

    it('should not be the current when not the last path', () => {
      linker.history = ['first-page', 'some-page', 'current-page'];
      expect(linker.isCurrentUrl('some-page')).toEqual(false);
    });

  });

  describe('normalizeUrl', () => {

    it('should parse multiple segment with leading and following / path', () => {
      expect(normalizeUrl('   /MockPage1/MockPage2/   ')).toEqual('/MockPage1/MockPage2');
    });

    it('should parse following / path', () => {
      expect(normalizeUrl('MockPage1/')).toEqual('/MockPage1');
    });

    it('should parse leading / path', () => {
      expect(normalizeUrl('/MockPage1')).toEqual('/MockPage1');
    });

    it('should parse / path', () => {
      expect(normalizeUrl('/')).toEqual('/');
    });

    it('should parse empty path with padding', () => {
      expect(normalizeUrl('    ')).toEqual('/');
    });

    it('should parse empty path', () => {
      expect(normalizeUrl('')).toEqual('/');
    });

  });

  var linker: DeepLinker;
  var serializer: UrlSerializer;

  beforeEach(() => {
    serializer = new UrlSerializer(mockDeepLinkConfig());
    linker = new DeepLinker(mockApp(), serializer, mockLocation());
  });

});
