import { NavLink, NavSegment } from '../nav-util';
import {
  createMatchedData,
  findLinkByComponentData,
  formatUrlPart,
  isPartMatch,
  NavGroup,
  navGroupStringtoObjects,
  normalizeLinks,
  parseUrlParts,
  UrlSerializer,
  urlToNavGroupStrings,
  } from '../url-serializer';
import { mockNavController, mockDeepLinkConfig, noop, MockView1, MockView2, MockView3 } from '../../util/mock-providers';


describe('UrlSerializer', () => {

  describe('serializeComponent', () => {

    it('should create segment when config has multiple links to same component', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view/:param1' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view/:param1/:param2' };
      const navGroup: NavGroup = { type: 'nav', navId: 'n1', secondaryId: null, segmentPieces: ['view']};
      serializer = mockSerializer([link1, link2, link3]);
      serializer._createSegment = noop;
      spyOn(serializer, '_createSegment');
      serializer.serializeComponent(navGroup, MockView1, null);
      expect(serializer._createSegment).toHaveBeenCalledWith(navGroup, link1, null);
    });

    it('should create segment if component found in links', () => {
      serializer._createSegment = noop;
      spyOn(serializer, '_createSegment');
      serializer.serializeComponent({ type: 'nav', navId: 'n1', secondaryId: null, segmentPieces: ['view']}, MockView1, null);
      expect(serializer._createSegment).toHaveBeenCalled();
    });

    it('should return null if component not found in links', () => {
      serializer._createSegment = noop;
      spyOn(serializer, '_createSegment');
      serializer.serializeComponent({ type: 'nav', navId: 'n1', secondaryId: null, segmentPieces: ['view']}, NotFound, null);
      expect(serializer._createSegment).not.toHaveBeenCalled();
    });

    it('should create tab segment if component found in deep links', () => {
      serializer._createSegment = noop;
      spyOn(serializer, '_createSegment');
      serializer.serializeComponent({ type: 'nav', navId: 'n1', secondaryId: null, segmentPieces: ['view']}, MockView1, null);
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

      const segment = serializer._createSegment({ navId: '1', type: 'nav', secondaryId: null}, link, data);
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
      const segment = serializer._createSegment({ navId: '1', type: 'nav', secondaryId: null}, link, data);
      expect(segment.id).toEqual(`userId/${encoded}/name/${data.name}`);
      expect(segment.component).toEqual(MockView1);
      expect(segment.data.id).toEqual(char);
    });

    it('should create segement with no data', () => {
      const link: NavLink = {
        segmentParts: ['settings-view'],
        component: MockView1
      };
      const segment = serializer._createSegment({ navId: '1', type: 'nav', secondaryId: null}, link, null);
      expect(segment.id).toEqual('settings-view');
      expect(segment.component).toEqual(MockView1);
      expect(segment.data).toEqual(null);
    });

  });

  describe('urlToNavGroupStrings', () => {
    it('should return an empty array of groups when there isnt a nav/tabs keyword', () => {
      const url = 'some/bogus/url';
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(0);
    });

    it('should return a single nav group', () => {
      const url = 'nav/23/chunk/of/segment';
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(url);
    });

    it('should return multiple nav groups', () => {
      const urlGroupOne = 'nav/1/chunk/of/segment';
      const urlGroupTwo = 'nav/2/chunk/two';
      const urlGroupThree = 'nav/3/chunk/three';
      const url = `${urlGroupOne}/${urlGroupTwo}/${urlGroupThree}`;
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(3);
      expect(result[0]).toEqual(urlGroupOne);
      expect(result[1]).toEqual(urlGroupTwo);
      expect(result[2]).toEqual(urlGroupThree);
    });

    it('should return a single tabs group', () => {
      const url = 'tabs/1/tab-one/chunk/of/segment';
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(url);
    });

    it('should return multiple tabs groups', () => {
      const urlGroupOne = 'tabs/1/tab-one/chunk/of/segment';
      const urlGroupTwo = 'tabs/2/tab-one/chunk/two';
      const urlGroupThree = 'tabs/3/tab-two/chunk/three';
      const url = `${urlGroupOne}/${urlGroupTwo}/${urlGroupThree}`;
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(3);
      expect(result[0]).toEqual(urlGroupOne);
      expect(result[1]).toEqual(urlGroupTwo);
      expect(result[2]).toEqual(urlGroupThree);
    });

    it('should return groups when url has both nav and tabs and starts with tabs', () => {
      const urlGroupOne = 'tabs/1/tab-one/chunk/of/segment';
      const urlGroupTwo = 'nav/2/chunk/two';
      const urlGroupThree = 'tabs/3/tab-two/chunk/three';
      const urlGroupFour = 'nav/4/chunk/four';
      const url = `${urlGroupOne}/${urlGroupTwo}/${urlGroupThree}/${urlGroupFour}`;
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(4);
      expect(result[0]).toEqual(urlGroupOne);
      expect(result[1]).toEqual(urlGroupTwo);
      expect(result[2]).toEqual(urlGroupThree);
      expect(result[3]).toEqual(urlGroupFour);
    });

    it('should return groups when url has both nav and tabs and starts with nav', () => {
      const urlGroupOne = 'nav/1/chunk/of/segment';
      const urlGroupTwo = 'tabs/1/tab-one/chunk/of/segment';
      const urlGroupThree = 'tabs/3/tab-two/chunk/three';
      const urlGroupFour = 'nav/4/chunk/four';
      const url = `${urlGroupOne}/${urlGroupTwo}/${urlGroupThree}/${urlGroupFour}`;
      const result = urlToNavGroupStrings(url);
      expect(result.length).toEqual(4);
      expect(result[0]).toEqual(urlGroupOne);
      expect(result[1]).toEqual(urlGroupTwo);
      expect(result[2]).toEqual(urlGroupThree);
      expect(result[3]).toEqual(urlGroupFour);
    });
  });

  describe('navGroupStringtoObjects', () => {
    it('should convert the nav group strings to objects', () => {
      const urlChunks = ['nav/1/chunk/of/segment', 'tabs/1/tab-one/chunk/of/segment'];
      const objects = navGroupStringtoObjects(urlChunks);
      expect(objects.length).toEqual(2);
      expect(objects[0].type).toEqual('nav');
      expect(objects[0].navId).toEqual('1');
      expect(objects[0].secondaryId).toEqual(null);
      expect(objects[0].segmentPieces.length).toEqual(3);
      expect(objects[0].segmentPieces[0]).toEqual('chunk');
      expect(objects[0].segmentPieces[1]).toEqual('of');
      expect(objects[0].segmentPieces[2]).toEqual('segment');
      expect(objects[1].type).toEqual('tabs');
      expect(objects[1].navId).toEqual('1');
      expect(objects[1].secondaryId).toEqual('tab-one');
      expect(objects[1].segmentPieces.length).toEqual(3);
      expect(objects[1].segmentPieces[0]).toEqual('chunk');
      expect(objects[1].segmentPieces[1]).toEqual('of');
      expect(objects[1].segmentPieces[2]).toEqual('segment');
    });
  });

  describe('parse', () => {

    it('should return empty list of segments for bogus url', () => {
      serializer = mockSerializer([]);

      const segments = serializer.parse('/some/bogus/url');
      expect(segments.length).toEqual(0);
    });

    it('should return empty list of segments when there isnt a match', () => {
      serializer = mockSerializer([
        { segment: 'some/chunk/of/url', name: 'viewone', component: MockView1 },
        { segment: 'another/section/of/url', name: 'viewtwo', component: MockView2 }
      ]);
      const segments = serializer.parse('/nav/n1/not/a/matching/url');
      expect(segments.length).toEqual(0);
    });

    it('should return the segments from the url with multiple navs', () => {
      serializer = mockSerializer([
        { segment: 'userId/:id/name/:name', name: 'viewone', component: MockView1 },
        { segment: 'selectedId/:id/food/:food', name: 'viewtwo', component: MockView2 }
      ]);
      const segments = serializer.parse('/nav/n1/userId/123/name/Stanley/nav/n2/selectedId/456/food/tacos');
      expect(segments.length).toEqual(2);
      expect(segments[0].name).toEqual('viewone');
      expect(segments[0].data.id).toEqual('123');
      expect(segments[0].data.name).toEqual('Stanley');
      expect(segments[1].name).toEqual('viewtwo');
      expect(segments[1].data.id).toEqual('456');
      expect(segments[1].data.food).toEqual('tacos');
    });

    it('should return the segments from the url with multiple tabs', () => {
      serializer = mockSerializer([
        { segment: 'userId/:id/name/:name', name: 'viewone', component: MockView1 },
        { segment: 'selectedId/:id/food/:food', name: 'viewtwo', component: MockView2 }
      ]);
      const segments = serializer.parse('/tabs/t1/tab-one/userId/123/name/Stanley/tabs/t2/tab-three/selectedId/456/food/tacos');
      expect(segments.length).toEqual(2);
      expect(segments[0].name).toEqual('viewone');
      expect(segments[0].navId).toEqual('t1');
      expect(segments[0].data.id).toEqual('123');
      expect(segments[0].data.name).toEqual('Stanley');
      expect(segments[0].secondaryId).toEqual('tab-one');
      expect(segments[1].name).toEqual('viewtwo');
      expect(segments[1].navId).toEqual('t2');
      expect(segments[1].data.id).toEqual('456');
      expect(segments[1].data.food).toEqual('tacos');
      expect(segments[1].secondaryId).toEqual('tab-three');
    });

    it('should return the segments from a mixed nav/tabs url', () => {
      serializer = mockSerializer([
        { segment: 'userId/:id/name/:name', name: 'viewone', component: MockView1 },
        { segment: 'selectedId/:id/food/:food', name: 'viewtwo', component: MockView2 }
      ]);
      const segments = serializer.parse('/tabs/t1/tab-one/userId/123/name/Stanley/nav/n1/selectedId/456/food/tacos');
      expect(segments.length).toEqual(2);
      expect(segments[0].name).toEqual('viewone');
      expect(segments[0].navId).toEqual('t1');
      expect(segments[0].data.id).toEqual('123');
      expect(segments[0].data.name).toEqual('Stanley');
      expect(segments[0].secondaryId).toEqual('tab-one');
      expect(segments[1].name).toEqual('viewtwo');
      expect(segments[1].navId).toEqual('n1');
      expect(segments[1].data.id).toEqual('456');
      expect(segments[1].data.food).toEqual('tacos');
      expect(segments[1].secondaryId).toEqual(null);
    });
  });

  describe('serialize', () => {
    it('should serialize multiple segments into a url', () => {
      let paths: NavSegment[] = [
        { type: 'nav', navId: 'whatup', secondaryId: null, id: 'some/url/chunks', name: 'viewOne', component: MockView1, data: null },
        { type: 'tabs', navId: 't1', secondaryId: 'tab-one', id: 'some/more/url/chunks', name: 'viewTwo', component: MockView1, data: null }
      ];
      const result = serializer.serialize(paths);
      expect(result).toEqual('/nav/whatup/some/url/chunks/tabs/t1/tab-one/some/more/url/chunks');
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

  describe('parseUrlParts', () => {

    it('should return a single matching segment', () => {
      // arrange
      const navGroups = [];
      const configLinks = [];
      const segmentPieces = ['some', 'part', 'of', 'url'];

      const navGroup = { type: 'nav', navId: '1', secondaryId: '', segmentPieces: segmentPieces };
      navGroups.push(navGroup);

      const configLink = {
        segmentParts: segmentPieces,
        segmentPartsLen: 4,
        component: {},
        name: 'someName',
        loadChildren: 'someValue',
      };
      configLinks.push(configLink);

      // act
      const segments = parseUrlParts(navGroups, configLinks);

      // assert
      expect(segments.length).toEqual(1);
      expect(segments[0].id).toEqual(configLink.segmentParts.join('/'));
      expect(segments[0].component).toEqual(configLink.component);
      expect(segments[0].name).toEqual(configLink.name);
      expect(segments[0].loadChildren).toEqual(configLink.loadChildren);
      expect(segments[0].type).toEqual(navGroup.type);
      expect(segments[0].navId).toEqual(navGroup.navId);
      expect(segments[0].secondaryId).toEqual(navGroup.secondaryId);
    });

    it('should return single matching segment for tabs', () => {
      // arrange
      const navGroups = [];
      const configLinks = [];
      const segmentPieces = ['some', 'part', 'of', 'url'];

      const navGroup = { type: 'tabs', navId: '1', secondaryId: 'tab-one', segmentPieces: segmentPieces };
      navGroups.push(navGroup);

      const configLink = {
        segmentParts: ['some', ':someVariable', 'of', ':someVariable2'],
        segmentPartsLen: 4,
        component: {},
        name: 'someName',
        loadChildren: 'someValue',
      };
      configLinks.push(configLink);

      // act
      const segments = parseUrlParts(navGroups, configLinks);

      // assert
      expect(segments.length).toEqual(1);
      expect(segments[0].id).toEqual(configLink.segmentParts.join('/'));
      expect(segments[0].component).toEqual(configLink.component);
      expect(segments[0].name).toEqual(configLink.name);
      expect(segments[0].loadChildren).toEqual(configLink.loadChildren);
      expect(segments[0].type).toEqual(navGroup.type);
      expect(segments[0].navId).toEqual(navGroup.navId);
      expect(segments[0].secondaryId).toEqual(navGroup.secondaryId);
      expect(segments[0].data.someVariable).toEqual('part');
      expect(segments[0].data.someVariable2).toEqual('url');
    });

    it('should return an empty list of segments when there isnt a nav group', () => {
      // arrange
      const configLinks = [];

      const configLink = {
        segmentParts: ['some', ':someVariable', 'of', ':someVariable2'],
        segmentPartsLen: 4,
        component: {},
        name: 'someName',
        loadChildren: 'someValue',
      };
      configLinks.push(configLink);

      // act
      const segments = parseUrlParts([], configLinks);

      // assert
      expect(segments.length).toEqual(0);
    });

    it('should return a list of segments', () => {
      // arrange
      const navGroups = [];
      const configLinks = [];
      const segmentPiecesOne = ['some', 'part', 'of', 'url'];
      const navGroup = { type: 'tabs', navId: '1', secondaryId: 'tab-one', segmentPieces: segmentPiecesOne };
      const segmentPiecesTwo = ['userId', '123', 'name', 'Stanley Hudson'];
      const navGroupTwo = { type: 'nav', navId: '2', secondaryId: '', segmentPieces: segmentPiecesTwo };

      navGroups.push(navGroup);
      navGroups.push(navGroupTwo);

      const configLink = {
        segmentParts: ['some', ':someVariable', 'of', ':someVariable2'],
        segmentPartsLen: 4,
        component: {},
        name: 'someName',
        loadChildren: 'someValue',
      };
      const configLinkTwo = {
        segmentParts: ['userId', ':userId', 'name', ':name'],
        segmentPartsLen: 4,
        component: {},
        name: 'nameTwo',
        loadChildren: 'valueTwo',
      };
      configLinks.push(configLink);
      configLinks.push(configLinkTwo);

      // act
      const segments = parseUrlParts(navGroups, configLinks);

      // assert
      expect(segments.length).toEqual(2);
      expect(segments[0].id).toEqual(configLink.segmentParts.join('/'));
      expect(segments[0].component).toEqual(configLink.component);
      expect(segments[0].name).toEqual(configLink.name);
      expect(segments[0].loadChildren).toEqual(configLink.loadChildren);
      expect(segments[0].type).toEqual(navGroup.type);
      expect(segments[0].navId).toEqual(navGroup.navId);
      expect(segments[0].secondaryId).toEqual(navGroup.secondaryId);
      expect(segments[0].data.someVariable).toEqual('part');
      expect(segments[0].data.someVariable2).toEqual('url');

      expect(segments[1].id).toEqual(configLinkTwo.segmentParts.join('/'));
      expect(segments[1].component).toEqual(configLinkTwo.component);
      expect(segments[1].name).toEqual(configLinkTwo.name);
      expect(segments[1].loadChildren).toEqual(configLinkTwo.loadChildren);
      expect(segments[1].type).toEqual(navGroupTwo.type);
      expect(segments[1].navId).toEqual(navGroupTwo.navId);
      expect(segments[1].secondaryId).toEqual(navGroupTwo.secondaryId);
      expect(segments[1].data.userId).toEqual('123');
      expect(segments[1].data.name).toEqual('Stanley Hudson');
    });

    it('should return only matching segments for the nav groups', () => {
      // arrange
      const navGroups = [];
      const configLinks = [];
      const segmentPiecesOne = ['some', 'part', 'of', 'url'];
      const navGroup = { type: 'tabs', navId: '1', secondaryId: 'tab-one', segmentPieces: segmentPiecesOne };
      const segmentPiecesTwo = ['userId', '123', 'name', 'Stanley Hudson'];
      const navGroupTwo = { type: 'nav', navId: '2', secondaryId: '', segmentPieces: segmentPiecesTwo };

      navGroups.push(navGroup);
      navGroups.push(navGroupTwo);

      const configLink = {
        segmentParts: ['some', ':someVariable', 'of', ':someVariable2'],
        segmentPartsLen: 4,
        component: {},
        name: 'someName',
        loadChildren: 'someValue',
      };
      const configLinkTwo = {
        segmentParts: ['some', 'bogus', 'content', 'wewontmatch'],
        segmentPartsLen: 4,
        component: {},
        name: 'nameTwo',
        loadChildren: 'valueTwo',
      };
      const configLinkThree = {
        segmentParts: ['hi'],
        segmentPartsLen: 1,
        component: {},
        name: 'nameThree',
        loadChildren: 'valueThree',
      };
      configLinks.push(configLink);
      configLinks.push(configLinkTwo);
      configLinks.push(configLinkThree);

      const segments = parseUrlParts(navGroups, configLinks);

      expect(segments.length).toEqual(1);
      expect(segments[0].name).toEqual(configLink.name);
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

  var serializer: UrlSerializer;

  beforeEach(() => {
    serializer = mockSerializer();
  });

});


class ContactDetailPage {}
class NotFound {}

function mockSerializer(navLinks?: NavLink[]) {
  let deepLinkConfig = mockDeepLinkConfig(navLinks);
  return new UrlSerializer(deepLinkConfig);
}
