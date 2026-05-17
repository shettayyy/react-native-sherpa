declare const __reanimatedWorkletInit: unknown;

export function checkReanimatedSetup(): void {
  if (!__DEV__) {
    return;
  }

  try {
    if (__reanimatedWorkletInit === undefined) {
      console.error(
        '[Sherpa] react-native-worklets Babel plugin not detected. ' +
          'Add "react-native-worklets/plugin" as the last entry in your ' +
          'babel.config.js plugins array. Without it, animations will not work.'
      );
    }
  } catch {
    // __reanimatedWorkletInit access throws in some bundler environments
    // when the plugin is missing — the error message covers both cases.
  }
}
