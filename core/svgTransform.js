// This transform is required for svg files to work with Jest
// See https://stackoverflow.com/q/46791263/3802466
module.exports = {
  process() {
    return {
      code: `module.exports = {};`,
    };
  },
  getCacheKey() {
    // The output is always the same.
    return "svgTransform";
  },
};
