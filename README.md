
#### Test it out!

- Run `gulp watch` to build, serve, and watch Ionic & playground
- Run `gulp karma-watch` while gulp watch is running to watch tests. Unit tests run on compiled files in dist.
- All test files must be suffixed with `_spec.js`.

#### Building & Running

- `npm install -g jspm`
- `jspm init`
- `gulp watch`
- `python -m SimpleHTTPServer .`
- `open http://localhost:9000/dist/examples/aside/basic/index.html`
- Follow the structure found in src/components/aside/examples/basic
  to create more examples.

#### Problems already

- If we have a `.spec.js` file as a sibling of a js file,
  System will make that an export and ignore the `.js` file.
  There's probably a setting in System.js somewhere to fix this.

#### Build

- JSCS
- JSHint (or TypeScript variant)

#### Current Focus

Build/Angular2
 - Build system
 - Repo structure overlord
 - ES6/Angular2/Component conventions
 - Global/Attribute config system
 - Dynamically assign behaviors/templates per config

HTML/CSS/Transitions
 - Markup structure
 - SCSS
 - View transitions
 - Core View History/Navigation system
 - Routing
 - Snapshot

Gestures
 - Gesture system
 - Linear constraints
 - Auto layout
 - Class/inheritance system
 - Translate native concepts to the web


#### Make it so

```
<nav-view>
  <aside left/>
  <aside right/>
  <aside top/>
  <view cached/>
  <view cached/>
  <view cached/>
  <tabs active>
    <tab selected>
      <nav-view>
        <aside left/>
        <aside right/>
        <view active/>
        <view cached/>
        <view cached/>
      </nav-view>
    </tab>
    <tab deselected>
      <nav-view>
        <aside/>
        <view cached/>
        <view active/>
        <tabs cached>
          <tab deselected>
            <nav-view>
              <aside left/>
              <aside bottom/>
              <view active/>
              <view cached/>
              <view cached/>
            </nav-view>
          </tab>
          <tab selected>
            <nav-view>
              <view cached/>
              <view active/>
            </nav-view>
          </tab>
        </tab>
      </nav-view>
    </tab>
  </tab>
  <view cached/>
</nav-view>
```
