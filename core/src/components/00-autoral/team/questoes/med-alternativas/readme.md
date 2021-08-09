# med-alternativas



<!-- Auto Generated Below -->


## Properties

| Property                              | Attribute                 | Description | Type      | Default         |
| ------------------------------------- | ------------------------- | ----------- | --------- | --------------- |
| `alternativaSelecionada` _(required)_ | `alternativa-selecionada` |             | `string`  | `undefined`     |
| `alternativas`                        | `alternativas`            |             | `any`     | `[]`            |
| `keyAlternativa`                      | `key-alternativa`         |             | `string`  | `'Alternativa'` |
| `keyEnunciado`                        | `key-enunciado`           |             | `string`  | `'Enunciado'`   |
| `keyImagem`                           | `key-imagem`              |             | `string`  | `'Imagem'`      |
| `keyPorcentagem`                      | `key-porcentagem`         |             | `string`  | `'Porcentagem'` |
| `mostraResposta` _(required)_         | `mostra-resposta`         |             | `boolean` | `undefined`     |
| `respostaCorreta` _(required)_        | `resposta-correta`        |             | `string`  | `undefined`     |


## Events

| Event               | Description | Type                                   |
| ------------------- | ----------- | -------------------------------------- |
| `medChange`         |             | `CustomEvent<MedAlternativaInterface>` |
| `medClick`          |             | `CustomEvent<MedAlternativaInterface>` |
| `medGalleryRequest` |             | `CustomEvent<MedAlternativaInterface>` |


## Dependencies

### Depends on

- [ion-radio-group](../../../../radio-group)
- [med-option](../med-option)
- [ion-radio](../../../../radio)
- ion-icon
- [ion-progress-bar](../../../../progress-bar)

### Graph
```mermaid
graph TD;
  med-alternativas --> ion-radio-group
  med-alternativas --> med-option
  med-alternativas --> ion-radio
  med-alternativas --> ion-icon
  med-alternativas --> ion-progress-bar
  style med-alternativas fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
