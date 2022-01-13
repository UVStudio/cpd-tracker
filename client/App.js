import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { LogBox } from 'react-native';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import AppNavigator from './navigation/AppNavigator';
import authReducer from './store/reducers/auth';
import userReducer from './store/reducers/user';
import reportReducer from './store/reducers/report';
import certReducer from './store/reducers/cert';
import nonVerReducer from './store/reducers/nonVer';

const fetchFonts = () => {
  return Font.loadAsync({
    'avenir-medium': require('./assets/fonts/AvenirNextCondensed-Medium.ttf'),
    'avenir-demibold': require('./assets/fonts/AvenirNextCondensed-DemiBold.ttf'),
    'avenir-bold': require('./assets/fonts/AvenirNextCondensed-Bold.ttf'),
    'avenir-light': require('./assets/fonts/AvenirNextCondensed-UltraLight.ttf'),
  });
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  report: reportReducer,
  cert: certReducer,
  nonVer: nonVerReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const App = () => {
  LogBox.ignoreLogs(['Setting a timer']);

  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
        onError={console.warn}
      />
    );
  }

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
