import {For, Ancestor, Descendent, Parent, NgElement, Component, View as NgView, bootstrap} from 'angular2/angular2';
import {PushToNav, View, Content, Nav, NavPane, List, Item} from 'ionic/ionic';

import {HackerNews} from 'hn'

@Component({ selector: 'top-stories' })
@NgView({
  templateUrl: 'pages/top.html',
  directives: [View, Content, For, List, Item, PushToNav]
})
export class HNTopStories {
  constructor(@Ancestor() viewport: Nav) {//, @Ancestor() app: HNApp) {
    console.log('TOP STORIES', 'Ancestor', viewport);

    var self = this;

    this.throwMe = function() {
      throw new Error('stack test from throwMe');
    };

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

    var APIUrl = 'https://hacker-news.firebaseio.com/v0';

    var s = document.createElement('script');
    s.src = 'https://cdn.firebase.com/js/client/2.2.4/firebase.js';
    s.async = true;
    s.onload = doStuff.bind(this);
    document.head.appendChild(s);
    console.log('loading firebase');

  function doStuff() {
    console.log('done loading firebase');

    this.fb = new window.Firebase(APIUrl);
    this.fb.child('topstories').limitToFirst(20).once('value', (snapshot) => {

      let items = snapshot.val();

      console.log('Fetched', items.length, 'items');
      debugger;

      for(var itemID of items) {

        this.fb.child("item").child(itemID).on('value', (data) => {
          //setTimeout(() => {
            //console.log('SUB THIS', this);
            //console.log(itemID, data.val());
            //console.log('ADDED');
            //self.stories.push(data.val());
            //throw new Error("stack test");
            debugger;
            console.log('GOT ITEM', data.val());
            self.stories.push({title: 'asdf'});
          //});

          //console.log(data.val());
        });
      }
    });


    //doStuffEnd
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
}
