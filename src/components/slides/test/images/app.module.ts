import { Component, ViewChild, NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { IonicApp, IonicModule, Slides } from '../../../../../ionic-angular';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  images: string[] = [];
  @ViewChild(Slides) slider: Slides;

  constructor(private http: Http) {}

  ngAfterViewInit() {
    let tags = 'madison wisconsin';
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

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = E2EPage;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage
  ]
})
export class AppModule {}
