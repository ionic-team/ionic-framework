# Ionic Framework

Ionic the open source HTML5 Mobile Framework for building amazing, cross-platform native apps with HTML, Javascript, and CSS.

We built Ionic because the options for using HTML5 in native apps weren't good enough. They weren't built to focus on 
native apps targeting the newest of devices. They had too many hacks to support old devices that didn't have 
meaningful market share, or they were too focused on building mobile websites.

Many were slow, had excessive DOM operations, and relied on bulky libraries like jQuery. They weren't built with
performance and great design as the top concerns.

With Ionic we've built a framework meant for native. We don't tie you to the URL bar, and we aren't dwelling on the past,
worrying about supporting marginal or slow devices.

It's important to realize that Ionic is not a replacement for frameworks used for building mobile web apps. There are a lot
of great solutions that work well for websites, like [jQuery Mobile](http://jquerymobile.com/).

Ionic is also not a good solution if you need to support older generation devices. Our compatibility *starts* at iOS 6 and Android 4.2. We will never support devices older than this.

===============


## Quick Start

To start using ionic, you have two options: copy over the built JS and CSS files, or 
use the `ionic` tool.

The source files are in the `dist/` folder. You can just grab the `dist/ionic.js` and `dist/ionic.css` files and
you'll be good to go.

But we recommend using the `ionic` tool because it's faster and gives you a good starting structure for your app.

## Running examples

Ionic comes with many interesting examples showing the power of the framework. To
check them out, navigate into the source folder, and start a web server. The easiest
way is to use Python:

    python -m SimpleHTTPServer 8000

    http://localhost:8000/example/
   
    
## Events

### Page Events

Page events happen in the order shown and described below:

 1. __pageinit__: The user clicked an internal webapp link, which triggers this event before the next page is either requested from the server or retrieved from the cache. The event's detail data contains the URL of the request.
   -  __pageinitfailed__: This event is triggered when something has gone wrong while trying to receive data for the next page to show. 
 2. __pageloaded__: The new page the user will view has already been successfully received from the server or cache. However, it  has not been placed into the DOM, it has not started or ended the page transition, it is not in view for the user, and the old page it's replacing is still in view.
 3. __pagecreate__: This event is triggered after the new page has been added to the DOM. However, the new page has not started the transition to be in view yet, and the old page is still in view for the user. 
 4. __pageview__: The new page the user is viewing has already been received from the server or cache, it has been placed into the DOM, the page transition has completed. This is primarily the event you'll want to listen to to know when a new page is being viewed. Note that while the the old page is not showing, the old page has not been removed from the DOM yet.
 5. __pageremove__: The new page is already being viewed by the user and the old page has transitioned out of view. This event is triggered before the old page is about to be removed from the DOM.


### WebApp Events

__ready__: The DOM is ready.

__initalized__: The webapp has been initalized.

