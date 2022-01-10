import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { ReactComponentOrElement } from '../models';

interface IonOverlayManagerProps {
  onAddOverlay: (
    callback: (
      id: string,
      component: ReactComponentOrElement,
      containerElement: HTMLDivElement
    ) => void
  ) => void;
  onRemoveOverlay: (callback: (id: string) => void) => void;
}

/**
 * Manages overlays that are added via the useOverlay hook.
 * This is a standalone component so changes to its children don't cause other descendant
 * components to re-render when overlays are added. However, we need to communicate with the IonContext
 * that is set up in <IonApp />, so we register callbacks so when overlays are added to IonContext,
 * they ultimately added here.
 */
export const IonOverlayManager: React.FC<IonOverlayManagerProps> = ({
  onAddOverlay,
  onRemoveOverlay,
}) => {
  const [overlays, setOverlays] = useState<{
    [key: string]: {
      component: any;
      containerElement: HTMLDivElement;
    };
  }>({
    "-1": {
      component: null,
      containerElement: null!
    }
  });

  const [testStr, setTestStr] = useState('test');

  useEffect(() => {
    /* Setup the callbacks that get called from <IonApp /> */
    onAddOverlay(addOverlay);
    onRemoveOverlay(removeOverlay);
  }, []);

  const addOverlay = (
    id: string,
    component: ReactComponentOrElement,
    containerElement: HTMLDivElement
  ) => {
    const newOverlays = { ...overlays };
    console.log('addOverlay called:', { id, component, newOverlays, testStr });
    setTestStr('test updated');
    newOverlays[id] = { component, containerElement };
    setOverlays(newOverlays);
  };

  const removeOverlay = (id: string) => {
    const newOverlays = { ...overlays };
    delete newOverlays[id];
    setOverlays(newOverlays);
  };

  const overlayKeys = Object.keys(overlays);

  return (
    <>
      {overlayKeys.map((key) => {
        if(key === '-1') return;
        const overlay = overlays[key];
        return ReactDOM.createPortal(overlay.component, overlay.containerElement, `overlay-${key}`);
      })}
    </>
  );
};
