import { Component, Event, Prop, Watch } from '@stencil/core';
import { EventEmitter } from 'ionicons/dist/types/stencil.core';

@Component({
  tag: 'ion-route'
})
export class Route {

  /**
   * Relative path that needs to match in order for this route to apply.
   */
  @Prop() url = '';

  /**
   * Name of the component to load/select in the navigation outlet (`ion-tabs`, `ion-nav`)
   * when the route matches.
   *
   * The value of this property is not always the tagname of the component to load,
   * in ion-tabs it actually refers to the name of the `ion-tab` to select.
   */
  @Prop() component!: string;

  /**
   * Props to pass when the `component` specified in this route load.
   */
  @Prop() componentProps?: {[key: string]: any};

  /**
   * Used internaly by `ion-router` to know when this route did change.
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
    for (let i = 0; i < keys1.length; i++) {
      const key = keys1[i];
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
