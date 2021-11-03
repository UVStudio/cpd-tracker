import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Provinces from '../constants/Provinces';
import Colors from '../constants/Colors';

const CustomProgressBar = (props) => {
  const { width } = useWindowDimensions();

  //set total bar width at 75% of screen width
  const barWidth = 0.75 * width;

  //industry rules; default 20 hours
  // const verifiableHours = 20;
  // const totalCPDHours = 40;

  const { progress, type, hoursRequired } = props;
  //console.log('hours required obj: ', hoursRequired);
  const { currentYearNeedCPDHours, currentYearNeedVerHours } = hoursRequired;

  const barProgress = () => {
    let progressWidth;
    if (type === 'verifiable') {
      progressWidth = (progress / currentYearNeedVerHours) * barWidth;
    } else {
      progressWidth = (progress / currentYearNeedCPDHours) * barWidth;
    }
    return progressWidth;
  };

  const barType = () => {
    let color;
    if (type === 'verifiable') {
      if (progress > currentYearNeedVerHours) {
        color = Colors.brightGreen;
      } else {
        color = Colors.light;
      }
    } else {
      if (progress > currentYearNeedCPDHours) {
        color = Colors.brightGreen;
      } else {
        color = Colors.light;
      }
    }
    return color;
  };

  return (
    <View>
      <View style={{ ...styles.bar, width: barWidth }} />
      <View
        style={{
          ...styles.progress,
          width: barProgress(),
          backgroundColor: barType(),
          maxWidth: barWidth,
        }}
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
    marginVertical: 2,
  },
  progress: {
    width: 0,
    height: 5,
    borderRadius: 2,
    marginVertical: 2,
    top: -9,
  },
});

export default CustomProgressBar;
