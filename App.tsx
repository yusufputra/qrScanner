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
import {decode} from './src/utils/decode';

import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import calculateRotation from './src/utils/calculateRotation';

import getAnswer from './src/utils/answer';

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
    const results = decode(frame);
    console.log(results);
    // runOnJS(setBarcodes)(results);
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
      {barcodes?.map((barcode, idx) => {
        const angle = calculateRotation([
          {x: barcode.x1, y: barcode.y1},
          {x: barcode.x2, y: barcode.y2},
          {x: barcode.x3, y: barcode.y3},
          {x: barcode.x4, y: barcode.y4},
        ]);
        const answer = getAnswer(angle);
        return (
          <Text key={idx} style={styles.barcodeTextURL}>
            {`${barcode.barcodeText} angle ${angle} answer is ${answer}`}
          </Text>
        );
      })}
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
