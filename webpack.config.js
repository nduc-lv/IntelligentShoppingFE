const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.devServer = {
    ...config.devServer,
    hot: true, // Enable Hot Module Replacement
  };
  return config;
};
