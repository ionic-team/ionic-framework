# ion-tab

The tab component is a child component of [tabs](../tabs). Each tab can contain a top level navigation stack for an app or a single view. An app can have many tabs, all with their own independent navigation.

See the [tabs documentation](../tabs/) for more details on configuring tabs.


<!-- Auto Generated Below -->


## Properties

| Property           | Attribute   | Description                                                                                                                               | Type                                                     | Default     |
| ------------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------- |
| `component`        | `component` | The component to display inside of the tab.                                                                                               | `Function \| HTMLElement \| null \| string \| undefined` | `undefined` |
| `tab` _(required)_ | `tab`       | A tab id must be provided for each `ion-tab`. It's used internally to reference the selected tab or by the router to switch between them. | `string`                                                 | `undefined` |


## Methods

### `setActive() => Promise<void>`

Set the active component for the tab

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
