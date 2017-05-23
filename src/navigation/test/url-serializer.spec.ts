import { NavLink, NavSegment } from '../nav-util';
import { UrlSerializer, isPartMatch, fillMatchedUrlParts, parseUrlParts, createMatchedData, normalizeLinks, findLinkByComponentData, urlToNavGroupStrings, navGroupStringtoObjects } from '../url-serializer';
import { mockDeepLinkConfig, noop, MockView1, MockView2, MockView3, MockView4, MockView5 } from '../../util/mock-providers';


describe('UrlSerializer', () => {

  describe('serializeComponent', () => {

    it('should create segement when config has multiple links to same component', () => {
      const link1 = { component: MockView1, name: 'viewone', segment: 'view' };
      const link2 = { component: MockView1, name: 'viewtwo', segment: 'view/:param1' };
      const link3 = { component: MockView1, name: 'viewthree', segment: 'view/:param1/:param2' };

      serializer = mockSerializer([link1, link2, link3]);
      serializer._createSegment = noop;
      spyOn(serializer, '_createSegment');
      serializer.serializeComponent(MockView1, null);
      expect(serializer._createSegment).toHaveBeenCalledWith(link1, null);
    });

    it('should create segment if component found in links', () => {
      serializer._createSegment = noop;
      spyOn(serializer, '_createSegment');
      serializer.serializeComponent(MockView1, null);
      expect(serializer._createSegment).toHaveBeenCalled();
    });

    it('should return null if component not found in links', () => {
      serializer._createSegment = noop;
      spyOn(serializer, '_createSegment');
      serializer.serializeComponent(NotFound, null);
      expect(serializer._createSegment).not.toHaveBeenCalled();
    });

    it('should create tab segment if component found in deep links', () => {
      serializer._createSegment = noop;
      spyOn(serializer, '_createSegment');
      serializer.serializeComponent(MockView1, null);
      expect(serializer._createSegment).toHaveBeenCalled();
    });

  });

  describe('_createSegment', () => {

    it('should create segement path data', () => {
      let link: NavLink = {
        segmentParts: ['a', ':id', ':name'],
        component: MockView1
      };
      let data: any = {
        id: 8675309,
        name: 'jenny'
      };
      let p = serializer._createSegment(link, data);
      expect(p.id).toEqual('a/8675309/jenny');
      expect(p.component).toEqual(MockView1);
    });

    it('should create segement with encodeURIComponent data', () => {
      let char = '道';
      let encoded = encodeURIComponent(char);

      let link: NavLink = {
        segmentParts: ['a', ':id'],
        component: MockView1
      };
      let data: any = {
        id: char
      };
      let p = serializer._createSegment(link, data);
      expect(p.id).toEqual('a/' + encoded);
      expect(p.component).toEqual(MockView1);
      expect(p.data.id).toEqual(char);
    });

    it('should create segement with no data', () => {
      let link: NavLink = {
        segmentParts: ['a'],
        component: MockView1
      };
      let p = serializer._createSegment(link, null);
      expect(p.id).toEqual('a');
      expect(p.component).toEqual(MockView1);
      expect(p.data).toEqual(null);
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

    /*it('should parse mix match of component paths', () => {
      serializer = mockSerializer([
        { segment: 'b/c', name: 'viewone', component: MockView1 },
        { segment: 'a/:id', name: 'viewtwo', component: MockView2 }
      ]);
      let p = serializer.parse('a/b/c');
      expect(p.length).toEqual(2);
      expect(p[0].component).toEqual(null);
      expect(p[0].data).toEqual(null);
      expect(p[1].name).toEqual('viewone');
      expect(p[1].data).toEqual(null);
    });

    it('should parse by higher priority with data in middle', () => {
      serializer = mockSerializer([
        { segment: 'viewone/:id/viewtwo', name: 'viewone', component: MockView1 },
        { segment: 'viewone/viewtwo', name: 'viewtwo', component: MockView2 },
        { segment: 'viewtwo', name: 'viewthree', component: MockView3 }
      ]);
      let p = serializer.parse('viewone/viewtwo/viewtwo');
      expect(p.length).toEqual(1);
      expect(p[0].name).toEqual('viewone');
      expect(p[0].data.id).toEqual('viewtwo');
    });

    it('should parse by higher priority, two segments', () => {
      serializer = mockSerializer([
        { segment: 'viewone/:id', name: 'viewone', component: MockView1 },
        { name: 'viewtwo', component: MockView2 }
      ]);
      let p = serializer.parse('viewone/viewtwo');
      expect(p.length).toEqual(1);
      expect(p[0].name).toEqual('viewone');
      expect(p[0].data.id).toEqual('viewtwo');
    });

    it('should parse path with one slash and data', () => {
      serializer = mockSerializer([
        { segment: 'a/:id', name: 'a', component: MockView1 },
      ]);
      let p = serializer.parse('a/b');
      expect(p.length).toEqual(1);
      expect(p[0].name).toEqual('a');
      expect(p[0].data.id).toEqual('b');
    });

    it('should parse multiple url part path', () => {
      serializer = mockSerializer([
        { segment: 'c/a/b/d', name: 'five', component: MockView5 },
        { segment: 'c/a/b', name: 'four', component: MockView4 },
        { segment: 'a/b/c', name: 'three', component: MockView3 },
        { segment: 'a/b', name: 'two', component: MockView2 },
        { segment: 'a', name: 'one', component: MockView1 }
      ]);
      let p = serializer.parse('a/b');
      expect(p.length).toEqual(1);
      expect(p[0].name).toEqual('two');

      p = serializer.parse('a');
      expect(p.length).toEqual(1);
      expect(p[0].name).toEqual('one');
    });

    it('should parse multiple segments with data', () => {
      let p = serializer.parse('viewone/viewtwo');
      expect(p.length).toEqual(2);
      expect(p[0].name).toEqual('viewone');
      expect(p[1].name).toEqual('viewtwo');
    });

    it('should parse one segment path', () => {
      let p = serializer.parse('viewone');
      expect(p.length).toEqual(1);
      expect(p[0].id).toEqual('viewone');
      expect(p[0].name).toEqual('viewone');
      expect(p[0].data).toEqual(null);
    });
    */
  });
  describe('serialize', () => {
    it('should bring together two paths that are not the index', () => {
      let path: NavSegment[] = [
        { id: 'a', name: 'a', component: MockView1, data: null },
        { id: 'b', name: 'b', component: MockView1, data: null }
      ];
      expect(serializer.serialize(path)).toEqual('/a/b');
    });

    it('should bring together one path, not the index', () => {
      let path: NavSegment[] = [
        { id: 'a', name: 'a', component: MockView1, data: null }
      ];
      expect(serializer.serialize(path)).toEqual('/a');
    });

    it('should bring together one path that is the index', () => {
      let path: NavSegment[] = [
        { id: '', name: 'a', component: MockView1, data: null }
      ];
      expect(serializer.serialize(path)).toEqual('/');
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

    it('should match with complex path', () => {
      let urlParts = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      let configLinks: NavLink[] = [
        { segmentParts: ['a', 'b', 'c', 'e'], segmentPartsLen: 4, component: MockView2 },
        { segmentParts: ['a', ':key', ':val'], segmentPartsLen: 3, component: MockView1 },
        { segmentParts: ['a', 'c', 'd'], segmentPartsLen: 3, component: MockView5 },
        { segmentParts: ['d', 'e'], segmentPartsLen: 2, component: MockView4 },
        { segmentParts: ['d', ':x'], segmentPartsLen: 2, component: MockView3 },
        { segmentParts: ['f'], segmentPartsLen: 1, component: MockView2 },
        { segmentParts: [':last'], segmentPartsLen: 1, component: MockView1 },
      ];

      let segments = parseUrlParts(null, configLinks);
      expect(segments.length).toEqual(4);
      expect(segments[0].id).toEqual('a/b/c');
      expect(segments[0].data.key).toEqual('b');
      expect(segments[0].data.val).toEqual('c');
      expect(segments[1].id).toEqual('d/e');
      expect(segments[1].data).toEqual(null);
      expect(segments[2].id).toEqual('f');
      expect(segments[3].id).toEqual('g');
      expect(segments[3].data.last).toEqual('g');
    });

    it('should not get a match on already matched parts', () => {
      let urlParts = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      let configLinks: NavLink[] = [
        { segmentParts: ['a', 'b', 'c'], segmentPartsLen: 3, component: MockView1 },
        { segmentParts: ['b', 'c', 'd'], segmentPartsLen: 3, component: MockView1 }, // no match
        { segmentParts: ['a', 'b'], segmentPartsLen: 2, component: MockView1 }, // no match
        { segmentParts: ['d', 'e'], segmentPartsLen: 2, component: MockView1 },
        { segmentParts: ['e', 'f'], segmentPartsLen: 2, component: MockView1 }, // no match
        { segmentParts: ['e'], segmentPartsLen: 1, component: MockView1 }, // no match
        { segmentParts: ['f'], segmentPartsLen: 1, component: MockView1 },
      ];

      let segments = parseUrlParts(null, configLinks);
      expect(segments.length).toEqual(4);
      expect(segments[0].id).toEqual('a/b/c');
      expect(segments[1].id).toEqual('d/e');
      expect(segments[2].id).toEqual('f');
      expect(segments[3].id).toEqual('g');
    });

    it('should get a one part match', () => {
      let urlParts = ['a', 'b', 'c'];
      let configLinks: NavLink[] = [
        { segmentParts: ['a'], segmentPartsLen: 1, component: MockView1 },
        { segmentParts: ['b'], segmentPartsLen: 1, component: MockView2 },
        { segmentParts: ['c'], segmentPartsLen: 1, component: MockView3 },
      ];
      let segments = parseUrlParts(null, configLinks);
      expect(segments.length).toEqual(3);
      expect(segments[0].id).toEqual('a');
      expect(segments[1].id).toEqual('b');
      expect(segments[2].id).toEqual('c');
    });

    it('should not match', () => {
      let urlParts = ['z'];
      let configLinks: NavLink[] = [
        { segmentParts: ['a'], segmentPartsLen: 1, component: MockView1 }
      ];
      let segments = parseUrlParts(null, configLinks);
      expect(segments.length).toEqual(1);
      expect(segments[0].id).toEqual('z');
      expect(segments[0].name).toEqual('z');
      expect(segments[0].component).toEqual(null);
      expect(segments[0].data).toEqual(null);
    });

  });

  describe('fillMatchedUrlParts', () => {

    it('should match w/ many url parts and many config parts w/ : data', () => {
      let urlParts = ['a', 'b', 'c', 'd', 'e', 'b', 'c'];
      let configLink: NavLink = { segmentParts: ['b', 'c', ':key'], segmentPartsLen: 3, component: MockView1 };
      let segments: NavSegment[] = new Array(urlParts.length);
      fillMatchedUrlParts(segments, urlParts, configLink);

      expect(segments[0]).toEqual(undefined);
      expect(segments[1].id).toEqual('b/c/d');
      expect(segments[1].data.key).toEqual('d');

      expect(urlParts[0]).toEqual('a');
      expect(urlParts[1]).toEqual(undefined);
      expect(urlParts[2]).toEqual(undefined);
      expect(urlParts[3]).toEqual(undefined);
      expect(urlParts[4]).toEqual('e');
      expect(urlParts[5]).toEqual('b');
      expect(urlParts[6]).toEqual('c');
    });

    it('should not match w/ many url parts and many config parts', () => {
      let urlParts = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      let configLink: NavLink = { segmentParts: ['e', 'c', 'd'], segmentPartsLen: 3, component: MockView1 };
      let segments: NavSegment[] = new Array(urlParts.length);
      fillMatchedUrlParts(segments, urlParts, configLink);
      expect(segments.filter(f => !!f).length).toEqual(0);

      expect(urlParts[0]).toEqual('a');
      expect(urlParts[1]).toEqual('b');
      expect(urlParts[2]).toEqual('c');
      expect(urlParts[3]).toEqual('d');
      expect(urlParts[4]).toEqual('e');
      expect(urlParts[5]).toEqual('f');
      expect(urlParts[6]).toEqual('g');
    });

    it('should match w/ two sets of the same parts', () => {
      let urlParts = ['a', 'b', 'c', 'd', 'b', 'c'];
      let configLink: NavLink = { segmentParts: ['b', 'c'], segmentPartsLen: 2, component: MockView1 };
      let segments: NavSegment[] = new Array(urlParts.length);
      fillMatchedUrlParts(segments, urlParts, configLink);

      expect(segments[0]).toEqual(undefined);
      expect(segments[1].id).toEqual('b/c');
      expect(segments[2]).toEqual(undefined);
      expect(segments[3]).toEqual(undefined);
      expect(segments[4].id).toEqual('b/c');
      expect(segments[5]).toEqual(undefined);

      expect(urlParts[0]).toEqual('a');
      expect(urlParts[1]).toEqual(undefined);
      expect(urlParts[2]).toEqual(undefined);
      expect(urlParts[3]).toEqual('d');
      expect(urlParts[4]).toEqual(undefined);
      expect(urlParts[5]).toEqual(undefined);
    });

    it('should match w/ many url parts and many config parts', () => {
      let urlParts = ['a', 'b', 'c', 'd'];
      let configLink: NavLink = { segmentParts: ['c', 'd'], segmentPartsLen: 2, component: MockView1 };
      let segments: NavSegment[] = new Array(urlParts.length);
      fillMatchedUrlParts(segments, urlParts, configLink);

      expect(segments[0]).toEqual(undefined);
      expect(segments[1]).toEqual(undefined);
      expect(segments[2].id).toEqual('c/d');
      expect(segments[3]).toEqual(undefined);

      expect(urlParts[0]).toEqual('a');
      expect(urlParts[1]).toEqual('b');
      expect(urlParts[2]).toEqual(undefined);
      expect(urlParts[3]).toEqual(undefined);
    });

    it('should match the repeated url parts', () => {
      let urlParts = ['a', 'a', 'a', 'a'];
      let configLink: NavLink = { segmentParts: ['a'], segmentPartsLen: 1, component: MockView1 };
      let segments: NavSegment[] = new Array(urlParts.length);
      fillMatchedUrlParts(segments, urlParts, configLink);

      expect(segments[0].id).toEqual('a');
      expect(segments[1].id).toEqual('a');
      expect(segments[2].id).toEqual('a');
      expect(segments[3].id).toEqual('a');

      expect(urlParts[0]).toEqual(undefined);
      expect(urlParts[1]).toEqual(undefined);
      expect(urlParts[2]).toEqual(undefined);
      expect(urlParts[3]).toEqual(undefined);
    });

    it('should not match w/ two url parts', () => {
      let urlParts = ['a', 'b'];
      let configLink: NavLink = { segmentParts: ['c'], segmentPartsLen: 1, component: MockView1 };
      let segments: NavSegment[] = new Array(urlParts.length);
      fillMatchedUrlParts(segments, urlParts, configLink);

      expect(segments[0]).toEqual(undefined);
      expect(segments[1]).toEqual(undefined);

      expect(urlParts[0]).toEqual('a');
      expect(urlParts[1]).toEqual('b');
    });

    it('should match data only config link part', () => {
      let urlParts = ['a', 'b'];
      let configLink: NavLink = { segmentParts: [':key'], segmentPartsLen: 1, component: MockView1 };
      let segments: NavSegment[] = new Array(urlParts.length);
      fillMatchedUrlParts(segments, urlParts, configLink);

      expect(segments[0].id).toEqual('a');
      expect(segments[0].data.key).toEqual('a');
      expect(segments[1].id).toEqual('b');
      expect(segments[1].data.key).toEqual('b');

      expect(urlParts[0]).toEqual(undefined);
      expect(urlParts[1]).toEqual(undefined);
    });

    it('should match w/ many url parts', () => {
      let urlParts = ['a', 'b', 'c', 'd'];
      let configLink: NavLink = { segmentParts: ['d'], segmentPartsLen: 1, component: MockView1 };
      let segments: NavSegment[] = new Array(urlParts.length);
      fillMatchedUrlParts(segments, urlParts, configLink);

      expect(segments[0]).toEqual(undefined);
      expect(segments[1]).toEqual(undefined);
      expect(segments[2]).toEqual(undefined);
      expect(segments[3].id).toEqual('d');

      expect(urlParts[0]).toEqual('a');
      expect(urlParts[1]).toEqual('b');
      expect(urlParts[2]).toEqual('c');
      expect(urlParts[3]).toEqual(undefined);
    });

    it('should match single part', () => {
      let urlParts = ['a'];
      let configLink: NavLink = { segmentParts: ['a'], segmentPartsLen: 1, component: MockView1 };
      let segments: NavSegment[] = new Array(urlParts.length);
      fillMatchedUrlParts(segments, urlParts, configLink);

      expect(segments[0].id).toEqual('a');
      expect(segments[0].component).toEqual(MockView1);
      expect(segments[0].data).toEqual(null);

      expect(urlParts[0]).toEqual(undefined);
    });

    it('should not match single part', () => {
      let urlParts = ['a'];
      let configLink: NavLink = { segmentParts: ['b'], segmentPartsLen: 1, component: MockView1 };
      let segments: NavSegment[] = new Array(urlParts.length);
      fillMatchedUrlParts(segments, urlParts, configLink);
      expect(segments[0]).toEqual(undefined);
      expect(urlParts[0]).toEqual('a');
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
      expect(serializer.formatUrlPart(name)).toEqual(encoded);
    });

    it('should not allow restricted characters', () => {
      expect(serializer.formatUrlPart('!!!Restricted \'?$,.+"*^|/\#%`><;:@&[]=! Characters!!!')).toEqual('restricted-characters');
    });

    it('should trim and replace spaces with dashes', () => {
      expect(serializer.formatUrlPart('   This is the name   ')).toEqual('this-is-the-name');
    });

    it('should not have multiple dashes', () => {
      expect(serializer.formatUrlPart('Contact Detail Page')).toEqual('contact-detail-page');
    });

    it('should change to pascal case for multiple words', () => {
      expect(serializer.formatUrlPart('ContactDetailPage')).toEqual('contact-detail-page');
    });

    it('should change to pascal case for one work', () => {
      expect(serializer.formatUrlPart('View1')).toEqual('view1');
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
