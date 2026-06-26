# whistStats

Record results of Whist and view statistics.

> **2026 revival note:** this project was upgraded from React Native **0.59.5** to
> **0.85.2** (React 19, New Architecture / bridgeless). The native `ios/` and
> `android/` folders were regenerated from a fresh RN 0.85.2 scaffold and the
> `src/` JS was ported on top. See the dependency stack below.

## Stack
- react-native 0.85.2 / react 19
- react-native-navigation 8.x (native navigation)
- react-native-ui-lib 9.x (+ uilib-native, reanimated 4, gesture-handler 3, safe-area-context 5)
- remx (state), @react-native-async-storage/async-storage, @sayem314/react-native-keep-awake, lodash

## Prerequisites
- Node >= 22.11
- **npm access:** the registry in `~/.npmrc` points to Wix's internal registry,
  which only resolves on the **Wix VPN**. Connect the VPN before `npm install`
  (public `registry.npmjs.org` is firewall-blocked on the corp network).
- Xcode (for iOS), Android Studio + an emulator (for Android), JDK 17–21.
- **CocoaPods >= 1.13.** The default `pod` on this machine is an old 1.11.0 gem
  shim; use the Homebrew one instead (see below).

## Install
```sh
npm install            # on the Wix VPN
```

## Run — Android
```sh
# start an emulator (e.g. Pixel_9_Pro) or connect a device, then:
npm run android
# or: npx react-native run-android
```

## Run — iOS
```sh
# install pods with a modern CocoaPods (the system 'pod' is too old):
/usr/local/Cellar/cocoapods/1.16.2_1/bin/pod install --project-directory=ios
#   (or `brew link --overwrite cocoapods` once, then plain `pod install` in ios/)
npm run ios
# or open ios/whistStats.xcworkspace in Xcode and Run
```

## Metro
`npm start` runs the Metro bundler.
