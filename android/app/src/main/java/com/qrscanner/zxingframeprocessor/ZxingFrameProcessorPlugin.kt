package com.qrscanner.zxingframeprocessor

import androidx.camera.core.ImageProxy
import com.facebook.react.bridge.WritableNativeArray
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin

class ZxingFrameProcessorPlugin: FrameProcessorPlugin("qrDecode") {
  override fun callback(image: ImageProxy, params: Array<Any>): Any? {
    // code goes here
    var array = WritableNativeArray()
    return array
  }
}