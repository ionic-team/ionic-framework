import React from 'react';
import {
  IonSplitPane,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonPage,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonButtons,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { Route, Redirect } from 'react-router';
import { Menu } from './Menu';
import { triangle, ellipse, square, rocket } from 'ionicons/icons';

const MultipleTabs: React.FC = () => {
  return (
    <IonSplitPane contentId="main">
      <Menu />
      <IonRouterOutlet id="main">
        <Route
          path="/multiple-tabs/tab1"
          render={() => {
            return <Tab1 />;
          }}
          exact={false}
        />
        <Route
          path="/multiple-tabs/tab2"
          render={() => {
            return <Tab2 />;
          }}
          exact={false}
        />
        <Route
          path="/multiple-tabs"
          render={() => <Redirect to="/multiple-tabs/tab1" />}
          exact={true}
        />
      </IonRouterOutlet>
    </IonSplitPane>
  );
};

export default MultipleTabs;

const Tab1: React.FC = () => {
  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton tab="pagea" href="/multiple-tabs/tab1/pagea">
          <IonIcon icon={triangle} />
          <IonLabel>Page A</IonLabel>
        </IonTabButton>

        <IonTabButton tab="pageb" href="/multiple-tabs/tab1/pageb">
          <IonIcon icon={ellipse} />
          <IonLabel>Page B</IonLabel>
        </IonTabButton>
      </IonTabBar>
      <IonRouterOutlet id="tab1">
        <Route
          path="/multiple-tabs/tab1"
          render={() => <Redirect to="/multiple-tabs/tab1/pagea" />}
          exact={true}
        />
        {/* <Redirect path="/multiple-tabs/event" to="/multiple-tabs/tab1/pagea" exact={true} /> */}
        <Route path="/multiple-tabs/tab1/pagea" render={() => <Page name="PageA" />} exact={true} />
        <Route path="/multiple-tabs/tab1/pageb" render={() => <Page name="PageB" />} exact={true} />
      </IonRouterOutlet>
    </IonTabs>
  );
};

const Tab2: React.FC = () => {
  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton tab="pagec" href="/multiple-tabs/tab2/pagec">
          <IonIcon icon={square} />
          <IonLabel>Page C</IonLabel>
        </IonTabButton>
        <IonTabButton tab="paged" href="/multiple-tabs/tab2/paged">
          <IonIcon icon={rocket} />
          <IonLabel>Page D</IonLabel>
        </IonTabButton>
      </IonTabBar>
      <IonRouterOutlet id="tab2">
        <Route
          path="/multiple-tabs/tab2"
          render={() => <Redirect to="/multiple-tabs/tab2/pagec" />}
          exact={true}
        />
        {/* <Redirect path="/multiple-tabs/tab2" to="/multiple-tabs/tab2/pagec" exact={true} /> */}
        <Route path="/multiple-tabs/tab2/pagec" render={() => <Page name="PageC" />} exact={true} />
        <Route path="/multiple-tabs/tab2/paged" render={() => <Page name="PageD" />} exact={true} />
      </IonRouterOutlet>
    </IonTabs>
  );
};

const Page: React.FC<{ name: string }> = ({ name }) => {
  return (
    <IonPage data-pageid={name}>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonMenuButton />
            <IonTitle>{name}</IonTitle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>{name}</IonContent>
    </IonPage>
  );
};
