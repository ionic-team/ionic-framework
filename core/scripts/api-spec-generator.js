

const fs = require('fs');

function apiSpecGenerator(opts) {
  return {
    type: 'docs-custom',
    generator: (docsData) => {
      const content = [];
      docsData.components.forEach(cmp => generateComponent(cmp, content));

      const contentStr = content.join('\n');
      return new Promise(resolve => {
        fs.writeFile(opts.file, contentStr, () => {
          resolve();
        });
      });
    }
  };
}

function generateComponent(component, content) {
  content.push('');
  content.push(`${component.tag},${component.encapsulation}`);

  component.props.forEach(prop => {
    content.push(`${component.tag},prop,${prop.name},${prop.type},${prop.default},${prop.required},${prop.reflectToAttr}`);
  });
  component.methods.forEach(prop => {
    content.push(`${component.tag},method,${prop.name},${prop.signature}`);
  });
  component.events.forEach(prop => {
    content.push(`${component.tag},event,${prop.event},${prop.detail},${prop.bubbles}`);
  });
  component.styles.forEach(prop => {
    content.push(`${component.tag},css-prop,${prop.name}`);
  });
}

exports.apiSpecGenerator = apiSpecGenerator;
