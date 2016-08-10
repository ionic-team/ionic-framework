import { Injectable, Inject, forwardRef } from '@angular/core';

import { isArray, isBlank, isPresent, pascalCaseToDashCase } from '../util/util';
import { DeepLink,DeepLinkConfig,  NavLink, NavPath, NavSegment } from './nav-util';
import { UserDeepLinkConfig } from './deep-linker';


@Injectable()
export class UrlSerializer {
  links: NavLink[];

  constructor(@Inject(UserDeepLinkConfig) config: DeepLinkConfig) {
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
  parse(browserUrl: string): NavPath {
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
  serialize(path: NavPath): string {
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
      data: data
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

export const parseUrlParts = (urlParts: string[], configLinks: NavLink[]): NavPath => {
  const configLinkLength = configLinks.length;
  const path: NavPath = [];
  let segment: NavSegment;

  for (var j = 0; j < configLinkLength; j++) {
    // compare url parts to config link parts to create nav segments
    segment = null;

    for (var i = 0; i < urlParts.length; i++) {
      // test each link config starting from this url part index
      segment = matchUrlParts(i, urlParts, configLinks[j]);
      if (segment) {
        i += (configLinks[j].parts.length - 1);
        break;
      }
    }

    if (segment === null) {
      segment = {
        id: urlParts[i],
        name: urlParts[i],
        component: null,
        data: null
      };
    }

    path.push(segment);
  }

  return path;
};

export const matchUrlParts = (partStartIndex: number, urlParts: string[], link: NavLink): NavSegment => {
  for (var i = 0; i < link.parts.length; i++) {
    if (!isPartMatch(urlParts[partStartIndex + i], link.parts[i])) {
      // these parts do not match, so this link config will not work
      return null;
    }
  }

  // all parts matched so far
  // make sure the lengths are correct
  const matchedUrlParts = urlParts.slice(partStartIndex, partStartIndex + link.parts.length);
  return createSegmentFromPart(matchedUrlParts, link);
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

export const createSegmentFromPart = (matchedUrlParts: string[], link: NavLink): NavSegment => {
  if (matchedUrlParts.length === link.parts.length) {
    const segment: NavSegment = {
      id: matchedUrlParts.join('/'),
      name: link.name,
      component: link.component,
      data: createMatchedData(matchedUrlParts, link)
    };
    if (segment.id === '') {
      segment.id = link.name;
    }
    return segment;
  }
  return null;
};

export const createMatchedData = (matchedUrlParts: string[], link: NavLink): any => {
  let data: any = null;

  for (var i = 0; i < link.parts.length; i++) {
    if (link.parts[i].charAt(0) === ':') {
      data = data || {};
      data[link.parts[i].substring(1)] = decodeURIComponent(matchedUrlParts[i]);
    }
  }

  return data;
};

function sortConfigLinks(a: NavLink, b: NavLink) {
  // sort by the number of parts
  if (a.parts.length > b.parts.length) {
    return -1;
  }
  if (a.parts.length < b.parts.length) {
    return 1;
  }

  // sort by the number of static parts in a row
  if (a.staticParts > b.staticParts) {
    return -1;
  }
  if (a.staticParts < b.staticParts) {
    return 1;
  }

  // sort by the number of total data parts
  if (a.dataParts < b.dataParts) {
    return -1;
  }
  if (a.dataParts > b.dataParts) {
    return 1;
  }

  return 0;
}

export const normalizeLinks = (links: NavLink[]): NavLink[] => {
  for (var i = 0, ilen = links.length; i < ilen; i++) {
    var link = links[i];

    if (isBlank(link.path)) {
      link.path = link.name;
    }

    link.parts = link.path.split('/');

    // used for sorting
    link.staticParts = link.dataParts = 0;
    var stillCountingStatic = true;

    for (var j = 0; j < link.parts.length; j++) {
      if (link.parts[j].charAt(0) === ':') {
        link.dataParts++;
        stillCountingStatic = false;

      } else if (stillCountingStatic) {
        link.staticParts++;
      }
    }
  }

  // sort by the number of parts, with the links
  // with the most parts first
  return links.sort(sortConfigLinks);
}

const URL_REPLACE_REG = /\s+|\?|\!|\$|\,|\.|\+|\"|\'|\*|\^|\||\/|\\|\[|\]|#|%|`|>|<|;|:|@|&|=/g;
