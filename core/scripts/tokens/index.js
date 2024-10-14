/* eslint-disable @typescript-eslint/no-var-requires */
// For generating Design Tokens, we use Style Dictionary for several reasons:
// - It's prepared to easily generate tokens for multiple types of outputs (CSS, SCSS, iOS, Android, documentation, etc.).
// - It also works very well out of the box with any kind of Design Tokens formats, like Figma Tokens, as well as APIs to adjust to more custom ones.
// - It is probably the most well-known and widely used Design Tokens tool. It has also been regularly maintained for a long time.
// - It can easily scale to different necessities we might have in the future.
(async () => {
  const {
    generateShadowValue,
    generateFontSizeValue,
    generateFontFamilyValue,
    generateTypographyOutput,
    generateValue,
    generateColorUtilityClasses,
    generateSpaceUtilityClasses,
    removeConsecutiveRepeatedWords,
    setPrefixValue
  } = require('./utils.js');

  const StyleDictionary = (await import('style-dictionary')).default;
  // Set the prefix for variables and classes
  const variablesPrefix = setPrefixValue('ion')

  // Register a custom file header
  StyleDictionary.registerFileHeader({
      name: 'custom-header',
      fileHeader: async (defaultMessages = []) => {
        return [...defaultMessages, 'Do not edit directly, this file was auto-generated.'];
      },
  });

  // SCSS variables format
  StyleDictionary.registerFormat({
    name: 'scssVariablesFormat',
    format: async function({ dictionary, file}) {

      console.log('Generating SCSS variables...');

        //setVariablePrefix(options.platforms.css.prefix);
        const typographyProperties = dictionary.allTokens.filter((prop) => prop['$type'] === 'typography');
        const otherProperties = dictionary.allTokens.filter((prop) => prop['$type'] !== 'typography');

        // Make sure the reused scss variables are defined first, to avoid compilation errors
        const sortedProperties = [...otherProperties, ...typographyProperties];

        const prefixedVariables = sortedProperties.map((prop) => {
        // Remove consecutive repeated words from the token name, like border-border-color
        const propName = removeConsecutiveRepeatedWords(prop.name);

        if (prop.attributes.category.startsWith('elevation')) {
            const cssShadow = prop.$value.map(generateShadowValue).join(', ');
            return `$${variablesPrefix}-${propName}: var(--${variablesPrefix}-${propName}, ${cssShadow});`;
        } else if (prop.$type === 'fontFamilies') {
            return generateFontFamilyValue(prop, propName, 'scss');
        } else if (prop.$type === 'fontSizes') {
            return generateFontSizeValue(prop, propName, 'scss');
        } else if (prop.$type === 'typography') {
            return generateTypographyOutput(prop, propName, true);
        } else {
            return generateValue(prop, propName);
        }
        });

        const fileHeader = await file.options.fileHeader();
              
        return [
        `/*\n${fileHeader.join('\n')}\n*/`,
        '@use "../themes/functions.sizes" as font;\n',
        prefixedVariables.join('\n') + '\n',
        ].join('\n');
    },
  });

  // Create utility-classes
  StyleDictionary.registerFormat({
    name: 'cssUtilityClassesFormat',
    format: async function({ dictionary, file})  {

        console.log('Generating Utility-Classes...');
        
        // Arrays to store specific utility classes
        const typographyUtilityClasses = [];
        const otherUtilityClasses = [];

        // Generate utility classes for each token
        dictionary.allTokens.map((prop) => {
            const tokenType = prop.attributes.category;
            // Remove consecutive repeated words from the token name, like border-border-color
            const propName = removeConsecutiveRepeatedWords(prop.name);
            
            // Typography tokens are handled differently, as each might have a different tokenType
            if (prop['$type'] === 'typography') {
                return typographyUtilityClasses.push(generateTypographyOutput(prop, propName, false));
                // Generate utility classes for border-radius tokens, as they have their own token json file, based on primitive tokens
            } else if(tokenType.startsWith('round') || tokenType.startsWith('rectangular') || tokenType.startsWith('soft')) {
                return otherUtilityClasses.push(`.${variablesPrefix}-${propName} {\n  border-radius: $ionic-${propName};\n}`);

                /*
                * Not creating for the tokens below, as they make no sense to exist as utility-classes.
                * Font-family should be defined on global scope, not component.
                * Scale its an abstract token group, to be used by other tokens, like the space ones.
                * And backdrop is a token that is targeted to a specific type of element.
                */
            } else if (prop.$type === 'fontFamilies' || tokenType === 'scale' || tokenType === 'backdrop') {
                return;
            }

            let utilityClass = '';

            switch (tokenType) {
                case 'color':
                case 'primitives':
                case 'semantics':
                case 'text':
                case 'bg':
                case 'icon':
                case 'state':
                  utilityClass = generateColorUtilityClasses(prop, propName);
                break;
                case 'border-size':
                  utilityClass = `.${variablesPrefix}-${propName} {\n  border-width: $ionic-${propName};\n}`;
                break;
                case 'font':
                  utilityClass = `.${variablesPrefix}-${propName} {\n  ${prop.attributes.type}: $ionic-${propName};\n}`;
                break;
                case 'space':
                  utilityClass = generateSpaceUtilityClasses(prop, propName);
                break;
                case 'shadow':
                case 'elevation':
                  utilityClass = `.${variablesPrefix}-${propName} {\n  box-shadow: $ionic-${propName};\n}`;
                break;
                default:
                  utilityClass = `.${variablesPrefix}-${propName} {\n  ${tokenType}: $ionic-${propName};\n}`;
            }

            return otherUtilityClasses.push(utilityClass);
        });

        // Concatenate typography utility classes at the beginning
        const finalOutput = typographyUtilityClasses.concat(otherUtilityClasses).join('\n');

        const fileHeader = await file.options.fileHeader();
              
        return [
        `/*\n${fileHeader.join('\n')}\n*/`,
        '@import "./ionic.vars";\n@import "../themes/mixins";\n',
        finalOutput,
        ].join('\n');
    },
  });

})();

// APPLY THE CONFIGURATION
module.exports = {
  source: ["node_modules/outsystems-design-tokens/tokens/**/*.json"],
  platforms: {
    scss: {
        transformGroup: "scss",
        buildPath: './src/foundations/',
        files: [
          {
              destination: "ionic.vars.scss",
              format: "scssVariablesFormat",
              options: {
                  fileHeader: `custom-header`,
                },
          },
          {
              destination: "ionic.utility.scss",
              format: "cssUtilityClassesFormat",
              options: {
                  fileHeader: `custom-header`
              }
          }
          ]
    }
  }
};