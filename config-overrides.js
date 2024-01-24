const { override } = require('customize-cra');

const handleFallback = () => (config) => {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    path: require.resolve("path-browserify"),
    url: require.resolve("url"),
    zlib: require.resolve("browserify-zlib"),
  });
  config.resolve.fallback = fallback;
  return config;
};
module.exports = override(handleFallback());
