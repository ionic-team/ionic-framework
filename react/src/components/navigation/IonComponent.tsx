
import React from 'react';

export abstract class IonComponent<TProps, TState> extends React.Component<TProps, TState> {

  ref: React.RefObject<any>;

  constructor(props: TProps) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    if(this.ref && this.ref.current) {
      this.ref.current.addEventListener('ionViewWillEnter', () => {
        this.ionViewWillEnter();
       });
    }
  }

  componentWillUnmount() {
    if(this.ref && this.ref.current) {
      this.ref.current.removeEventListener('ionViewWillEnter');
    }
  }

  abstract ionViewWillEnter(): void;
  abstract ionViewDidEnter(): void;
  abstract ionViewWillLeave(): void;
  abstract ionViewDidLeave(): void;

  render(): React.ReactElement<any> {
    const children = React.Children.map(this.props.children, (child: React.ReactElement<any>) => {
      return React.cloneElement(child, {
        ...this.props,
        ref: this.ref
      });
    });

    return (
      <>
        { children }
      </>
    );
  }
}
