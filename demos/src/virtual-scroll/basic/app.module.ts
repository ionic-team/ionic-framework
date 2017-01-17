import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../ionic-angular';


@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  // a lot of records!
  items: string[] = [
    'Fast Times at Ridgemont High', 'Peggy Sue Got Married', 'Raising Arizona',
    'Moonstruck', 'Fire Birds', 'Honeymoon in Vegas', 'Amos & Andrew',
    'It Could Happen to You', 'Trapped in Paradise', 'Leaving Las Vegas',
    'The Rock', 'Con Air', 'Face/Off', 'City of Angels', 'Gone in Sixty Seconds',
    'The Family Man', 'Windtalkers', 'Matchstick Men', 'National Treasure',
    'National Treasure 2', 'Ghost Rider', 'Grindhouse', 'Next', 'Kick-Ass',
    'Drive Angry', 'Snowden', 'Army of One', 'Pay the Ghost', 'The Runner', 
    'Dying of the Light', 'Seeking Justice', 'Stolen', 'The Frozen ground',
    'Dog Eat Dog', 'Joe', 'The Croods', 'Trespass', 'Astro Boy', 'G-Force', 
    'Knowing', 'Bangkok Dangerous', 'The Wicker Man', 'The Ant Bully',
    'World Trade Center', 'Lord of War', 'The Weather Man',
    'Fast Times at Ridgemont High', 'Peggy Sue Got Married', 'Raising Arizona',
    'Moonstruck', 'Fire Birds', 'Honeymoon in Vegas', 'Amos & Andrew',
    'It Could Happen to You', 'Trapped in Paradise', 'Leaving Las Vegas',
    'The Rock', 'Con Air', 'Face/Off', 'City of Angels', 'Gone in Sixty Seconds',
    'The Family Man', 'Windtalkers', 'Matchstick Men', 'National Treasure',
    'National Treasure 2', 'Ghost Rider', 'Grindhouse', 'Next', 'Kick-Ass',
    'Drive Angry', 'Snowden', 'Army of One', 'Pay the Ghost', 'The Runner', 
    'Dying of the Light', 'Seeking Justice', 'Stolen', 'The Frozen ground',
    'Dog Eat Dog', 'Joe', 'The Croods', 'Trespass', 'Astro Boy', 'G-Force', 
    'Knowing', 'Bangkok Dangerous', 'The Wicker Man', 'The Ant Bully',
    'World Trade Center', 'Lord of War', 'The Weather Man',
    'Fast Times at Ridgemont High', 'Peggy Sue Got Married', 'Raising Arizona',
    'Moonstruck', 'Fire Birds', 'Honeymoon in Vegas', 'Amos & Andrew',
    'It Could Happen to You', 'Trapped in Paradise', 'Leaving Las Vegas',
    'The Rock', 'Con Air', 'Face/Off', 'City of Angels', 'Gone in Sixty Seconds',
    'The Family Man', 'Windtalkers', 'Matchstick Men', 'National Treasure',
    'National Treasure 2', 'Ghost Rider', 'Grindhouse', 'Next', 'Kick-Ass',
    'Drive Angry', 'Snowden', 'Army of One', 'Pay the Ghost', 'The Runner', 
    'Dying of the Light', 'Seeking Justice', 'Stolen', 'The Frozen ground',
    'Dog Eat Dog', 'Joe', 'The Croods', 'Trespass', 'Astro Boy', 'G-Force', 
    'Knowing', 'Bangkok Dangerous', 'The Wicker Man', 'The Ant Bully',
    'World Trade Center', 'Lord of War', 'The Weather Man',
  ];

  constructor() { }

}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}

@NgModule({
  declarations: [
    ApiDemoApp,
    ApiDemoPage
  ],
  imports: [
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ApiDemoPage
  ]
})
export class AppModule {}
