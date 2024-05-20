/* eslint-disable @typescript-eslint/no-var-requires */
// For generating Design Tokens, we use Style Dictionary for several reasons:
// - It's prepared to easily generate tokens for multiple types of outputs (CSS, SCSS, iOS, Android, documentation, etc.).
// - It also works very well out of the box with any kind of Design Tokens formats, like Figma Tokens, as well as APIs to adjust to more custom ones.
// - It is probably the most well-known and widely used Design Tokens tool. It has also been regularly maintained for a long time.
// - It can easily scale to different necessities we might have in the future.

const fs = require('fs');
const path = require('path');
const StyleDictionary = require('style-dictionary');

const targetPath = './src/foundations/';

const {
  variablesPrefix,
  hexToRgb,
  generateShadowValue,
  generateFontFamilyValue,
  generateTypographyValue,
  generateRgbValue,
  generateColorUtilityClasses,
  generateFontUtilityClass,
  generateSpaceUtilityClasses,
  generateTypographyUtilityClass,
} = require('./tokens-utilities');

const { fileHeader } = StyleDictionary.formatHelpers;

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

    return fileHeader({ file }) + ':root {\n' + prefixedVariables.join('\n') + '\n}\n';
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

    return fileHeader({ file }) + prefixedVariables.join('\n') + '\n';
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

// Register the custom format to generate HTML
// Load the HTML template
const template = fs.readFileSync(path.join(__dirname, 'preview-template.html'), 'utf8');
StyleDictionary.registerFormat({
  name: 'html/tokens',
  formatter: function ({ dictionary }) {
    let colorTokens = '';
    let fontSizeTokens = '';
    let boxShadowTokens = '';
    let borderSizeTokens = '';
    let borderRadiusTokens = '';
    let fontWeightTokens = '';
    let letterSpacingTokens = '';
    let spaceTokens = '';

    dictionary.allProperties.forEach((token) => {
      if (token.attributes.category === 'color') {
        colorTokens += `
          <div class="color-token" style="background-color: ${token.value};">
              <div>${token.name}</div>
          </div>
        `;
      } else if (token.attributes.category === 'font-size') {
        fontSizeTokens += `
          <div class="font-size-token" style="font-size: ${token.value};">
              ${token.name} (${token.value})
          </div>
        `;
      } else if (token.attributes.category.startsWith('Elevation')) {
        const cssShadow = token.value.map(generateShadowValue).join(', ');
        boxShadowTokens += `
          <div class="shadow-token" style="box-shadow: ${cssShadow};">
              ${token.name}
          </div>
        `;
      } else if (token.attributes.category === 'border-size' || token.attributes.category === 'border-width') {
        borderSizeTokens += `
          <div class="border-token" style="border-width: ${token.value};">
              ${token.name} (${token.value})
          </div>
        `;
      } else if (token.attributes.category === 'border-radius') {
        borderRadiusTokens += `
          <div class="border-token" style="border-radius: ${token.value};">
              ${token.name} (${token.value})
          </div>
        `;
      } else if (token.attributes.category === 'font-weight') {
        fontWeightTokens += `
          <div class="weight-token" style="font-weight: ${token.value};">
              ${token.name} (${token.value})
          </div>
        `;
      } else if (token.attributes.category === 'letter-spacing') {
        letterSpacingTokens += `
          <div class="letter-spacing-token" style="letter-spacing: ${token.value};">
              ${token.name} (${token.value})
          </div>
        `;
      } else if (token.attributes.category === 'space') {
        spaceTokens += `
          <div class="space-token" style="margin: ${token.value};">
              ${token.name} (${token.value})
          </div>
        `;
      }
    });

    return template
      .replace('{{colorTokens}}', colorTokens)
      .replace('{{fontSizeTokens}}', fontSizeTokens)
      .replace('{{boxShadowTokens}}', boxShadowTokens)
      .replace('{{borderSizeTokens}}', borderSizeTokens)
      .replace('{{borderRadiusTokens}}', borderRadiusTokens)
      .replace('{{fontWeightTokens}}', fontWeightTokens)
      .replace('{{letterSpacingTokens}}', letterSpacingTokens)
      .replace('{{spaceTokens}}', spaceTokens);
  },
});

// Custom transform to ensure unique token names
StyleDictionary.registerTransform({
  name: 'name/cti/kebab-unique',
  type: 'name',
  transformer: function (prop, options) {
    return [options.prefix].concat(prop.path).join('-').toLowerCase();
  },
});

// Register the custom transform group for html file generation
StyleDictionary.registerTransformGroup({
  name: 'custom',
  transforms: ['attribute/cti', 'name/cti/kebab-unique', 'size/rem', 'color/css'],
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
  source: ['./src/foundations/tokens/*.json', './src/foundations/tokens/theme/*.json'],
  platforms: {
    css: {
      buildPath: targetPath,
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
      buildPath: targetPath,
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
    // TODO (ROU-4870) - Don't generate html file now to prevent lint conflicts on CI
    // html: {
    //   transformGroup: 'custom',
    //   buildPath: targetPath,
    //   files: [
    //     {
    //       destination: 'design-tokens.html',
    //       format: 'html/tokens',
    //     },
    //   ],
    // },
  },
  fileHeader: {
    myFileHeader: () => {
      return [`This is an auto-generated file, please do not change it directly.`, `Ionic Design System`];
    },
  },
}).buildAllPlatforms();
