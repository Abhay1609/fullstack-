const { override, addResolveFallback } = require('customize-cra');
const path = require('path');

module.exports = override(
  addResolveFallback({
    "crypto": require.resolve("crypto-browserify")
  })
);
