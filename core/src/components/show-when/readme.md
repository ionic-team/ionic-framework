# ion-show-when

ShowWhen is a component that will automatically show it's child contents when a query evaluates to true.
ShowWhen can watch for platform changes, mode changes, css media queries, and device orientation.


<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                                                                                                                                                          | Type      |
| ------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `mediaQuery`  | `media-query` | If the current media query matches this value, the element will show.                                                                                                                | `string`  |
| `modes`       | `modes`       | If the current platform matches the given value, the element will show. Accepts a comma separated list of modes to match against.                                                    | `string`  |
| `or`          | `or`          | If false, and two or more conditions are set, the element will show when all are true. If true, and two or more conditions are set, the element will show when at least one is true. | `boolean` |
| `orientation` | `orientation` | If the current orientation matches this value, the element will show.                                                                                                                | `string`  |
| `platform`    | `platform`    | If the current platform matches the given value, the element will show. Accepts a comma separated list of platform to match against.                                                 | `string`  |
| `size`        | `size`        | If the current screen width matches the given size, the element will show. Uses the build in sizes of xs, sm, md, lg, xl.                                                            | `string`  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
