import { Component,ViewEncapsulation } from '@angular/core';
import { NavController, reorderArray } from 'ionic-angular';

@Component({
  templateUrl: 'page.html',
  encapsulation: ViewEncapsulation.None
})
export class ApiDemoPage {
  songs: any[];
  editButton: string = 'Edit';
  editing: boolean = false;

  constructor(public navCtrl: NavController) {
    this.songs = [
    {
      title: 'Everything Beta',
      band: 'Phoria',
      album: 'Volition'
    },
    {
      title: 'Hello',
      band: 'Adele',
      album: '25'
    },
    {
      title: 'Bohemian Rhapsody',
      band: 'Queen',
      album: 'A Night at the Opera'
    },
    {
      title: 'Don\'t Stop Believin\'',
      band: 'Journey',
      album: 'Escape'
    },
    {
      title: 'Smells Like Teen Spirit',
      band: 'Nirvana',
      album: 'Nevermind'
    },
    {
      title: 'All You Need Is Love',
      band: 'The Beatles',
      album: 'Magical Mystery Tour'
    },
    {
      title: 'Hotel California',
      band: 'The Eagles',
      album: 'Hotel California'
    },
    {
      title: 'The Hand That Feeds',
      band: 'Nine Inch Nails',
      album: 'With Teeth'
    },
    {
      title: 'Who Are You',
      band: 'The Who',
      album: 'Who Are You'
    }];
  }

  toggleEdit() {
    this.editing = !this.editing;
    if (this.editing) {
      this.editButton = 'Done';
    } else {
      this.editButton = 'Edit';
    }
  }

  reorderData(indexes: any) {
    this.songs = reorderArray(this.songs, indexes);
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}
