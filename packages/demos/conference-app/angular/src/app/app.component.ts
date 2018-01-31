import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  Events,
  MenuController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SchedulePage } from '../pages/schedule/schedule';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { SupportPage } from '../pages/support/support';

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('nav') navRef: ElementRef;
  rootPage: any;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'Schedule', name: 'TabsPage', component: TabsPage, tabComponent: SchedulePage, index: 0, icon: 'calendar', color: null },
    { title: 'Speakers', name: 'TabsPage', component: TabsPage, tabComponent: SpeakerListPage, index: 1, icon: 'contacts', color: null },
    { title: 'Map', name: 'TabsPage', component: TabsPage, tabComponent: MapPage, index: 2, icon: 'map', color: null },
    { title: 'About', name: 'TabsPage', component: TabsPage, tabComponent: AboutPage, index: 3, icon: 'information-circle', color: null }
  ];

  loggedInPages: PageInterface[] = [
    { title: 'Account', name: 'AccountPage', component: AccountPage, icon: 'person', color: null },
    { title: 'Support', name: 'SupportPage', component: SupportPage, icon: 'help', color: null },
    { title: 'Logout', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true, color: null }
  ];

  loggedOutPages: PageInterface[] = [
    { title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in', color: null },
    { title: 'Support', name: 'SupportPage', component: SupportPage, icon: 'help', color: null },
    { title: 'Signup', name: 'SignupPage', component: SignupPage, icon: 'person-add', color: null }
  ];

  constructor(
    public confData: ConferenceData,
    public events: Events,
    public menu: MenuController,
    public storage: Storage,
    public userData: UserData) {
  }

  ngOnInit() {
    // Check if the user has already seen the tutorial
    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.rootPage = TabsPage;
        } else {
          this.rootPage = TutorialPage;
        }
        getNav(this.navRef).then((navElement) => {
          navElement.setRoot(this.rootPage);
        });
      });

    // load the conference data
    this.confData.load();

    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });
    this.enableMenu(true);

    this.listenToLoginEvents();

    return getNav(this.navRef).then(() => {
      this.appPages = this.appPages.concat([]);
    });
  }

  openPage(page: PageInterface): Promise<any> {
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // check if it's in the appPAges
    for (const appPage of this.appPages) {
      if (page === appPage) {
        // sweet, select the tab
        const tabs = document.querySelector('ion-tabs');
        return (tabs as any).componentOnReady().then(() => {
          return tabs.select(page.index);
        }).then(() => {
          if (page.logsOut === true) {
            // Give the menu time to close before changing to logged out
            return this.userData.logout();
          }
        });
      }
    }

    return getNav(this.navRef).then(() => {
      return nav.setRoot(page.component, params);
    }).then(() => {
      if (page.logsOut === true) {
        // Give the menu time to close before changing to logged out
        return this.userData.logout();
      }
    });
  }

  openTutorial() {
    return getNav(this.navRef).then((navElement) => {
      navElement.setRoot(TutorialPage);
    });
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  isActive(page: PageInterface) {
    if (!nav) {
      return;
    }
    if (nav.root === TabsPage) {
      const selectedTab = nav.element.querySelector('ion-tab-button.selected-tab');
      const childNav = selectedTab.querySelector('ion-nav');
      if ( childNav.root === page.component) {
        return 'primary';
      }
      return '';
    } else {
      if (nav.getActive() && nav.getActive().component === page.component) {
        page.color = 'primary';
      }
      page.color = '';
    }
  }
}

function getNav(elementRef: ElementRef): Promise<HTMLIonNavElement> {
  return (elementRef.nativeElement as any).componentOnReady().then(() => {
    nav = elementRef.nativeElement;
    return elementRef.nativeElement as HTMLIonNavElement;
  });
}

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
  color: string;
}

let nav: HTMLIonNavElement = null;
