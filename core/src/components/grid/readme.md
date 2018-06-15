# ion-grid


The grid is a powerful mobile-first flexbox system for building custom layouts.

It is composed of two units — a grid, and column(s). Columns will expand to fill the grid, and will resize to fit additional columns. It is based on a 12 column layout with different breakpoints based on the screen size. The number of columns can be customized using CSS.

See [Responsive Grid](/docs/layout/grid) for more information.

## Grid attributes

By default, columns will stretch to fill the entire height of the grid and wrap when necessary.
There are several attributes that can be added to a grid to customize this behavior.

| Property                    | Description                                                                                                                                      |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| nowrap                      | Adds `flex-wrap: nowrap`. Forces the columns to a single row.                                                                                    |
| wrap-reverse                | Adds `flex-wrap: wrap-reverse`. The columns will wrap in reverse.                                                                                |
| align-items-start           | Adds `align-items: flex-start`. All columns will be vertically aligned at the top, unless they specify their own alignment.                      |
| align-items-center          | Adds `align-items: center`. All columns will be vertically aligned in the center, unless they specify their own alignment.                       |
| align-items-end             | Adds `align-items: flex-end`. All columns will be vertically aligned at the bottom, unless they specify their own alignment.                     |
| align-items-stretch         | Adds `align-items: stretch`. All columns will be stretched to take up the entire height of the row, unless they specify their own alignment.     |
| align-items-baseline        | Adds `align-items: baseline`. All columns will be vertically aligned at their baselines, unless they specify their own alignment.                |
| justify-content-start       | Adds `justify-content: start`. All columns will be horizontally aligned at the start.                                                            |
| justify-content-center      | Adds `justify-content: center`. All columns will be horizontally aligned at the center.                                                          |
| justify-content-end         | Adds `justify-content: end`. All columns will be horizontally aligned at the end.                                                                |
| justify-content-around      | Adds `justify-content: space-around`. All columns will be horizontally aligned with equal space around them.                                     |
| justify-content-between     | Adds `justify-content: space-between`. All columns will be horizontally aligned with a half-size space on either end.                            |


<!-- Auto Generated Below -->


## Properties

#### fixed

boolean

If true, the grid will have a fixed width based on the screen size. Defaults to `false`.


## Attributes

#### fixed

boolean

If true, the grid will have a fixed width based on the screen size. Defaults to `false`.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
