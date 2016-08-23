import { Component, ViewChild, NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { IonicApp, IonicModule, Slides } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EApp {
  mySlideOptions: any;
  images: string[] = [];
  @ViewChild(Slides) slider: Slides;

  constructor(private http: Http) {
    this.mySlideOptions = {
      loop: true
    };
  }

  ngAfterViewInit() {
    let tags = 'amsterdam';
    let FLICKR_API_KEY = '504fd7414f6275eb5b657ddbfba80a2c';

    let baseUrl = 'https://api.flickr.com/services/rest/';

    this.http.get(baseUrl + '?method=flickr.groups.pools.getPhotos&group_id=1463451@N25&safe_search=1&api_key='
                  + FLICKR_API_KEY + '&nojsoncallback=1&format=json&tags=' + tags)
      .subscribe(data => {
        this.images = data.json().photos.photo.slice(0, 20);
        setTimeout(() => {
          this.slider.update();
        });

    }, (err) => {
      console.info('Unable to load images');
      console.error(err);
    });
  }

  getImageUrl(item: any) {
    return `http://farm${item.farm}.static.flickr.com/${item.server}/${item.id}_${item.secret}_z.jpg`;
  }

}

@NgModule({
  declarations: [
    E2EApp
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp
  ]
})
export class AppModule {}
