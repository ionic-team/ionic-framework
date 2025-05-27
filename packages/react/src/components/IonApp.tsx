import type { JSX as LocalJSX } from '@ionic/core/components';
import React, { type PropsWithChildren } from 'react';

import type { IonContextInterface } from '../contexts/IonContext';
import { IonContext } from '../contexts/IonContext';
import type { ReactComponentOrElement } from '../models';

import { IonOverlayManager } from './IonOverlayManager';
import type { IonicReactProps } from './IonicReactProps';
import { IonAppInner } from './inner-proxies';

type Props = PropsWithChildren<
  LocalJSX.IonApp &
    IonicReactProps & {
      ref?: React.Ref<HTMLIonAppElement>;
    }
>;

export class IonApp extends React.Component<Props> {
  addOverlayCallback?: (id: string, overlay: ReactComponentOrElement, containerElement: HTMLDivElement) => void;
  removeOverlayCallback?: (id: string) => void;

  constructor(props: Props) {
    super(props);
  }

  ionContext: IonContextInterface = {
    addOverlay: (id: string, overlay: ReactComponentOrElement, containerElement: HTMLDivElement) => {
      if (this.addOverlayCallback) {
        this.addOverlayCallback(id, overlay, containerElement);
      }
    },
    removeOverlay: (id: string) => {
      if (this.removeOverlayCallback) {
        this.removeOverlayCallback(id);
      }
    },
  };

  render() {
    return (
      <IonContext.Provider value={this.ionContext}>
        <IonAppInner {...this.props}>{this.props.children}</IonAppInner>
        <IonOverlayManager
          onAddOverlay={(callback) => {
            this.addOverlayCallback = callback;
          }}
          onRemoveOverlay={(callback) => {
            this.removeOverlayCallback = callback;
          }}
        />
      </IonContext.Provider>
    );
  }

  static displayName = 'IonApp';
}
