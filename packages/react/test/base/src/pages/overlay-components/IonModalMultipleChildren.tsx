import { IonButton, IonContent, IonModal } from '@ionic/react';

/**
 * Test inline modal rendering when content lacks a single root node
 */
const IonModalMultipleChildren = () => {
  return (
    <IonContent>
      <IonButton id="show-modal">Show Modal</IonButton>
      {showIonModal && (
        <IonModal trigger="show-modal">
          <div class="child-content">Content A</div>
          <div class="child-content">Content B</div>
        </IonModal>
      )}
    </IonContent>
  );
};

export default IonModalConditional;
