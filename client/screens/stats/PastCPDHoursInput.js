import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomTitle from '../../components/CustomTitle';
import CustomText from '../../components/CustomText';
import CustomInput from '../../components/CustomInput';
import CustomRowSpace from '../../components/CustomRowSpace';
import CustomBoldText from '../../components/CustomBoldText';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomScreenContainer from '../../components/CustomScreenContainer';

const PastCPDHoursInput = (props) => {
  const { yearsToOverride } = props.route.params;
  console.log('yearsToOverride: ', yearsToOverride);

  const inputChangeHandler = () => {
    console.log('input change handler');
  };

  return (
    <CustomScreenContainer>
      <CustomTitle>Past CPD Hours Input</CustomTitle>
      <CustomGreyLine />
      <View style={{ alignSelf: 'flex-start', marginBottom: 15 }}>
        <CustomText>Hello, thank you for using CPD Tracker.</CustomText>
      </View>
      {yearsToOverride.length === 1 ? (
        <CustomText>
          In order for the app to function well for you, it needs you to input
          your CPD data for {yearsToOverride[0].year}.
        </CustomText>
      ) : (
        <CustomText>
          In order for the app to function well for you, it needs you to input
          your CPD data for {yearsToOverride[0].year} and{' '}
          {yearsToOverride[1].year}.
        </CustomText>
      )}
      <CustomThinGreyLine style={{ marginVertical: 10 }} />
      {/* {yearsToOverride.map(() => (<View></View>))} */}
      <CustomStatsInfoBox>
        <CustomBoldText style={{ marginBottom: 10 }}>
          Input CPD Hours for {yearsToOverride[0].year}
        </CustomBoldText>

        <View style={{ width: '100%' }}>
          <CustomRowSpace>
            <View style={{ width: '50%' }}>
              <CustomText style={{ top: 5 }}>Verifiable Hours:</CustomText>
            </View>
            <View style={{ width: '40%' }}>
              <CustomInput
                id="verHours"
                keyboardType="numeric"
                autoCapitalize="none"
                onInputChange={inputChangeHandler}
                initialValue=""
                required
                style={styles.textInput}
              />
            </View>
          </CustomRowSpace>
          <CustomRowSpace>
            <View style={{ width: '50%' }}>
              <CustomText style={{ top: 5 }}>Non-Verifiable Hours:</CustomText>
            </View>
            <View style={{ width: '40%' }}>
              <CustomInput
                id="nonVerHours"
                keyboardType="numeric"
                autoCapitalize="none"
                onInputChange={inputChangeHandler}
                initialValue=""
                required
                style={styles.textInput}
              />
            </View>
          </CustomRowSpace>
          <CustomRowSpace>
            <View style={{ width: '50%' }}>
              <CustomText style={{ top: 5 }}>Ethics Hours:</CustomText>
            </View>
            <View style={{ width: '40%' }}>
              <CustomInput
                id="ethicsHours"
                keyboardType="numeric"
                autoCapitalize="none"
                onInputChange={inputChangeHandler}
                initialValue=""
                required
                style={styles.textInput}
              />
            </View>
          </CustomRowSpace>
        </View>
      </CustomStatsInfoBox>
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 22,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    fontSize: 16,
  },
});

export default PastCPDHoursInput;
