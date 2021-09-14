# med-alternativas-skin



<!-- Auto Generated Below -->


## Properties

| Property                              | Attribute                 | Description | Type                  | Default         |
| ------------------------------------- | ------------------------- | ----------- | --------------------- | --------------- |
| `alternativaSelecionada` _(required)_ | `alternativa-selecionada` | TODO        | `string`              | `undefined`     |
| `alternativas`                        | `alternativas`            | TODO        | `any`                 | `[]`            |
| `dsColor`                             | `ds-color`                | TODO        | `string \| undefined` | `undefined`     |
| `dsSkin`                              | `ds-skin`                 | TODO        | `any`                 | `undefined`     |
| `dsSkinConfig`                        | `ds-skin-config`          | TODO        | `any`                 | `undefined`     |
| `keyAlternativa`                      | `key-alternativa`         | TODO        | `string`              | `'Alternativa'` |
| `keyEnunciado`                        | `key-enunciado`           | TODO        | `string`              | `'Enunciado'`   |
| `keyImagem`                           | `key-imagem`              | TODO        | `string`              | `'Imagem'`      |
| `keyPorcentagem`                      | `key-porcentagem`         | TODO        | `string`              | `'Porcentagem'` |
| `keyRiscada`                          | `key-riscada`             | TODO        | `string`              | `'Riscada'`     |
| `mostraResposta` _(required)_         | `mostra-resposta`         | TODO        | `boolean`             | `undefined`     |
| `permiteRiscar`                       | `permite-riscar`          | TODO        | `boolean`             | `true`          |
| `respostaCorreta` _(required)_        | `resposta-correta`        | TODO        | `string`              | `undefined`     |


## Events

| Event               | Description | Type                                   |
| ------------------- | ----------- | -------------------------------------- |
| `medChange`         | TODO        | `CustomEvent<MedAlternativaInterface>` |
| `medGalleryRequest` | TODO        | `CustomEvent<MedAlternativaInterface>` |
| `medRiscada`        | TODO        | `CustomEvent<MedAlternativaInterface>` |


## Dependencies

### Used by

 - [med-alternativas](../med-alternativas)

### Depends on

- ion-icon
- [ion-progress-bar](../../../../progress-bar)

### Graph
```mermaid
graph TD;
  med-alternativas-b --> ion-icon
  med-alternativas-b --> ion-progress-bar
  med-alternativas --> med-alternativas-b
  style med-alternativas-b fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
