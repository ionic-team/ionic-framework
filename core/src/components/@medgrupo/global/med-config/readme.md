# med-image-zoom



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute | Description | Type                                                                   | Default     |
| ---------------------- | --------- | ----------- | ---------------------------------------------------------------------- | ----------- |
| `emitter` _(required)_ | --        | TODO        | `{ scheme: (value: string) => void; theme: (value: string) => void; }` | `undefined` |
| `opcoes` _(required)_  | --        | TODO        | `MedConfigInterface`                                                   | `undefined` |


## Dependencies

### Depends on

- [med-header](../med-header)
- [med-navbar](../med-navbar)
- [ion-button](../../../button)
- ion-icon
- [ion-content](../../../content)
- [ion-segment](../../../segment)
- [ion-segment-button](../../../segment-button)
- [ion-label](../../../label)
- [ion-list](../../../list)
- [ion-radio-group](../../../radio-group)
- [ion-item](../../../item)
- [ion-radio](../../../radio)

### Graph
```mermaid
graph TD;
  med-config --> med-header
  med-config --> med-navbar
  med-config --> ion-button
  med-config --> ion-icon
  med-config --> ion-content
  med-config --> ion-segment
  med-config --> ion-segment-button
  med-config --> ion-label
  med-config --> ion-list
  med-config --> ion-radio-group
  med-config --> ion-item
  med-config --> ion-radio
  ion-button --> ion-ripple-effect
  ion-segment-button --> ion-ripple-effect
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  style med-config fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
