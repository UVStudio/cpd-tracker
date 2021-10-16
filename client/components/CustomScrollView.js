import React from 'react';
import { View, ScrollView } from 'react-native';

const CustomScrollView = (props) => {
  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={{ alignItems: 'center' }}>{props.children}</View>
    </ScrollView>
  );
};

export default CustomScrollView;
