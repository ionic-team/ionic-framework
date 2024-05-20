// For generating Design Tokens, we use Style Dictionary for several reasons:
// - It's prepared to easily generate tokens for multiple types of outputs (CSS, SCSS, iOS, Android, documentation, etc.).
// - It also works very well out of the box with any kind of Design Tokens formats, like Figma Tokens, as well as APIs to adjust to more custom ones.
// - It is probably the most well-known and widely used Design Tokens tool. It has also been regularly maintained for a long time.
// - It can easily scale to different necessities we might have in the future.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const StyleDictionary = require('style-dictionary');

const { fileHeader } = StyleDictionary.formatHelpers;
const customVariables = ''; // Empty for example of how we can add some extra variables, not from the tokens JSON
const variablesPrefix = 'ionic';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function generateShadowValue(shadow) {
  return `${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.spread} ${shadow.color}`;
}

function generateFontFamilyValue(prop, variableType = 'css') {
  const propName = prop.name.split('-').slice(0, -1).join('-');
  return variableType === 'scss'
    ? `$${variablesPrefix}-${propName}: var(--${variablesPrefix}-${propName}, "${prop.value}", sans-serif);`
    : `--${variablesPrefix}-${propName}: "${prop.value}", sans-serif;`;
}

function generateTypographyValue(prop, dictionary) {
  const typography = prop.value;
  const fontSizeMap = createTypeMap(dictionary, 'font-size');
  const fontWeightMap = createTypeMap(dictionary, 'font-weight');
  const lineHeightMap = createTypeMap(dictionary, 'line-height');
  const letterSpacingMap = createTypeMap(dictionary, 'letter-spacing');

  return `
$${variablesPrefix}-${prop.name}: (
  font-family: $ionic-font-family,
  font-size: $ionic-font-size-${fontSizeMap[typography.fontSize]},
  font-weight: $ionic-font-weight-${fontWeightMap[typography.fontWeight]},
  letter-spacing: $ionic-letter-spacing-${letterSpacingMap[typography.letterSpacing] || 0},
  line-height: $ionic-line-height-${lineHeightMap[typography.lineHeight]},
  text-transform: ${typography.textTransform},
  text-decoration: ${typography.textDecoration}
);
`;
}

function createTypeMap(dictionary, type) {
  return Object.fromEntries(
    Object.entries(dictionary.properties[type]).map(([key, token]) => [token.value, token.attributes.type])
  );
}

function generateRgbValue(prop) {
  const rgb = hexToRgb(prop.value);
  return `$${variablesPrefix}-${prop.name}: var(--${variablesPrefix}-${prop.name}, ${prop.value});${
    rgb
      ? `\n$${variablesPrefix}-${prop.name}-rgb: var(--${variablesPrefix}-${prop.name}-rgb, ${rgb.r}, ${rgb.g}, ${rgb.b});`
      : ``
  }`;
}

// CSS vanilla :root format
StyleDictionary.registerFormat({
  name: 'rootFormat',
  formatter({ dictionary, file }) {
    const prefixedVariables = dictionary.allProperties
      .filter((prop) => prop['$type'] !== 'typography')
      .map((prop) => {
        if (prop.attributes.category.startsWith('Elevation')) {
          const cssShadow = prop.value.map(generateShadowValue).join(', ');
          return `--${variablesPrefix}-${prop.name}: ${cssShadow};`;
        } else if (prop.attributes.category.match('font-family')) {
          return generateFontFamilyValue(prop);
        } else {
          const rgb = hexToRgb(prop.value);
          return `  --${variablesPrefix}-${prop.name}: ${prop.value};${
            rgb ? `\n  --${variablesPrefix}-${prop.name}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};` : ``
          }`;
        }
      });

    return fileHeader({ file }) + ':root {\n' + prefixedVariables.join('\n') + customVariables + '\n}\n';
  },
});

// SCSS variables format
StyleDictionary.registerFormat({
  name: 'scssVariablesFormat',
  formatter({ dictionary, file }) {
    const typographyProperties = dictionary.allProperties.filter((prop) => prop['$type'] === 'typography');
    const otherProperties = dictionary.allProperties.filter((prop) => prop['$type'] !== 'typography');

    const sortedProperties = [...otherProperties, ...typographyProperties];

    const prefixedVariables = sortedProperties.map((prop) => {
      if (prop.attributes.category.startsWith('Elevation')) {
        const cssShadow = prop.value.map(generateShadowValue).join(', ');
        return `$${variablesPrefix}-${prop.name}: var(--${variablesPrefix}-${prop.name}, ${cssShadow});`;
      } else if (prop.attributes.category.match('font-family')) {
        return generateFontFamilyValue(prop, 'scss');
      } else if (prop['$type'] === 'typography') {
        return generateTypographyValue(prop, dictionary);
      } else {
        return generateRgbValue(prop);
      }
    });

    return fileHeader({ file }) + prefixedVariables.join('\n') + customVariables + '\n';
  },
});

