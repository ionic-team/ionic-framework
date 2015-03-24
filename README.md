
#### Test it out!

- Run `gulp watch` to build, serve, and watch Ionic & playground
- Run `gulp karma-watch` while gulp watch is running to watch tests. Unit tests run on compiled files in dist.
- All test files must be suffixed with `_spec.js`.

#### Building & Running

- `npm install -g jspm`
- `jspm init && jspm install`
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
