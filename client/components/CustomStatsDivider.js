import React from 'react';
import { View } from 'react-native';

const CustomStatsDivider = (props) => {
  return <View style={{ marginVertical: 3 }}>{props.children}</View>;
};

export default CustomStatsDivider;
