import { JSX as LocalJSX } from '@ionic/core/components';
import React from 'react';

import { IonContext, IonContextInterface } from '../contexts/IonContext';
import { ReactComponentOrElement } from '../models';

import { IonOverlayManager } from './IonOverlayManager';
import { IonicReactProps } from './IonicReactProps';
import { IonAppInner } from './inner-proxies';

type Props = LocalJSX.IonApp &
  IonicReactProps & {
    ref?: React.Ref<HTMLIonAppElement>;
  };

export const IonApp = /*@__PURE__*/ (() =>
  class extends React.Component<Props> {
    addOverlayCallback?: (id: string, overlay: ReactComponentOrElement, containerElement: HTMLDivElement) => void;
    removeOverlayCallback?: (id: string) => void;

    constructor(props: Props) {
      super(props);
    }

    /*
      Wire up methods to call into IonOverlayManager
    */
    ionContext: IonContextInterface = {
      addOverlay: (
        id: string,
        overlay: ReactComponentOrElement,
        containerElement: HTMLDivElement
      ) => {
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

    static get displayName() {
      return 'IonApp';
    }
  })();
