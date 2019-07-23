import { JSX as IonicJSX } from '@ionic/core';
import React from 'react';
import { IonItemInner } from './inner-proxies';
import { ReactProps } from './ReactProps';
import { NavContext } from './navigation/routing/NavContext';

interface IonItemProps extends IonicJSX.IonItem, ReactProps { }

interface IonItemState { };

export class IonItemInternal extends React.Component<IonItemProps, IonItemState> {
  context!: React.ContextType<typeof NavContext>;

  constructor(props: IonItemProps) {
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
      <IonItemInner onClick={this.handleClick} {...props}>{this.props.children}</IonItemInner>
    );
  }

};

IonItemInternal.contextType = NavContext;

function forwardRef(props: any, ref: any) {
  return <IonItemInternal forwardedRef={ref} {...props} />;
}
forwardRef.displayName = 'IonItem';

export const IonItem = /*@__PURE__*/React.forwardRef(forwardRef);
