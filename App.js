import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView
} from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import { appColors } from './src/component/Color';
import Navigation from './src/navigation/Navigation';

class App extends Component {
  render() {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: appColors.secondary }}>
          <StatusBar
            backgroundColor={appColors.secondary}
            barStyle={'dark-content'}
          />
          <FlashMessage position="bottom" floating={true} />
          <Navigation />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}

export default App;
