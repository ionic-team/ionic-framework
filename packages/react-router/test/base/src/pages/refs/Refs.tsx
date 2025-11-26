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

const Refs: React.FC = () => {
  return (
    <IonRouterOutlet>
      {/* <Route path="/home" element={<Home update={addRoute} />} /> */}
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
