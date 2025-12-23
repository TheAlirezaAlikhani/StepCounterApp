// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Manual Expo Router configuration for Windows compatibility
config.resolver.sourceExts = config.resolver.sourceExts.concat(['js', 'jsx', 'json', 'ts', 'tsx', 'mjs']);
config.resolver.assetExts = config.resolver.assetExts.filter(ext => !['svg'].includes(ext));
config.watchFolders = config.watchFolders.concat([__dirname]);

module.exports = withNativeWind(config, { input: './global.css' });