import {Component} from 'angular2/angular2';

import {App, NavController, IonicView} from 'ionic/ionic';

import {HackerNews} from './hn';
import {HNSinglePost} from './pages/single';


@Component({
  selector: 'story'
})
@IonicView({
  template: '<div class="hn-story"><ng-content></ng-content></div>'
})
export class Story {
  constructor() {

  }
}

@IonicView({
  templateUrl: './pages/top.html'
})
class HNTopStories {
  constructor(
    nav: NavController
  ) {
    this.nav = nav;

    this.stories = [
      /*
    {
      by: "FatalLogic",
      descendants: 77,
      id: 9444675,
      //kids: Array[26]
      score: 464,
      text: "",
      time: 1430116925,
      title: "Under Pressure",
      type: "story",
      url: "http://minusbat.livejournal.com/180556.html"
    }*/
    ];

    var APIUrl = 'https://hacker-news.firebaseio.com/v0';

    console.log('FIREBASE', window.Firebase);

    this.fb = new window.Firebase(APIUrl);
    this.fb.child('topstories').limitToFirst(20).once('value', (snapshot) => {

      let items = snapshot.val();

      console.log('Fetched', items.length, 'items');

      for(var itemID of items) {

        this.fb.child("item").child(itemID).on('value', (data) => {
          console.log('GOT ITEM', data.val());
          this.stories.push(data.val());
        });
      }
    });

    //doStuffEnd
  }

  openStory(story) {
    console.log('Opening story', story);

    this.nav.push(HNSinglePost, story);
  }

  /*
  HackerNews.getTopStories((val) => {
    new Promise((resolve, reject) => {
      console.log('PROMISES!', val);
      this.stories.push(val);
      resolve();
    });
  });
  */
}


@App({
  template: '<ion-nav [root]="rootView"></ion-nav>'
})
class IonicApp {
  constructor() {
    this.rootView = HNTopStories;
  }
}
