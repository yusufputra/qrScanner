/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

import {Frame} from 'react-native-vision-camera';
import {
  BarcodeFormat,
  DetectionOptions,
  DetectionResult,
} from 'vision-camera-plugin-zxing';

AppRegistry.registerComponent(appName, () => App);

export declare function detectBarcodes(
  frame: Frame,
  formats: BarcodeFormat[],
  options?: DetectionOptions,
): DetectionResult | null;

export type {Frame, DetectionOptions, DetectionResult, BarcodeFormat};
