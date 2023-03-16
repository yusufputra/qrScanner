/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {runOnJS} from 'react-native-reanimated';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import calculateRotation from './src/utils/calculateRotation';
import {
  DBRConfig,
  decode,
  TextResult,
  initLicense,
} from 'vision-camera-dynamsoft-barcode-reader';

const getPermission = async () => {
  const cameraPermission = await Camera.getCameraPermissionStatus();
  const microphonePermission = await Camera.getMicrophonePermissionStatus();

  return {
    cameraPermission,
    microphonePermission,
  };
};
const requestPermission = async () => {
  const cameraPermission = await Camera.requestCameraPermission();
  const microphonePermission = await Camera.requestCameraPermission();

  return {
    cameraPermission,
    microphonePermission,
  };
};
const CameraComponent = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [barcodes, setBarcodes] = useState<TextResult[]>();
  useEffect(() => {
    (async () => {
      await initLicense(
        'DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==',
      );
    })();
  }, []);
  useEffect(() => {
    console.log('running');
    getPermission().then(res => {
      if (
        res.cameraPermission === 'denied' ||
        res.cameraPermission === 'not-determined' ||
        res.microphonePermission === 'denied' ||
        res.microphonePermission === 'not-determined'
      ) {
        requestPermission().then(result => {
          setHasPermission(result.cameraPermission === 'authorized');
        });
      }
    });
  }, []);
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const config: DBRConfig = {};
    config.template =
      '{"ImageParameter":{"BarcodeFormatIds":["BF_QR_CODE"],"Description":"","Name":"Settings"},"Version":"3.0"}'; //scan qrcode only

    const results: TextResult[] = decode(frame, config);
    console.log(results);
    runOnJS(setBarcodes)(results);
  }, []);
  const devices = useCameraDevices();
  const device = devices.back;
  if (!device || !hasPermission) {
    return <Text style={styles.highlight}>loading</Text>;
  }
  return (
    <>
      {device && hasPermission && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
        />
      )}
      {barcodes?.map((barcode, idx) => (
        <Text key={idx} style={styles.barcodeTextURL}>
          {`${barcode.barcodeText} angle ${
            barcode &&
            calculateRotation([
              {x: barcode.x1, y: barcode.y1},
              {x: barcode.x2, y: barcode.y2},
              {x: barcode.x3, y: barcode.y3},
              {x: barcode.x4, y: barcode.y4},
            ])
          }`}
        </Text>
      ))}
    </>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          height: '100%',
        }}>
        <CameraComponent />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  barcodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
