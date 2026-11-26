import React from 'react';
import { IonLabel, IonTabBar, IonTabButton, IonTabs, IonTab, IonPage } from '@ionic/react';

const TabsFunctionChildren: React.FC = () => {
  return (
    <IonPage>
      <IonTabs>
        {
          // The children type doesn't accept a function, but IonTabs still calls one with the tabs context.
          (() => [
            <IonTab tab="tab1" key="tab1">
              <IonLabel>Tab 1 Content</IonLabel>
            </IonTab>,
            <IonTab tab="tab2" key="tab2">
              <IonLabel>Tab 2 Content</IonLabel>
            </IonTab>,
            <IonTabBar slot="bottom" key="tab-bar">
              <IonTabButton tab="tab1">
                <IonLabel>Tab 1</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2">
                <IonLabel>Tab 2</IonLabel>
              </IonTabButton>
            </IonTabBar>,
          ]) as any
        }
      </IonTabs>
    </IonPage>
  );
};

export default TabsFunctionChildren;
