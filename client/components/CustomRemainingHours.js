import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

import CustomTextStats from './CustomTextStats';

const CustomRemainingHours = (props) => {
  const {
    currentYearNeedVerHours,
    currentYearNeedCPDHours,
    currentYearNeedEthicsHours,
    verifiable,
    nonVerifiable,
    ethics,
    showYear,
  } = props;

  const remainingVer = currentYearNeedVerHours - verifiable;
  const remainingTotalCPD =
    currentYearNeedCPDHours - verifiable - nonVerifiable;
  const remainingEthics = currentYearNeedEthicsHours - ethics;

  if (remainingVer <= 0 && remainingTotalCPD <= 0 && remainingEthics <= 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomTextStats>
          You have completely satisfied {showYear}'s CPD requirements.
        </CustomTextStats>
      </View>
    );
  }

  if (remainingVer <= 0 && remainingTotalCPD <= 0 && remainingEthics > 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomTextStats>
          You have enough Verifiable hours and your earned total CPD hours is
          same as the required amount, but you still need{' '}
          {remainingEthics.toFixed(1)} Ethics hours to complete {showYear}'s CPD
          requirement.
        </CustomTextStats>
      </View>
    );
  }

  if (remainingVer <= 0 && remainingTotalCPD > 0 && remainingEthics <= 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomTextStats>
          You have satisfied your Ethics and your Verifiable hours requirement
          for {showYear}, but you still need {remainingTotalCPD.toFixed(1)}{' '}
          hours of total CPD hours to satisfy your province's CPD requirement.
        </CustomTextStats>
      </View>
    );
  }

  //dangerous scenario
  if (remainingVer > 0 && remainingTotalCPD <= 0 && remainingEthics <= 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomTextStats>
          You have satisfied your Ethics requirement. While your total CPD hours
          for {showYear} is same as the required amount, you still need to earn
          {remainingVer.toFixed(1)} hours of Verifiable hours to completely
          satisfy your province's CPD requirement.
        </CustomTextStats>
      </View>
    );
  }

  if (remainingVer <= 0 && remainingTotalCPD > 0 && remainingEthics > 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomTextStats>
          You have satisfied the Verifiable hours requirement for {showYear},
          but you still need {remainingEthics.toFixed(1)} Ethics hours. You also
          need to earn {remainingTotalCPD.toFixed(1)} hours of total CPD hours.
        </CustomTextStats>
      </View>
    );
  }

  if (remainingVer > 0 && remainingTotalCPD > 0 && remainingEthics <= 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomTextStats>
          You have satisfied your Ethics requirement for {showYear}, but you
          still need {remainingTotalCPD.toFixed(1)} hours of total CPD hours,
          and {remainingVer.toFixed(1)} of these hours need to be Verifiable
          hours.
        </CustomTextStats>
      </View>
    );
  }

  //dangerous scenario 2
  if (remainingVer > 0 && remainingTotalCPD <= 0 && remainingEthics > 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomTextStats>
          Your amount of total earned CPD hours for {showYear} is same as the
          required amount, but you still need {remainingVer.toFixed(1)}{' '}
          Verifiable hours, and {remainingEthics.toFixed(1)} of these Verifiable
          hours need to be Ethics hours, to completely satisfy your province's
          requirement.
        </CustomTextStats>
      </View>
    );
  }

  if (remainingVer > 0 && remainingTotalCPD > 0 && remainingEthics > 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomTextStats>
          For {showYear}, you still need {remainingTotalCPD.toFixed(1)} hours of
          total CPD hours, {remainingVer.toFixed(1)} of which need to be
          Verifiable. {remainingEthics.toFixed(1)} of these Verifiable hours
          need to be Ethics hours.
        </CustomTextStats>
      </View>
    );
  }

  return (
    <View style={styles.remainingHourscontainer}>
      <CustomTextStats>
        This data is being reflected by retro-actively uploaded sessions. The
        CPD Tracker app cannot calculate your CPD requirements for this
        particular year of {showYear}. It can only sum up how many hours from
        sessions you have uploaded.
      </CustomTextStats>
    </View>
  );
};

const styles = StyleSheet.create({
  remainingHourscontainer: {
    padding: 10,
    borderWidth: 2,
    borderColor: Colors.darkOrange,
  },
});

export default CustomRemainingHours;
