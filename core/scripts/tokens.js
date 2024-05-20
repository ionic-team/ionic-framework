/* For generating Design Tokens, we use Style Dictionary for several reasons:
- It's prepared to easily generate tokens for multiple types of outputs (CSS, SCSS, iOS, Android, documentation, etc.).
- It also works very well out of the box with any kind of Design Tokens formats, like Figma Tokens, as well as APIs to adjust to more custom ones.
- It is probably the most well-known and widely used Design Tokens tool. It has also been regularly maintained for a long time.
- It can easily scale to different necessities we might have in the future.
*/
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StyleDictionary = require('style-dictionary');

const { fileHeader } = StyleDictionary.formatHelpers;

// Empty for as an example of how we can add some extra variables, not from the tokens JSON
const customVariables = ``;

// Prefix for all generated variables
const variablesPrefix = 'ionic';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// CSS vanilla :root format
StyleDictionary.registerFormat({
  name: 'rootFormat',
  formatter({ dictionary, file }) {
    // Add a prefix to all variable names
    const prefixedVariables = dictionary.allProperties.map((prop) => {
      if (prop['$type'] === 'typography') {
        return;
      }

      if (prop.attributes.category.startsWith('Elevation')) {
        const cssShadow = prop.value
          .map((shadow) => {
            return `${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.spread} ${shadow.color}`;
          })
          .join(', ');

        return `--${variablesPrefix}-${prop.name}: ${cssShadow};`;
      } else if (prop.attributes.category.match('font-family')) {
        // Remove the last word from family token, as it comes already with the name of the font, and we want a more abstract variable name
        const propName = prop.name.split('-').slice(0, -1).join('-');
        return `--${variablesPrefix}-${propName}: "${prop.value}", sans-serif;`;
      } else {
        const rgb = hexToRgb(prop.value);
        return `  --${variablesPrefix}-${prop.name}: ${prop.value};${
          rgb ? `\n  --${variablesPrefix}-${prop.name}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};` : ``
        }`;
      }
    });

    return (
      fileHeader({ file }) +
      ':root {\n' +
      prefixedVariables.join('\n') + // Join all prefixed variables with a newline
      customVariables +
      '\n}\n'
    );
  },
});

