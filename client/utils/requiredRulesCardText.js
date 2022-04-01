import { showThreeYearRolling } from './hoursRequiredLogic';

const requiredVerRules = (
  province,
  cpdYear,
  showYear,
  pastVerHours,
  totalRollingVerRequired,
  setCardText
) => {
  const remainingVerHours = totalRollingVerRequired - pastVerHours;

  if (showThreeYearRolling(province, cpdYear, showYear)) {
    if (remainingVerHours > 0) {
      setCardText(
        `The annual Verifiable and total CPD hours requirements are calculated based on your hours for the previous 2 years, if the 3-year rolling requirement is applicable for ${showYear}.
  
From the previous 2 years, you have earned a total of ${pastVerHours} verifiable hours, which means you will need to earn ${remainingVerHours} verifiable hours in ${showYear} to satisfy your 3-year rolling Verifiable hours requirement.`
      );
    } else {
      setCardText(
        `The annual Verifiable hours requirements are calculated based on your hours earned for the previous 2 years, if the 3-year rolling requirement is applicable for ${showYear}. You have satisfied your 3-year rolling Verifiable requirements for ${showYear}.`
      );
    }
  } else {
    setCardText(
      'While you are only required to obtain 10 verifiable hours, you are encouraged to earn 20 hours, so you will have an easier time meeting the CPD 3-year rolling requirement in the near future.'
    );
  }
};

const requiredTotalCPDRules = (
  province,
  cpdYear,
  showYear,
  pastVerHours,
  pastNonVerHours,
  totalRollingCPDHoursRequired,
  setCardText
) => {
  const remainingTotalCPDHours =
    totalRollingCPDHoursRequired - pastVerHours - pastNonVerHours;
  const totalEarnedHours = pastNonVerHours + pastVerHours;

  if (showThreeYearRolling(province, cpdYear, showYear)) {
    if (remainingTotalCPDHours > 0) {
      setCardText(`The annual Verifiable and total CPD hours requirements are calculated based on your hours for the previous 2 years, if the 3-year rolling requirement is applicable for ${showYear}.
    
From the previous 2 years, you have earned a total of ${totalEarnedHours} CPD hours, which means you will need to earn ${remainingTotalCPDHours} total CPD hours in ${showYear} to satisfy your total CPD hours requirements.
        `);
    } else {
      setCardText(
        `The annual total CPD hours requirements are calculated based on your hours earned for the previous 2 years. You have satisfied your 3-year rolling total CPD requirements for ${showYear}.`
      );
    }
  } else {
    setCardText(
      'While you are only required to obtain 20 CPD hours this year, you are encouraged to earn 40 hours, so you will have an easier time meeting the CPD 3-year rolling requirement in the near future.'
    );
  }
};

const rollingVerRules = (pastVerHours, setCardText) => {
  const remainingVerHours = 60 - pastVerHours;

  if (remainingVerHours > 0) {
    setCardText(
      `The annual Verifiable and total CPD hours requirements are calculated based on your hours for the previous 2 years, if the 3-year rolling requirement is applicable for ${showYear}.
  
From the previous 2 years, you have earned a total of ${pastVerHours} verifiable hours, which means you will need to earn ${remainingVerHours} verifiable hours in ${showYear} to satisfy your 3-year rolling Verifiable hours requirement.`
    );
  } else {
    setCardText(
      `The annual Verifiable hours requirements are calculated based on your hours earned for the previous 2 years, if the 3-year rolling requirement is applicable for ${showYear}. You have satisfied your 3-year rolling Verifiable requirements for ${showYear}.`
    );
  }
};

export { requiredVerRules, requiredTotalCPDRules };
