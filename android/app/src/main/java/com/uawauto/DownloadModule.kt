package com.uawauto.uaw

import android.content.ContentValues
import android.content.Context
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.Base64
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import java.io.File
import java.io.FileOutputStream
import java.io.OutputStream

class DownloadModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "DownloadModule" // This is what you'll import in JS
    }

    @ReactMethod
    fun savePdfToDownloads(base64Data: String, fileName: String, promise: Promise) {
        try {
            val pdfBytes = Base64.decode(base64Data, Base64.DEFAULT)

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // Android 10+ -> Use MediaStore
                val values = ContentValues().apply {
                    put(MediaStore.Downloads.DISPLAY_NAME, fileName)
                    put(MediaStore.Downloads.MIME_TYPE, "application/pdf")
                    put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                }

                val uri: Uri? = reactContext.contentResolver.insert(
                    MediaStore.Downloads.EXTERNAL_CONTENT_URI,
                    values
                )

                uri?.let {
                    reactContext.contentResolver.openOutputStream(it).use { outputStream ->
                        outputStream?.write(pdfBytes)
                        outputStream?.flush()
                    }
                    promise.resolve("Saved to Downloads folder")
                } ?: promise.reject("ERR", "Failed to create file in Downloads")
            } else {
                // Android 9 and below -> Direct file write
                val downloadsPath = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                val file = File(downloadsPath, fileName)
                FileOutputStream(file).use { outputStream ->
                    outputStream.write(pdfBytes)
                    outputStream.flush()
                }
                promise.resolve("Saved to: ${file.absolutePath}")
            }
        } catch (e: Exception) {
            promise.reject("ERR", e.message, e)
        }
    }
}
