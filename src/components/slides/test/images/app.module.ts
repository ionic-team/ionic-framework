import { HttpClient } from '@angular/common/http';
import { Component, NgModule, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { IonicApp, IonicModule, Slides } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  images: string[] = [];
  @ViewChild(Slides) slider: Slides;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    let tags = 'madison wisconsin';
    let FLICKR_API_KEY = '504fd7414f6275eb5b657ddbfba80a2c';

    let baseUrl = 'https://api.flickr.com/services/rest';

    this.http.get(baseUrl + '?method=flickr.groups.pools.getPhotos&group_id=1463451@N25&safe_search=1&api_key='
                  + FLICKR_API_KEY + '&nojsoncallback=1&format=json&tags=' + tags)
      .subscribe((data: any) => {
        this.images = data.photos.photo.slice(0, 20);
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
export class AppComponent {
  root = E2EPage;
}

@NgModule({
  declarations: [
    AppComponent,
    E2EPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    E2EPage
  ]
})
export class AppModule {}
