# Ionic Framework

Ionic the open source HTML5 Mobile Framework for building amazing, cross-platform native apps with HTML, Javascript, and CSS.

We built Ionic because the options for using HTML5 in native apps weren't good enough. They weren't built to focus on 
native apps targeting the newest of devices. They had too many hacks to support old devices that didn't have 
meaningful market share, or they were too focused on building mobile websites.

Many were slow, had excessive DOM operations, and relied on bulky libraries like jQuery. They weren't built with
performance and great design as the top concerns.

With Ionic we've built a framework meant for native. We don't tie you to the URL bar, and we aren't dwelling on the past or
worrying about supporting marginal, slow devices.

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

    node_modules/grunt-cli/bin/grunt watch

    http://localhost:8000/example/

    http://localhost:8000/test/
   


===============

## LICENSE

Ionic is licensed under the MIT Open Source license. For more information, see the LICENSE file in this repository.
