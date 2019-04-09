# ion-picker-controller



<!-- Auto Generated Below -->


## Methods

### `create(opts: PickerOptions) => Promise<HTMLIonPickerElement>`

Create a picker overlay with picker options.

#### Returns

Type: `Promise<HTMLIonPickerElement>`



### `dismiss(data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>`

Dismiss the open picker overlay.

#### Returns

Type: `Promise<boolean>`



### `getTop() => Promise<HTMLIonPickerElement | undefined>`

Get the most recently opened picker overlay.

#### Returns

Type: `Promise<HTMLIonPickerElement | undefined>`




## Dependencies

**Used by:** [ion-datetime](../datetime)
**Depends on:** [ion-picker](../picker)

```mermaid
graph TD;
  ion-picker-controller --> ion-picker
  ion-picker --> ion-backdrop
  ion-picker --> ion-picker-column
  ion-datetime --> ion-picker-controller
  style ion-picker-controller fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
