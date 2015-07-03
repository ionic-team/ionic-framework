var APIUrl = 'https://hacker-news.firebaseio.com/v0/';

export class HackerNewsClient {
  constructor() {
    //this.fb = new Firebase(APIUrl);
  }

  getTopStories(cb) {
    console.log('GETTING TOP STORIES');

    this.fb.child('topstories').on('value', (snapshot) => {

      let items = snapshot.val();

      console.log('Fetched', items.length, 'items');

      for(var itemID of items) {

        this.fb.child("item").child(itemID).on('value', (data) => {

          cb(data.val());

          //console.log(data.val());
        });
      }
    });
  }
}

export var HackerNews = new HackerNewsClient();
