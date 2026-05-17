/* eslint-disable unicorn/no-anonymous-default-export */
/* eslint-disable unicorn/prefer-module */
// eslint-disable-next-line unicorn/prefer-node-protocol
const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

module.exports = function (api) {
  api.cache(true);

  return getConfig(
    {
      presets: ['babel-preset-expo'],
    },
    { root, pkg }
  );
};
