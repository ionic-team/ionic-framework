Framework!
===============

    python -m SimpleHTTPServer 8000

    http://localhost:8000/example/
   
    
## Events

### Page Events

Page events happen in the order shown and described below:

 1. __pageinit__: The user clicked an internal webapp link, which triggers this event before the next page is either requested from the server or retrieved from the cache. The event's detail data contains the URL to request.
   -  __pageinitfailed__: This event is triggered when something has gone wrong while trying to receive data for the next page to show. 
 2. __pagecreate__: This event is trigger after the new page has been added to the DOM. However, the new page has not started the transition to be in view yet, and the old page is still in view for the user. 
 3. __pageload__: The new page the user will view has already been received from the server or cache, and has been placed into the DOM. However, it has not started or ended the page transition, it is not in view for the user, and the old page it's replacing is still in view.
 4. __pageview__: The new page the user is viewing has already been received from the server or cache, it has been placed into the DOM, the page transition has completed. This is primarily the event you'll want to listen to to know when a new page is being viewed. Note that while the the old page is not showing, the old page has not been removed from the DOM yet.
 5. __pageremove__: The new page is already being viewed by the user and the old page has transitioned out of view. This event is triggered before the old page is about to be removed from the DOM.


### WebApp Events

__ready__: The DOM is ready.

