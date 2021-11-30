import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CustomText from './CustomText';
import CustomFaintThinGreyLine from './CustomFaintThinGreyLine';
import CustomStatsInfoBox from './CustomStatsInfoBox';
import CustomFullWidthContainer from './CustomFullWidthContainer';

import Colors from '../constants/Colors';
import CustomRowSpace from '../components/CustomRowSpace';

const CustomCertHoursDetails = (props) => {
  const { cert, editCourseHandler, deleteCardHandler } = props;

  return (
    <CustomFullWidthContainer>
      <CustomRowSpace>
        <CustomStatsInfoBox style={{ marginVertical: 5 }}>
          <Pressable onLongPress={() => editCourseHandler(cert)}>
            <CustomText>Course Name: {cert.courseName}</CustomText>
            <CustomText>Hours: {cert.hours}</CustomText>
            <CustomText>Ethics Hours: {cert.ethicsHours}</CustomText>
          </Pressable>
        </CustomStatsInfoBox>
        <Pressable
          style={{ alignSelf: 'center' }}
          onPress={() => deleteCardHandler(cert)}
        >
          <Ionicons
            name="trash-outline"
            size={24}
            color={Colors.darkGrey}
            style={{ alignSelf: 'center' }}
          />
        </Pressable>
      </CustomRowSpace>
      <CustomFaintThinGreyLine />
    </CustomFullWidthContainer>
  );
};

export default CustomCertHoursDetails;
