import React, { useState } from 'react';
import { LogBox } from 'react-native';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import AppNavigator from './navigation/AppNavigator';
import authReducer from './store/reducers/auth';
import reportReducer from './store/reducers/report';
import certReducer from './store/reducers/cert';
import nonVerReducer from './store/reducers/nonVer';
//import userReducer from './store/reducers/user';

const fetchFonts = () => {
  return Font.loadAsync({
    'avenir-medium': require('./assets/fonts/AvenirNextCondensed-Medium.ttf'),
    'avenir-demibold': require('./assets/fonts/AvenirNextCondensed-DemiBold.ttf'),
    'avenir-bold': require('./assets/fonts/AvenirNextCondensed-Bold.ttf'),
  });
};

const rootReducer = combineReducers({
  auth: authReducer,
  report: reportReducer,
  cert: certReducer,
  nonVer: nonVerReducer,
  //user: userReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const App = () => {
  LogBox.ignoreLogs([
    'Setting a timer',
    'Overwriting fontFamily style attribute preprocessor',
  ]);

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

export default App;
