/**
 * Reproduces https://github.com/ionic-team/ionic-framework/issues/31157
 * (and the original https://github.com/ionic-team/ionic-framework/issues/19986).
 *
 * A parent passes state to a child rendered inside an IonRouterOutlet. Clicking the
 * button updates that state, and the child should re-render with the new prop value.
 *
 * Two variants:
 * - `routes-wrapper`: routes wrapped in <Routes>, the RR6 equivalent of the issue's <Switch>
 * - `direct`: routes as direct <Route> children of the outlet (the #19986 shape)
 */

import { IonButton, IonContent, IonHeader, IonPage, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

interface ChildProps {
  name: string;
  setName: (name: string) => void;
}

const ChildPage: React.FC<ChildProps> = ({ name, setName }) => {
  return (
    <IonPage data-pageid="props-update-child">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Props Update</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <TestDescription>
          Tap the button. Its label should change from "Viktor" to "another", confirming the child
          re-renders with the updated parent prop.
        </TestDescription>
        <IonButton data-testid="name-button" onClick={() => setName('another')}>
          {name}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

/** Routes wrapped in <Routes> - the RR6 equivalent of the <Switch> shape in #31157. */
export const PropsUpdateRoutesWrapper: React.FC = () => {
  const [name, setName] = useState('Viktor');
  return (
    <IonRouterOutlet>
      <Routes>
        <Route path="child" element={<ChildPage name={name} setName={setName} />} />
        <Route index element={<Navigate to="child" replace />} />
      </Routes>
    </IonRouterOutlet>
  );
};

/** Routes as direct <Route> children of the outlet - the original #19986 shape. */
export const PropsUpdateDirect: React.FC = () => {
  const [name, setName] = useState('Viktor');
  return (
    <IonRouterOutlet>
      <Route path="child" element={<ChildPage name={name} setName={setName} />} />
      <Route index element={<Navigate to="child" replace />} />
    </IonRouterOutlet>
  );
};
