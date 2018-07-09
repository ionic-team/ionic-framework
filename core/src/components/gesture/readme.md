# ion-gesture

Gesture is a component that can be used to add gesture based interaction to it's child content.
The component properties can accept methods that will fire when the property is triggered.


<!-- Auto Generated Below -->


## Properties

#### attachTo

string

What component to attach listeners to.


#### canStart

GestureCallback

Function to execute to see if gesture can start. Return boolean


#### direction

string

What direction to listen for gesture changes


#### disableScroll

boolean

If true, the current gesture will disabling scrolling interactions


#### disabled

boolean

If true, the current gesture interaction is disabled


#### gestureName

string

Name for the gesture action


#### gesturePriority

number

What priority the gesture should take. The higher the number, the higher the priority.


#### maxAngle

number

The max angle for the gesture


#### notCaptured

GestureCallback

Function to execute when the gesture has not been captured


#### onEnd

GestureCallback

Function to execute when the gesture has end


#### onMove

GestureCallback

Function to execute when the gesture has moved


#### onStart

GestureCallback

Function to execute when the gesture has start


#### onWillStart

(_: GestureDetail) => Promise<void>

Function to execute when the gesture will start


#### passive

boolean

If the event should use passive event listeners


#### threshold

number

How many pixels of change the gesture should wait for before triggering the action.


## Attributes

#### attach-to

string

What component to attach listeners to.


#### can-start



Function to execute to see if gesture can start. Return boolean


#### direction

string

What direction to listen for gesture changes


#### disable-scroll

boolean

If true, the current gesture will disabling scrolling interactions


#### disabled

boolean

If true, the current gesture interaction is disabled


#### gesture-name

string

Name for the gesture action


#### gesture-priority

number

What priority the gesture should take. The higher the number, the higher the priority.


#### max-angle

number

The max angle for the gesture


#### not-captured



Function to execute when the gesture has not been captured


#### on-end



Function to execute when the gesture has end


#### on-move



Function to execute when the gesture has moved


#### on-start



Function to execute when the gesture has start


#### on-will-start



Function to execute when the gesture will start


#### passive

boolean

If the event should use passive event listeners


#### threshold

number

How many pixels of change the gesture should wait for before triggering the action.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
