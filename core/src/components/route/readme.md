# ion-route



<!-- Auto Generated Below -->


## Properties

#### component

string

Name of the component to load/select in the navigation outlet (`ion-tabs`, `ion-nav`)
when the route matches.

The value of this property is not always the tagname of the component to load,
in ion-tabs it actually refers to the name of the `ion-tab` to select.


#### componentProps



A key value `{ 'red': true, 'blue': 'white'}` containing props that should be passed
to the defined component when rendered.


#### url

string

Relative path that needs to match in order for this route to apply.

Accepts paths similar to expressjs so that you can define parameters
in the url /foo/:bar where bar would be available in incoming props.


## Attributes

#### component

string

Name of the component to load/select in the navigation outlet (`ion-tabs`, `ion-nav`)
when the route matches.

The value of this property is not always the tagname of the component to load,
in ion-tabs it actually refers to the name of the `ion-tab` to select.


#### component-props



A key value `{ 'red': true, 'blue': 'white'}` containing props that should be passed
to the defined component when rendered.


#### url

string

Relative path that needs to match in order for this route to apply.

Accepts paths similar to expressjs so that you can define parameters
in the url /foo/:bar where bar would be available in incoming props.


## Events

#### ionRouteDataChanged

Used internaly by `ion-router` to know when this route did change.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
