import { Component, Event, EventEmitter, Prop } from '@stencil/core';


@Component({
  tag: 'demo-selection',
  styleUrl: 'demo-selection.css',
  shadow: true
})
export class DemoSelection {

  @Prop() demoData: { name: string, url: string }[];
  @Prop() demoMode: string;
  @Event() demoModeChange!: EventEmitter;
  @Prop() demoUrl: string;
  @Event() demoUrlChange!: EventEmitter;

  onChangeMode (ev) {
    this.demoModeChange.emit(ev.currentTarget.value);
  }

  onChangeUrl (ev) {
    this.demoUrlChange.emit(ev.currentTarget.value);
  }

  render () {
    return [
      <div>

        <select onChange={this.onChangeUrl.bind(this)}>
          {this.demoData.map(d => <option value={d.url} selected={d.url === this.demoUrl}>{d.name}</option>)}
        </select>

        <select onChange={this.onChangeMode.bind(this)}>
          <option value="md" selected={'md' === this.demoMode}>md</option>
          <option value="ios" selected={'ios' === this.demoMode}>ios</option>
        </select>

      </div>
    ];
  }
}
