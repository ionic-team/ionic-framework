import React, { useEffect, useRef, useState } from 'react';
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
  type OverlaysList = {
    [key: string]: {
      component: any;
      containerElement: HTMLDivElement;
    };
  };

  /**
   * Because of the way we're passing around the addOverlay and removeOverlay
   * callbacks, by the time they finally get called, they use a stale reference
   * to the state that only has the initial values. So if two overlays are opened
   * at the same time, both using useIonModal or similar (such as through nesting),
   * the second will erase the first from the overlays list. This causes the content
   * of the first overlay to unmount.
   *
   * We wrap the state in useRef to ensure the two callbacks always use the most
   * up-to-date version.
   *
   * Further reading: https://stackoverflow.com/a/56554056
   */
  const [overlays, setOverlays] = useState<OverlaysList>({});
  const overlaysRef = useRef<OverlaysList>({});
  overlaysRef.current = overlays;

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
    const newOverlays = { ...overlaysRef.current };
    newOverlays[id] = { component, containerElement };
    setOverlays(newOverlays);
  };

  const removeOverlay = (id: string) => {
    const newOverlays = { ...overlaysRef.current };
    delete newOverlays[id];
    setOverlays(newOverlays);
  };

  const overlayKeys = Object.keys(overlays);

  return (
    <>
      {overlayKeys.map((key) => {
        const overlay = overlays[key];
        return ReactDOM.createPortal(overlay.component, overlay.containerElement, `overlay-${key}`);
      })}
    </>
  );
};
