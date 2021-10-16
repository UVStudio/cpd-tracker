import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';
import currentYear from '../../utils/currentYear';

import CustomText from '../../components/CustomText';
import CustomTitle from '../../components/CustomTitle';
import CustomSubtitle from '../../components/CustomSubtitle';
import CustomAccordionUnit from '../../components/CustomAccordionUnit';
import CustomStatsDivider from '../../components/CustomStatsDivider';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomProgressBar from '../../components/CustomProgressBar';
import CustomScreenContainer from '../../components/CustomScreenContainer';

const Stats = () => {
  const user = useSelector((state) => state.auth.user);
  // const authState = useSelector((state) => state.auth);
  // console.log('authState: ', authState);
  const userHours = user.hours;

  const [showYear, setShowYear] = useState(currentYear);

  return (
    <CustomScreenContainer>
      <CustomTitle>Statistics Overview</CustomTitle>
      <CustomGreyLine />
      {userHours.map((elem, index) => (
        <CustomAccordionUnit key={index}>
          <Pressable onPress={() => setShowYear(userHours[index].year)}>
            <CustomSubtitle>{elem.year}</CustomSubtitle>
          </Pressable>
          <CustomThinGreyLine />
          {showYear === elem.year ? (
            <CustomStatsInfoBox>
              <CustomStatsDivider>
                <CustomText>Verifiable Hours: {elem.verifiable}</CustomText>
                <CustomProgressBar
                  progress={elem.verifiable}
                  type="verifiable"
                />
              </CustomStatsDivider>
              <CustomStatsDivider>
                <CustomText>
                  Non-Verifiable Hours: {elem.nonVerifiable}
                </CustomText>
                <CustomProgressBar
                  progress={elem.nonVerifiable}
                  type="nonVerifiable"
                />
              </CustomStatsDivider>
              <CustomStatsDivider>
                <CustomText>Ethics Hours: {elem.ethics}</CustomText>
              </CustomStatsDivider>
            </CustomStatsInfoBox>
          ) : null}
        </CustomAccordionUnit>
      ))}
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({});

export default Stats;
