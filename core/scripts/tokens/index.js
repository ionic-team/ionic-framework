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
    setPrefixValue,
    generateRadiusUtilityClasses,
    generateBorderSizeUtilityClasses,
    generateFontUtilityClasses,
    generateShadowUtilityClasses,
    generateUtilityClasses
  } = require('./utils.js');

  const StyleDictionary = (await import('style-dictionary')).default;
  
  // Set the prefix for variables and classes
  setPrefixValue('ion');

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

        // Separate typography tokens from the rest
        const typographyProperties = dictionary.allTokens.filter((prop) => prop.$type === 'typography');
        const otherProperties = dictionary.allTokens.filter((prop) => prop.$type !== 'typography');

        // Make sure the reused scss variables are defined first, to avoid compilation errors
        const sortedProperties = [...otherProperties, ...typographyProperties];

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
                
            } else if(tokenCategory.startsWith('round') || tokenCategory.startsWith('rectangular') || tokenCategory.startsWith('soft')) {
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
                case 'border-size':
                  utilityClass = generateBorderSizeUtilityClasses(propName);
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
