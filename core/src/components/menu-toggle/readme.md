# ion-menu-toggle

The MenuToggle component can be used to toggle a menu open or closed.

By default, it's only visible when the selected menu is active. A menu is active when it can be opened/closed. If the menu is disabled or it's being presented as a split-pane, the menu is marked as non-active and ion-menu-toggle hides itself.

In case it's desired to keep `ion-menu-toggle` always visible, the `autoHide` property can be set to `false`.

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                                                                                                                                                                                                                         | Type                  | Default     |
| ---------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `autoHide` | `auto-hide` | Automatically hides the content when the corresponding menu is not active.  By default, it's `true`. Change it to `false` in order to keep `ion-menu-toggle` always visible regardless the state of the menu.                                       | `boolean`             | `true`      |
| `menu`     | `menu`      | Optional property that maps to a Menu's `menuId` prop. Can also be `start` or `end` for the menu side. This is used to find the correct menu to toggle.  If this property is not used, `ion-menu-toggle` will toggle the first menu that is active. | `string \| undefined` | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
