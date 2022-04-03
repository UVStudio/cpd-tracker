import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomButton from './CustomButton';
import CustomText from './CustomText';
import CustomSubtitle from './CustomSubtitle';
import CustomBoldText from './CustomBoldText';
import CustomAnimatedPie from './CustomAnimatedPie';

import Colors from '../constants/Colors';
import delayButton from '../utils/delayButton';

const CustomPieMessageCard = (props) => {
  const { text, toShow, required, progress, type, year } = props;
  const navigation = useNavigation();

  const toStats = async () => {
    try {
      delayButton(toShow, '', 100);
      //navigation.navigate('Your CPD Statistics');
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
        <CustomBoldText style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
          {text}
        </CustomBoldText>
        <CustomText style={{ marginBottom: 10 }}>
          Great job! You are one step closer from meeting your annual CPD
          requirements! You now have earned {progress} {type} hours for {year}.
          You still have {required - progress} hours to go.
        </CustomText>
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
