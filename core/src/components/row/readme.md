# ion-row

Rows are horizontal components of the [grid](../grid) system and contain varying numbers of
[columns](../col). They ensure the columns are positioned properly.

See [Grid Layout](/docs/layout/grid) for more information.


## Styling Rows

By default, columns will stretch to fill the entire height of the row and wrap when necessary.
There are several CSS classes that can be added to a row to customize this behavior.

| Property                            | Description                                                                                                                                      |
|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| `"ion-nowrap"`                      | Adds `flex-wrap: nowrap`. Forces the columns to a single row.                                                                                    |
| `"ion-wrap-reverse"`                | Adds `flex-wrap: wrap-reverse`. The columns will wrap in reverse.                                                                                |
| `"ion-align-items-start"`           | Adds `align-items: flex-start`. All columns will be vertically aligned at the top, unless they specify their own alignment.                      |
| `"ion-align-items-center"`          | Adds `align-items: center`. All columns will be vertically aligned in the center, unless they specify their own alignment.                       |
| `"ion-align-items-end"`             | Adds `align-items: flex-end`. All columns will be vertically aligned at the bottom, unless they specify their own alignment.                     |
| `"ion-align-items-stretch"`         | Adds `align-items: stretch`. All columns will be stretched to take up the entire height of the row, unless they specify their own alignment.     |
| `"ion-align-items-baseline"`        | Adds `align-items: baseline`. All columns will be vertically aligned at their baselines, unless they specify their own alignment.                |
| `"ion-justify-content-start"`       | Adds `justify-content: start`. All columns will be horizontally aligned at the start.                                                            |
| `"ion-justify-content-center"`      | Adds `justify-content: center`. All columns will be horizontally aligned at the center.                                                          |
| `"ion-justify-content-end"`         | Adds `justify-content: end`. All columns will be horizontally aligned at the end.                                                                |
| `"ion-justify-content-around"`      | Adds `justify-content: space-around`. All columns will be horizontally aligned with equal space around them.                                     |
| `"ion-justify-content-between"`     | Adds `justify-content: space-between`. All columns will be horizontally aligned with a half-size space on either end.                            |


<!-- Auto Generated Below -->


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
