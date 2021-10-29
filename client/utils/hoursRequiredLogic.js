import currentYear from './currentYear';

const hoursRequiredLogic = (user) => {
  const { hours, province, cpdYear, cpdMonth } = user;

  const lastYearDB = hours[hours.length - 1].year;
  const catchUpYears = currentYear - lastYearDB;

  let totalRollingCPDHoursRequired;
  let totalRollingEthicsRequired;
  let totalRollingVerRequired;
  let pastVerHours = 0;
  let pastNonVerHours = 0;
  let pastEthicsHours = 0;

  //if CPD Year is more than 2 years ago, 3 year rolling applies
  if (cpdYear < lastYearDB) {
    totalRollingCPDHoursRequired = 120;
    totalRollingEthicsRequired = 4;
    totalRollingVerRequired = 120 / 2;

    for (let i = 1; i < hours.length; i++) {
      pastVerHours = pastVerHours + hours[i].verifiable;
      pastNonVerHours = pastNonVerHours + hours[i].nonVerifiable;
      pastEthicsHours = pastEthicsHours + hours[i].ethics;
    }

    let currentYearNeedCPDHours =
      totalRollingCPDHoursRequired - (pastVerHours + pastNonVerHours);
    let currentYearNeedVerHours = totalRollingVerRequired - pastVerHours;
    let currentYearNeedEthicsHours =
      totalRollingEthicsRequired - pastEthicsHours;

    return {
      currentYearNeedVerHours,
      currentYearNeedCPDHours,
      currentYearNeedEthicsHours,
      totalRollingVerRequired,
      totalRollingCPDHoursRequired,
      totalRollingEthicsRequired,
    };
  }

  //if CPD Year is 2 years ago, 3 year rolling requirement is province dependent
  if (cpdYear === lastYearDB) {
    const proration = () => {
      return Math.round((12 - (cpdMonth - 1) / 12) * 40); //month of CPA joined counts for CPA requirement
    };
    switch (province) {
      case 'Alberta':
      case 'Northwest Territories / Nunavut':
        totalRollingCPDHoursRequired === 20; //3 year rolling requirement does not apply
        break;
      case 'British Columbia':
      case 'Manitoba':
      case 'New Brunswick':
      case 'Saskatchewan':
      case 'Nova Scotia':
      case 'Yukon':
        totalRollingCPDHoursRequired === 120; //3 year rolling requirement fully applies
        break;
      case 'Prince Edward Island':
        totalRollingCPDHoursRequired === proration();
    }
  }
};

export { hoursRequiredLogic };
