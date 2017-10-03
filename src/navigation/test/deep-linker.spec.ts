import * as deepLinker from '../deep-linker';
import { NavSegment } from '../nav-util';
import { UrlSerializer } from '../url-serializer';
import {
  MockView1,
  MockView2,
  mockApp,
  mockDeepLinkConfig,
  mockLocation,
  mockModuleLoader,
  mockNavController,
  mockTab,
  mockTabs,
  mockView,
  mockViews,
  noop
} from '../../util/mock-providers';


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

      linker._loadViewForSegment(nav, segment, noop);

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

      linker._loadViewForSegment(nav, segment, noop);

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

      spyOn(nav, 'setRoot');
      spyOn(nav, 'popTo');

      linker._loadViewForSegment(nav, segment, noop);

      expect(nav.setRoot).toHaveBeenCalled();
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

      linker._loadViewForSegment(tabOne, segment, noop);

      expect(tabs.select).toHaveBeenCalled();
    });

    it('should not error when no segment found', () => {
      let calledDone = false;
      let done = () => { calledDone = true; };
      let nav = mockNavController();

      linker._loadViewForSegment(nav, null, done);

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

    it('should go to root when url is /', () => {
      linker._history = ['/some/fake/url'];
      spyOn(linker, '_historyPush');

      const navControllerOne = mockNavController();
      const navControllerTwo = mockNavController();

      linker._app.getActiveNavContainers = () => {
        return [navControllerOne, navControllerTwo];
      };

      spyOn(navControllerOne, 'goToRoot');
      spyOn(navControllerTwo, 'goToRoot');

      linker._urlChange('/');

      expect(navControllerOne.goToRoot).toHaveBeenCalled();
      expect(navControllerTwo.goToRoot).toHaveBeenCalled();
    });

    it('should not do anything when there arent any segments', () => {
      linker._history = ['/some/fake/url'];
      spyOn(linker, '_historyPush');

      const navControllerOne = mockNavController();
      const navControllerTwo = mockNavController();

      linker._app.getActiveNavContainers = () => {
        return [navControllerOne, navControllerTwo];
      };

      spyOn(linker, 'getCurrentSegments').and.returnValue([]);
      spyOn(linker, '_loadViewForSegment');

      linker._urlChange('/some/irrelevant/fake/url');

      expect(linker._loadViewForSegment).not.toHaveBeenCalled();
    });

    it('should load the views for the segments', () => {
      linker._history = ['/some/fake/url'];
      spyOn(linker, '_historyPush');

      const navControllerOne = mockNavController();
      const navControllerTwo = mockNavController();

      const childNavOne = mockNavController();
      childNavOne.parent = navControllerOne;
      navControllerOne.registerChildNav(childNavOne);

      const childNavTwo = mockTabs();
      childNavTwo.parent = navControllerTwo;
      const tabOne = mockTab(childNavTwo);
      tabOne.setSelected(true);
      mockTab(childNavTwo);
      navControllerTwo.registerChildNav(childNavTwo);

      linker._app.getActiveNavContainers = () => {
        return [childNavOne, tabOne];
      };

      const segments = [];
      segments.push({
        navId: childNavOne.id
      });
      segments.push({
        navId: tabOne.id
      });
      spyOn(linker, 'getCurrentSegments').and.returnValue(segments);
      const loadViewSpy = spyOn(linker, '_loadViewForSegment');

      linker._urlChange('/some/irrelevant/fake/url');

      expect(loadViewSpy.calls.first().args[0]).toEqual(childNavOne);
      expect(loadViewSpy.calls.first().args[1]).toEqual(segments[0]);
      expect(loadViewSpy.calls.mostRecent().args[0]).toEqual(tabOne);
      expect(loadViewSpy.calls.mostRecent().args[1]).toEqual(segments[1]);
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
      expect(deepLinker.normalizeUrl('   /MockPage1/MockPage2/   ')).toEqual('/MockPage1/MockPage2');
    });

    it('should parse following / path', () => {
      expect(deepLinker.normalizeUrl('MockPage1/')).toEqual('/MockPage1');
    });

    it('should parse leading / path', () => {
      expect(deepLinker.normalizeUrl('/MockPage1')).toEqual('/MockPage1');
    });

    it('should parse / path', () => {
      expect(deepLinker.normalizeUrl('/')).toEqual('/');
    });

    it('should parse empty path with padding', () => {
      expect(deepLinker.normalizeUrl('    ')).toEqual('/');
    });

    it('should parse empty path', () => {
      expect(deepLinker.normalizeUrl('')).toEqual('/');
    });

  });

  describe('navChange', () => {
    it('should immediately return when an active nav container is a tabs component', () => {
      linker._app.getActiveNavContainers = () => {
        return [mockTabs()];
      };

      spyOn(linker, 'getSegmentsFromNav');

      linker.navChange('forward');

      expect(linker.getSegmentsFromNav).not.toHaveBeenCalled();
    });

    it('should immediately return when an active nav container is transitioning', () => {
      const mockNav = mockNavController();
      mockNav.setTransitioning(true);
      linker._app.getActiveNavContainers = () => {
        return [mockNav];
      };

      spyOn(linker, 'getSegmentsFromNav');

      linker.navChange('forward');

      expect(linker.getSegmentsFromNav).not.toHaveBeenCalled();
    });
  });

  describe('getSegmentFromNav', () => {
    it('should use the name of the nav when it exists', () => {
      const mockNav = mockNavController();
      mockNav.name = 'superduper';
      const view1 = mockView(MockView1);
      mockViews(mockNav, [view1]);

      const spy = spyOn(serializer, 'serializeComponent');

      linker.getSegmentFromNav(mockNav, null, null);

      expect(spy.calls.first().args[0]).toEqual(mockNav);
    });

    it('should use the id of the nav when name doesnt exists', () => {
      const mockNav = mockNavController();
      mockNav.id = 'someId';
      const view1 = mockView(MockView1);
      mockViews(mockNav, [view1]);

      const spy = spyOn(serializer, 'serializeComponent');

      linker.getSegmentFromNav(mockNav, null, null);

      expect(spy.calls.first().args[0]).toEqual(mockNav);
    });
  });

  describe('getSegmentFromTab', () => {
    it('should use the parent tabs name when it exists', () => {
      const tabs = mockTabs();
      tabs.name = 'super-tabs';
      const tabOne = mockTab(tabs);
      tabOne.setSelected(true);
      mockTab(tabs);

      tabs.select(tabOne);

      const spy = spyOn(serializer, 'serializeComponent');

      linker.getSegmentFromTab(tabOne, null, null);

      expect(spy).toHaveBeenCalled();
      expect(spy.calls.first().args[0]).toEqual(tabs);

    });

    it('should use the parent tabs id when name doesnt exists', () => {
      const tabs = mockTabs();
      tabs.id = 'super-tabs';
      const tabOne = mockTab(tabs);
      tabOne.setSelected(true);
      mockTab(tabs);

      tabs.select(tabOne);

      const spy = spyOn(serializer, 'serializeComponent');

      linker.getSegmentFromTab(tabOne, null, null);

      expect(spy).toHaveBeenCalled();
      expect(spy.calls.first().args[0]).toEqual(tabs);

    });
  });

  describe('_loadViewForSegment', () => {
    it('should call done if segment is null', () => {
      const wrapper = {
        done: () => {}
      };
      spyOn(wrapper, wrapper.done.name);

      linker._loadViewForSegment(null, null, wrapper.done);

      expect(wrapper.done).toHaveBeenCalled();
    });

    it('should set the selected tab from the segment', () => {
      const wrapper = {
        done: () => {}
      };
      spyOn(wrapper, wrapper.done.name);

      const tabs = mockTabs();
      const tabOne = mockTab(tabs);
      tabOne.parent = tabs;
      mockTab(tabs);

      const segment: NavSegment = {
        id: 'someId',
        type: 'tab',
        navId: tabOne.id,
        secondaryId: 'secondaryId',
        name: 'name',
        data: { }
      };

      spyOn(tabs, '_getSelectedTabIndex').and.returnValue(0);
      const selectSpy = spyOn(tabs, 'select');

      linker._loadViewForSegment(tabs, segment, wrapper.done);

      expect(selectSpy.calls.first().args[0]).toEqual(tabOne);
      expect(selectSpy.calls.first().args[0]._segment).toEqual(segment);
      expect(wrapper.done).toHaveBeenCalled();
    });

    it('should remain on the last view in the stack if its found', () => {
      const wrapper = {
        done: () => {}
      };
      spyOn(wrapper, wrapper.done.name);

      const navCtrl = mockNavController();
      const view1 = mockView(MockView1);
      view1.id = 'MockPage1';
      const view2 = mockView(MockView1);
      view2.id = 'MockPage2';

      mockViews(navCtrl, [view1, view2]);

      spyOn(navCtrl, 'popTo');
      spyOn(navCtrl, 'setRoot');

      const segment: NavSegment = {
        id: view2.id,
        type: 'nav',
        navId: view2.id,
        secondaryId: null,
        name: 'name',
        data: { }
      };

      linker._loadViewForSegment(navCtrl, segment, wrapper.done);

      expect(wrapper.done).toHaveBeenCalled();
      expect(navCtrl.popTo).not.toHaveBeenCalled();
      expect(navCtrl.setRoot).not.toHaveBeenCalled();
    });

    it('should popTo the view if its in the stack', () => {
      const wrapper = {
        done: () => {}
      };
      spyOn(wrapper, wrapper.done.name);

      const navCtrl = mockNavController();
      const view1 = mockView(MockView1);
      view1.id = 'MockPage1';
      const view2 = mockView(MockView1);
      view2.id = 'MockPage2';

      mockViews(navCtrl, [view1, view2]);

      spyOn(navCtrl, 'popTo');
      spyOn(navCtrl, 'setRoot');

      const segment: NavSegment = {
        id: view1.id,
        type: 'nav',
        navId: view1.id,
        secondaryId: null,
        name: 'name',
        data: { }
      };

      linker._loadViewForSegment(navCtrl, segment, wrapper.done);

      expect(wrapper.done).not.toHaveBeenCalled();
      expect(navCtrl.popTo).toHaveBeenCalled();
      expect(navCtrl.setRoot).not.toHaveBeenCalled();
    });

    it('should set the component to root if a view controller doesnt yet exist', () => {
      const wrapper = {
        done: () => {}
      };
      spyOn(wrapper, wrapper.done.name);

      const navCtrl = mockNavController();

      spyOn(navCtrl, 'popTo');
      const setRootSpy = spyOn(navCtrl, 'setRoot');

      const segment: NavSegment = {
        id: 'who cares',
        type: 'nav',
        navId: 'irrelevant data',
        secondaryId: null,
        name: 'name',
        data: { }
      };

      linker._loadViewForSegment(navCtrl, segment, wrapper.done);

      expect(wrapper.done).not.toHaveBeenCalled();
      expect(navCtrl.popTo).not.toHaveBeenCalled();
      expect(setRootSpy.calls.first().args[0]).toEqual(segment.name);
      expect(setRootSpy.calls.first().args[1]).toEqual(segment.data);
    });
  });

  describe('createUrl', () => {
    it('should get the current segments, then replace with whatever data needed, and then create a url from that', () => {
      const name = 'Some Name';
      const nav = mockNavController();
      const mockSegment = { };
      const existingSegments = [];
      existingSegments.push({
        navId: nav.id
      });
      existingSegments.push({
        navId: 'blah'
      });
      const url = 'someUrl';
      spyOn(serializer, 'createSegmentFromName').and.returnValue(mockSegment);
      const serializeSpy = spyOn(serializer, 'serialize');
      spyOn(linker, 'getCurrentSegments').and.returnValue(existingSegments);
      spyOn(linker._location, 'prepareExternalUrl').and.returnValue(url);

      const result = linker.createUrl(nav, name, null);
      expect(result).toEqual(url);
      expect(serializer.createSegmentFromName).toHaveBeenCalledWith(nav, name);
      expect(serializeSpy.calls.first().args[0][0]).toEqual(mockSegment);
      expect(serializeSpy.calls.first().args[0][1]).toEqual(existingSegments[1]);
    });
  });

  var linker: deepLinker.DeepLinker;
  var serializer: UrlSerializer;

  beforeEach(() => {
    let linkConfig = mockDeepLinkConfig();
    serializer = new UrlSerializer(mockApp(), linkConfig);

    let moduleLoader = mockModuleLoader();
    let baseCfr: any = null;

    linker = new deepLinker.DeepLinker(mockApp(), serializer, mockLocation(), moduleLoader as any, baseCfr);
  });

});
