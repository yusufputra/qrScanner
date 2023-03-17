package com.qrscanner.zxingframeprocessor;

import android.util.Log;

import androidx.camera.core.ImageProxy;

import java.nio.ByteBuffer;
import java.util.Map;
import java.util.EnumMap;

import com.facebook.react.bridge.WritableNativeArray;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.Result;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.RGBLuminanceSource;
import android.graphics.Bitmap;
import android.media.Image;
import android.graphics.YuvImage;
import android.graphics.ImageFormat;
import java.io.ByteArrayOutputStream;
import android.graphics.Rect;
import android.graphics.BitmapFactory;
import com.google.zxing.multi.GenericMultipleBarcodeReader;
import com.google.zxing.multi.MultipleBarcodeReader;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.DecodeHintType;

import java.util.ArrayList;
import java.util.List;

public class ZxingFrameProcessorPlugin extends FrameProcessorPlugin {
  private MultiFormatReader reader;
  private MultipleBarcodeReader mReader;
  private Bitmap toBitmap(Image image) {
    Image.Plane[] planes = image.getPlanes();
    ByteBuffer yBuffer = planes[0].getBuffer();
    ByteBuffer uBuffer = planes[1].getBuffer();
    ByteBuffer vBuffer = planes[2].getBuffer();

    int ySize = yBuffer.remaining();
    int uSize = uBuffer.remaining();
    int vSize = vBuffer.remaining();

    byte[] nv21 = new byte[ySize + uSize + vSize];
    //U and V are swapped
    yBuffer.get(nv21, 0, ySize);
    vBuffer.get(nv21, ySize, vSize);
    uBuffer.get(nv21, ySize + vSize, uSize);

    YuvImage yuvImage = new YuvImage(nv21, ImageFormat.NV21, image.getWidth(), image.getHeight(), null);
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    yuvImage.compressToJpeg(new Rect(0, 0, yuvImage.getWidth(), yuvImage.getHeight()), 75, out);

    byte[] imageBytes = out.toByteArray();
    return BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
  }

  @Override
  public Object callback(ImageProxy image, Object[] params) {
    Image images = image.getImage();
    Bitmap bitmap = toBitmap(images);
    int width = bitmap.getWidth();
    int height = bitmap.getHeight();
    int[] pixels = new int[width * height];
    bitmap.getPixels(pixels, 0, width, 0, 0, width, height);
    Result[] results = null;
    try {
        results = mReader.decodeMultiple(new BinaryBitmap(new HybridBinarizer(new RGBLuminanceSource(width, height, pixels))));
    } catch (Exception e) {
        e.printStackTrace();
    }
    WritableNativeArray resultArray = new WritableNativeArray();
    if (results != null) {
        for (Result result : results) {
            WritableNativeArray resultData = new WritableNativeArray();
            resultData.pushString(result.getBarcodeFormat().toString());
            resultData.pushString(result.getText());

            resultArray.pushArray(resultData);
        }
    }
    return resultArray;
  }
  private static Map<DecodeHintType, Object> getHints() {
    Map<DecodeHintType, Object> hints = new EnumMap<>(DecodeHintType.class);
    List<BarcodeFormat> formats = new ArrayList<>();
    formats.add(BarcodeFormat.QR_CODE);
    formats.add(BarcodeFormat.CODE_39);
    formats.add(BarcodeFormat.CODE_128);
    hints.put(DecodeHintType.POSSIBLE_FORMATS, formats);
    hints.put(DecodeHintType.TRY_HARDER, Boolean.TRUE);
    hints.put(DecodeHintType.CHARACTER_SET, "UTF-8");
    return hints;
}
  public ZxingFrameProcessorPlugin() {
    super("detectBarcodes");
    reader = new MultiFormatReader();
    reader.setHints(getHints());
    mReader = new GenericMultipleBarcodeReader(reader);
  }
}