import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from '@ionic/react';
import React from 'react';
import { heartOutline, heartSharp, mailOutline, mailSharp } from 'ionicons/icons';

interface MenuProps {}

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Tabs',
    url: '/routing/tabs',
    iosIcon: mailOutline,
    mdIcon: mailSharp,
  },
  {
    title: 'Favorites',
    url: '/routing/favorites',
    iosIcon: heartOutline,
    mdIcon: heartSharp,
  },
  {
    title: 'Other Page',
    url: '/routing/otherpage',
    iosIcon: heartOutline,
    mdIcon: heartSharp,
  },
  {
    title: 'Home with redirect',
    url: '/routing/redirect',
    iosIcon: heartOutline,
    mdIcon: heartSharp,
  },
  {
    title: 'Home with router',
    url: '/routing/redirect-routing',
    iosIcon: heartOutline,
    mdIcon: heartSharp,
  },
];

const Menu: React.FunctionComponent<MenuProps> = () => {
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Menu</IonListHeader>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon slot="start" icon={appPage.iosIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
