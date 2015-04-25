/* Ported from Velocity.js, MIT License. Julian Shapiro http://twitter.com/shapiro */

import {Collide} from 'ionic/collide/collide'

const data = Collide.data;


/*****************
    CSS Stack
*****************/

/* The CSS object is a highly condensed and performant CSS stack that fully replaces jQuery's.
   It handles the validation, getting, and setting of both standard CSS properties and CSS property hooks. */
/* Note: A 'CSS' shorthand is aliased so that our code is easier to read. */
export var CSS = {


  /*************
      CSS RegEx
  *************/

  RegEx: {
    isHex: /^#([A-f\d]{3}){1,2}$/i,

    /* Unwrap a property value's surrounding text, e.g. 'rgba(4, 3, 2, 1)' ==> '4, 3, 2, 1' and 'rect(4px 3px 2px 1px)' ==> '4px 3px 2px 1px'. */
    valueUnwrap: /^[A-z]+\((.*)\)$/i,

    wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,

    /* Split a multi-value property into an array of subvalues, e.g. 'rgba(4, 3, 2, 1) 4px 3px 2px 1px' ==> [ 'rgba(4, 3, 2, 1)', '4px', '3px', '2px', '1px' ]. */
    valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/ig
  },


  /************
      CSS Lists
  ************/

  Lists: {
    colors: [ 'fill', 'stroke', 'stopColor', 'color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'outlineColor' ],
    transformsBase: [ 'translateX', 'translateY', 'scale', 'scaleX', 'scaleY', 'skewX', 'skewY', 'rotateZ' ],
    transforms3D: [ 'transformPerspective', 'translateZ', 'scaleZ', 'rotateX', 'rotateY' ]
  },


  /************
      CSS Hooks
  ************/

  /* Hooks allow a subproperty (e.g. 'boxShadowBlur') of a compound-value CSS property
     (e.g. 'boxShadow: X Y Blur Spread Color') to be animated as if it were a discrete property. */
  /* Note: Beyond enabling fine-grained property animation, hooking is necessary since Collide only
     tweens properties with single numeric values; unlike CSS transitions, Collide does not interpolate compound-values. */
  Hooks: {

    /********************
        CSS Hook Registration
    ********************/

    /* Templates are a concise way of indicating which subproperties must be individually registered for each compound-value CSS property. */
    /* Each template consists of the compound-value's base name, its constituent subproperty names, and those subproperties' default values. */
    templates: {
      textShadow: [ 'Color X Y Blur', 'black 0px 0px 0px' ],
      boxShadow: [ 'Color X Y Blur Spread', 'black 0px 0px 0px 0px' ],
      clip: [ 'Top Right Bottom Left', '0px 0px 0px 0px' ],
      backgroundPosition: [ 'X Y', '0% 0%' ],
      transformOrigin: [ 'X Y Z', '50% 50% 0px' ],
      perspectiveOrigin: [ 'X Y', '50% 50%' ]
    },

    /* A 'registered' hook is one that has been converted from its template form into a live,
       tweenable property. It contains data to associate it with its root property. */
    registered: {
      /* Note: A registered hook looks like this ==> textShadowBlur: [ 'textShadow', 3 ],
         which consists of the subproperty's name, the associated root property's name,
         and the subproperty's position in the root's value. */
    },

    /* Convert the templates into individual hooks then append them to the registered object above. */
    register: function() {
      /* Color hooks registration: Colors are defaulted to white -- as opposed to black -- since colors that are
         currently set to 'transparent' default to their respective template below when color-animated,
         and white is typically a closer match to transparent than black is. An exception is made for text ('color'),
         which is almost always set closer to black than white. */
      for (var i = 0; i < CSS.Lists.colors.length; i++) {
        var rgbComponents = (CSS.Lists.colors[i] === 'color') ? '0 0 0 1' : '255 255 255 1';
        CSS.Hooks.templates[CSS.Lists.colors[i]] = [ 'Red Green Blue Alpha', rgbComponents ];
      }

      var rootProperty,
          hookTemplate,
          hookNames;

      /* In IE, color values inside compound-value properties are positioned at the end the value instead of at the beginning.
         Thus, we re-arrange the templates accordingly. */
      // if (IE) {
      //     for (rootProperty in CSS.Hooks.templates) {
      //         hookTemplate = CSS.Hooks.templates[rootProperty];
      //         hookNames = hookTemplate[0].split(' ');

      //         var defaultValues = hookTemplate[1].match(CSS.RegEx.valueSplit);

      //         if (hookNames[0] === 'Color') {
      //             // Reposition both the hook's name and its default value to the end of their respective strings.
      //             hookNames.push(hookNames.shift());
      //             defaultValues.push(defaultValues.shift());

      //             // Replace the existing template for the hook's root property.
      //             CSS.Hooks.templates[rootProperty] = [ hookNames.join(' '), defaultValues.join(' ') ];
      //         }
      //     }
      // }

      /* Hook registration. */
      for (rootProperty in CSS.Hooks.templates) {
        hookTemplate = CSS.Hooks.templates[rootProperty];
        hookNames = hookTemplate[0].split(' ');

        for (var i in hookNames) {
          var fullHookName = rootProperty + hookNames[i],
              hookPosition = i;

          /* For each hook, register its full name (e.g. textShadowBlur) with its root property (e.g. textShadow)
             and the hook's position in its template's default value string. */
          CSS.Hooks.registered[fullHookName] = [ rootProperty, hookPosition ];
        }
      }
    },


    /*****************************
       CSS Hook Injection and Extraction
    *****************************/

    /* Look up the root property associated with the hook (e.g. return 'textShadow' for 'textShadowBlur'). */
    /* Since a hook cannot be set directly (the browser won't recognize it), style updating for hooks is routed through the hook's root property. */
    getRoot: function(property) {
      var hookData = CSS.Hooks.registered[property];

      if (hookData) {
        return hookData[0];
      }

      /* If there was no hook match, return the property name untouched. */
      return property;
    },

    /* Convert any rootPropertyValue, null or otherwise, into a space-delimited list of hook values so that
       the targeted hook can be injected or extracted at its standard position. */
    cleanRootPropertyValue: function(rootProperty, rootPropertyValue) {
      /* If the rootPropertyValue is wrapped with 'rgb()', 'clip()', etc., remove the wrapping to normalize the value before manipulation. */
      if (CSS.RegEx.valueUnwrap.test(rootPropertyValue)) {
        rootPropertyValue = rootPropertyValue.match(CSS.RegEx.valueUnwrap)[1];
      }

      /* If rootPropertyValue is a CSS null-value (from which there's inherently no hook value to extract),
         default to the root's default value as defined in CSS.Hooks.templates. */
      /* Note: CSS null-values include 'none', 'auto', and 'transparent'. They must be converted into their
         zero-values (e.g. textShadow: 'none' ==> textShadow: '0px 0px 0px black') for hook manipulation to proceed. */
      if (CSS.Values.isCSSNullValue(rootPropertyValue)) {
        rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
      }

      return rootPropertyValue;
    },

    /* Extracted the hook's value from its root property's value. This is used to get the starting value of an animating hook. */
    extractValue: function(fullHookName, rootPropertyValue) {
      var hookData = CSS.Hooks.registered[fullHookName];

      if (hookData) {
        var hookRoot = hookData[0],
            hookPosition = hookData[1];

        rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

        /* Split rootPropertyValue into its constituent hook values then grab the desired hook at its standard position. */
        return rootPropertyValue.toString().match(CSS.RegEx.valueSplit)[hookPosition];
      }

      /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
      return rootPropertyValue;
    },

    /* Inject the hook's value into its root property's value. This is used to piece back together the root property
       once Collide has updated one of its individually hooked values through tweening. */
    injectValue: function(fullHookName, hookValue, rootPropertyValue) {
      var hookData = CSS.Hooks.registered[fullHookName];

      if (hookData) {
        var hookRoot = hookData[0],
            hookPosition = hookData[1],
            rootPropertyValueParts,
            rootPropertyValueUpdated;

        rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

        /* Split rootPropertyValue into its individual hook values, replace the targeted value with hookValue,
           then reconstruct the rootPropertyValue string. */
        rootPropertyValueParts = rootPropertyValue.toString().match(CSS.RegEx.valueSplit);
        rootPropertyValueParts[hookPosition] = hookValue;
        rootPropertyValueUpdated = rootPropertyValueParts.join(' ');

        return rootPropertyValueUpdated;
      }

      /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
      return rootPropertyValue;
    }
  },


  /*******************
     CSS Normalizations
  *******************/

  /* Normalizations standardize CSS property manipulation by pollyfilling browser-specific implementations (e.g. opacity)
     and reformatting special properties (e.g. clip, rgba) to look like standard ones. */
  Normalizations: {

    /* Normalizations are passed a normalization target (either the property's name, its extracted value, or its injected value),
       the targeted element (which may need to be queried), and the targeted property value. */
    registered: {
        clip: function(type, element, propertyValue) {
          switch (type) {

            case 'name':
              return 'clip';

            /* Clip needs to be unwrapped and stripped of its commas during extraction. */
            case 'extract':
              var extracted;

              /* If Collide also extracted this value, skip extraction. */
              if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                extracted = propertyValue;

              } else {
                /* Remove the 'rect()' wrapper. */
                extracted = propertyValue.toString().match(CSS.RegEx.valueUnwrap);

                /* Strip off commas. */
                extracted = extracted ? extracted[1].replace(/,(\s+)?/g, ' ') : propertyValue;
              }

              return extracted;

            /* Clip needs to be re-wrapped during injection. */
            case 'inject':
              return 'rect(' + propertyValue + ')';
          }
        },

        blur: function(type, element, propertyValue) {
          switch (type) {

            case 'name':
              return '-webkit-filter';

            case 'extract':
              var extracted = parseFloat(propertyValue);

              /* If extracted is NaN, meaning the value isn't already extracted. */
              if (!(extracted || extracted === 0)) {
                var blurComponent = propertyValue.toString().match(/blur\(([0-9]+[A-z]+)\)/i);

                /* If the filter string had a blur component, return just the blur value and unit type. */
                if (blurComponent) {
                  extracted = blurComponent[1];

                /* If the component doesn't exist, default blur to 0. */
                } else {
                  extracted = 0;
                }
              }

              return extracted;

            /* Blur needs to be re-wrapped during injection. */
            case 'inject':
              /* For the blur effect to be fully de-applied, it needs to be set to 'none' instead of 0. */
              if (!parseFloat(propertyValue)) {
                return 'none';
              }

              return 'blur(' + propertyValue + ')';
          }
        },

        opacity: function(type, element, propertyValue) {
          switch (type) {
            case 'name':
              return 'opacity';

            case 'extract':
              return propertyValue;

            case 'inject':
              return propertyValue;
          }
        }
      },


      /*****************************
          CSS Batched Registrations
      *****************************/

      /* Note: Batched normalizations extend the CSS.Normalizations.registered object. */
      register: function() {

        /*****************
            CSS Batched Registration Transforms
        *****************/

        /* Transforms are the subproperties contained by the CSS 'transform' property. Transforms must undergo normalization
           so that they can be referenced in a properties map by their individual names. */
        /* Note: When transforms are 'set', they are actually assigned to a per-element transformCache. When all transform
           setting is complete complete, CSS.flushTransformCache() must be manually called to flush the values to the DOM.
           Transform setting is batched in this way to improve performance: the transform style only needs to be updated
           once when multiple transform subproperties are being animated simultaneously. */

        for (var i = 0; i < CSS.Lists.transformsBase.length; i++) {
          /* Wrap the dynamically generated normalization function in a new scope so that transformName's value is
          paired with its respective function. (Otherwise, all functions would take the final for loop's transformName.) */
          (function() {
            var transformName = CSS.Lists.transformsBase[i];

            CSS.Normalizations.registered[transformName] = function(type, element, propertyValue) {
              var eleData = data(element);

              switch (type) {

                /* The normalized property name is the parent 'transform' property -- the property that is actually set in CSS. */
                case 'name':
                  return 'transform';

                /* Transform values are cached onto a per-element transformCache object. */
                case 'extract':
                  /* If this transform has yet to be assigned a value, return its null value. */
                  if (eleData === undefined || eleData.transformCache[transformName] === undefined) {
                    /* Scale CSS.Lists.transformsBase default to 1 whereas all other transform properties default to 0. */
                    return /^scale/i.test(transformName) ? 1 : 0;
                  }
                  /* When transform values are set, they are wrapped in parentheses as per the CSS spec.
                     Thus, when extracting their values (for tween calculations), we strip off the parentheses. */
                  return eleData.transformCache[transformName].replace(/[()]/g, '');

                case 'inject':
                  var invalid = false;

                  /* If an individual transform property contains an unsupported unit type, the browser ignores the *entire* transform property.
                     Thus, protect users from themselves by skipping setting for transform values supplied with invalid unit types. */
                  /* Switch on the base transform type; ignore the axis by removing the last letter from the transform's name. */
                  switch (transformName.substr(0, transformName.length - 1)) {
                    /* Whitelist unit types for each transform. */
                    case 'translate':
                      invalid = !/(%|px|em|rem|vw|vh|\d)$/i.test(propertyValue);
                      break;

                    /* Since an axis-free 'scale' property is supported as well, a little hack is used here to detect it by chopping off its last letter. */
                    case 'scal':
                    case 'scale':
                      invalid = !/(\d)$/i.test(propertyValue);
                      break;

                    case 'skew':
                      invalid = !/(deg|\d)$/i.test(propertyValue);
                      break;

                    case 'rotate':
                      invalid = !/(deg|\d)$/i.test(propertyValue);
                      break;
                  }

                  if (!invalid) {
                    /* As per the CSS spec, wrap the value in parentheses. */
                    eleData.transformCache[transformName] = '(' + propertyValue + ')';
                  }

                  /* Although the value is set on the transformCache object, return the newly-updated value for the calling code to process as normal. */
                  return eleData.transformCache[transformName];
              }
            };
          })();
        }

        /*************
            CSS Batched Registration Colors
        *************/

        /* Since Collide only animates a single numeric value per property, color animation is achieved by hooking the individual RGBA components of CSS color properties.
           Accordingly, color values must be normalized (e.g. '#ff0000', 'red', and 'rgb(255, 0, 0)' ==> '255 0 0 1') so that their components can be injected/extracted by CSS.Hooks logic. */
        for (var i = 0; i < CSS.Lists.colors.length; i++) {
          /* Wrap the dynamically generated normalization function in a new scope so that colorName's value is paired with its respective function.
             (Otherwise, all functions would take the final for loop's colorName.) */
          (function() {
            var colorName = CSS.Lists.colors[i];

            /* Note: In IE<=8, which support rgb but not rgba, color properties are reverted to rgb by stripping off the alpha component. */
            CSS.Normalizations.registered[colorName] = function(type, element, propertyValue) {
              switch (type) {

                case 'name':
                  return colorName;

                /* Convert all color values into the rgb format. (Old IE can return hex values and color names instead of rgb/rgba.) */
                case 'extract':
                  var extracted;

                  /* If the color is already in its hookable form (e.g. '255 255 255 1') due to having been previously extracted, skip extraction. */
                  if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                    extracted = propertyValue;

                  } else {
                    var converted,
                        colorNames = {
                            black: 'rgb(0, 0, 0)',
                            blue: 'rgb(0, 0, 255)',
                            gray: 'rgb(128, 128, 128)',
                            green: 'rgb(0, 128, 0)',
                            red: 'rgb(255, 0, 0)',
                            white: 'rgb(255, 255, 255)'
                        };

                    /* Convert color names to rgb. */
                    if (/^[A-z]+$/i.test(propertyValue)) {
                      if (colorNames[propertyValue] !== undefined) {
                        converted = colorNames[propertyValue]

                      } else {
                        /* If an unmatched color name is provided, default to black. */
                        converted = colorNames.black;
                      }

                    /* Convert hex values to rgb. */
                    } else if (CSS.RegEx.isHex.test(propertyValue)) {
                      converted = 'rgb(' + CSS.Values.hexToRgb(propertyValue).join(' ') + ')';

                    /* If the provided color doesn't match any of the accepted color formats, default to black. */
                    } else if (!(/^rgba?\(/i.test(propertyValue))) {
                      converted = colorNames.black;
                    }

                    /* Remove the surrounding 'rgb/rgba()' string then replace commas with spaces and strip
                       repeated spaces (in case the value included spaces to begin with). */
                    extracted = (converted || propertyValue).toString().match(CSS.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, ' ');
                  }

                  /* add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                  if (extracted.split(' ').length === 3) {
                    extracted += ' 1';
                  }

                  return extracted;

              case 'inject':
                /* add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                if (propertyValue.split(' ').length === 3) {
                  propertyValue += ' 1';
                }

                /* Re-insert the browser-appropriate wrapper('rgb/rgba()'), insert commas, and strip off decimal units
                   on all values but the fourth (R, G, and B only accept whole numbers). */
                return 'rgba(' + propertyValue.replace(/\s+/g, ',').replace(/\.(\d)+(?=,)/g, '') + ')';
            }
          };
        })();
      }
    }
  },


  /************************
     CSS Property Names
  ************************/

  Names: {
    /* Camelcase a property name into its JavaScript notation (e.g. 'background-color' ==> 'backgroundColor').
       Camelcasing is used to normalize property names between and across calls. */
    camelCase: function(property) {
      return property.replace(/-(\w)/g, function(match, subMatch) {
        return subMatch.toUpperCase();
      });
    },

    /* For SVG elements, some properties (namely, dimensional ones) are GET/SET via the element's HTML attributes (instead of via CSS styles). */
    SVGAttribute: function(property) {
      return new RegExp('^(width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2)$', 'i').test(property);
    },

    /* Determine whether a property should be set with a vendor prefix. */
    /* If a prefixed version of the property exists, return it. Otherwise, return the original property name.
       If the property is not at all supported by the browser, return a false flag. */
    prefixCheck: function(property) {
      /* If this property has already been checked, return the cached value. */
      if (CSS.Names.prefixMatches[property]) {
        return [ CSS.Names.prefixMatches[property], true ];

      } else {
        for (var i = 0, vendorsLength = vendorPrefixes.length; i < vendorsLength; i++) {
          var propertyPrefixed;

          if (i === 0) {
            propertyPrefixed = property;

          } else {
            /* Capitalize the first letter of the property to conform to JavaScript vendor prefix notation (e.g. webkitFilter). */
            propertyPrefixed = vendorPrefixes[i] + property.replace(/^\w/, function(match) { return match.toUpperCase(); });
          }

          /* Check if the browser supports this property as prefixed. */
          if (typeof Collide.State.prefixElement.style[propertyPrefixed] === 'string') {
            /* Cache the match. */
            CSS.Names.prefixMatches[property] = propertyPrefixed;

            return [ propertyPrefixed, true ];
          }
        }

        /* If the browser doesn't support this property in any form, include a false flag so that the caller can decide how to proceed. */
        return [ property, false ];
      }
    },

    /* cached property name prefixes */
    prefixMatches: {}
  },


  /************************
     CSS Property Values
  ************************/

  Values: {
    /* Hex to RGB conversion. Copyright Tim Down: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
    hexToRgb: function(hex) {
      var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
          longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
          rgbParts;

      hex = hex.replace(shortformRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });

      rgbParts = longformRegex.exec(hex);

      return rgbParts ? [ parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16) ] : [ 0, 0, 0 ];
    },

    isCSSNullValue: function(value) {
      /* The browser defaults CSS values that have not been set to either 0 or one of several possible null-value strings.
         Thus, we check for both falsiness and these special strings. */
      /* Null-value checking is performed to default the special strings to 0 (for the sake of tweening) or their hook
         templates as defined as CSS.Hooks (for the sake of hook injection/extraction). */
      /* Note: Chrome returns 'rgba(0, 0, 0, 0)' for an undefined color whereas IE returns 'transparent'. */
      return (value == 0 || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value));
    },

    /* Retrieve a property's default unit type. Used for assigning a unit type when one is not supplied by the user. */
    getUnitType: function(property) {
      if (/^(rotate|skew)/i.test(property)) {
        return 'deg';

      } else if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
        /* The above properties are unitless. */
        return '';
      }

      /* Default to px for all other properties. */
      return 'px';
    },

    /* HTML elements default to an associated display type when they're not set to display:none. */
    /* Note: This function is used for correctly setting the non-'none' display value in certain Collide redirects, such as fadeIn/Out. */
    getDisplayType: function(element) {
      var tagName = element && element.tagName && element.tagName.toString().toLowerCase();

      if (/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/.test(tagName)) {
        return 'inline';

      } else if (/^(li)$/.test(tagName)) {
        return 'list-item';

      } else if (/^(tr)$/.test(tagName)) {
        return 'table-row';

      } else if (/^(table)$/.test(tagName)) {
        return 'table';

      } else if (/^(tbody)$/.test(tagName)) {
        return 'table-row-group';
      }

      /* Default to 'block' when no match is found. */
      return 'block';
    }

  },


  /****************************
     CSS Style Getting & Setting
  ****************************/

  /* The singular getPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
  getPropertyValue: function(element, property, rootPropertyValue, forceStyleLookup) {

    /* Get an element's computed property value. */
    /* Note: Retrieving the value of a CSS property cannot simply be performed by checking an element's
       style attribute (which only reflects user-defined values). Instead, the browser must be queried for a property's
       *computed* value. You can read more about getComputedStyle here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
    function computePropertyValue (element, property) {
      /* When box-sizing isn't set to border-box, height and width style values are incorrectly computed when an
         element's scrollbars are visible (which expands the element's dimensions). Thus, we defer to the more accurate
         offsetHeight/Width property, which includes the total dimensions for interior, border, padding, and scrollbar.
         We subtract border and padding to get the sum of interior + scrollbar. */
      var computedValue = 0;

      /* Browsers do not return height and width values for elements that are set to display:'none'. Thus, we temporarily
         toggle display to the element type's default value. */
      var toggleDisplay = false;

      if (/^(width|height)$/.test(property) && CSS.getPropertyValue(element, 'display') === 0) {
        toggleDisplay = true;
        CSS.setPropertyValue(element, 'display', CSS.Values.getDisplayType(element));
      }

      function revertDisplay () {
        if (toggleDisplay) {
          CSS.setPropertyValue(element, 'display', 'none');
        }
      }

      if (!forceStyleLookup) {
        if (property === 'height' && CSS.getPropertyValue(element, 'boxSizing').toString().toLowerCase() !== 'border-box') {
          var contentBoxHeight = element.offsetHeight - (parseFloat(CSS.getPropertyValue(element, 'borderTopWidth')) || 0) - (parseFloat(CSS.getPropertyValue(element, 'borderBottomWidth')) || 0) - (parseFloat(CSS.getPropertyValue(element, 'paddingTop')) || 0) - (parseFloat(CSS.getPropertyValue(element, 'paddingBottom')) || 0);
          revertDisplay();

          return contentBoxHeight;

        } else if (property === 'width' && CSS.getPropertyValue(element, 'boxSizing').toString().toLowerCase() !== 'border-box') {
          var contentBoxWidth = element.offsetWidth - (parseFloat(CSS.getPropertyValue(element, 'borderLeftWidth')) || 0) - (parseFloat(CSS.getPropertyValue(element, 'borderRightWidth')) || 0) - (parseFloat(CSS.getPropertyValue(element, 'paddingLeft')) || 0) - (parseFloat(CSS.getPropertyValue(element, 'paddingRight')) || 0);
          revertDisplay();

          return contentBoxWidth;
        }
      }

      var computedStyle;
      var eleData = data(element);

      /* For elements that Collide hasn't been called on directly (e.g. when Collide queries the DOM on behalf
         of a parent of an element its animating), perform a direct getComputedStyle lookup since the object isn't cached. */
      if (eleData === undefined) {
        computedStyle = window.getComputedStyle(element, null); /* GET */

      /* If the computedStyle object has yet to be cached, do so now. */
      } else if (!eleData.computedStyle) {
        computedStyle = eleData.computedStyle = window.getComputedStyle(element, null); /* GET */

      /* If computedStyle is cached, use it. */
      } else {
        computedStyle = eleData.computedStyle;
      }

      /* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
         Also, in all browsers, when border colors aren't all the same, a compound value is returned that isn't setup to parse.
         So, as a polyfill for querying individual border side colors, we just return the top border's color and animate all borders from that value. */
      if (property === 'borderColor') {
        property = 'borderTopColor';
      }

      computedValue = computedStyle[property];

      /* Fall back to the property's style value (if defined) when computedValue returns nothing,
         which can happen when the element hasn't been painted. */
      if (computedValue === '' || computedValue === null) {
        computedValue = element.style[property];
      }

      revertDisplay();

      /* For top, right, bottom, and left (TRBL) values that are set to 'auto' on elements of 'fixed' or 'absolute' position,
         defer to jQuery for converting 'auto' to a numeric value. (For elements with a 'static' or 'relative' position, 'auto' has the same
         effect as being set to 0, so no conversion is necessary.) */
      /* An example of why numeric conversion is necessary: When an element with 'position:absolute' has an untouched 'left'
         property, which reverts to 'auto', left's value is 0 relative to its parent element, but is often non-zero relative
         to its *containing* (not parent) element, which is the nearest 'position:relative' ancestor or the viewport (and always the viewport in the case of 'position:fixed'). */
      if (computedValue === 'auto' && /^(top|right|bottom|left)$/i.test(property)) {
        var position = computePropertyValue(element, 'position'); /* GET */

        /* For absolute positioning, jQuery's $.position() only returns values for top and left;
           right and bottom will have their 'auto' value reverted to 0. */
        /* Note: A jQuery object must be created here since jQuery doesn't have a low-level alias for $.position().
           Not a big deal since we're currently in a GET batch anyway. */
        if (position === 'fixed' || (position === 'absolute' && /top|left/i.test(property))) {
          /* Note: jQuery strips the pixel unit from its returned values; we re-add it here to conform with computePropertyValue's behavior. */
          // TODO!!!!
          computedValue = $(element).position()[property] + 'px'; /* GET */
        }
      }

      return computedValue;
    }

    var propertyValue;

    /* If this is a hooked property (e.g. 'clipLeft' instead of the root property of 'clip'),
       extract the hook's value from a normalized rootPropertyValue using CSS.Hooks.extractValue(). */
    if (CSS.Hooks.registered[property]) {
      var hook = property,
          hookRoot = CSS.Hooks.getRoot(hook);

      /* If a cached rootPropertyValue wasn't passed in (which Collide always attempts to do in order to avoid requerying the DOM),
         query the DOM for the root property's value. */
      if (rootPropertyValue === undefined) {
        /* Since the browser is now being directly queried, use the official post-prefixing property name for this lookup. */
        rootPropertyValue = CSS.getPropertyValue(element, CSS.Names.prefixCheck(hookRoot)[0]); /* GET */
      }

      /* If this root has a normalization registered, peform the associated normalization extraction. */
      if (CSS.Normalizations.registered[hookRoot]) {
        rootPropertyValue = CSS.Normalizations.registered[hookRoot]('extract', element, rootPropertyValue);
      }

      /* Extract the hook's value. */
      propertyValue = CSS.Hooks.extractValue(hook, rootPropertyValue);

    /* If this is a normalized property (e.g. 'opacity' becomes 'filter' in <=IE8) or 'translateX' becomes 'transform'),
       normalize the property's name and value, and handle the special case of transforms. */
    /* Note: Normalizing a property is mutually exclusive from hooking a property since hook-extracted values are strictly
       numerical and therefore do not require normalization extraction. */
    } else if (CSS.Normalizations.registered[property]) {
      var normalizedPropertyName,
          normalizedPropertyValue;

      normalizedPropertyName = CSS.Normalizations.registered[property]('name', element);

      /* Transform values are calculated via normalization extraction (see below), which checks against the element's transformCache.
         At no point do transform GETs ever actually query the DOM; initial stylesheet values are never processed.
         This is because parsing 3D transform matrices is not always accurate and would bloat our codebase;
         thus, normalization extraction defaults initial transform values to their zero-values (e.g. 1 for scaleX and 0 for translateX). */
      if (normalizedPropertyName !== 'transform') {
          normalizedPropertyValue = computePropertyValue(element, CSS.Names.prefixCheck(normalizedPropertyName)[0]); /* GET */

          /* If the value is a CSS null-value and this property has a hook template, use that zero-value template so that hooks can be extracted from it. */
          if (CSS.Values.isCSSNullValue(normalizedPropertyValue) && CSS.Hooks.templates[property]) {
            normalizedPropertyValue = CSS.Hooks.templates[property][1];
          }
      }

      propertyValue = CSS.Normalizations.registered[property]('extract', element, normalizedPropertyValue);
    }

    /* If a (numeric) value wasn't produced via hook extraction or normalization, query the DOM. */
    if (!/^[\d-]/.test(propertyValue)) {
      /* For SVG elements, dimensional properties (which SVGAttribute() detects) are tweened via
         their HTML attribute values instead of their CSS style values. */
      var eleData = data(element);
      if (eleData && eleData.isSVG && CSS.Names.SVGAttribute(property)) {
        /* Since the height/width attribute values must be set manually, they don't reflect computed values.
           Thus, we use use getBBox() to ensure we always get values for elements with undefined height/width attributes. */
        if (/^(height|width)$/i.test(property)) {
          /* Firefox throws an error if .getBBox() is called on an SVG that isn't attached to the DOM. */
          try {
            propertyValue = element.getBBox()[property];
          } catch (error) {
            propertyValue = 0;
          }

        /* Otherwise, access the attribute value directly. */
        } else {
          propertyValue = element.getAttribute(property);
        }

      } else {
        propertyValue = computePropertyValue(element, CSS.Names.prefixCheck(property)[0]); /* GET */
      }
    }

    /* Since property lookups are for animation purposes (which entails computing the numeric delta between start and end values),
       convert CSS null-values to an integer of value 0. */
    if (CSS.Values.isCSSNullValue(propertyValue)) {
      propertyValue = 0;
    }

    return propertyValue;
  },

  /* The singular setPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
  setPropertyValue: function(element, property, propertyValue, rootPropertyValue, scrollData) {
    var propertyName = property;

    /* In order to be subjected to call options and element queueing, scroll animation is routed through Collie as if it were a standard CSS property. */
    if (property === 'scroll') {
      /* If a container option is present, scroll the container instead of the browser window. */
      if (scrollData.container) {
        scrollData.container['scroll' + scrollData.direction] = propertyValue;

      /* Otherwise, Collide defaults to scrolling the browser window. */
      } else {
        if (scrollData.direction === 'Left') {
          window.scrollTo(propertyValue, scrollData.alternateValue);
        } else {
          window.scrollTo(scrollData.alternateValue, propertyValue);
        }
      }

    } else {
      var eleData = data(element);

      /* Transforms (translateX, rotateZ, etc.) are applied to a per-element transformCache object, which is manually flushed via flushTransformCache().
         Thus, for now, we merely cache transforms being SET. */
      if (CSS.Normalizations.registered[property] && CSS.Normalizations.registered[property]('name', element) === 'transform') {
        /* Perform a normalization injection. */
        /* Note: The normalization logic handles the transformCache updating. */
        CSS.Normalizations.registered[property]('inject', element, propertyValue);

        propertyName = 'transform';
        propertyValue = eleData.transformCache[property];

      } else {
        /* Inject hooks. */
        if (CSS.Hooks.registered[property]) {
          var hookName = property,
              hookRoot = CSS.Hooks.getRoot(property);

          /* If a cached rootPropertyValue was not provided, query the DOM for the hookRoot's current value. */
          rootPropertyValue = rootPropertyValue || CSS.getPropertyValue(element, hookRoot); /* GET */

          propertyValue = CSS.Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
          property = hookRoot;
        }

        /* Normalize names and values. */
        if (CSS.Normalizations.registered[property]) {
          propertyValue = CSS.Normalizations.registered[property]('inject', element, propertyValue);
          property = CSS.Normalizations.registered[property]('name', element);
        }

        /* Assign the appropriate vendor prefix before performing an official style update. */
        propertyName = CSS.Names.prefixCheck(property)[0];

        /* SVG elements have their dimensional properties (width, height, x, y, cx, etc.) applied directly as attributes instead of as styles. */

        if (eleData && eleData.isSVG && CSS.Names.SVGAttribute(property)) {
          /* Note: For SVG attributes, vendor-prefixed property names are never used. */
          /* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
          element.setAttribute(property, propertyValue);

        } else {
          element.style[propertyName] = propertyValue;
        }

        //if (Collide.debug >= 2) console.log('Set ' + property + ' (' + propertyName + '): ' + propertyValue);
      }
    }

    /* Return the normalized property name and value in case the caller wants to know how these values were modified before being applied to the DOM. */
    return [ propertyName, propertyValue ];
  },

  /* To increase performance by batching transform updates into a single SET, transforms are not directly applied to an element until flushTransformCache() is called. */
  /* Note: Collide applies transform properties in the same order that they are chronogically introduced to the element's CSS styles. */
  flushTransformCache: function(element) {
    var transformString = '';
    var transformCache = data(element).transformCache;

    var transformValue,
        perspective;

    /* Transform properties are stored as members of the transformCache object. Concatenate all the members into a string. */
    for (var transformName in transformCache) {
      transformValue = transformCache[transformName];

      /* Transform's perspective subproperty must be set first in order to take effect. Store it temporarily. */
      if (transformName === 'transformPerspective') {
        perspective = transformValue;
        return true;
      }

      transformString += transformName + transformValue + ' ';
    }

    /* If present, set the perspective subproperty first. */
    if (perspective) {
      transformString = 'perspective' + perspective + ' ' + transformString;
    }

    CSS.setPropertyValue(element, 'transform', transformString);
  }

};

const vendorPrefixes = [ '', 'Webkit', 'ms' ];
