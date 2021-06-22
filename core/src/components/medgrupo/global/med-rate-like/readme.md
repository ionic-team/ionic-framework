# med-rate-like



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                                                 | Default     |
| -------- | --------- | ----------- | ---------------------------------------------------- | ----------- |
| `status` | `status`  |             | `RateStatus.DISLIKE \| RateStatus.LIKE \| undefined` | `undefined` |


## Events

| Event       | Description | Type                                                 |
| ----------- | ----------- | ---------------------------------------------------- |
| `medChange` |             | `CustomEvent<RateStatus.DISLIKE \| RateStatus.LIKE>` |


## Dependencies

### Depends on

- ion-icon

### Graph
```mermaid
graph TD;
  med-rate-like --> ion-icon
  style med-rate-like fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
