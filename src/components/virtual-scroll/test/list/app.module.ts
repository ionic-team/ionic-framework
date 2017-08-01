import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  items: Array<{id: number, url: string, gif: string}> = [];
  imgDomain = 'http://localhost:8900';
  responseDelay = 1500;
  itemCount = 1000;
  showGifs = false;

  constructor() {
    // take a look at the gulp task: test.imageserver
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.imgDomain}/reset`, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        this.fillList();
      }
    };
    xhr.send();
  }

  fillList() {
    this.items.length = 0;
    let gifIndex = Math.ceil(Math.random() * gifs.length) - 1;

    for (let i = 0; i < this.itemCount; i++) {
      this.items.push({
        id: i,
        url: `${this.imgDomain}/?d=${this.responseDelay}&id=${i}`,
        gif: gifs[gifIndex]
      });
      gifIndex++;
      if (gifIndex >= gifs.length) {
        gifIndex = 0;
      }
    }
  }

  emptyList() {
    this.items.length = 0;
  }

  toggleGifs() {
    this.showGifs = !this.showGifs;
  }

  reload() {
    window.location.reload(true);
  }

}

const gifs = [
  'https://media.giphy.com/media/cFdHXXm5GhJsc/giphy.gif',
  'https://media.giphy.com/media/5JjLO6t0lNvLq/giphy.gif',
  'https://media.giphy.com/media/ZmdIZ8K4fKEEM/giphy.gif',
  'https://media.giphy.com/media/lKXEBR8m1jWso/giphy.gif',
  'https://media.giphy.com/media/PjplWH49v1FS0/giphy.gif',
  'https://media.giphy.com/media/SyVyFtBTTVb5m/giphy.gif',
  'https://media.giphy.com/media/LWqQ5glpSMjny/giphy.gif',
  'https://media.giphy.com/media/l396Dat26yQOdfWgw/giphy.gif',
  'https://media.giphy.com/media/zetsDd1oSNd96/giphy.gif',
  'https://media.giphy.com/media/F6PFPjc3K0CPe/giphy.gif',
  'https://media.giphy.com/media/L0GJP0ZxdnVbW/giphy.gif',
  'https://media.giphy.com/media/26ufbLWPFHkhwXcpW/giphy.gif',
  'https://media.giphy.com/media/r3jTnU6iEwpbO/giphy.gif',
  'https://media.giphy.com/media/6Xbr4pVmJW4wM/giphy.gif',
  'https://media.giphy.com/media/FPmzkXGFVhp2U/giphy.gif',
  'https://media.giphy.com/media/p3yU7Rno2PvvW/giphy.gif',
  'https://media.giphy.com/media/vbBmb51klyyB2/giphy.gif',
  'https://media.giphy.com/media/ZAfpXz6fGrlYY/giphy.gif',
  'https://media.giphy.com/media/3oGRFvVyUdGBZeQiAw/giphy.gif',
  'https://media.giphy.com/media/NJbeypFZCHj2g/giphy.gif',
  'https://media.giphy.com/media/WpNO2ZXjhJ85y/giphy.gif',
  'https://media.giphy.com/media/xaw15bdmMEkgg/giphy.gif',
  'https://media.giphy.com/media/tLwQSHQo6hjTa/giphy.gif',
  'https://media.giphy.com/media/3dcoLqDDjd9pC/giphy.gif',
  'https://media.giphy.com/media/QFfs8ubyDkluo/giphy.gif',
  'https://media.giphy.com/media/10hYVVSPrSpZS0/giphy.gif',
  'https://media.giphy.com/media/EYJz9cfMa7WAU/giphy.gif',
  'https://media.giphy.com/media/Q21vzIHyTtmaQ/giphy.gif',
  'https://media.giphy.com/media/pzmUOeqhzJTck/giphy.gif',
  'https://media.giphy.com/media/G6kt1Gb4Luxy0/giphy.gif',
  'https://media.giphy.com/media/13wjHxAz6B6E9i/giphy.gif',
  'https://media.giphy.com/media/ANbbM3IzH9Tna/giphy.gif',
  'https://media.giphy.com/media/EQ5I7NF4BDYA/giphy.gif',
  'https://media.giphy.com/media/L7gHewOS8GOWY/giphy.gif',
  'https://media.giphy.com/media/nO16UrmQh7khW/giphy.gif',
  'https://media.giphy.com/media/eGuk6gQM3Q29W/giphy.gif',
  'https://media.giphy.com/media/8dpPMMlxmDEJO/giphy.gif',
  'https://media.giphy.com/media/5ox090BjCB8ME/giphy.gif',
  'https://media.giphy.com/media/Hzm8c1eMSq3CM/giphy.gif',
  'https://media.giphy.com/media/2APlzZshLu3LO/giphy.gif',
  'https://media.giphy.com/media/dgygjvNe7jckw/giphy.gif',
  'https://media.giphy.com/media/5g0mypSSPupO0/giphy.gif',
  'https://media.giphy.com/media/10JmxORlA6dEFW/giphy.gif',
];


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
