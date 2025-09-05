/* eslint-disable @typescript-eslint/no-var-requires */
// For generating Design Tokens, we use Style Dictionary for several reasons:
// - It's prepared to easily generate tokens for multiple types of outputs (CSS, SCSS, iOS, Android, documentation, etc.).
// - It also works very well out of the box with any kind of Design Tokens formats, like Figma Tokens, as well as APIs to adjust to more custom ones.
// - It is probably the most well-known and widely used Design Tokens tool. It has also been regularly maintained for a long time.
// - It can easily scale to different necessities we might have in the future.
import * as utils from './utils.mjs';
const {
  generateShadowValue,
  generateFontSizeValue,
  generateFontFamilyValue,
  generateTypographyOutput,
  generateValue,
  generateColorUtilityClasses,
  generateDefaultSpaceUtilityClasses,
  generateSpaceUtilityClasses,
  removeConsecutiveRepeatedWords,
  setVariablePrefixValue,
  setClassesAndScssPrefixValue: setClassesPrefixValue,
  generateRadiusUtilityClasses,
  generateBorderUtilityClasses,
  generateFontUtilityClasses,
  generateShadowUtilityClasses,
  generateUtilityClasses
} = utils;
import StyleDictionary from 'style-dictionary';

const customHeader = `// Do not edit directly, this file was auto-generated.`;
// Set the prefix for classes
setClassesPrefixValue('ion');
// Set the prefix for variables
setVariablePrefixValue('token');

// SCSS variables format
StyleDictionary.registerFormat({
  name: 'scssVariablesFormat',
  format: function ({ dictionary }) { // Use 'format' for Style Dictionary v3
    console.log('Generating SCSS variables...');

    const primitiveProperties = dictionary.allTokens.filter((prop) => prop.path[0] === 'primitives');
    const scaleProperties = dictionary.allTokens.filter((prop) => prop.path[0] === 'scale');
    const borderProperties = dictionary.allTokens.filter((prop) => prop.path[0] === 'border');
    const semanticsProperties = dictionary.allTokens.filter((prop) => prop.path[0] === 'semantics');
    const nonPrimitiveScaleBorderSemanticsProperties = dictionary.allTokens.filter(
      (prop) => !['primitives', 'scale', 'border', 'semantics'].includes(prop.path[0])
    );
    const typographyProperties = nonPrimitiveScaleBorderSemanticsProperties.filter((prop) => prop.$type === 'typography');
    const otherProperties = nonPrimitiveScaleBorderSemanticsProperties.filter((prop) => prop.$type !== 'typography');
    
    // Order: primitives → semantics → scale → border → other → typography
    const sortedProperties = [
      ...primitiveProperties,
      ...semanticsProperties,
      ...scaleProperties,
      ...borderProperties,
      ...otherProperties,
      ...typographyProperties
    ];

    const prefixedVariables = sortedProperties.map((prop) => {
      // Remove consecutive repeated words from the token name, like border-border-color
      const propName = removeConsecutiveRepeatedWords(prop.name);

      switch (prop.$type) {
        case 'boxShadow':
          return generateShadowValue(prop, propName);
        case 'fontFamilies':
          return generateFontFamilyValue(prop, propName, 'scss');
        case 'fontSizes':
          return generateFontSizeValue(prop, propName, 'scss');
        case 'typography':
          return generateTypographyOutput(prop, propName, true);
        default:
          return generateValue(prop, propName);
      }
    });

    // In v3, the header is added automatically by Style Dictionary.
    // The format function should only return the file content.
    return [
      customHeader + '\n\n',
      '@use "../themes/functions.sizes" as font;\n',
      prefixedVariables.join('\n') + '\n',
    ].join('');
  },
});

// Create utility-classes
StyleDictionary.registerFormat({
  name: 'cssUtilityClassesFormat',
  format: function ({ dictionary }) { // Use 'format' for Style Dictionary v3
    console.log('Generating Utility-Classes...');

    // Arrays to store specific utility classes
    const typographyUtilityClasses = [];
    const otherUtilityClasses = [];

    // Generate utility classes for each token
    dictionary.allTokens.map((prop) => {
      const tokenCategory = prop.attributes.category;

      if (prop.$type === 'fontFamilies' || tokenCategory === 'scale' || tokenCategory === 'backdrop') {
        // Not creating for the tokens below, as they make no sense to exist as utility-classes.
        return;
      }

      // Remove consecutive repeated words from the token name, like border-border-color
      const propName = removeConsecutiveRepeatedWords(prop.name);

      if (prop.$type === 'typography') {
        // Typography tokens are handled differently, as each might have a different tokenType
        return typographyUtilityClasses.push(generateTypographyOutput(prop, propName, false));
      } else if (tokenCategory.startsWith('round') || tokenCategory.startsWith('rectangular') || tokenCategory.startsWith('soft')) {
        // Generate utility classes for border-radius shape tokens, as they have their own token json file, based on primitive tokens
        return otherUtilityClasses.push(generateRadiusUtilityClasses(propName));
      }

      let utilityClass = '';
      switch (tokenCategory) {
        case 'color':
        case 'primitives':
        case 'semantics':
        case 'text':
        case 'bg':
        case 'icon':
        case 'state':
          utilityClass = generateColorUtilityClasses(prop, propName);
          break;
        case 'border':
          utilityClass = generateBorderUtilityClasses(prop, propName);
          break;
        case 'font':
          utilityClass = generateFontUtilityClasses(prop, propName);
          break;
        case 'space':
          utilityClass = generateSpaceUtilityClasses(prop, propName);
          break;
        case 'shadow':
        case 'elevation':
          utilityClass = generateShadowUtilityClasses(propName);
          break;
        default:
          utilityClass = generateUtilityClasses(tokenCategory, propName);
      }

      return otherUtilityClasses.push(utilityClass);
    });

    const defaultSpaceUtilityClasses = generateDefaultSpaceUtilityClasses();
    otherUtilityClasses.push(defaultSpaceUtilityClasses);

    // Concatenate typography utility classes at the beginning
    const finalOutput = typographyUtilityClasses.concat(otherUtilityClasses).join('\n');

    // In v3, the header is added automatically by Style Dictionary.
    // The format function should only return the file content.
    return [
      customHeader + '\n\n',
      '@import "./ionic.vars";\n@import "../themes/mixins";\n',
      finalOutput,
    ].join('');
  },
});

// APPLY THE CONFIGURATION
const config = {
  source: ["node_modules/outsystems-design-tokens/tokens/**/*.json"],
  platforms: {
    scss: {
      transformGroup: "scss",
      buildPath: './src/foundations/',
      files: [
        {
          destination: "ionic.vars.scss",
          format: "scssVariablesFormat",
        },
        {
          destination: "ionic.utility.scss",
          format: "cssUtilityClassesFormat",
        }
      ]
    }
  }
};

export default config;