// Create utility-classes
StyleDictionary.registerFormat({
  name: 'cssUtilityClassesFormat',
  formatter({ dictionary, file }) {
    const utilityClasses = dictionary.allProperties.map((prop) => {
      let tokenType = prop.attributes.category;
      const className = `${prop.name}`;
      let utilityClass = '';

      if (tokenType.startsWith('Elevation')) {
        return `.${variablesPrefix}-${className} {\n  box-shadow: $ionic-${prop.name};\n}`;
      } else if (prop['$type'] === 'typography') {
        return generateTypographyUtilityClass(prop, dictionary);
      } else if (prop.attributes.category.match('font-family') || tokenType === 'scale') {
        return;
      }

      switch (tokenType) {
        case 'color':
        case 'state':
        case 'Guidelines':
        case 'Disabled':
        case 'Hover':
        case 'Pressed':
          utilityClass = generateColorUtilityClasses(prop, className);
          break;
        case 'border-size':
          utilityClass = `.${variablesPrefix}-${className} {\n  border-width: $ionic-${prop.name};\n}`;
          break;
        case 'font':
          utilityClass = generateFontUtilityClass(prop, className);
          break;
        case 'space':
          utilityClass = generateSpaceUtilityClasses(prop, className);
          break;
        default:
          utilityClass = `.${variablesPrefix}-${className} {\n  ${tokenType}: $ionic-${prop.name};\n}`;
      }

      return utilityClass;
    });

    return [
      fileHeader({ file }),
      '@import "./ionic.vars";\n@import "../themes/mixins";\n',
      utilityClasses.join('\n'),
    ].join('\n');
  },
});

function generateTypographyUtilityClass(prop, dictionary) {
  const typography = prop.value;
  const fontSizeMap = createTypeMap(dictionary, 'font-size');
  const fontWeightMap = createTypeMap(dictionary, 'font-weight');
  const lineHeightMap = createTypeMap(dictionary, 'line-height');
  const letterSpacingMap = createTypeMap(dictionary, 'letter-spacing');

  return `
.${variablesPrefix}-${prop.name} {
  font-family: $ionic-font-family;
  font-size: $ionic-font-size-${fontSizeMap[typography.fontSize]};
  font-weight: $ionic-font-weight-${fontWeightMap[typography.fontWeight]};
  letter-spacing: $ionic-letter-spacing-${letterSpacingMap[typography.letterSpacing] || 0};
  line-height: $ionic-line-height-${lineHeightMap[typography.lineHeight]};
  text-transform: ${typography.textTransform};
  text-decoration: ${typography.textDecoration};
};
`;
}

function generateColorUtilityClasses(prop, className) {
  return `.${variablesPrefix}-${className} {\n  color: $ionic-${prop.name};\n}
.${variablesPrefix}-background-${className} {\n  background-color: $ionic-${prop.name};\n}`;
}

function generateFontUtilityClass(prop, className) {
  let fontAttribute;
  switch (prop.attributes.type) {
    case 'size':
      fontAttribute = 'font-size';
      break;
    case 'weight':
      fontAttribute = 'font-weight';
      break;
    case 'line-height':
      fontAttribute = 'line-height';
      break;
    case 'letter-spacing':
      fontAttribute = 'letter-spacing';
      break;
  }
  return `.${variablesPrefix}-${className} {\n  ${fontAttribute}: $ionic-${prop.name};\n}`;
}

function generateSpaceUtilityClasses(prop, className) {
  return `.${variablesPrefix}-margin-${className} {\n  --margin-start: #{$ionic-${prop.name}};\n  --margin-end: #{$ionic-${prop.name}};\n  --margin-top: #{$ionic-${prop.name}};\n  --margin-bottom: #{$ionic-${prop.name}};\n\n  @include margin($ionic-${prop.name});\n};\n
.${variablesPrefix}-padding-${className} {\n  --padding-start: #{$ionic-${prop.name}};\n  --padding-end: #{$ionic-${prop.name}};\n  --padding-top: #{$ionic-${prop.name}};\n  --padding-bottom: #{$ionic-${prop.name}};\n\n  @include padding($ionic-${prop.name});\n};\n`;
}

// Make Style Dictionary comply with the $ format on properties from W3C Guidelines
const w3cTokenJsonParser = {
  pattern: /\.json|\.tokens\.json|\.tokens$/,
  parse({ contents }) {
    // replace $value with value so that style dictionary recognizes it
    var preparedContent = (contents || '{}')
      .replace(/"\$?value":/g, '"value":')
      // convert $description to comment
      .replace(/"\$?description":/g, '"comment":');
    //

    return JSON.parse(preparedContent);
  },
};

StyleDictionary.registerParser(w3cTokenJsonParser);

// Generate Tokens
StyleDictionary.extend({
  source: ['./src/foundations/tokens/*.json', './src/foundations/tokens/theme/*.json'],
  platforms: {
    css: {
      buildPath: './src/foundations/',
      transformGroup: 'css',
      files: [
        {
          destination: 'ionic.root.scss',
          format: 'rootFormat',
          options: {
            outputReferences: true,
            fileHeader: `myFileHeader`,
          },
        },
      ],
    },
    scss: {
      buildPath: './src/foundations/',
      transformGroup: 'scss',
      files: [
        {
          destination: 'ionic.vars.scss',
          format: 'scssVariablesFormat',
          options: {
            outputReferences: true,
            fileHeader: `myFileHeader`,
          },
        },
        {
          destination: 'ionic.utility.scss',
          format: 'cssUtilityClassesFormat',
          options: {
            outputReferences: true,
            fileHeader: `myFileHeader`,
          },
        },
      ],
    },
  },
  fileHeader: {
    myFileHeader: () => {
      return [`This is an auto-generated file, please do not change it directly.`, `Ionic Design System`];
    },
  },
}).buildAllPlatforms();
