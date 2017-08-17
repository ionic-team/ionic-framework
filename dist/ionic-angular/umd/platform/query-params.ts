/**
 * @hidden
 */
export class QueryParams {
  data: {[key: string]: any} = {};

  parseUrl(url: string) {
    if (url) {
      var startIndex = url.indexOf('?');
      if (startIndex > -1) {
        var queries = url.slice(startIndex + 1).split('&');
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
