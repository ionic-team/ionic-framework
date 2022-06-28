import {
  IonButton,
  IonContent,
  IonHeader,
  IonNav,
  IonNavLink,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';

const NavComponent: React.FC = () => {
  return (
    <IonNav
      root={() => {
        return (
          <>
            <IonPage>
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Page One</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                I am the content.
                <IonNavLink
                  routerDirection="forward"
                  component={() => {
                    return (
                      <IonPage>
                        <IonHeader>
                          <IonToolbar>
                            <IonTitle>Page Two</IonTitle>
                          </IonToolbar>
                        </IonHeader>
                        <IonContent>I am the page two content.</IonContent>
                      </IonPage>
                    );
                  }}
                >
                  <IonButton>Go to Page Two</IonButton>
                </IonNavLink>
              </IonContent>
            </IonPage>
          </>
        );
      }}
    ></IonNav>
  );
};

export default NavComponent;
