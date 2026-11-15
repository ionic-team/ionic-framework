import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import React, { createContext, useContext, useState } from 'react';
import { Route } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

/**
 * Logging out clears the user and navigates in the same click, so the Join page
 * mounts before the outlet's route info catches up. It should still be shown.
 */

interface AuthState {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
}

const AuthContext = createContext<AuthState>({ loggedIn: false, setLoggedIn: () => undefined });

const GuardAnonOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loggedIn } = useContext(AuthContext);
  return loggedIn ? null : <>{children}</>;
};

const Join: React.FC<{ base: string }> = ({ base }) => {
  const { setLoggedIn } = useContext(AuthContext);
  const router = useIonRouter();

  return (
    <IonPage data-pageid="stale-register-join">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Join</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton
          data-testid="log-in"
          onClick={() => {
            setLoggedIn(true);
            router.push(`${base}/verify`, 'forward');
          }}
        >
          Log in
        </IonButton>
        <TestDescription>
          Log in, then log out. Log out clears the user and navigates back here in the same click, so this page mounts
          in the same commit as the navigation. It should be shown, not left hidden behind a blank screen.
        </TestDescription>
      </IonContent>
    </IonPage>
  );
};

const Verify: React.FC<{ base: string }> = ({ base }) => {
  const { setLoggedIn } = useContext(AuthContext);
  const router = useIonRouter();

  return (
    <IonPage data-pageid="stale-register-verify">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Verify</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton
          data-testid="log-out"
          onClick={() => {
            setLoggedIn(false);
            router.navigateRoot(`${base}/join`);
          }}
        >
          Log out
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const NotFound: React.FC = () => (
  <IonPage data-pageid="stale-register-not-found">
    <IonContent>Not found</IonContent>
  </IonPage>
);

const StaleRegister: React.FC<{ base: string; catchAll: boolean }> = ({ base, catchAll }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const guardedJoin = (
    <GuardAnonOnly>
      <Join base={base} />
    </GuardAnonOnly>
  );

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      <IonRouterOutlet id="stale-register-outer">
        <Route path="verify" element={<Verify base={base} />} />
        <Route
          path="*"
          element={
            <IonPage data-pageid="stale-register-shell">
              {/* The outlet crashes on a `false` child, so each variant gets its own outlet. */}
              {catchAll ? (
                <IonRouterOutlet id="stale-register-inner">
                  <Route path="join/*" element={guardedJoin} />
                  <Route path="*" element={<NotFound />} />
                </IonRouterOutlet>
              ) : (
                <IonRouterOutlet id="stale-register-inner">
                  <Route path="join/*" element={guardedJoin} />
                </IonRouterOutlet>
              )}
            </IonPage>
          }
        />
      </IonRouterOutlet>
    </AuthContext.Provider>
  );
};

export default StaleRegister;