// scss variables format
StyleDictionary.registerFormat({
  name: 'scssVariablesFormat',
  formatter({ dictionary, file }) {
    // Separate typography properties
    const typographyProperties = dictionary.allProperties.filter((prop) => prop['$type'] === 'typography');
    const otherProperties = dictionary.allProperties.filter((prop) => prop['$type'] !== 'typography');

    // Combine other properties first, then typography properties
    const sortedProperties = [...otherProperties, ...typographyProperties];

    // Add a prefix to all variable names
    const prefixedVariables = sortedProperties.map((prop) => {
      if (prop.attributes.category.startsWith('Elevation')) {
        const cssShadow = prop.value
          .map((shadow) => {
            return `${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.spread} ${shadow.color}`;
          })
          .join(', ');

        return `$${variablesPrefix}-${prop.name}: var(--${variablesPrefix}-${prop.name}, ${cssShadow});`;
      } else if (prop.attributes.category.match('font-family')) {
        // Remove the last word from family token, as it comes already with the name of the font, and we want a more abstract variable name
        const propName = prop.name.split('-').slice(0, -1).join('-');
        return `$${variablesPrefix}-${propName}: var(--${variablesPrefix}-${propName}, "${prop.value}", sans-serif);`;
      } else if (prop['$type'] === 'typography') {
        const typography = prop.value;

        // Get font-size token type, based on typography font-size value
        const fontSizeMap = Object.fromEntries(
          Object.entries(dictionary.properties['font-size']).map(([key, token]) => [token.value, token.attributes.type])
        );

        // Get font-weight token type, based on typography font-weight value
        const fontWeightMap = Object.fromEntries(
          Object.entries(dictionary.properties['font-weight']).map(([key, token]) => [
            token.value,
            token.attributes.type,
          ])
        );

        // Get line-height token type, based on typography line-height value
        const lineHeightMap = Object.fromEntries(
          Object.entries(dictionary.properties['line-height']).map(([key, token]) => [
            token.value,
            token.attributes.type,
          ])
        );

        // Get letter-spacing token type, based on typography letter-spacing value
        const letterSpacingMap = Object.fromEntries(
          Object.entries(dictionary.properties['letter-spacing']).map(([key, token]) => [
            token.value,
            token.attributes.type,
          ])
        );

        // Generate CSS for typography tokens
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
      } else {
        const rgb = hexToRgb(prop.value);
        return `$${variablesPrefix}-${prop.name}: var(--${variablesPrefix}-${prop.name}, ${prop.value});${
          rgb
            ? `\n$${variablesPrefix}-${prop.name}-rgb: var(--${variablesPrefix}-${prop.name}-rgb, ${rgb.r}, ${rgb.g}, ${rgb.b});`
            : ``
        }`;
      }
    });

    return (
      fileHeader({ file }) +
      prefixedVariables.join('\n') + // Join all prefixed variables with a newline
      customVariables +
      '\n'
    );
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
        return (utilityClass = `.${variablesPrefix}-${className} {\n  box-shadow: $ionic-${prop.name};\n}`);
      } else if (prop['$type'] === 'typography') {
        const typography = prop.value;

        // Get font-size token type, based on typography font-size value
        const fontSizeMap = Object.fromEntries(
          Object.entries(dictionary.properties['font-size']).map(([key, token]) => [token.value, token.attributes.type])
        );

        // Get font-weight token type, based on typography font-wight value
        const fontWeightMap = Object.fromEntries(
          Object.entries(dictionary.properties['font-weight']).map(([key, token]) => [
            token.value,
            token.attributes.type,
          ])
        );

        // Get line-height token type, based on typography line-height value
        const lineHeightMap = Object.fromEntries(
          Object.entries(dictionary.properties['line-height']).map(([key, token]) => [
            token.value,
            token.attributes.type,
          ])
        );

        // Get letter-spacing token type, based on typography letter-spacing value
        const letterSpacingMap = Object.fromEntries(
          Object.entries(dictionary.properties['letter-spacing']).map(([key, token]) => [
            token.value,
            token.attributes.type,
          ])
        );

        // Generate CSS for typography tokens
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
      } else if (prop.attributes.category.match('font-family')) {
        return;
      }

      switch (tokenType) {
        case 'color':
        case 'state':
        case 'Guidelines':
        case 'Disabled':
        case 'Hover':
        case 'Pressed':
          utilityClass = `.${variablesPrefix}-${className} {\n  color: $ionic-${prop.name};\n}
.${variablesPrefix}-background-${className} {\n  background-color: $ionic-${prop.name};\n}`;
          break;
        case 'border-size':
          utilityClass = `.${variablesPrefix}-${className} {\n  border-width: $ionic-${prop.name};\n}`;
          break;
        case 'font':
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
            case 'family':
              return;
          }
          utilityClass = `.${variablesPrefix}-${className} {\n  ${fontAttribute}: $ionic-${prop.name};\n}`;
          break;
        case 'space':
          utilityClass = `.${variablesPrefix}-margin-${className} {\n  --margin-start: #{$ionic-${prop.name}};\n  --margin-end: #{$ionic-${prop.name}};\n  --margin-top: #{$ionic-${prop.name}};\n  --margin-bottom: #{$ionic-${prop.name}};\n\n  @include margin($ionic-${prop.name});\n};\n 
.${variablesPrefix}-padding-${className} {\n  --padding-start: #{$ionic-${prop.name}};\n  --padding-end: #{$ionic-${prop.name}};\n  --padding-top: #{$ionic-${prop.name}};\n  --padding-bottom: #{$ionic-${prop.name}};\n\n  @include padding($ionic-${prop.name});\n};\n`;
          break;
        case 'scale':
          return;
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
  source: ['./src/foundations/tokens/*.json'],
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
