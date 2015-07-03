import {Http} from 'ionic/net/http';

let FLICKR_API_KEY = '504fd7414f6275eb5b657ddbfba80a2c';

let baseUrl = 'https://api.flickr.com/services/rest/';

export class Flickr {
  constructor() {

    /*
    var flickrSearch = $resource(baseUrl, {
      method: 'flickr.groups.pools.getPhotos',
      group_id: '1463451@N25',
      safe_search: 1,
      jsoncallback: 'JSON_CALLBACK',
      api_key: FLICKR_API_KEY,
      format: 'json'
    }, {
      get: {
        method: 'JSONP'
      }
    });
    */
  }

  static search(tags, lat, lng) {
    return new Promise((resolve, reject) => {
      Http.get(baseUrl + '?method=flickr.groups.pools.getPhotos&group_id=1463451@N25&safe_search=1&api_key=' + FLICKR_API_KEY + '&jsoncallback=JSON_CALLBACK&format=json&tags=' + tags + '&lat=' + lat + '&lng=' + lng, {
        method: 'jsonp'
      }).then((val) => {
        resolve(val);
      }, (err) => {
        reject(httpResponse);
      })
    })
  }
}
