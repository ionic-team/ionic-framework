import {App, IonicApp} from 'ionic/ionic';
import {Http} from 'angular2/http';

@App({
  templateUrl: 'main.html'
})
class MyApp {
  constructor(app: IonicApp, http: Http) {
    this.app = app;
    this.http = http;

    this.extraOptions = {
      loop: true
    };

    this.images = [];

    let tags = "amsterdam";
    let FLICKR_API_KEY = '504fd7414f6275eb5b657ddbfba80a2c';

    let baseUrl = 'https://api.flickr.com/services/rest/';

    this.http.get(baseUrl + '?method=flickr.groups.pools.getPhotos&group_id=1463451@N25&safe_search=1&api_key='
                  + FLICKR_API_KEY + '&nojsoncallback=1&format=json&tags=' + tags)
       .map(res => res.json())
      .subscribe(data => {
        this.images = data.photos.photo.slice(0, 20);
        setTimeout(() => {
          this.slider.update();
        });
    }, (err) => {
      alert('Unable to load images');
      console.error(err);
    })
  }

  onInit() {
    setTimeout(() => {
      this.slider = this.app.getComponent('slider');
      console.log('Got slider', this.slider);
    });
  }

  getImageUrl(item) {
    return "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret + "_z.jpg";
  }

  doRefresh() {
    console.log('DOREFRESH')
  }
}
