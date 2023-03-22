import React, { useState, useCallback } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonApp,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonButton,
} from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { IonReactRouter } from '@ionic/react-router';
import { triangle, square } from 'ionicons/icons';

const DynamicTabs: React.FC = () => {
  const [display2ndTab, setDisplayThirdTab] = useState<boolean>(false);

  const renderFirstTab = useCallback(() => {
    return <Tab1 setDisplayThirdTab={() => setDisplayThirdTab(!display2ndTab)} />;
  }, [display2ndTab]);

  const render2ndTabRoute = useCallback(() => {
    if (display2ndTab) {
      return <Route path="/dynamic-tabs/tab2" component={Tab2} />;
    } else {
      // This is weird, if I return null or undefined then I get all sorts of errors, seemingly
      // because the router is mad about a child not being a route.
      return <Route path="/dynamic-tabs/tab200" component={Tab1} />;
    }
  }, [display2ndTab]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/dynamic-tabs/tab1" render={renderFirstTab} exact={true} />
            {render2ndTabRoute()}
            <Route
              path="/dynamic-tabs/"
              render={() => <Redirect to="/dynamic-tabs/tab1" />}
              exact={true}
            />
            <Route render={() => <Redirect to="/dynamic-tabs/tab1" />} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/dynamic-tabs/tab1">
              <IonIcon icon={triangle} />
              <IonLabel>Tab 1</IonLabel>
            </IonTabButton>
            {display2ndTab && (
              <IonTabButton tab="tab2" href="/dynamic-tabs/tab2">
                <IonIcon icon={square} />
                <IonLabel>Tab 2</IonLabel>
              </IonTabButton>
            )}
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default DynamicTabs;

const Tab1: React.FC<{
  setDisplayThirdTab: (value: boolean) => void;
}> = ({ setDisplayThirdTab }) => {
  const doIt = useCallback(() => {
    setDisplayThirdTab(true);
  }, [setDisplayThirdTab]);

  return (
    <IonPage data-pageid="Tab1">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>Tab 1 Page</div>
        <IonButton onClick={doIt}>Add Tab 2</IonButton>
      </IonContent>
    </IonPage>
  );
};

const Tab2 = () => {
  return (
    <IonPage data-pageid="Tab2">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>Tab 2 Page</div>
      </IonContent>
    </IonPage>
  );
};
