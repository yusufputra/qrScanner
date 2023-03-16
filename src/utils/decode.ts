import type {Frame} from 'react-native-vision-camera';

export function decode(frame: Frame): string[] {
  'worklet';
  // @ts-ignore
  // eslint-disable-next-line no-undef
  return __qrDecode(frame, config);
}
