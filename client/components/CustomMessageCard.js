import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import Colors from '../constants/Colors';

const CustomMessageCard = (props) => {
  const { text, toShow } = props;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.text}>{text}</Text>
        <CustomButton style={{ marginTop: 15 }} onSelect={() => toShow('')}>
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
    height: 200,
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
    padding: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontFamily: 'sans-serif-condensed',
  },
});

export default CustomMessageCard;
