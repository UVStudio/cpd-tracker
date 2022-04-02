import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import CustomButton from './CustomButton';
import CustomAnimatedPie from './CustomAnimatedPie';

import * as authActions from '../store/actions/auth';

import Colors from '../constants/Colors';
import delayButton from '../utils/delayButton';

const CustomPieMessageCard = (props) => {
  const { text, toShow, required, progress } = props;

  //const authState = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const toStats = async () => {
    try {
      //await dispatch(authActions.getUser());
      delayButton(toShow, '', 100);
      navigation.navigate('Your CPD Statistics');
    } catch (err) {
      console.log(err.message);
      setError(
        'There is something wrong with our network. Please try again later.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.text}>
          Great job! You are one step closer from meeting your annual CPD
          requirements!
        </Text>
        <CustomAnimatedPie
          required={required}
          progress={progress}
          CPDdetails={null}
        />
        <CustomButton style={{ marginTop: 15 }} onSelect={() => toStats()}>
          Okay
        </CustomButton>
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
    borderColor: Colors.primary,
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

export default CustomPieMessageCard;
