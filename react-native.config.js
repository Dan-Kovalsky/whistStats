/**
 * uilib-native ships three Android ReactPackages, but React Native's
 * gradle-based autolinking (RN 0.76+) only generates the import/FQN for the
 * first package listed in a dependency's `packageInstance`, leaving the other
 * two unqualified and unimported — which breaks the generated PackageList.java.
 *
 * We override the dependency config so every package instance is written with
 * its fully-qualified class name (no imports required beyond the first).
 */
module.exports = {
  dependencies: {
    'uilib-native': {
      platforms: {
        android: {
          // The autolinker derives a package prefix from `packageImportPath` and
          // prepends it to ONLY the first instance below — so the first stays
          // unqualified (it gets the prefix) while the rest must be fully qualified.
          packageImportPath:
            'import com.wix.reactnativeuilib.dynamicfont.DynamicFontPackage;',
          packageInstance: [
            'new DynamicFontPackage()',
            '      new com.wix.reactnativeuilib.highlighterview.HighlighterViewPackage()',
            '      new com.wix.reactnativeuilib.keyboardinput.KeyboardInputPackage(getApplication())',
          ].join(',\n'),
        },
      },
    },
  },
};
