import { OpaqueToken } from '@angular/core';

import { NavigationContainer } from './navigation-container';
import { DeepLinkConfig, NavLink, NavSegment } from './nav-util';
import { isArray, isBlank, isPresent } from '../util/util';


/**
 * @hidden
 */
export class UrlSerializer {
  links: NavLink[];

  constructor(config: DeepLinkConfig) {
    if (config && isArray(config.links)) {
      this.links = normalizeLinks(config.links);

    } else {
      this.links = [];
    }
  }

  /**
   * Parse the URL into a Path, which is made up of multiple NavSegments.
   * Match which components belong to each segment.
   */
  parse(browserUrl: string): NavSegment[] {
    if (browserUrl.charAt(0) === '/') {
      browserUrl = browserUrl.substr(1);
    }

    // trim off data after ? and #
    browserUrl = browserUrl.split('?')[0].split('#')[0];
    const navGroupStrings = urlToNavGroupStrings(browserUrl);
    const navGroups = navGroupStringtoObjects(navGroupStrings);
    return parseUrlParts(navGroups, this.links);
  }



  createSegmentFromName(navContainer: NavigationContainer, nameOrComponent: any): NavSegment {
    const configLink = this.getLinkFromName(nameOrComponent);
    if (configLink) {
      return this._createSegment({ navId: navContainer.id, secondaryId: navContainer.getSecondaryIdentifier(), type: 'tabs'}, configLink, null);
    }
    return null;
  }

  getLinkFromName(nameOrComponent: any) {
    return this.links.find(link => {
      return (link.component === nameOrComponent) ||
             (link.name === nameOrComponent);
    });
  }

  /**
   * Serialize a path, which is made up of multiple NavSegments,
   * into a URL string. Turn each segment into a string and concat them to a URL.
   */
  serialize(segments: NavSegment[]): string {
    if (!segments || !segments.length) {
      return '/';
    }
    const sections = segments.map(segment => {
      if (segment.type === 'tabs') {
        return `/${segment.type}/${segment.navId}/${segment.secondaryId}/${segment.id}`;
      }
      return `/${segment.type}/${segment.navId}/${segment.id}`;
    });
    return sections.join('');
  }

  /**
   * Serializes a component and its data into a NavSegment.
   */
  serializeComponent(navGroup: NavGroup, component: any, data: any): NavSegment {
    if (component) {
      const link = findLinkByComponentData(this.links, component, data);
      if (link) {
        return this._createSegment(navGroup, link, data);
      }
    }
    return null;
  }

  /** @internal */
  _createSegment(navGroup: NavGroup, configLink: NavLink, data: any): NavSegment {
    let urlParts = configLink.segmentParts;

    if (isPresent(data)) {
      // create a copy of the original parts in the link config
      urlParts = urlParts.slice();

      // loop through all the data and convert it to a string
      const keys = Object.keys(data);
      const keysLength = keys.length;

      if (keysLength) {
        for (var i = 0; i < urlParts.length; i++) {
          if (urlParts[i].charAt(0) === ':') {
            for (var j = 0; j < keysLength; j++) {
              if (urlParts[i] === `:${keys[j]}`) {
                // this data goes into the URL part (between slashes)
                urlParts[i] = encodeURIComponent(data[keys[j]]);
                break;
              }
            }
          }
        }
      }
    }

    return {
      id: urlParts.join('/'),
      name: configLink.name,
      component: configLink.component,
      loadChildren: configLink.loadChildren,
      data: data,
      defaultHistory: configLink.defaultHistory,
      navId: navGroup.navId,
      type: navGroup.type,
      secondaryId: navGroup.secondaryId
    };
  }
}

export function formatUrlPart(name: string): string {
  name = name.replace(URL_REPLACE_REG, '-');
  name = name.charAt(0).toLowerCase() + name.substring(1).replace(/[A-Z]/g, match => {
    return '-' + match.toLowerCase();
  });
  while (name.indexOf('--') > -1) {
    name = name.replace('--', '-');
  }
  if (name.charAt(0) === '-') {
    name = name.substring(1);
  }
  if (name.substring(name.length - 1) === '-') {
    name = name.substring(0, name.length - 1);
  }
  return encodeURIComponent(name);
}

export const parseUrlParts = (navGroups: NavGroup[], configLinks: NavLink[]): NavSegment[] => {
  const segments: NavSegment[] = [];
  for (const link of configLinks) {
    for (const navGroup of navGroups) {
      if (link.segmentPartsLen === navGroup.segmentPieces.length) {
        // check if the segment pieces are a match
        let allSegmentsMatch = true;
        for (let i = 0; i < navGroup.segmentPieces.length; i++) {
          if (!isPartMatch(navGroup.segmentPieces[i], link.segmentParts[i])) {
            allSegmentsMatch = false;
            break;
          }
        }
        // sweet, we found a match!
        if (allSegmentsMatch) {
          segments.push({
            id: link.segmentParts.join('/'),
            name: link.name,
            component: link.component,
            loadChildren: link.loadChildren,
            data: createMatchedData(navGroup.segmentPieces, link),
            defaultHistory: link.defaultHistory,
            navId: navGroup.navId,
            type: navGroup.type,
            secondaryId: navGroup.secondaryId
          });
        }
      }
    }
  }
  return segments;
};

