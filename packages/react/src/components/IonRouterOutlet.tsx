import React from 'react';

import { ReactProps } from './ReactProps';
import { IonRouterOutletInner } from './inner-proxies';

export const IonRouterOutlet: React.FC<ReactProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={className !== undefined ? `ion-page ${className}` : 'ion-page'}
    >
      <IonRouterOutletInner {...props}>
        {children}
      </IonRouterOutletInner>
    </div>
  );
};
