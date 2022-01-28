import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Colors from '../constants/Colors';

const CustomDownloadProgressBar = (props) => {
  const { width } = useWindowDimensions();

  //set total bar width at 75% of screen width
  const barWidth = 0.75 * width;

  const { progress, fileSize } = props;

  const barProgress = () => {
    let progressWidth = (progress / fileSize) * barWidth;
    return progressWidth;
  };

  return (
    <View>
      <View style={{ ...styles.bar, width: barWidth }} />
      <View
        style={{
          ...styles.progress,
          width: barProgress(),
          backgroundColor: Colors.primary,
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

export default CustomDownloadProgressBar;
