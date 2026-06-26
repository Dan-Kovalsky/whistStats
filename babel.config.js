module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // react-native-worklets/plugin powers react-native-reanimated v4 (used by
  // react-native-ui-lib). It MUST be listed last.
  plugins: ['react-native-worklets/plugin'],
};
