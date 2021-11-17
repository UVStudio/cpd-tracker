import React from 'react';
import { Text, Linking } from 'react-native';
import CustomText from '../components/CustomText';

const cpdWebsites = (province) => {
  switch (province) {
    case 'Alberta':
      return (
        <Text
          style={{ color: 'blue' }}
          onPress={() =>
            Linking.openURL('https://www.cpaalberta.ca/Members/CPD-Reporting')
          }
        >
          CPA Alberta - CPD Reporting
        </Text>
      );
  }
};

export default cpdWebsites;

const arr = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland & Labrador',
  'Northwest Territories / Nunavut',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Yukon',
];
