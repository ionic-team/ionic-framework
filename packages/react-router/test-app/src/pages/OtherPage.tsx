import React, { useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonBackButton, IonRouterOutlet, useIonViewWillEnter } from '@ionic/react';
import { Route } from 'react-router';

interface OtherPageProps {
}

const OtherPage: React.FC<OtherPageProps> = () => {

  useIonViewWillEnter(() => {
    console.log('IVWE on otherpage');
  })

  useEffect(() => {
    console.log('Other Page mount');
    return () => console.log('Other Page unmount');
  }, []);

  return (
    // <IonRouterOutlet id="other" ionPageContainer>
    //   <Route path="/otherpage" render={() => (
      <IonPage data-pageid="other-page">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>OtherPage</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>

        </IonContent>
      </IonPage>
    //   )}></Route>
    // </IonRouterOutlet>
  );
};

export default OtherPage;