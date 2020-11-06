const DocsJson = require('@ionic/core/dist/docs.json');
const fs = require('fs');
const { paramCase } = require('change-case');

const generateTags = () => {
  const tagsObject = {};

  DocsJson.components.forEach(component => {
    tagsObject[component.tag] = {
      description: component.docs,
      attributes: component.props.map(prop => paramCase(prop.name))
    }
  });

  fs.writeFileSync('./dist/vetur/tags.json', JSON.stringify(tagsObject, null, 2));
}

const generateAttributes = () => {
  const attributesObject = {};

  DocsJson.components.forEach(component => {
    component.props.forEach(prop => {

      attributesObject[`${component.tag}/${paramCase(prop.name)}`] = {
        type: prop.type,
        description: prop.docs,
        options: prop.values.filter(option => option.value !== undefined).map(option => option.value)
      }
    });
  });

  fs.writeFileSync('./dist/vetur/attributes.json', JSON.stringify(attributesObject, null, 2));
}

const main = async () => {
  if (!fs.existsSync('./dist/vetur')) {
    fs.mkdirSync('./dist/vetur');
  }
  generateTags();
  generateAttributes();
}

main();
