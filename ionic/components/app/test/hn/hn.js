export class HackerNews {
  constructor() {
    this.fb = new Firebase('https://hacker-news.firebaseio.com/v0');
    this.getPosts();
  }

  getPosts() {
    console.log('GETTING POSTS');
    this.fb.child('topstories').on('value', function(snapshot) {
      console.log(snapshot.val());
    });
  }
}
