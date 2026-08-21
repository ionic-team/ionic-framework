import React, { Suspense, lazy, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

const NestedModalContents: React.FC = () => (
  <IonContent className="ion-padding">
    <p id="nested-modal-contents">Nested modal contents</p>
  </IonContent>
);

/**
 * The nested modal's contents, resolved after a delay so that their first
 * render suspends.
 *
 * Core emits `ionMount` from the middle of `present()`, and that is what first
 * mounts an inline overlay's children, so a suspension in those children always
 * lands while the nested modal is presenting and its host has just been
 * teleported out of its `<template>` into `ion-app`.
 */
const LazyNestedModalContents = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>((resolve) => {
      setTimeout(() => resolve({ default: NestedModalContents }), 500);
    })
);

const ModalSuspense: React.FC = () => {
  const [isOuterOpen, setIsOuterOpen] = useState(false);
  const [isNestedOpen, setIsNestedOpen] = useState(false);
  const [nestedDismissCount, setNestedDismissCount] = useState(0);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonButton id="open-suspense-outer-modal" onClick={() => setIsOuterOpen(true)}>
          Open Outer Modal
        </IonButton>
        <div>
          Nested dismiss count: <span id="nested-modal-dismiss-count">{nestedDismissCount}</span>
        </div>

        <IonModal
          id="suspense-outer-modal"
          isOpen={isOuterOpen}
          onDidDismiss={() => setIsOuterOpen(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Outer Modal</IonTitle>
              <IonButtons slot="end">
                <IonButton id="close-suspense-outer-modal" onClick={() => setIsOuterOpen(false)}>
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonButton id="open-suspense-nested-modal" onClick={() => setIsNestedOpen(true)}>
              Open Nested Modal
            </IonButton>

            {/*
             * The boundary encloses the nested overlay itself, so hiding it
             * runs `componentWillUnmount` on the nested modal's wrapper while
             * the overlay is presenting.
             */}
            <Suspense fallback={<div id="suspense-fallback">Loading nested modal contents</div>}>
              <IonModal
                id="suspense-nested-modal"
                isOpen={isNestedOpen}
                onDidDismiss={() => {
                  setIsNestedOpen(false);
                  setNestedDismissCount((count) => count + 1);
                }}
              >
                <IonHeader>
                  <IonToolbar>
                    <IonTitle>Nested Modal</IonTitle>
                    <IonButtons slot="end">
                      <IonButton
                        id="close-suspense-nested-modal"
                        onClick={() => setIsNestedOpen(false)}
                      >
                        Close
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <LazyNestedModalContents />
              </IonModal>
            </Suspense>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ModalSuspense;
