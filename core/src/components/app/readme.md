# ion-app

App is a container element for an Ionic application. There should only be one `<ion-app>` element per project. An app can have many Ionic components including menus, headers, content, and footers. The overlay components get appended to the `<ion-app>` when they are presented.

<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [ion-alert](../alert)
- [ion-action-sheet](../action-sheet)
- [ion-loading](../loading)
- [ion-modal](../modal)
- [ion-picker](../picker)
- [ion-popover](../popover)
- [ion-toast](../toast)

### Graph
```mermaid
graph TD;
  ion-app --> ion-alert
  ion-app --> ion-action-sheet
  ion-app --> ion-loading
  ion-app --> ion-modal
  ion-app --> ion-picker
  ion-app --> ion-popover
  ion-app --> ion-toast
  ion-alert --> ion-ripple-effect
  ion-alert --> ion-backdrop
  ion-action-sheet --> ion-backdrop
  ion-action-sheet --> ion-icon
  ion-action-sheet --> ion-ripple-effect
  ion-loading --> ion-backdrop
  ion-loading --> ion-spinner
  ion-modal --> ion-backdrop
  ion-picker --> ion-backdrop
  ion-picker --> ion-picker-column
  ion-popover --> ion-backdrop
  ion-toast --> ion-icon
  ion-toast --> ion-ripple-effect
  style ion-app fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
