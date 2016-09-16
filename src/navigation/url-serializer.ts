import { OpaqueToken } from '@angular/core';

import { DeepLinkConfig, NavLink, NavSegment } from './nav-util';
import { isArray, isBlank, isPresent, pascalCaseToDashCase } from '../util/util';


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

    return parseUrlParts(browserUrl.split('/'), this.links);
  }

  createSegmentFromName(nameOrComponent: any): NavSegment {
    const configLink = this.links.find((link: NavLink) => {
      return (link.component === nameOrComponent) ||
             (link.name === nameOrComponent) ||
             (link.component.name === nameOrComponent);
    });

    return configLink ? {
      id: configLink.name,
      name: configLink.name,
      component: configLink.component,
      data: null
    } : null;
  }

  /**
   * Serialize a path, which is made up of multiple NavSegments,
   * into a URL string. Turn each segment into a string and concat them to a URL.
   */
  serialize(path: NavSegment[]): string {
    return '/' + path.map(segment => segment.id).join('/');
  }

  /**
   * Serializes a component and its data into a NavSegment.
   */
  serializeComponent(component: any, data: any): NavSegment {
    if (component) {
      const link = this.links.find(l => component === l.component || component.name === l.name);
      if (link) {
        return this.createSegment(link, data);
      }
    }
    return null;
  }

  createSegment(configLink: NavLink, data: any): NavSegment {
    let urlParts = configLink.parts;

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
      data: data,
      defaultHistory: configLink.defaultHistory
    };
  }

  formatUrlPart(name: string): string {
    name = pascalCaseToDashCase(name.replace(URL_REPLACE_REG, '-'));
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

}

export const parseUrlParts = (urlParts: string[], configLinks: NavLink[]): NavSegment[] => {
  const configLinkLen = configLinks.length;
  const urlPartsLen = urlParts.length;
  const segments: NavSegment[] = new Array(urlPartsLen);

  for (var i = 0; i < configLinkLen; i++) {
    // compare url parts to config link parts to create nav segments
    var configLink = configLinks[i];
    if (configLink.partsLen <= urlPartsLen) {
      fillMatchedUrlParts(segments, urlParts, configLink);
    }
  }

  // remove all the undefined segments
  for (var i = urlPartsLen - 1; i >= 0; i--) {
    if (segments[i] === undefined) {
      if (urlParts[i] === undefined) {
        // not a used part, so remove it
        segments.splice(i, 1);

      } else {
        // create an empty part
        segments[i] = {
          id: urlParts[i],
          name: urlParts[i],
          component: null,
          data: null
        };
      }
    }
  }

  return segments;
};

export const fillMatchedUrlParts = (segments: NavSegment[], urlParts: string[], configLink: NavLink) => {
  for (var i = 0; i < urlParts.length; i++) {
    var urlI = i;

    for (var j = 0; j < configLink.partsLen; j++) {
      if (isPartMatch(urlParts[urlI], configLink.parts[j])) {
        urlI++;
      } else {
        break;
      }
    }

    if ((urlI - i) === configLink.partsLen) {
      var matchedUrlParts = urlParts.slice(i, urlI);
      for (var j = i; j < urlI; j++) {
        urlParts[j] = undefined;
      }
      segments[i] = {
        id: matchedUrlParts.join('/'),
        name: configLink.name,
        component: configLink.component,
        data: createMatchedData(matchedUrlParts, configLink)
      };
    }
  }
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

  for (var i = 0; i < link.partsLen; i++) {
    if (link.parts[i].charAt(0) === ':') {
      data = data || {};
      data[link.parts[i].substring(1)] = decodeURIComponent(matchedUrlParts[i]);
    }
  }

  return data;
};

export const normalizeLinks = (links: NavLink[]): NavLink[] => {
  for (var i = 0, ilen = links.length; i < ilen; i++) {
    var link = links[i];

    if (isBlank(link.segment)) {
      link.segment = link.name;
    }

    link.parts = link.segment.split('/');
    link.partsLen = link.parts.length;

    // used for sorting
    link.staticLen = link.dataLen = 0;
    var stillCountingStatic = true;

    for (var j = 0; j < link.partsLen; j++) {
      if (link.parts[j].charAt(0) === ':') {
        link.dataLen++;
        stillCountingStatic = false;

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
  if (a.partsLen > b.partsLen) {
    return -1;
  }
  if (a.partsLen < b.partsLen) {
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

export const DeepLinkConfigToken = new OpaqueToken('USERLINKS');

export function setupUrlSerializer(userDeepLinkConfig: any): UrlSerializer {
  return new UrlSerializer(userDeepLinkConfig);
}
