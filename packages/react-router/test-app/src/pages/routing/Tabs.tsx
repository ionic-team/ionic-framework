import React from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route, Redirect } from 'react-router';
import Tab1 from './Tab1';
import Details from './Details';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import { triangle, ellipse, square } from 'ionicons/icons';
import SettingsDetails from './SettingsDetails';

interface TabsProps {}

const Tabs: React.FC<TabsProps> = () => {
  return (
    <IonTabs>
      <IonRouterOutlet id="tabs">
        <Route path="/routing/tabs/home" component={Tab1} exact />
        <Route path="/routing/tabs/home/details/:id" component={Details} exact={true} />
        {/* <Route path="/routing/tabs/home/details/:id" render={(props) => {
          return <Details />
        }} exact={true} /> */}
        <Route path="/routing/tabs/settings" component={Tab2} exact={true} />
        <Route path="/routing/tabs/settings/details/:id" component={SettingsDetails} exact={true} />
        <Route path="/routing/tabs/tab3" component={Tab3} />
        <Route
          path="/routing/tabs"
          render={() => <Redirect to="/routing/tabs/home" />}
          exact={true}
        />
        <Route
          path="/routing/tabs/redirect"
          render={() => <Redirect to="/routing/tabs/settings" />}
          exact={true}
        />
        {/* <Route path="/routing/tabs" render={() => <Route render={() => <Redirect to="/tabs/home" />} />} /> */}
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/routing/tabs/home" routerOptions={{ unmount: true }}>
          <IonIcon icon={triangle} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/routing/tabs/settings">
          <IonIcon icon={ellipse} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/routing/tabs/tab3">
          <IonIcon icon={square} />
          <IonLabel>Tab 3</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
