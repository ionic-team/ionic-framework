import { IonButton, IonContent, IonModal } from '@ionic/react';

/**
 * Test inline modal rendering when content lacks a single root node
 */
const IonModalMultipleChildren = () => {
  return (
    <IonContent>
      <IonButton id="show-modal">Show Modal</IonButton>
      <IonModal trigger="show-modal">
        <div className="child-content">Content A</div>
        <div className="child-content">Content B</div>
      </IonModal>
    </IonContent>
  );
};

export default IonModalMultipleChildren;
