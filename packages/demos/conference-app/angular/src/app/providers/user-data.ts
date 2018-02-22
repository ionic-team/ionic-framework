import { Injectable } from '@angular/core';

import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';

export const HAS_LOGGED_IN = 'hasLoggedIn';
export const HAS_SEEN_TUTORIAL = 'hasSeenTutorial';


@Injectable()
export class UserData {
  _favorites: string[] = [];

  constructor(
    private events: Events,
    private storage: Storage,

  ) {}

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  }

  login(username: string): Promise<any> {
    return this.storage.set(HAS_LOGGED_IN, true).then(() => {
      this.setUsername(username);
      return this.events.publish('user:login');
    });
  }

  signup(username: string): Promise<any> {
    return this.storage.set(HAS_LOGGED_IN, true).then(() => {
      this.setUsername(username);
      return this.events.publish('user:signup');
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(HAS_LOGGED_IN).then(() => {
      return this.storage.remove('username');
    }).then(() => {
      this.events.publish('user:logout');
    });
  }

  setUsername(username: string): Promise<any> {
    return this.storage.set('username', username);
  }

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(HAS_LOGGED_IN).then((value) => {
      return value;
    });

    // return Promise.resolve(true);
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  }
}
