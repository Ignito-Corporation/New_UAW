import React, { useState } from 'react';
import {
  View,
  Button,
  Alert,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';

import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

const PDFGenerator = ({ htmlContent, fileName = 'MyDocument' }) => {
  const [loading, setLoading] = useState(false);

  const checkAndRequestStoragePermission = async () => {
    if (Platform.OS !== 'android') {
      // iOS doesn't need this permission
      return true;
    }

    // For Android: request WRITE_EXTERNAL_STORAGE permission
    let permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

    const result = await check(permission);
    if (result === RESULTS.GRANTED) {
      return true;
    }

    if (result === RESULTS.DENIED) {
      const reqResult = await request(permission);
      return reqResult === RESULTS.GRANTED;
    }

    if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Blocked',
        'Storage permission is blocked. Please allow it from settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => openSettings() },
        ]
      );
      return false;
    }

    return false;
  };

  const createPDF = async () => {
    const hasPermission = await checkAndRequestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required to save the PDF.');
      return;
    }

    setLoading(true);
    try {
      const options = {
        html: htmlContent,
        fileName,
        directory: 'Documents', // Saves to Documents folder on Android
        base64: false,
        height: 1122,
        width: 794,
      };

      const file = await RNHTMLtoPDF.convert(options);
      const filePath = file.filePath;

      Alert.alert(
        'PDF Generated',
        `Saved to: ${filePath}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'View',
            onPress: async () => {
              try {
                await FileViewer.open(filePath);
              } catch (err) {
                Alert.alert('Error', 'Unable to open PDF');
                console.error('File open error:', err);
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('PDF creation error:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="small" color="#007BFF" />
      ) : (
        <Button title="Generate PDF" onPress={createPDF} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
});

export default PDFGenerator;
