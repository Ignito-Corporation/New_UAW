import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet } from "react-native";
import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";
import { appColors } from "./Color";

const QRScannerModal = ({ isVisible, onClose, onScan, scanType, navigation }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);
  const [isScanned, setIsScanned] = useState(false);
  const device = useCameraDevice("back");

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const requestPermissionAndLockOrientation = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "granted");
      setIsScanned(false);
      setScannedCode(null);
    };

    if (isVisible) {
      requestPermissionAndLockOrientation();
    }
  }, [isVisible]);

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13", "code-128", "code-39", "code-93", "ean-8"],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && !isScanned) {
        const code = codes[0].value;
        setScannedCode(code);
        setIsScanned(true);
        console.log("Scanned Code:", code);
      }
    },
  });

  const handleConfirmScan = () => {
    if (scannedCode) {
      onScan?.(scannedCode);
      onClose();
    }
  };

  const handleClearScan = () => {
    setScannedCode(null);
    setIsScanned(false);
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {hasPermission && device ? (
          <>
            <View style={styles.cameraContainer}>
              <Camera
                device={device}
                isActive={true}
                style={styles.camera}
                codeScanner={codeScanner}
              />
              <View style={styles.scanFrame} />
            </View>

            {scannedCode && (
              <View style={styles.resultContainer}>
                <TouchableOpacity
                  onPress={handleConfirmScan}
                  style={styles.confirmButton}
                >
                  <Text style={styles.confirmButtonText}>
                    Confirm Scan: {scannedCode}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.instructionText}>
                  *Tap on confirm scan button to select barcode
                </Text>
                <TouchableOpacity
                  onPress={handleClearScan}
                  style={styles.clearButton}
                >
                  <Text style={styles.clearButtonText}>Clear Selection</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <ActivityIndicator size="large" appColors={appColors.primary} />
        )}

        <TouchableOpacity
          style={[styles.closeButton, { width: screenWidth }]}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Close Scanner</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.offWhite,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    width: "90%",
    height: "25%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  camera: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  scanFrame: {
    position: "absolute",
    borderColor: appColors.primary,
    borderWidth: 2,

    width: "100%",
    height: "100%",
  },
  resultContainer: {
    width: "95%",
    alignItems: "center",
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: appColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: "95%",
    alignSelf: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  instructionText: {
    color: appColors.error,
    textAlign: "center",
    paddingVertical: 10,
  },
  clearButton: {
    marginTop: 10,
    backgroundappColors: "#e5e5e5",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: "50%",
  },
  clearButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: appColors.primary,
    alignItems: "center",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
  },
  closeButtonText: {
    color: appColors.white,
    fontWeight: "900",
    fontSize: 18,
  },
});

export default QRScannerModal;