# ion-tab

The Tab component is a child component of the [Tabs](../Tabs/) component.
Each Tab is meant to be a top level navigation stack for an app.
Meaning that an app can have many tabs, all wit their own independent navigation.

See the [Tabs API Docs](../Tabs/) for more details on configuring Tabs.


<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                                                                                                               | Type                                                     | Default     |
| ----------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------- |
| `active`    | `active`    |                                                                                                                                           | `boolean`                                                | `false`     |
| `component` | `component` | The component to display inside of the tab.                                                                                               | `Function \| HTMLElement \| null \| string \| undefined` | `undefined` |
| `delegate`  | --          |                                                                                                                                           | `FrameworkDelegate \| undefined`                         | `undefined` |
| `tab`       | `tab`       | A tab id must be provided for each `ion-tab`. It's used internally to reference the selected tab or by the router to switch between them. | `string \| undefined`                                    | `undefined` |


## Methods

### `setActive() => Promise<void>`

Set the active component for the tab

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
