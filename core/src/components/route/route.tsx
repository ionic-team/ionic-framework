import { Component, ComponentInterface, Event, EventEmitter, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'ion-route'
})
export class Route implements ComponentInterface {

  /**
   * Relative path that needs to match in order for this route to apply.
   *
   * Accepts paths similar to expressjs so that you can define parameters
   * in the url /foo/:bar where bar would be available in incoming props.
   */
  @Prop() url = '';

  /**
   * Name of the component to load/select in the navigation outlet (`ion-tabs`, `ion-nav`)
   * when the route matches.
   *
   * The value of this property is not always the tagname of the component to load,
   * in `ion-tabs` it actually refers to the name of the `ion-tab` to select.
   */
  @Prop() component!: string;

  /**
   * A key value `{ 'red': true, 'blue': 'white'}` containing props that should be passed
   * to the defined component when rendered.
   */
  @Prop() componentProps?: {[key: string]: any};

  /**
   * Used internally by `ion-router` to know when this route did change.
   */
  @Event() ionRouteDataChanged!: EventEmitter<any>;

  @Watch('url')
  @Watch('component')
  onUpdate(newValue: any) {
    this.ionRouteDataChanged.emit(newValue);
  }

  @Watch('componentProps')
  onComponentProps(newValue: any, oldValue: any) {
    if (newValue === oldValue) {
      return;
    }
    const keys1 = newValue ? Object.keys(newValue) : [];
    const keys2 = oldValue ? Object.keys(oldValue) : [];
    if (keys1.length !== keys2.length) {
      this.onUpdate(newValue);
      return;
    }
    for (const key of keys1) {
      if (newValue[key] !== oldValue[key]) {
        this.onUpdate(newValue);
        return;
      }
    }
  }

  componentDidLoad() {
    this.ionRouteDataChanged.emit();
  }
  componentDidUnload() {
    this.ionRouteDataChanged.emit();
  }
}
