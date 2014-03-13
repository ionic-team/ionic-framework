Editing Doc Pages
-----------------

After following these steps: https://github.com/driftyco/ionic#documentation

**Templates in `template` folder**

(src) => (dest)

- `pages-data.template.html` => `_layout/docs_0.9.0.html`
- `index.template.html` => The 'index' page for a doc version - http://ajoslin.github.io/docs/0.9.26/
- `yaml.template.html` => the common yaml config items that every doc page includes
- `api/componentGroup.template.html` => the template for every 'componentGroup' (eg http://ajoslin.github.io/docs/0.9.26/api/ionic/directive/)
- `api/api.template.html` - the base that every doc-item extends from
- `api/{something}.template.html` - the template for {something} - eg directive.template.html for directives
