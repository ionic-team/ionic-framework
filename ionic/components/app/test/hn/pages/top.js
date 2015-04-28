import {For, Ancestor, Descendent, Parent, NgElement, Component, View as NgView, bootstrap} from 'angular2/angular2';
import {PushToNav, View, Content, Nav, NavPane, List, Item} from 'ionic/ionic';

import {HackerNews} from 'hn'

@Component({ selector: 'top-stories' })
@NgView({
  templateUrl: 'pages/top.html',
  directives: [View, Content, For, List, Item, PushToNav]
})
export class HNTopStories {
  constructor(@Parent() viewport: Nav) {//, @Ancestor() app: HNApp) {
    console.log('TOP STORIES');

    this.stories = [{
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
    }];

    return;
    var APIUrl = 'https://hacker-news.firebaseio.com/v0';
    this.fb = new Firebase(APIUrl);
    this.fb.child('topstories').limitToFirst(20).once('value', (snapshot) => {

      let items = snapshot.val();

      console.log('Fetched', items.length, 'items');

      for(var itemID of items) {

        this.fb.child("item").child(itemID).on('value', (data) => {
          setTimeout(() => {
            console.log(itemID, data.val());
            console.log('ADDED');
            this.stories.push(data.val());
          });

          //console.log(data.val());
        });
      }
    });
    

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
}