export const isPartMatch = (urlPart: string, configLinkPart: string) => {
  if (isPresent(urlPart) && isPresent(configLinkPart)) {
    if (configLinkPart.charAt(0) === ':') {
      return true;
    }
    return (urlPart === configLinkPart);
  }
  return false;
};

export const createMatchedData = (matchedUrlParts: string[], link: NavLink): any => {
  let data: any = null;

  for (var i = 0; i < link.segmentPartsLen; i++) {
    if (link.segmentParts[i].charAt(0) === ':') {
      data = data || {};
      data[link.segmentParts[i].substring(1)] = decodeURIComponent(matchedUrlParts[i]);
    }
  }

  return data;
};

export const findLinkByComponentData = (links: NavLink[], component: any, instanceData: any): NavLink => {
  let foundLink: NavLink = null;
  let foundLinkDataMatches = -1;

  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    if (link.component === component) {
      // ok, so the component matched, but multiple links can point
      // to the same component, so let's make sure this is the right link
      var dataMatches = 0;
      if (instanceData) {
        var instanceDataKeys = Object.keys(instanceData);

        // this link has data
        for (var j = 0; j < instanceDataKeys.length; j++) {
          if (isPresent(link.dataKeys[instanceDataKeys[j]])) {
            dataMatches++;
          }
        }

      } else if (link.dataLen) {
        // this component does not have data but the link does
        continue;
      }

      if (dataMatches >= foundLinkDataMatches) {
        foundLink = link;
        foundLinkDataMatches = dataMatches;
      }
    }
  }

  return foundLink;
};

export const normalizeLinks = (links: NavLink[]): NavLink[] => {
  for (var i = 0, ilen = links.length; i < ilen; i++) {
    var link = links[i];

    if (isBlank(link.segment)) {
      link.segment = link.name;
    }

    link.dataKeys = {};
    link.segmentParts = link.segment.split('/');
    link.segmentPartsLen = link.segmentParts.length;

    // used for sorting
    link.staticLen = link.dataLen = 0;
    var stillCountingStatic = true;

    for (var j = 0; j < link.segmentPartsLen; j++) {
      if (link.segmentParts[j].charAt(0) === ':') {
        link.dataLen++;
        stillCountingStatic = false;
        link.dataKeys[link.segmentParts[j].substring(1)] = true;

      } else if (stillCountingStatic) {
        link.staticLen++;
      }
    }
  }

  // sort by the number of parts, with the links
  // with the most parts first
  return links.sort(sortConfigLinks);
};

function sortConfigLinks(a: NavLink, b: NavLink) {
  // sort by the number of parts
  if (a.segmentPartsLen > b.segmentPartsLen) {
    return -1;
  }
  if (a.segmentPartsLen < b.segmentPartsLen) {
    return 1;
  }

  // sort by the number of static parts in a row
  if (a.staticLen > b.staticLen) {
    return -1;
  }
  if (a.staticLen < b.staticLen) {
    return 1;
  }

  // sort by the number of total data parts
  if (a.dataLen < b.dataLen) {
    return -1;
  }
  if (a.dataLen > b.dataLen) {
    return 1;
  }

  return 0;
}

const URL_REPLACE_REG = /\s+|\?|\!|\$|\,|\.|\+|\"|\'|\*|\^|\||\/|\\|\[|\]|#|%|`|>|<|;|:|@|&|=/g;

/**
 * @hidden
 */
export const DeepLinkConfigToken = new OpaqueToken('USERLINKS');

export function setupUrlSerializer(userDeepLinkConfig: any): UrlSerializer {
  return new UrlSerializer(userDeepLinkConfig);
}

export function urlToNavGroupStrings(url: string): string[] {
  const tokens = url.split('/');
  const keywordIndexes = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === 'nav' || tokens[i] === 'tabs') {
      keywordIndexes.push(i);
    }
  }
  const groupings: string[] = [];
  for (let i = 0; i < keywordIndexes.length; i++) {
    const startIndex = keywordIndexes[i];
    const endIndex = keywordIndexes[i + 1 < keywordIndexes.length ? i + 1 : keywordIndexes.length];
    const group = tokens.slice(startIndex, endIndex);
    groupings.push(group.join('/'));
  }
  return groupings;
}

export function navGroupStringtoObjects(navGroupStrings: string[]): NavGroup[] {
  // each string has a known format-ish, convert it to it
  return navGroupStrings.map(navGroupString => {
    const sections = navGroupString.split('/');
    if (sections[0] === 'nav') {
      return {
        type: 'nav',
        navId: sections[1],
        niceId: sections[1],
        secondaryId: null,
        segmentPieces: sections.splice(2)
      };
    }
    return {
      type: 'tabs',
      navId: sections[1],
      niceId: sections[1],
      secondaryId: sections[2],
      segmentPieces: sections.splice(3)
    };
  });
}

export interface NavGroup {
  type: string;
  navId: string;
  secondaryId: string;
  segmentPieces?: string[];
}
