import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CustomText from './CustomText';
import CustomFaintThinGreyLine from './CustomFaintThinGreyLine';
import CustomStatsInfoBox from './CustomStatsInfoBox';
import CustomFullWidthContainer from './CustomFullWidthContainer';

import Colors from '../constants/Colors';
import CustomRowSpace from '../components/CustomRowSpace';

const CustomNonVerHoursDetails = (props) => {
  const { nonver, editSessionHandler, deleteCardHandler } = props;

  return (
    <CustomFullWidthContainer>
      <CustomRowSpace>
        <CustomStatsInfoBox style={{ marginVertical: 5 }}>
          <Pressable onLongPress={() => editSessionHandler(nonver)}>
            <CustomText>Session Name: {nonver.sessionName}</CustomText>
            <CustomText>Date: {nonver.date}</CustomText>
            <CustomText>Hours: {nonver.hours}</CustomText>
          </Pressable>
        </CustomStatsInfoBox>
        <Pressable
          style={{ alignSelf: 'center' }}
          onPress={() => deleteCardHandler(nonver)}
        >
          <Ionicons name="trash-outline" size={24} color={Colors.darkGrey} />
        </Pressable>
      </CustomRowSpace>
      <CustomFaintThinGreyLine />
    </CustomFullWidthContainer>
  );
};

export default CustomNonVerHoursDetails;
