import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonRouterLink,
  IonRouterOutlet,
  IonSplitPane
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-split-pane',
  templateUrl: 'split-pane.component.html',
  styleUrls: ['split-pane.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonRouterLink,
    IonRouterOutlet,
    IonSplitPane,
    RouterLink,
    RouterLinkActive,
  ],
})
export class SplitPaneComponent {
  public appPages = [
    { title: 'Inbox', url: '/standalone/split-pane/inbox' },
    { title: 'Outbox', url: '/standalone/split-pane/outbox' },
    { title: 'Favorites', url: '/standalone/split-pane/favorites' },
    { title: 'Archived', url: '/standalone/split-pane/archived' },
    { title: 'Trash', url: '/standalone/split-pane/trash' },
    { title: 'Spam', url: '/standalone/split-pane/spam'}
  ];

  constructor() { }
}
