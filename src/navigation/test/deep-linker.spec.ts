import { DeepLinker, _loadViewForSegment, normalizeUrl } from '../deep-linker';
import { NavSegment } from '../nav-util';
import { UrlSerializer } from '../url-serializer';
import { mockApp, mockDeepLinkConfig, mockNavController, mockLocation,
         mockModuleLoader, mockTab, mockTabs, mockViews, mockView, noop,
         MockView1, MockView2 } from '../../util/mock-providers';


describe('DeepLinker', () => {

  describe('updateLocation', () => {

    it('should update the browserUrl to / when the passed in url matches indexAliasUrl', () => {
      linker._indexAliasUrl = '/my-special/url';
      linker._updateLocation('/my-special/url', 'forward');
      expect(linker._history[0]).toEqual('/');
    });

    it('should update location.back when back direction and previous url is the same', () => {
      spyOn(linker._location, 'back');
      spyOn(linker._location, 'go');
      spyOn(linker, '_historyPop');
      linker._history = ['first-page', 'some-page', 'current-page'];
      linker._updateLocation('some-page', 'back');
      expect(linker._location.back).toHaveBeenCalled();
      expect(linker._location.go).not.toHaveBeenCalled();
      expect(linker._historyPop).toHaveBeenCalled();
    });

    it('should not update location.go when same as current page', () => {
      spyOn(linker._location, 'back');
      spyOn(linker._location, 'go');
      linker._history = ['current-page'];
      linker._updateLocation('current-page', 'forward');
      expect(linker._location.back).not.toHaveBeenCalled();
      expect(linker._location.go).not.toHaveBeenCalled();
    });

    it('should update location.go when back direction but not actually the previous url', () => {
      spyOn(linker._location, 'back');
      spyOn(linker._location, 'go');
      spyOn(linker, '_historyPush');
      linker._history = ['first-page', 'some-other-page'];
      linker._updateLocation('some-page', 'forward');
      expect(linker._location.back).not.toHaveBeenCalled();
      expect(linker._location.go).toHaveBeenCalledWith('some-page');
      expect(linker._historyPush).toHaveBeenCalledWith('some-page');
    });

    it('should update location.go when forward direction', () => {
      spyOn(linker._location, 'back');
      spyOn(linker._location, 'go');
      spyOn(linker, '_historyPush');
      linker._updateLocation('new-url', 'forward');
      expect(linker._location.back).not.toHaveBeenCalled();
      expect(linker._location.go).toHaveBeenCalledWith('new-url');
      expect(linker._historyPush).toHaveBeenCalledWith('new-url');
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

      const segment: NavSegment = {
        id: view2.id,
        name: 'MockPage2',
        data: null,
        type: 'nav',
        navId: 'n1',
        secondaryId: null,
      };

      spyOn(nav, 'push');
      spyOn(nav, 'popTo');

      _loadViewForSegment(nav, segment, noop);

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

      const segment: NavSegment = {
        id: view1.id,
        name: 'MockPage1',
        data: null,
        type: 'nav',
        navId: 'n1',
        secondaryId: null,
      };

      spyOn(nav, 'push');
      spyOn(nav, 'popTo');

      _loadViewForSegment(nav, segment, noop);

      expect(nav.push).not.toHaveBeenCalled();
      expect(nav.popTo).toHaveBeenCalled();
    });

    it('should push a new page', () => {
      let nav = mockNavController();
      const segment: NavSegment = {
        id: 'MockPage1',
        name: 'MockPage1',
        data: null,
        type: 'nav',
        navId: 'n1',
        secondaryId: null,
      };

      spyOn(nav, 'push');
      spyOn(nav, 'popTo');

      _loadViewForSegment(nav, segment, noop);

      expect(nav.push).toHaveBeenCalled();
      expect(nav.popTo).not.toHaveBeenCalled();
    });

    it('should call select when its a Tabs nav', () => {
      const tabs = mockTabs();
      const tabOne = mockTab(tabs);
      mockTab(tabs);

      const segment: NavSegment = {
        id: 'MockPage1',
        name: 'MockPage1',
        data: null,
        type: 'tabs',
        navId: tabs.id,
        secondaryId: 'tab-one',
      };

      spyOn(tabs, 'select');

      _loadViewForSegment(tabOne, segment, noop);

      expect(tabs.select).toHaveBeenCalled();
    });

    it('should not error when no segment found', () => {
      let calledDone = false;
      let done = () => { calledDone = true; };
      let nav = mockNavController();

      _loadViewForSegment(nav, null, done);

      expect(calledDone).toEqual(true);
    });

  });

  describe('getTabSelector', () => {

    it('should get tab url path selector', () => {
      let tabs = mockTabs();
      let tab1 = mockTab(tabs);
      tab1.tabUrlPath = 'some-tab-url-path';
      tab1.tabTitle = 'My Tab Title';
      expect(linker._getTabSelector(tab1)).toEqual('some-tab-url-path');
    });

    it('should get tab title selector', () => {
      let tabs = mockTabs();
      let tab1 = mockTab(tabs);
      tab1.tabTitle = 'My Tab Title';
      expect(linker._getTabSelector(tab1)).toEqual('my-tab-title');
    });

    it('should get tab-0 selector', () => {
      let tabs = mockTabs();
      let tab1 = mockTab(tabs);
      expect(linker._getTabSelector(tab1)).toEqual('tab-0');
    });

  });

  describe('initViews', () => {

    it('should return an array with one view controller when there isnt default history', (done: Function) => {
      const knownSegment: NavSegment = {
        id: 'idk',
        name: 'viewone',
        data: {},
        type: 'nav',
        navId: 'n1',
        secondaryId: null
      };
      const promise = linker.initViews(knownSegment);

      promise.then((result: any[]) => {
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toEqual(1);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    });
  });

  describe('urlChange', () => {

    it('should use indexAliasUrl when set and browserUrl is /', () => {
      linker._app.getActiveNavContainers = () => {
        return [mockNavController()];
      };
      spyOn(serializer, 'parse').and.returnValue([]);

      linker._indexAliasUrl = '/tabs/t1/tab-one/some/parts/of/the/segment';

      linker._urlChange('/');

      expect(serializer.parse).toHaveBeenCalledWith(linker._indexAliasUrl);
    });

    it('should historyPush if new url', () => {
      spyOn(linker, '_historyPop');
      spyOn(linker, '_historyPush');

      linker._history = ['back-url', 'current-url'];
      linker._urlChange('new-url');

      expect(linker._historyPop).not.toHaveBeenCalled();
      expect(linker._historyPush).toHaveBeenCalled();
    });

    it('should historyPop if back url', () => {
      spyOn(linker, '_historyPop');
      spyOn(linker, '_historyPush');

      linker._history = ['back-url', 'current-url'];
      linker._urlChange('back-url');

      expect(linker._historyPop).toHaveBeenCalled();
      expect(linker._historyPush).not.toHaveBeenCalled();
    });

    it('should do nothing if the url is the same', () => {
      spyOn(linker, '_historyPop');
      spyOn(linker, '_historyPush');

      linker._history = ['current-url'];
      linker._urlChange('current-url');

      expect(linker._historyPop).not.toHaveBeenCalled();
      expect(linker._historyPush).not.toHaveBeenCalled();
    });

  });

  describe('isBackUrl', () => {

    it('should not be the back path when no history', () => {
      expect(linker._isBackUrl('some-page')).toEqual(false);
    });

    it('should not be the back when same as last path', () => {
      linker._history = ['first-page', 'some-page'];
      expect(linker._isBackUrl('some-page')).toEqual(false);
    });

    it('should be the back when same as second to last path', () => {
      linker._history = ['first-page', 'some-page', 'current-page'];
      expect(linker._isBackUrl('some-page')).toEqual(true);
    });

  });

  describe('isCurrentUrl', () => {

    it('should not be the current path when no history', () => {
      expect(linker._isCurrentUrl('some-page')).toEqual(false);
    });

    it('should be the current when same as last path', () => {
      linker._history = ['first-page', 'some-page'];
      expect(linker._isCurrentUrl('some-page')).toEqual(true);
    });

    it('should not be the current when not the last path', () => {
      linker._history = ['first-page', 'some-page', 'current-page'];
      expect(linker._isCurrentUrl('some-page')).toEqual(false);
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
    let linkConfig = mockDeepLinkConfig();
    serializer = new UrlSerializer(linkConfig);

    let moduleLoader = mockModuleLoader();
    let baseCfr: any = null;

    linker = new DeepLinker(mockApp(), serializer, mockLocation(), moduleLoader as any, baseCfr);
  });

});
