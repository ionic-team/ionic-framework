import {Http} from 'ionic/net/http';

let WUNDERGROUND_API_KEY = '1cc2d3de40fa5af0';

let FORECASTIO_KEY = '4cd3c5673825a361eb5ce108103ee84a';

export class Weather {
  static getAtLocation(lat, lng) {
    let url = 'https://api.forecast.io/forecast/' + FORECASTIO_KEY + '/';
    return Http.get(url + lat + ',' + lng + '?callback=JSON_CALLBACK', {
      method: 'jsonp'
    });
  }
}
