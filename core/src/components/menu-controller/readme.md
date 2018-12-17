# ion-menu-controller

The Menu Controller makes it easy to control a Menu. The methods provided can be used to display the menu, enable the menu, toggle the menu, and more. The controller will grab a reference to the menu by the side, or id. if neither of these are passed to it, it will grab the first menu it finds.


<!-- Auto Generated Below -->


## Methods

### `close(menuId?: string | null | undefined) => Promise<boolean>`

Close the menu. If no menu is specified, then it will close any menu
that is open. If a menu is specified, it will close that menu.

#### Parameters

| Name     | Type                          | Description |
| -------- | ----------------------------- | ----------- |
| `menuId` | `null \| string \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `enable(shouldEnable: boolean, menuId?: string | null | undefined) => Promise<HTMLIonMenuElement | undefined>`

Used to enable or disable a menu. For example, there could be multiple
left menus, but only one of them should be able to be opened at the same
time. If there are multiple menus on the same side, then enabling one menu
will also automatically disable all the others that are on the same side.

#### Parameters

| Name           | Type                          | Description |
| -------------- | ----------------------------- | ----------- |
| `shouldEnable` | `boolean`                     |             |
| `menuId`       | `null \| string \| undefined` |             |

#### Returns

Type: `Promise<HTMLIonMenuElement | undefined>`



### `get(menuId?: string | null | undefined) => Promise<HTMLIonMenuElement | undefined>`

Used to get a menu instance. If a menu is not provided then it will
return the first menu found. If the specified menu is `start` or `end`, then
it will return the enabled menu on that side. Otherwise, it will try to find
the menu using the menu's `id` property. If a menu is not found then it will
return `null`.

#### Parameters

| Name     | Type                          | Description |
| -------- | ----------------------------- | ----------- |
| `menuId` | `null \| string \| undefined` |             |

#### Returns

Type: `Promise<HTMLIonMenuElement | undefined>`



### `getMenus() => Promise<HTMLIonMenuElement[]>`

Returns an array of all menu instances.

#### Returns

Type: `Promise<HTMLIonMenuElement[]>`



### `getOpen() => Promise<HTMLIonMenuElement | undefined>`

Returns the instance of the menu already opened, otherwise `null`.

#### Returns

Type: `Promise<HTMLIonMenuElement | undefined>`



### `isAnimating() => Promise<boolean>`

Returns `true` if any menu is currently animating.

#### Returns

Type: `Promise<boolean>`



### `isEnabled(menuId?: string | null | undefined) => Promise<boolean>`

Returns `true` if the specified menu is enabled.

#### Parameters

| Name     | Type                          | Description |
| -------- | ----------------------------- | ----------- |
| `menuId` | `null \| string \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `isOpen(menuId?: string | null | undefined) => Promise<boolean>`

Returns `true` if the specified menu is open. If the menu is not specified, it
will return `true` if any menu is currently open.

#### Parameters

| Name     | Type                          | Description |
| -------- | ----------------------------- | ----------- |
| `menuId` | `null \| string \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `open(menuId?: string | null | undefined) => Promise<boolean>`

Open the menu.

#### Parameters

| Name     | Type                          | Description |
| -------- | ----------------------------- | ----------- |
| `menuId` | `null \| string \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `registerAnimation(name: string, animation: AnimationBuilder) => void`

Registers a new animation that can be used in any `ion-menu`.

```
   * <ion-menu type="my-animation">
   * ```

#### Parameters

| Name        | Type                                                                    | Description |
| ----------- | ----------------------------------------------------------------------- | ----------- |
| `name`      | `string`                                                                |             |
| `animation` | `(Animation: Animation, baseEl: any, opts?: any) => Promise<Animation>` |             |

#### Returns

Type: `void`



### `swipeGesture(shouldEnable: boolean, menuId?: string | null | undefined) => Promise<HTMLIonMenuElement | undefined>`

Used to enable or disable the ability to swipe open the menu.

#### Parameters

| Name           | Type                          | Description |
| -------------- | ----------------------------- | ----------- |
| `shouldEnable` | `boolean`                     |             |
| `menuId`       | `null \| string \| undefined` |             |

#### Returns

Type: `Promise<HTMLIonMenuElement | undefined>`



### `toggle(menuId?: string | null | undefined) => Promise<boolean>`

Toggle the menu. If it's closed, it will open, and if opened, it
will close.

#### Parameters

| Name     | Type                          | Description |
| -------- | ----------------------------- | ----------- |
| `menuId` | `null \| string \| undefined` |             |

#### Returns

Type: `Promise<boolean>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
