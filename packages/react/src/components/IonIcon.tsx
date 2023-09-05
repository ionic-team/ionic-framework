import React from 'react';

import { NavContext } from '../contexts/NavContext';

import type { IonicReactProps } from './IonicReactProps';
import { IonIconInner } from './inner-proxies';
import { createForwardRef, getConfig } from './utils';

export interface IonIconProps {
  color?: string;
  flipRtl?: boolean;
  icon?: string;
  ios?: string;
  lazy?: boolean;
  md?: string;
  mode?: 'ios' | 'md';
  name?: string;
  size?: string;
  src?: string;
}

type InternalProps = IonIconProps & {
  forwardedRef?: React.ForwardedRef<HTMLIonIconElement>;
};

class IonIconContainer extends React.PureComponent<InternalProps> {
  constructor(props: InternalProps) {
    super(props);
    if (this.props.name) {
      console.warn(
        'In Ionic React, you import icons from "ionicons/icons" and set the icon you imported to the "icon" property. Setting the "name" property has no effect.'
      );
    }
  }

  render() {
    const { icon, ios, md, mode, ...rest } = this.props;

    let iconToUse: typeof icon;

    const config = getConfig();
    const iconMode = mode || config?.get('mode');

    if (ios || md) {
      if (iconMode === 'ios') {
        iconToUse = ios ?? md ?? icon;
      } else {
        iconToUse = md ?? ios ?? icon;
      }
    } else {
      iconToUse = icon;
    }

    return (
      <IonIconInner ref={this.props.forwardedRef} icon={iconToUse} {...rest}>
        {this.props.children}
      </IonIconInner>
    );
  }

  static get contextType() {
    return NavContext;
  }
}

export const IonIcon = createForwardRef<IonIconProps & IonicReactProps, HTMLIonIconElement>(
  IonIconContainer,
  'IonIcon'
);
