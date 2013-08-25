Framework!
===============

    python -m SimpleHTTPServer 8000

    http://localhost:8000/example/
   
    
## Events

### Page Events

Page events happen in the order shown and described below:

 1. __pageinit__: The user clicked an internal webapp link, which triggers this event before the next page to show is either requested from the server or retrieved from the cache.
 2. __pageload__: The new page to show the user has already been received from the server or cache, and has been placed into the DOM. However, it has not started or ended the page transition, it is not being shown to the user, and the old page it's replacing is still being shown to the user.
 3. __pageshow__: The new page to show the user has already been received from the server or cache, it has been placed into the DOM, the page transition has completed, and the old page has been removed from the DOM.


### WebApp Events

__ready__: The DOM is ready.
