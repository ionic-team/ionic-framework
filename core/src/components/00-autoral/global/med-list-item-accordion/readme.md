# med-list-item-accordion



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description | Type                                        | Default     |
| ----------- | ----------- | ----------- | ------------------------------------------- | ----------- |
| `border`    | `border`    |             | `boolean`                                   | `false`     |
| `collapsed` | `collapsed` |             | `boolean`                                   | `true`      |
| `color`     | `color`     |             | `string \| undefined`                       | `undefined` |
| `dsSize`    | `ds-size`   |             | `"md" \| "sm" \| "xs" \| undefined`         | `undefined` |
| `label`     | `label`     |             | `string \| undefined`                       | `undefined` |
| `margin`    | `margin`    |             | `"lg" \| "md" \| "sm" \| "xs" \| undefined` | `undefined` |
| `neutral`   | `neutral`   |             | `string \| undefined`                       | `undefined` |
| `selected`  | `selected`  |             | `boolean`                                   | `false`     |
| `titulo`    | `titulo`    |             | `string \| undefined`                       | `undefined` |


## Methods

### `toggle(event?: Event | undefined) => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [ion-button](../../../button)
- ion-icon

### Graph
```mermaid
graph TD;
  med-list-item-accordion --> ion-button
  med-list-item-accordion --> ion-icon
  ion-button --> ion-ripple-effect
  style med-list-item-accordion fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
