import { JSX as IonicJSX } from '@ionic/core';
import React from 'react';
import { IonFabButtonInner } from './inner-proxies';
import { ReactProps } from './ReactProps';
import { NavContext } from './navigation/routing/NavContext';

interface IonFabButtonProps extends IonicJSX.IonFabButton, ReactProps { }

interface IonFabButtonState { };

export class IonFabButtonInternal extends React.Component<IonFabButtonProps, IonFabButtonState> {
  context!: React.ContextType<typeof NavContext>;

  constructor(props: IonFabButtonProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: MouseEvent) {
    if ((this.props.href && this.context.hasIonicRouter()) && !this.props.target) {
      e.preventDefault();
      this.context.navigate(this.props.href, this.props.routerDirection);
    }
  }

  render() {
    const { ...props } = this.props;
    return (
      <IonFabButtonInner onClick={this.handleClick} {...props}>{this.props.children}</IonFabButtonInner>
    );
  }

};

IonFabButtonInternal.contextType = NavContext;

function forwardRef(props: any, ref: any) {
  return <IonFabButtonInternal forwardedRef={ref} {...props} />;
}
forwardRef.displayName = 'IonFabButton';

export const IonFabButton = /*@__PURE__*/React.forwardRef(forwardRef);
