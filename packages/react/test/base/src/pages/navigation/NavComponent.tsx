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
import React, { useEffect, useRef } from 'react';

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
          componentProps={{
            someValue: 'Hello',
            nav: nav,
          }}
        >
          <IonButton>Go to Page Two</IonButton>
        </IonNavLink>
      </IonContent>
    </>
  );
};

const PageTwo = ({ nav, ...rest }: { someValue: string; nav: React.MutableRefObject<HTMLIonNavElement> }) => {
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
        <div id="pageTwoProps">{JSON.stringify(rest)}</div>
        <IonNavLink routerDirection="forward" component={() => <PageThree nav={nav} />}>
          <IonButton>Go to Page Three</IonButton>
        </IonNavLink>
      </IonContent>
    </>
  );
};

const PageThree = ({ nav }: { nav: React.MutableRefObject<HTMLIonNavElement> }) => {
  useEffect(() => {
    return () => {
      window.dispatchEvent(new CustomEvent('pageThreeUnmounted'));
    };
  });
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
      <IonContent id="pageThreeContent">
        <IonLabel>Page three content</IonLabel>
        <IonButton onClick={() => nav.current.popToRoot()}>popToRoot</IonButton>
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
