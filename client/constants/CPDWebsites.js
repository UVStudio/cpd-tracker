import React from 'react';
import { Text, Linking } from 'react-native';
import { provinceObjs } from './Provinces';

const url = (province, website) => {
  return (
    <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(website)}>
      CPA {province} - CPD Information
    </Text>
  );
};

const cpdWebsites = (province) => {
  for (const key in provinceObjs) {
    const prov = provinceObjs[key];
    if (prov.name === province) {
      return url(province, prov.url);
    }
  }
};

export default cpdWebsites;
