import { NavLink, NavSegment } from '../nav-util';
import {
  UrlSerializer,
  convertUrlToDehydratedSegments,
  convertUrlToSegments,
  createMatchedData,
  findLinkByComponentData,
  formatUrlPart,
  isPartMatch,
  navGroupStringtoObjects,
  normalizeLinks,
  urlToNavGroupStrings,
  } from '../url-serializer';
import { MockView1, MockView2, MockView3, mockApp, mockDeepLinkConfig, mockNavController, mockTab, mockTabs, noop } from '../../util/mock-providers';


describe('UrlSerializer', () => {

  describe('serializeComponent', () => {

    it('should create segment when config has multiple links to same component', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view/:param1' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view/:param1/:param2' };
      serializer = mockSerializer([link1, link2, link3]);
      serializer._createSegment = noop;
      spyOn(serializer, '_createSegment');
      const nav = mockNavController();
      serializer.serializeComponent(nav, MockView1, null);
      expect(serializer._createSegment).toHaveBeenCalledWith(serializer._app, nav, link1, null);
    });

    it('should create segment if component found in links', () => {
      serializer._createSegment = noop;
      spyOn(serializer, '_createSegment');
      const nav = mockNavController();
      serializer.serializeComponent(nav, MockView1, null);
      expect(serializer._createSegment).toHaveBeenCalled();
    });

    it('should return null if component not found in links', () => {
      serializer._createSegment = noop;
      spyOn(serializer, '_createSegment');
      const nav = mockNavController();
      serializer.serializeComponent(nav, NotFound, null);
      expect(serializer._createSegment).not.toHaveBeenCalled();
    });

    it('should create tab segment if component found in deep links', () => {
      serializer._createSegment = noop;
      spyOn(serializer, '_createSegment');

      const tabs = mockTabs();
      const tab = mockTab(tabs);
      serializer.serializeComponent(tab, MockView1, null);
      expect(serializer._createSegment).toHaveBeenCalled();
    });

  });

  describe('_createSegment', () => {

    it('should create segement path data', () => {
      const link: NavLink = {
        segmentParts: ['userId', ':id', 'name', ':name'],
        component: MockView1
      };
      const data = {
        id: 8675309,
        name: 'jenny'
      };

      const nav = mockNavController();
      const segment = serializer._createSegment(serializer._app, nav, link, data);
      expect(segment.id).toEqual('userId/8675309/name/jenny');
      expect(segment.component).toEqual(link.component);
      expect(segment.data.id).toEqual(data.id);
      expect(segment.data.name).toEqual(data.name);
    });

    it('should create segement with encodeURIComponent data', () => {
      const char = '道';
      const encoded = encodeURIComponent(char);

      const link: NavLink = {
        segmentParts: ['userId', ':id', 'name', ':name'],
        component: MockView1
      };
      const data: any = {
        id: char,
        name: 'jenny'
      };
      const nav = mockNavController();
      const segment = serializer._createSegment(serializer._app, nav, link, data);
      expect(segment.id).toEqual(`userId/${encoded}/name/${data.name}`);
      expect(segment.component).toEqual(MockView1);
      expect(segment.data.id).toEqual(char);
    });

    it('should create segement with no data', () => {
      const link: NavLink = {
        segmentParts: ['settings-view'],
        component: MockView1
      };
      const nav = mockNavController();
      const segment = serializer._createSegment(serializer._app, nav, link, null);
      expect(segment.id).toEqual('settings-view');
      expect(segment.component).toEqual(MockView1);
      expect(segment.data).toEqual(null);
    });

  });

  describe('navGroupStringtoObjects', () => {
    it('should convert the nav group strings to objects', () => {
      const urlChunks = ['taco/burrito/pizza/nachos', 'nav/1/chunk/of/segment', 'tabs/1/tab-one/chunk/of/segment', 'schedule', 'taco/burrito'];
      const objects = navGroupStringtoObjects(urlChunks);
      expect(objects.length).toEqual(5);
      expect(objects[0].type).toEqual(null);
      expect(objects[0].navId).toEqual(null);
      expect(objects[0].secondaryId).toEqual(null);
      expect(objects[0].segmentPieces.length).toEqual(4);
      expect(objects[0].segmentPieces[0]).toEqual('taco');
      expect(objects[0].segmentPieces[1]).toEqual('burrito');
      expect(objects[0].segmentPieces[2]).toEqual('pizza');
      expect(objects[0].segmentPieces[3]).toEqual('nachos');
      expect(objects[1].type).toEqual('nav');
      expect(objects[1].navId).toEqual('1');
      expect(objects[1].secondaryId).toEqual(null);
      expect(objects[1].segmentPieces.length).toEqual(3);
      expect(objects[1].segmentPieces[0]).toEqual('chunk');
      expect(objects[1].segmentPieces[1]).toEqual('of');
      expect(objects[1].segmentPieces[2]).toEqual('segment');
      expect(objects[2].type).toEqual('tabs');
      expect(objects[2].navId).toEqual('1');
      expect(objects[2].secondaryId).toEqual('tab-one');
      expect(objects[2].segmentPieces.length).toEqual(3);
      expect(objects[2].segmentPieces[0]).toEqual('chunk');
      expect(objects[2].segmentPieces[1]).toEqual('of');
      expect(objects[2].segmentPieces[2]).toEqual('segment');

      expect(objects[3].type).toEqual(null);
      expect(objects[3].navId).toEqual(null);
      expect(objects[3].secondaryId).toEqual(null);
      expect(objects[3].segmentPieces.length).toEqual(1);
      expect(objects[3].segmentPieces[0]).toEqual('schedule');

      expect(objects[4].type).toEqual(null);
      expect(objects[4].navId).toEqual(null);
      expect(objects[4].secondaryId).toEqual(null);
      expect(objects[4].segmentPieces.length).toEqual(2);
      expect(objects[4].segmentPieces[0]).toEqual('taco');
      expect(objects[4].segmentPieces[1]).toEqual('burrito');
    });
  });

  describe('serialize', () => {
    it('should serialize multiple segments into a url with explicit prefixs', () => {
      let paths: NavSegment[] = [
        { type: 'nav', navId: 'whatup', secondaryId: null, id: 'some/url/chunks', name: 'viewOne', component: MockView1, data: null, requiresExplicitNavPrefix: true},
        { type: 'tabs', navId: 't1', secondaryId: 'tab-one', id: 'some/more/url/chunks', name: 'viewTwo', component: MockView1, data: null, requiresExplicitNavPrefix: true }
      ];
      const result = serializer.serialize(paths);
      expect(result).toEqual('/nav/whatup/some/url/chunks/tabs/t1/tab-one/some/more/url/chunks');
    });

    it('should serialize multiple segments into a url', () => {
      let paths: NavSegment[] = [
        { type: 'nav', navId: 'whatup', secondaryId: null, id: 'some/url/chunks', name: 'viewOne', component: MockView1, data: null },
        { type: 'tabs', navId: 't1', secondaryId: 'tab-one', id: 'some/more/url/chunks', name: 'viewTwo', component: MockView1, data: null }
      ];
      const result = serializer.serialize(paths);
      expect(result).toEqual('/some/url/chunks/tab-one/some/more/url/chunks');
    });

    it('should return default url when given empty list of segments', () => {
      expect(serializer.serialize([])).toEqual('/');
    });

  });

  describe('createMatchedData', () => {

    it('should get data from multiple parts', () => {
      let matchedUrlParts = ['a', 'ellie', 'blacklab'];
      let link: NavLink = {
        segmentParts: ['a', ':name', ':breed'], segmentPartsLen: 3, component: MockView1
      };
      let data = createMatchedData(matchedUrlParts, link);
      expect(data.name).toEqual('ellie');
      expect(data.breed).toEqual('blacklab');
    });

    it('should get data within the config link path', () => {
      let char = '道';

      let matchedUrlParts = ['a', 'b', encodeURIComponent(char), 'd'];
      let link: NavLink = {
        segmentParts: ['a', ':id', ':name', 'd'], segmentPartsLen: 4, component: MockView1
      };
      let data = createMatchedData(matchedUrlParts, link);
      expect(data.id).toEqual('b');
      expect(data.name).toEqual(char);
    });

    it('should get data within the config link path', () => {
      let matchedUrlParts = ['a', '8675309'];
      let link: NavLink = {
        segmentParts: ['a', ':num'], segmentPartsLen: 2, component: MockView1
      };
      let data = createMatchedData(matchedUrlParts, link);
      expect(data.num).toEqual('8675309');
    });

    it('should get uri decode data', () => {
      let char = '道';

      let matchedUrlParts = [`${encodeURIComponent(char)}`];
      let link: NavLink = {
        segmentParts: [':name'], segmentPartsLen: 1, component: MockView1
      };
      let data = createMatchedData(matchedUrlParts, link);
      expect(data.name).toEqual(char);
    });

    it('should get null data if nothing in the url', () => {
      let matchedUrlParts = ['a'];
      let link: NavLink = {
        segmentParts: ['a'], segmentPartsLen: 1, component: MockView1
      };
      let data = createMatchedData(matchedUrlParts, link);
      expect(data).toEqual(null);
    });

  });

  describe('isPartMatch', () => {

    it('should match if parts are equal', () => {
      expect(isPartMatch('a', 'a')).toEqual(true);
    });

    it('should not match if parts are not equal', () => {
      expect(isPartMatch('a', 'b')).toEqual(false);
    });

    it('should not match if configLinkPart has a : thats not index 0', () => {
      expect(isPartMatch('urlPart', 'my:id')).toEqual(false);
    });

    it('should match if configLinkPart starts with :', () => {
      expect(isPartMatch('urlPart', ':id')).toEqual(true);
    });

    it('should not match an empty urlPart', () => {
      expect(isPartMatch(null, 'configLinkPart')).toEqual(false);
    });

    it('should not match an empty configLinkPart', () => {
      expect(isPartMatch('urlPart', null)).toEqual(false);
    });

  });

  describe('formatUrlPart', () => {

    it('should encodeURIComponent', () => {
      let name = '你好';
      let encoded = encodeURIComponent(name);
      expect(formatUrlPart(name)).toEqual(encoded);
    });

    it('should not allow restricted characters', () => {
      expect(formatUrlPart('!!!Restricted \'?$,.+"*^|/\#%`><;:@&[]=! Characters!!!')).toEqual('restricted-characters');
    });

    it('should trim and replace spaces with dashes', () => {
      expect(formatUrlPart('   This is the name   ')).toEqual('this-is-the-name');
    });

    it('should not have multiple dashes', () => {
      expect(formatUrlPart('Contact Detail Page')).toEqual('contact-detail-page');
    });

    it('should change to pascal case for multiple words', () => {
      expect(formatUrlPart('ContactDetailPage')).toEqual('contact-detail-page');
    });

    it('should change to pascal case for one work', () => {
      expect(formatUrlPart('View1')).toEqual('view1');
    });

  });

  describe('findLinkByComponentData', () => {

    it('should get matching link by component w/ data and multiple links using same component, 2 matches', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view/:param1' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view/:param1/:param2' };

      let links = normalizeLinks([link1, link2, link3]);

      let foundLink = findLinkByComponentData(links, MockView1, {
        param1: false,
        param2: 0,
        param3: 0
      });
      expect(foundLink.name).toEqual('viewthree');
    });

    it('should get matching link by component w/ data and multiple links using same component, 1 match', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view/:param1' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view/:param1/:param2' };

      let links = normalizeLinks([link1, link2, link3]);

      let foundLink = findLinkByComponentData(links, MockView1, {
        param1: false,
        param3: 0
      });
      expect(foundLink.name).toEqual('viewtwo');
    });

    it('should get matching link by component w/ no data and multiple links using same component', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view/:param1' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view/:param1/:param2' };

      let links = normalizeLinks([link1, link2, link3]);

      let foundLink = findLinkByComponentData(links, MockView1, null);
      expect(foundLink.name).toEqual('viewone');
    });

    it('should get matching link by component data and link data', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view' };
      const link2 = { component: MockView2, name: 'viewtwo', segment: 'view/:param1' };
      const link3 = { component: MockView3, name: 'viewthree', segment: 'view/:param1/:param2' };

      let links = normalizeLinks([link1, link2, link3]);

      let foundLink = findLinkByComponentData(links, MockView3, {
        param1: null,
        param2: false,
        param3: 0,
        param4: 'hello'
      });
      expect(foundLink.name).toEqual('viewthree');
    });

    it('should get matching link by component without data and link without data', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view' };
      const link2 = { component: MockView2, name: 'viewtwo', segment: 'view/:param1' };
      const link3 = { component: MockView3, name: 'viewthree', segment: 'view/:param1/:param2' };

      let links = normalizeLinks([link1, link2, link3]);

      let foundLink = findLinkByComponentData(links, MockView1, null);
      expect(foundLink.name).toEqual('viewone');
    });

    it('should get no matching link by component without data, but link requires data', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view' };
      const link2 = { component: MockView2, name: 'viewtwo', segment: 'view/:param1' };
      const link3 = { component: MockView3, name: 'viewthree', segment: 'view/:param1/:param2' };

      let links = normalizeLinks([link1, link2, link3]);

      let foundLink = findLinkByComponentData(links, MockView2, null);
      expect(foundLink).toEqual(null);
    });

  });

  describe('normalizeLinks', () => {

    it('should sort with four parts, the most number of paths w/out data first', () => {
      let links: NavLink[] = [
        { segment: 'a/:val/:id/:name', component: MockView1, name: 'viewone' },
        { segment: 'a/:id/:name/d', component: MockView1, name: 'viewone' },
        { segment: 'a/b/c/d', component: MockView1, name: 'viewone' },
        { segment: 'a/b/:id/d', component: MockView1, name: 'viewone' },
        { segment: 'a/b/:id/:name', component: MockView1, name: 'viewone' },
        { segment: 'a/b/c/:id', component: MockView1, name: 'viewone' },
      ];
      let sortedLinks = normalizeLinks(links);

      expect(sortedLinks[0].segment).toEqual('a/b/c/d');
      expect(sortedLinks[1].segment).toEqual('a/b/c/:id');
      expect(sortedLinks[2].segment).toEqual('a/b/:id/d');
      expect(sortedLinks[3].segment).toEqual('a/b/:id/:name');
      expect(sortedLinks[4].segment).toEqual('a/:id/:name/d');
      expect(sortedLinks[5].segment).toEqual('a/:val/:id/:name');
    });

    it('should sort with the most number of paths w/out data first', () => {
      let links: NavLink[] = [
        { segment: 'a/:id', component: MockView1, name: 'viewone' },
        { segment: 'a/b', component: MockView1, name: 'viewone' },
        { segment: 'a/:id/c', component: MockView1, name: 'viewone' },
      ];
      let sortedLinks = normalizeLinks(links);

      expect(sortedLinks[0].segment).toEqual('a/:id/c');
      expect(sortedLinks[1].segment).toEqual('a/b');
      expect(sortedLinks[2].segment).toEqual('a/:id');
    });

    it('should sort with the most number of paths first', () => {
      let links: NavLink[] = [
        { segment: 'c', component: MockView1, name: 'viewone' },
        { segment: 'b', component: MockView1, name: 'viewone' },
        { segment: 'a', component: MockView1, name: 'viewone' },
        { segment: 'd/c/b/a', component: MockView1, name: 'viewone' },
        { segment: 'aaaaa/bbbb/ccccc', component: MockView1, name: 'viewone' },
        { segment: 'bbbbbbbbbbbbbbbb/c', component: MockView1, name: 'viewone' },
        { segment: 'a/b', component: MockView1, name: 'viewone' },
        { segment: 'a/b/c', component: MockView1, name: 'viewone' },
        { segment: 'aa/b/c', component: MockView1, name: 'viewone' },
      ];
      let sortedLinks = normalizeLinks(links);

      expect(sortedLinks[0].segment).toEqual('d/c/b/a');
      expect(sortedLinks[1].segment).toEqual('aaaaa/bbbb/ccccc');
      expect(sortedLinks[2].segment).toEqual('a/b/c');
      expect(sortedLinks[3].segment).toEqual('aa/b/c');
      expect(sortedLinks[4].segment).toEqual('bbbbbbbbbbbbbbbb/c');
      expect(sortedLinks[5].segment).toEqual('a/b');
      expect(sortedLinks[6].segment).toEqual('c');
      expect(sortedLinks[7].segment).toEqual('b');
      expect(sortedLinks[8].segment).toEqual('a');
    });

    it('should create a parts from the name', () => {
      let links: NavLink[] = [
        { name: 'somename', component: ContactDetailPage },
      ];
      expect(normalizeLinks(links)[0].segmentParts).toEqual(['somename']);
    });

    it('should create path from name if path missing', () => {
      let links: NavLink[] = [
        { component: ContactDetailPage, name: 'contact-detail-page' },
        { component: MockView2, name: 'view-two'  },
      ];
      expect(normalizeLinks(links)[0].segment).toEqual('contact-detail-page');
      expect(normalizeLinks(links)[1].segment).toEqual('view-two');
    });

  });

  describe('createSegmentFromName', () => {

    it('should match by the links string name', () => {
      const mockNav = mockNavController();
      const segment = serializer.createSegmentFromName(mockNav, 'viewone');
      expect(segment.component).toEqual(MockView1);
      expect(segment.navId).toEqual(mockNav.id);
    });

    it('should get no match', () => {
      const mockNav = mockNavController();
      const segment = serializer.createSegmentFromName(mockNav, 'someObviouslyFakeNameNotFound');
      expect(segment).toEqual(null);
    });

  });

  describe('urlToNavGroupStrings', () => {
    it('should get an array with a single piece url back', () => {
      const url = 'test';
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual('test');
    });

    it('should get an array with multiple pieces back', () => {
      const url = 'the/dog/jumps/high';
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual('the/dog/jumps/high');
    });

    it('should return a single entry with the nav prefix', () => {
      const url = 'nav/myApp/the/dog/jumps/high';
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual('nav/myApp/the/dog/jumps/high');
    });

    it('should return a single entry with the tabs prefix', () => {
      const url = 'tabs/myApp/tab-one/the/dog/jumps/high';
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual('tabs/myApp/tab-one/the/dog/jumps/high');
    });

    it('should return multiple entries with the nav prefix', () => {
      const url = 'nav/myApp/the/dog/jumps/high/nav/someSubNav/taco/burrito/nav/thirdNav/banana/apple/orange';
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(3);
      expect(result[0]).toEqual('nav/myApp/the/dog/jumps/high');
      expect(result[1]).toEqual('nav/someSubNav/taco/burrito');
      expect(result[2]).toEqual('nav/thirdNav/banana/apple/orange');
    });

    it('should return multiple entries with the tabs prefix', () => {
      const url = 'tabs/myApp/tab-one/the/dog/jumps/high/tabs/someSubNav/tab-two/taco/burrito/tabs/thirdNav/tab-three/banana/apple/orange';
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(3);
      expect(result[0]).toEqual('tabs/myApp/tab-one/the/dog/jumps/high');
      expect(result[1]).toEqual('tabs/someSubNav/tab-two/taco/burrito');
      expect(result[2]).toEqual('tabs/thirdNav/tab-three/banana/apple/orange');
    });

    it('should handle a nav in the middle of the url', () => {
      const url = 'the/dog/jumps/high/nav/someSubNav/taco/burrito/nav/thirdNav/banana/apple/orange';
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(3);
      expect(result[0]).toEqual('the/dog/jumps/high');
      expect(result[1]).toEqual('nav/someSubNav/taco/burrito');
      expect(result[2]).toEqual('nav/thirdNav/banana/apple/orange');
    });

    it('should handle a tabs in the middle of the url', () => {
      const url = 'the/dog/jumps/high/tabs/someSubNav/tab-two/taco/burrito/tabs/thirdNav/tab-three/banana/apple/orange';
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(3);
      expect(result[0]).toEqual('the/dog/jumps/high');
      expect(result[1]).toEqual('tabs/someSubNav/tab-two/taco/burrito');
      expect(result[2]).toEqual('tabs/thirdNav/tab-three/banana/apple/orange');
    });

    it('should handle a mixed url', () => {
      const url = 'the/dog/jumps/high/tabs/someSubNav/tab-two/taco/burrito/nav/thirdNav/banana/apple/orange';
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(3);
      expect(result[0]).toEqual('the/dog/jumps/high');
      expect(result[1]).toEqual('tabs/someSubNav/tab-two/taco/burrito');
      expect(result[2]).toEqual('nav/thirdNav/banana/apple/orange');
    });
  });

  describe('convertUrlToDehydratedSegments', () => {
    it('it should return a vanilla single segment', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view-one' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view-two' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view-three' };

      const links = normalizeLinks([link1, link2, link3]);
      const url = 'view-two';
      const segmentPairs = convertUrlToDehydratedSegments(url, links);
      expect(segmentPairs.length).toEqual(1);
      expect(segmentPairs[0].segments.length).toEqual(1);
      expect(segmentPairs[0].segments[0].id).toEqual('view-two');
    });

    it('it should return a data-driven single segment', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view-one' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view-two/paramOne/:paramOne/paramTwo/:paramTwo' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view-three' };

      const links = normalizeLinks([link1, link2, link3]);
      const url = 'view-two/paramOne/taco/paramTwo/burrito';
      const segmentPairs = convertUrlToDehydratedSegments(url, links);
      expect(segmentPairs.length).toEqual(1);
      expect(segmentPairs[0].segments.length).toEqual(1);
      expect(segmentPairs[0].segments[0].id).toEqual('view-two/paramOne/taco/paramTwo/burrito');
      expect(segmentPairs[0].segments[0].data.paramOne).toEqual('taco');
      expect(segmentPairs[0].segments[0].data.paramTwo).toEqual('burrito');
    });

    it('it should return a vanilla set of segments', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view-one' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view-two' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view-three' };
      const link4 = { component: MockView1, name: 'viewfour', segment: 'view-four' };

      const links = normalizeLinks([link1, link2, link3, link4]);
      const url = 'view-two/view-one/view-three';
      const segmentPairs = convertUrlToDehydratedSegments(url, links);
      expect(segmentPairs.length).toEqual(1);
      expect(segmentPairs[0].segments.length).toEqual(3);
      expect(segmentPairs[0].segments[0].id).toEqual('view-two');
      expect(segmentPairs[0].segments[1].id).toEqual('view-one');
      expect(segmentPairs[0].segments[2].id).toEqual('view-three');
    });

    it('it should return a data-driven set of segments', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view-one/paramOne/:paramOne/paramTwo/:paramTwo' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view-two/user/:userId' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view-three/:itemId' };
      const link4 = { component: MockView1, name: 'viewfour', segment: 'view-four' };

      const links = normalizeLinks([link1, link2, link3, link4]);
      const url = 'view-two/user/fred/view-one/paramOne/taco/paramTwo/burrito/view-three/12345';
      const segmentPairs = convertUrlToDehydratedSegments(url, links);
      expect(segmentPairs.length).toEqual(1);
      expect(segmentPairs[0].segments.length).toEqual(3);
      expect(segmentPairs[0].segments[0].id).toEqual('view-two/user/fred');
      expect(segmentPairs[0].segments[0].data.userId).toEqual('fred');
      expect(segmentPairs[0].segments[1].id).toEqual('view-one/paramOne/taco/paramTwo/burrito');
      expect(segmentPairs[0].segments[1].data.paramOne).toEqual('taco');
      expect(segmentPairs[0].segments[1].data.paramTwo).toEqual('burrito');
      expect(segmentPairs[0].segments[2].id).toEqual('view-three/12345');
      expect(segmentPairs[0].segments[2].data.itemId).toEqual('12345');
    });

    it('it should return a data-driven set of segments with a root nav prefix', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view-one/paramOne/:paramOne/paramTwo/:paramTwo' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view-two/user/:userId' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view-three/:itemId' };
      const link4 = { component: MockView1, name: 'viewfour', segment: 'view-four' };

      const links = normalizeLinks([link1, link2, link3, link4]);
      const url = 'nav/123/view-two/user/fred/view-one/paramOne/taco/paramTwo/burrito/view-three/12345';
      const segmentPairs = convertUrlToDehydratedSegments(url, links);
      expect(segmentPairs.length).toEqual(1);
      expect(segmentPairs[0].segments.length).toEqual(3);
      expect(segmentPairs[0].segments[0].id).toEqual('view-two/user/fred');
      expect(segmentPairs[0].segments[0].data.userId).toEqual('fred');
      expect(segmentPairs[0].segments[1].id).toEqual('view-one/paramOne/taco/paramTwo/burrito');
      expect(segmentPairs[0].segments[1].data.paramOne).toEqual('taco');
      expect(segmentPairs[0].segments[1].data.paramTwo).toEqual('burrito');
      expect(segmentPairs[0].segments[2].id).toEqual('view-three/12345');
      expect(segmentPairs[0].segments[2].data.itemId).toEqual('12345');
    });

    it('it should return a data-driven set of segments with multiple nav segments in the middle', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view-one/paramOne/:paramOne/paramTwo/:paramTwo' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view-two/user/:userId' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view-three/:itemId' };
      const link4 = { component: MockView1, name: 'viewfour', segment: 'view-four' };

      const links = normalizeLinks([link1, link2, link3, link4]);
      const url = 'view-two/user/fred/nav/123/view-one/paramOne/taco/paramTwo/burrito/nav/456/view-three/12345';
      const segmentPairs = convertUrlToDehydratedSegments(url, links);
      expect(segmentPairs.length).toEqual(3);
      expect(segmentPairs[0].segments.length).toEqual(1);
      expect(segmentPairs[0].segments[0].id).toEqual('view-two/user/fred');
      expect(segmentPairs[0].segments[0].data.userId).toEqual('fred');

      expect(segmentPairs[1].segments.length).toEqual(1);
      expect(segmentPairs[1].segments[0].id).toEqual('view-one/paramOne/taco/paramTwo/burrito');
      expect(segmentPairs[1].segments[0].data.paramOne).toEqual('taco');
      expect(segmentPairs[1].segments[0].data.paramTwo).toEqual('burrito');

      expect(segmentPairs[2].segments.length).toEqual(1);
      expect(segmentPairs[2].segments[0].id).toEqual('view-three/12345');
      expect(segmentPairs[2].segments[0].data.itemId).toEqual('12345');
    });

    it('it should return a data-driven set of segments with a root nav and multiple nav segments in the middle', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view-one/paramOne/:paramOne/paramTwo/:paramTwo' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view-two/user/:userId' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view-three/:itemId' };
      const link4 = { component: MockView1, name: 'viewfour', segment: 'view-four' };

      const links = normalizeLinks([link1, link2, link3, link4]);
      const url = 'nav/app/view-two/user/fred/nav/123/view-one/paramOne/taco/paramTwo/burrito/nav/456/view-three/12345';
      const segmentPairs = convertUrlToDehydratedSegments(url, links);
      expect(segmentPairs.length).toEqual(3);
      expect(segmentPairs[0].segments.length).toEqual(1);
      expect(segmentPairs[0].segments[0].id).toEqual('view-two/user/fred');
      expect(segmentPairs[0].segments[0].data.userId).toEqual('fred');

      expect(segmentPairs[1].segments.length).toEqual(1);
      expect(segmentPairs[1].segments[0].id).toEqual('view-one/paramOne/taco/paramTwo/burrito');
      expect(segmentPairs[1].segments[0].data.paramOne).toEqual('taco');
      expect(segmentPairs[1].segments[0].data.paramTwo).toEqual('burrito');

      expect(segmentPairs[2].segments.length).toEqual(1);
      expect(segmentPairs[2].segments[0].id).toEqual('view-three/12345');
      expect(segmentPairs[2].segments[0].data.itemId).toEqual('12345');
    });

    it('it should return a data-driven set of segments with a root tabs and multiple tabs segments in the middle', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view-one/paramOne/:paramOne/paramTwo/:paramTwo' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view-two/user/:userId' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view-three/:itemId' };
      const link4 = { component: MockView1, name: 'viewfour', segment: 'view-four' };

      const links = normalizeLinks([link1, link2, link3, link4]);
      const url = 'tabs/app/tab-two/view-two/user/fred/tabs/123/tab-three/view-one/paramOne/taco/paramTwo/burrito/tabs/456/tab-four/view-three/12345';
      const segmentPairs = convertUrlToDehydratedSegments(url, links);
      expect(segmentPairs.length).toEqual(3);
      expect(segmentPairs[0].segments.length).toEqual(1);
      expect(segmentPairs[0].segments[0].id).toEqual('view-two/user/fred');
      expect(segmentPairs[0].segments[0].data.userId).toEqual('fred');

      expect(segmentPairs[1].segments.length).toEqual(1);
      expect(segmentPairs[1].segments[0].id).toEqual('view-one/paramOne/taco/paramTwo/burrito');
      expect(segmentPairs[1].segments[0].data.paramOne).toEqual('taco');
      expect(segmentPairs[1].segments[0].data.paramTwo).toEqual('burrito');

      expect(segmentPairs[2].segments.length).toEqual(1);
      expect(segmentPairs[2].segments[0].id).toEqual('view-three/12345');
      expect(segmentPairs[2].segments[0].data.itemId).toEqual('12345');
    });

    it('should return a data-driven set of segments where the root tabs is implied but the secondary identifier is actually grabed', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view-one/paramOne/:paramOne/paramTwo/:paramTwo' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view-two/user/:userId' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view-three/:itemId' };
      const link4 = { component: MockView1, name: 'viewfour', segment: 'view-four' };

      const links = normalizeLinks([link1, link2, link3, link4]);
      const url = 'tab-two/view-two/user/fred' + '/tab-three/view-one/paramOne/taco/paramTwo/burrito' + '/tab-four/view-three/12345';

      const segmentPairs = convertUrlToDehydratedSegments(url, links);
      expect(segmentPairs.length).toEqual(1);
      expect(segmentPairs[0].segments.length).toEqual(3);
      expect(segmentPairs[0].segments[0].id).toEqual('view-two/user/fred');
      expect(segmentPairs[0].segments[0].name).toEqual('viewtwo');
      expect(segmentPairs[0].segments[0].secondaryId).toEqual('tab-two');
      expect(segmentPairs[0].segments[0].data.userId).toEqual('fred');

      expect(segmentPairs[0].segments[1].id).toEqual('view-one/paramOne/taco/paramTwo/burrito');
      expect(segmentPairs[0].segments[1].name).toEqual('viewone');
      expect(segmentPairs[0].segments[1].data.paramOne).toEqual('taco');
      expect(segmentPairs[0].segments[1].data.paramTwo).toEqual('burrito');
      expect(segmentPairs[0].segments[1].secondaryId).toEqual('tab-three');

      expect(segmentPairs[0].segments[2].id).toEqual('view-three/12345');
      expect(segmentPairs[0].segments[2].name).toEqual('viewthree');
      expect(segmentPairs[0].segments[2].data.itemId).toEqual('12345');
      expect(segmentPairs[0].segments[2].secondaryId).toEqual('tab-four');
    });

    it('should return a segment w/ secondary id even if it has the same name as a router link basic', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view-one/paramOne/:paramOne/paramTwo/:paramTwo' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view-two/user/:userId' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view-three/:itemId' };
      const link4 = { component: MockView1, name: 'schedule', segment: 'schedule' };

      const links = normalizeLinks([link1, link2, link3, link4]);
      const url = 'schedule/schedule';

      const segmentPairs = convertUrlToDehydratedSegments(url, links);
      expect(segmentPairs.length).toEqual(1);
      expect(segmentPairs[0].segments.length).toEqual(1);
      expect(segmentPairs[0].segments[0].id).toEqual('schedule');
      expect(segmentPairs[0].segments[0].name).toEqual('schedule');
      expect(segmentPairs[0].segments[0].secondaryId).toEqual('schedule');
    });

    it('should return a segment for the secondary id even if it has the same name as a router link advanced', () => {
      const link1 = { component: MockView1, name: 'about', segment: 'about/:id' };
      const link2 = { component: MockView1, name: 'schedule', segment: 'schedule/paramOne/:paramOne/paramTwo/:paramTwo' };
      const link3 = { component: MockView1, name: 'ThirdPage', segment: 'third-page' };
      const link4 = { component: MockView1, name: 'FourthPage', segment: 'fourth-page/object/:objectId' };
      const link5 = { component: MockView1, name: 'taco-page', segment: 'taco-page' };

      const links = normalizeLinks([link1, link2, link3, link4, link5]);
      const url = 'schedule/schedule/paramOne/hello/paramTwo/goodbye'
                  + '/about/about/123'
                  + '/tabs/t1/tab-one/third-page'
                  + '/tabs/t2/tab-two/fourth-page/object/456'
                  + '/fifth-page/taco-page';

      const segmentPairs = convertUrlToDehydratedSegments(url, links);
      expect(segmentPairs.length).toEqual(3);

      expect(segmentPairs[0].segments.length).toEqual(2);

      expect(segmentPairs[0].segments[0].id).toEqual('schedule/paramOne/hello/paramTwo/goodbye');
      expect(segmentPairs[0].segments[0].name).toEqual('schedule');
      expect(segmentPairs[0].segments[0].secondaryId).toEqual('schedule');
      expect(segmentPairs[0].segments[0].data.paramOne).toEqual('hello');
      expect(segmentPairs[0].segments[0].data.paramTwo).toEqual('goodbye');

      expect(segmentPairs[0].segments[1].id).toEqual('about/123');
      expect(segmentPairs[0].segments[1].name).toEqual('about');
      expect(segmentPairs[0].segments[1].secondaryId).toEqual('about');
      expect(segmentPairs[0].segments[1].data.id).toEqual('123');

      expect(segmentPairs[1].segments.length).toEqual(1);

      expect(segmentPairs[1].navGroup.navId).toEqual('t1');
      expect(segmentPairs[1].navGroup.type).toEqual('tabs');
      expect(segmentPairs[1].segments[0].id).toEqual('third-page');
      expect(segmentPairs[1].segments[0].name).toEqual('ThirdPage');
      expect(segmentPairs[1].segments[0].secondaryId).toEqual('tab-one');

      expect(segmentPairs[2].segments.length).toEqual(2);

      expect(segmentPairs[2].navGroup.navId).toEqual('t2');
      expect(segmentPairs[2].navGroup.type).toEqual('tabs');
      expect(segmentPairs[2].segments[0].id).toEqual('fourth-page/object/456');
      expect(segmentPairs[2].segments[0].name).toEqual('FourthPage');
      expect(segmentPairs[2].segments[0].secondaryId).toEqual('tab-two');
      expect(segmentPairs[2].segments[0].data.objectId).toEqual('456');

      expect(segmentPairs[2].segments[1].id).toEqual('taco-page');
      expect(segmentPairs[2].segments[1].name).toEqual('taco-page');
      expect(segmentPairs[2].segments[1].secondaryId).toEqual('fifth-page');
    });
  });

  describe('convertUrlToSegments', () => {
    it('it should return a vanilla single segment', () => {

      const link1 = { component: MockView1, name: 'login-page', segment: 'login-page' };
      const link2 = { component: MockView1, name: 'settings-page', segment: 'settings-page' };
      const link3 = { component: MockView1, name: 'details-page', segment: 'details-page' };

      const mockNav = mockNavController();
      serializer._app.registerRootNav(mockNav);

      const links = normalizeLinks([link1, link2, link3]);
      const url = 'settings-page';


      const segments = convertUrlToSegments(serializer._app, url, links);
      expect(segments.length).toEqual(1);
      expect(segments[0].type).toEqual('nav');
      expect(segments[0].navId).toEqual(mockNav.id);
    });
  });

  var serializer: UrlSerializer;

  beforeEach(() => {
    serializer = mockSerializer();
  });

});


class ContactDetailPage {}
class NotFound {}

function mockSerializer(navLinks?: NavLink[]) {
  let deepLinkConfig = mockDeepLinkConfig(navLinks);
  return new UrlSerializer(mockApp(), deepLinkConfig);
}
