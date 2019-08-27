# ion-loading-controller

Loading controllers programmatically control the loading component. Loadings can be created and dismissed from the loading controller. View the [Loading](../loading) documentation for a full list of options to pass upon creation.




<!-- Auto Generated Below -->


> **[DEPRECATED]** Use the `loadingController` exported from core.

## Methods

### `create(options?: LoadingOptions | undefined) => Promise<HTMLIonLoadingElement>`

Create a loading overlay with loading options.

#### Returns

Type: `Promise<HTMLIonLoadingElement>`



### `dismiss(data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>`

Dismiss the open loading overlay.

#### Returns

Type: `Promise<boolean>`



### `getTop() => Promise<HTMLIonLoadingElement | undefined>`

Get the most recently opened loading overlay.

#### Returns

Type: `Promise<HTMLIonLoadingElement | undefined>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
