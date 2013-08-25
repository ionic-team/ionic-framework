Framework!
===============

    python -m SimpleHTTPServer 8000

    http://localhost:8000/example/
   
    
## Events

__navbegin__: The user clicked an internal webapp link, which triggers this event before the next page is either requested or retrieved from the cache.

__pageshow__: A page has been requested by the user, the new page was received from the server or cache, it has been placed into the DOM, and the page transition has completed, and the old page was removed from the DOM.

__ready__: The DOM is ready.
