import React from 'react';
import { View, StyleSheet } from 'react-native';

const CustomStatsInfoBox = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <View style={{ alignItems: 'flex-start', width: '100%' }}>
        {props.children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
});

export default CustomStatsInfoBox;
