# ion-hide-when

`HideWhen` is a component that will automatically hide itself and any child content when a property evaluates to true.


<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                                                                                                                                                          | Type      |
| ------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `mediaQuery`  | `media-query` | If the current media query matches this value, the element will hide.                                                                                                                | `string`  |
| `modes`       | `modes`       | If the current platform matches the given value, the element will hide. Accepts a comma separated list of modes to match against.                                                    | `string`  |
| `or`          | `or`          | If false, and two or more conditions are set, the element will hide when all are true. If true, and two or more conditions are set, the element will hide when at least one is true. | `boolean` |
| `orientation` | `orientation` | If the current orientation matches this value, the element will hide.                                                                                                                | `string`  |
| `platform`    | `platform`    | If the current platform matches the given value, the element will hide. Accepts a comma separated list of platforms to match against.                                                | `string`  |
| `size`        | `size`        | If the current screen width matches the given size, the element will hide. Uses the build in sizes of xs, sm, md, lg, xl.                                                            | `string`  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
