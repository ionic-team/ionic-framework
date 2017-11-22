import { Injectable } from '@angular/core';
import { NavContainer } from '@ionic/core';
import { hydrateElement } from '../util/util';

@Injectable()
export class App {

  private element: HTMLIonAppElement;
  constructor() {
    this.element = document.querySelector('ion-app') as HTMLIonAppElement;
  }

  setTitle(title: string) {
    document.title = title;
  }

  isScrolling(): boolean {
    if (this.element.isScrolling) {
      return this.element.isScrolling();
    }
    return false;
  }

  getRootNavs(): NavContainer[] {
    if (this.element.getRootNavs) {
      return this.element.getRootNavs();
    }
    return [];
  }

  getActiveNavs(rootNavId?: number): NavContainer[] {
    if (this.element.getActiveNavs) {
      return this.element.getActiveNavs(rootNavId);
    }
    return [];
  }

  getNavByIdOrName(nameOrId: number | string): NavContainer {
    if (this.element.getNavByIdOrName) {
      return this.element.getNavByIdOrName(nameOrId);
    }
    return null;
  }
}