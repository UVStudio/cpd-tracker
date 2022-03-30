import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Colors from '../constants/Colors';

const CustomDownloadProgressBar = (props) => {
  const { width } = useWindowDimensions();

  //set total bar width at 75% of screen width
  const barWidth = 0.7 * width;

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
          backgroundColor: Colors.light,
          maxWidth: barWidth,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: 250,
    height: 10,
    backgroundColor: Colors.veryLightGrey,
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 4,
  },
  progress: {
    width: 0,
    height: 8,
    borderRadius: 4,
    marginVertical: 4,
    top: -17,
  },
});

export default CustomDownloadProgressBar;
