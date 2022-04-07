import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import CustomSubtitle from './CustomSubtitle';
import Colors from '../constants/Colors';
import delayButton from '../utils/delayButton';

const CustomErrorCard = (props) => {
  const { error, toShow } = props;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <CustomSubtitle style={{ alignSelf: 'center' }}>
          An error has occurred!
        </CustomSubtitle>
        <Text style={styles.text}>{error}</Text>
        <CustomButton
          style={{ marginTop: 15 }}
          onSelect={() => delayButton(toShow, '', 100)}
        >
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
    width: '88%',
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
    padding: 22,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginVertical: 10,
    fontFamily: 'avenir-medium',
  },
});

export default CustomErrorCard;
