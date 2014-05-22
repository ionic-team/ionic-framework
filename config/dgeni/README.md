Editing Doc Pages
-----------------

First, follow these steps: https://github.com/driftyco/ionic#documentation

**Templates in `templates` folder**

- `templates/pages-data.template.html` => `_layout/docs_api.html`
- `templates/index.template.html` => The 'index' page for a doc version - http://ajoslin.github.io/docs/0.9.26/
- `templates/lib/yaml.template.html` => the common yaml config items that every doc page includes
- `templates/api/componentGroup.template.html` => the template for every 'componentGroup' (eg http://ajoslin.github.io/docs/0.9.26/api/ionic/directive/)
- `templates/api/api.template.html` - the base that every doc-item extends from
- `templates/api/{something}.template.html` - the template for {something} - eg directive.template.html for directives

Not everything in all the pages is used - a lot of it is from Angular templates.  Eg things like 'doc.deprecated' aren't used currently.

**New Versions**

Every version uses its own include for left menu, which is manually written.

The first time a version is generated, if there is no _includes/api_menu_{{versionName}}.html, it will generate a generic one for you.

Then you can do what you want to edit that.
