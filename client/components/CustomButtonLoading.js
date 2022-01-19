import React from 'react';
import { ActivityIndicator } from 'react-native';

import CustomButton from './CustomButton';

const CustomButtonLoading = (props) => {
  return (
    <CustomButton style={props.style}>
      <ActivityIndicator size="small" color="white" />
    </CustomButton>
  );
};

export default CustomButtonLoading;
