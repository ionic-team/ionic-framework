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
import React, { useRef } from 'react';

const PageOne = ({
  nav,
  ...restOfProps
}: {
  someString: string;
  someNumber: number;
  someBoolean: boolean;
  nav: React.MutableRefObject<HTMLIonNavElement>;
}) => {
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
        <div id="pageOneProps">{JSON.stringify(restOfProps)}</div>
        <div id="navRef">Nav ref is defined: {nav.current !== null ? 'true' : 'false'}</div>
        <IonNavLink
          routerDirection="forward"
          component={PageTwo}
          componentProps={{ someValue: 'Hello' }}
        >
          <IonButton>Go to Page Two</IonButton>
        </IonNavLink>
      </IonContent>
    </>
  );
};

const PageTwo = (props?: { someValue: string }) => {
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
        <div id="pageTwoProps">{JSON.stringify(props)}</div>
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
  const ref = useRef<any>();
  return (
    <IonPage>
      <IonNav
        ref={ref}
        root={PageOne}
        rootParams={{
          someString: 'Hello',
          someNumber: 3,
          someBoolean: true,
          nav: ref,
        }}
      />
    </IonPage>
  );
};

export default NavComponent;
