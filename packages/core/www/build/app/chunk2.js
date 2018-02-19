/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

/**
 * Create the mode and color classes for the component based on the classes passed in
 */
function createThemedClasses(mode, color, classes) {
    const classObj = {};
    return classes.split(' ')
        .reduce((classObj, classString) => {
        classObj[classString] = true;
        if (mode) {
            classObj[`${classString}-${mode}`] = true;
            if (color) {
                classObj[`${classString}-${color}`] = true;
                classObj[`${classString}-${mode}-${color}`] = true;
            }
        }
        return classObj;
    }, classObj);
}
/**
 * Get the classes from a class list and return them as an object
 */
function getElementClassMap(classList) {
    const classObj = {};
    for (let i = 0; i < classList.length; i++) {
        classObj[classList[i]] = true;
    }
    return classObj;
}
/**
 * Get the classes based on the button type
 * e.g. alert-button, action-sheet-button
 */
function getButtonClassMap(buttonType, mode) {
    if (!buttonType) {
        return {};
    }
    return {
        [buttonType]: true,
        [`${buttonType}-${mode}`]: true
    };
}
function getClassMap(classes) {
    const map = {};
    if (classes) {
        classes
            .split(' ')
            .filter(c => c.trim() !== '')
            .forEach(c => map[c] = true);
    }
    return map;
}

export { createThemedClasses, getClassMap, getButtonClassMap, getElementClassMap };
