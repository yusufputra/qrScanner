package com.qrscanner.zxingframeprocessor;

import androidx.camera.core.ImageProxy;
import com.facebook.react.bridge.WritableNativeArray;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.Result;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.RGBLuminanceSource;


public class ZxingFrameProcessorPlugin extends FrameProcessorPlugin {
  private MultiFormatReader mReader = new MultiFormatReader();
  @Override
  public Object callback(ImageProxy image, Object[] params) {
    // Bitmap bitmap = frame.getData();
    Log.i("IMAGE_RESULT", image);
    int width = image.getWidth();
    int height = image.getHeight();
    int[] pixels = new int[width * height];
    // bitmap.getPixels(pixels, 0, width, 0, 0, width, height);

    Result result = null;
    try {
        result = mReader.decode(new BinaryBitmap(new HybridBinarizer(new RGBLuminanceSource(width, height, pixels))));
    } catch (Exception e) {
        e.printStackTrace();
    }
    WritableNativeArray resultArray = new WritableNativeArray();
    if (result != null) {
        WritableNativeArray resultData = new WritableNativeArray();
        resultData.pushString(result.getBarcodeFormat().toString());
        resultData.pushString(result.getText());

        resultArray.pushArray(resultData);

    }
    return resultArray;
    // // code goes here
    // WritableNativeArray array = new WritableNativeArray();
    // return array;
  }

  public ZxingFrameProcessorPlugin() {
    super("detectBarcodes");
  }
}