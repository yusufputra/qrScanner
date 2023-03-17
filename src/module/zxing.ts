import {Frame} from 'react-native-vision-camera';
import {
  BarcodeFormat,
  DetectionOptions,
  DetectionResult,
} from 'vision-camera-plugin-zxing';

export declare function __detectBarcodes(
  frame: Frame,
  formats: BarcodeFormat[],
  options?: DetectionOptions,
): DetectionResult | null;

export function zxingDetectBarcodes(
  frame: Frame,
  formats: BarcodeFormat[],
  options?: DetectionOptions,
): DetectionResult | null {
  'worklet';
  return __detectBarcodes(frame, formats, options);
}
