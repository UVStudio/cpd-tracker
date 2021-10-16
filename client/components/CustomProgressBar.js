import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Colors from '../constants/Colors';

const CustomProgressBar = (props) => {
  const { width } = useWindowDimensions();

  //set total bar width at 75% of screen width
  const barWidth = 0.75 * width;

  //industry rules
  const verifiableHours = 20;
  const nonVerifiableHours = 60;

  const { progress, type } = props;

  const barProgress = () => {
    let progressWidth;
    if (type === 'verifiable') {
      progressWidth = (progress / verifiableHours) * barWidth;
    } else {
      progressWidth = (progress / nonVerifiableHours) * barWidth;
    }
    return progressWidth;
  };

  return (
    <View>
      <View style={{ ...styles.bar, width: barWidth }} />
      <View
        style={{ ...styles.progress, width: barProgress(), maxWidth: barWidth }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: 250,
    height: 5,
    backgroundColor: Colors.lightGrey,
    borderRadius: 2,
    marginVertical: 5,
  },
  progress: {
    width: 0,
    height: 5,
    backgroundColor: Colors.light,
    borderRadius: 2,
    marginVertical: 5,
    top: -15,
  },
});

export default CustomProgressBar;
