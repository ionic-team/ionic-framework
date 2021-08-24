# med-context-menu



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                    | Type      | Default |
| ----------- | ----------- | ------------------------------ | --------- | ------- |
| `collapsed` | `collapsed` | Define o estado do componente. | `boolean` | `true`  |


## Methods

### `toggle(event?: Event | undefined) => Promise<void>`



#### Returns

Type: `Promise<void>`




## CSS Custom Properties

| Name           | Description                          |
| -------------- | ------------------------------------ |
| `--background` | Define a cor da borda do componente. |
| `--color`      | Define a cor do componente.          |
| `--z-index`    | Define o z-index do componente.      |


## Dependencies

### Depends on

- [ion-button](../../../button)
- ion-icon

### Graph
```mermaid
graph TD;
  med-context-menu --> ion-button
  med-context-menu --> ion-icon
  ion-button --> ion-ripple-effect
  style med-context-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
