import type { JSX as LocalJSX } from '@ionic/core/components';
import type { PropsWithChildren } from 'react';
import React, { useContext } from 'react';

import { NavContext } from '../contexts/NavContext';
import OutletPageManager from '../routing/OutletPageManager';

import type { IonicReactProps } from './IonicReactProps';
import { IonRouterOutletInner } from './inner-proxies';
import { createForwardRef } from './utils';

type Props = LocalJSX.IonRouterOutlet & {
  basePath?: string;
  ref?: React.Ref<any>;
  ionPage?: boolean;
};

interface InternalProps extends Props {
  forwardedRef?: React.ForwardedRef<HTMLIonRouterOutletElement>;
}

const IonRouterOutletContainer = (props: PropsWithChildren<InternalProps>) => {
  const { hasIonicRouter, routeInfo, getStackManager } = useContext(NavContext);
  const { children, forwardedRef, ...restProps } = props;

  if (hasIonicRouter()) {
    const StackManager = getStackManager();

    if (restProps.ionPage) {
      return (
        <OutletPageManager StackManager={StackManager} routeInfo={routeInfo} {...restProps}>
          {children}
        </OutletPageManager>
      );
    }
    return (
      <StackManager routeInfo={routeInfo}>
        <IonRouterOutletInner {...restProps} forwardedRef={forwardedRef}>
          {children}
        </IonRouterOutletInner>
      </StackManager>
    );
  }

  return (
    <IonRouterOutletInner ref={forwardedRef} {...restProps}>
      {children}
    </IonRouterOutletInner>
  );
};

// class IonRouterOutletContainer extends React.Component<InternalProps, InternalState> {
//   context!: React.ContextType<typeof NavContext>;

//   constructor(props: InternalProps) {
//     super(props);
//   }

//   render() {
//     const StackManager = this.context.getStackManager();
//     const { children, forwardedRef, ...props } = this.props;

//     return this.context.hasIonicRouter() ? (
//       props.ionPage ? (
//         <OutletPageManager StackManager={StackManager} routeInfo={this.context.routeInfo} {...props}>
//           {children}
//         </OutletPageManager>
//       ) : (
//         <StackManager routeInfo={this.context.routeInfo}>
//           <IonRouterOutletInner {...props} forwardedRef={forwardedRef}>
//             {children}
//           </IonRouterOutletInner>
//         </StackManager>
//       )
//     ) : (
//       <IonRouterOutletInner ref={forwardedRef} {...this.props}>
//         {this.props.children}
//       </IonRouterOutletInner>
//     );
//   }

//   static get contextType() {
//     return NavContext;
//   }
// }

export const IonRouterOutlet = createForwardRef<Props & IonicReactProps, HTMLIonRouterOutletElement>(
  IonRouterOutletContainer,
  'IonRouterOutlet'
);
