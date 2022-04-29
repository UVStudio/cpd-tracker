import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';

import CustomRedButton from './CustomRedButton';
import Colors from '../constants/Colors';
import CustomButton from './CustomButton';
import delayButton from '../utils/delayButton';

const CustomRedCard = (props) => {
  const { text, toShow, toPassError } = props;

  const dispatch = useDispatch();

  const deleteUserHandler = async () => {
    // setTimeout(() => {
    //   toShow('');
    // }, 400);
    toShow(''); //avoid the 'Can't perform a React state update on an unmounted component'
    try {
      await dispatch(authActions.deleteCurrentUser());
    } catch (err) {
      console.log(err.message);
      toPassError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.text}>{text}</Text>
        <CustomButton onSelect={() => delayButton(toShow, '', 400)}>
          Nevermind!
        </CustomButton>
        <CustomRedButton
          style={{ marginTop: 15 }}
          onSelect={() => deleteUserHandler()}
        >
          YES. DELETE MY ACCOUNT.
        </CustomRedButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '86%',
    backgroundColor: '#fff',
    opacity: 1,
    borderWidth: 5,
    borderRadius: 10,
    borderColor: Colors.red,
    //iOS shadow
    shadowColor: '#171717',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    //android shadow
    elevation: 10,
    shadowColor: '#000000',
  },
  innerContainer: {
    width: '100%',
    padding: 20,
    marginBottom: 5,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'avenir-medium',
  },
});

export default CustomRedCard;
