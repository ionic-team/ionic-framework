import {
  IonButton,
  IonContent,
  IonHeader,
  IonLabel,
  IonNav,
  IonNavLink,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonPage,
} from '@ionic/react';
import React, { useCallback } from 'react';

const PageOne = (props: { someString: string; someNumber: number; someBoolean: boolean }) => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Page One</IonTitle>
          <IonButtons>
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent id="pageOneContent">
        <IonLabel>Page one content</IonLabel>
        <div id="stringifiedProps">{JSON.stringify(props)}</div>
        <IonNavLink routerDirection="forward" component={PageTwo}>
          <IonButton>Go to Page Two</IonButton>
        </IonNavLink>
      </IonContent>
    </>
  );
};

const PageTwo = () => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Page Two</IonTitle>
          <IonButtons>
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent id="pageTwoContent">
        <IonLabel>Page two content</IonLabel>
        <IonNavLink routerDirection="forward" component={PageThree}>
          <IonButton>Go to Page Three</IonButton>
        </IonNavLink>
      </IonContent>
    </>
  );
};

const PageThree = () => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Page Three</IonTitle>
          <IonButtons>
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel>Page three content</IonLabel>
      </IonContent>
    </>
  );
};

const NavComponent: React.FC = () => {
  const root = useCallback(
    () => <PageOne someString="Hello" someNumber={3} someBoolean={true} />,
    []
  );

  return (
    <IonPage>
      <IonNav root={root} />
    </IonPage>
  );
};

export default NavComponent;
