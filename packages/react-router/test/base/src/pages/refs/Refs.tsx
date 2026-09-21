import {
  IonContent,
  IonHeader,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonText,
  IonToolbar,
} from "@ionic/react";
import React, { useRef } from "react";
import { Route } from "react-router";

import TestDescription from '../../components/TestDescription';

const Refs: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route path="/refs" element={<RefsFC />} />
      <Route path="/refs/class" element={<RefsClass />} />
    </IonRouterOutlet>
  );
};

const RefsFC: React.FC = () => {
  const contentRef = useRef<HTMLIonContentElement>(null);
  return (
    <IonPage data-pageid="refs-fc">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Refs FC</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef} className="ref-test">
        <IonText>
          <p>This view is used for automated ref regression tests.</p>
        </IonText>
        <TestDescription>Verify this page renders without errors. React refs on Ionic components (IonContent here) should resolve to the underlying HTML element. If the page crashes or shows a ref-related error in the console, the test fails.</TestDescription>
      </IonContent>
    </IonPage>
  );
};

class RefsClass extends React.Component {
  ref = React.createRef<HTMLIonContentElement>();
  render() {
    return (
      <IonPage data-pageid="refs-class">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Refs Class</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent ref={this.ref} className="ref-test">
          <IonText>
            <p>This view is used for automated ref regression tests.</p>
          </IonText>
        </IonContent>
      </IonPage>
    );
  }
}

export default Refs;
