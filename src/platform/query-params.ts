import { OpaqueToken } from '@angular/core';

/**
 * @private
 */
export class QueryParams {
  data: {[key: string]: any} = {};

  constructor(url: string) {
    if (url) {
      const startIndex = url.indexOf('?');
      if (startIndex > -1) {
        const queries = url.slice(startIndex + 1).split('&');
        for (var i = 0; i < queries.length; i++) {
          if (queries[i].indexOf('=') > 0) {
            var split = queries[i].split('=');
            if (split.length > 1) {
              this.data[split[0].toLowerCase()] = split[1].split('#')[0];
            }
          }
        }
      }
    }
  }

  get(key: string): any {
    return this.data[key.toLowerCase()];
  }

}

/**
 * @private
 */
export const UrlToken = new OpaqueToken('USERURL');

/**
 * @private
 */
export function setupQueryParams(url: string): QueryParams {
  return new QueryParams(url);
}
