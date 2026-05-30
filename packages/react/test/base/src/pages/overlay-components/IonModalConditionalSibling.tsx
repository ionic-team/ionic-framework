import { IonButton, IonCard, IonContent, IonModal } from '@ionic/react';
import { useRef } from 'react';
import { useState } from 'react';

/**
 * Issue: https://github.com/ionic-team/ionic-framework/issues/25590
 *
 * Exception is thrown when adding/removing nodes that are siblings of IonModal,
 * while the modal is being dismissed.
 */
const IonModalConditionalSibling = () => {
  const [items, setItems] = useState<string[]>(['Item 1']);
  const [isOpen, setIsOpen] = useState(true);

  const modal = useRef<HTMLIonModalElement>(null);

  return (
    <IonContent>
      {items && items.map((item) => <IonCard key={item}>Before {item}</IonCard>)}
      <IonModal
        ref={modal}
        isOpen={isOpen}
        onWillDismiss={() => {
          setItems([...items, `Item ${items.length + 1}`]);
        }}
        onDidDismiss={() => setIsOpen(false)}
      >
        <IonContent>
          Modal Content
          <IonButton onClick={() => modal.current!.dismiss()}>Close</IonButton>
        </IonContent>
      </IonModal>
      {items && items.map((item) => <IonCard key={item}>After {item}</IonCard>)}
    </IonContent>
  );
};

export default IonModalConditionalSibling;
