import currentYear from './currentYear';

const hoursRequiredLogic = (user) => {
  const { hours, province, cpdYear, cpdMonth } = user;

  const proration = () => {
    //Math.round(((12 - (user.cpdMonth - 1)) / 12) * 20)
    const prorated = Math.round(((12 - (cpdMonth - 1)) / 12) * 20); //month of CPA joined counts for CPA requirement
    console.log('prorated: ', prorated);
    return prorated;
  };

  const ontarioProration = () => {
    if (cpdYear >= 2022) {
      if (cpdMonth < 10) {
        return 120;
      }
      return 20;
    } else {
      return 20;
    }
  };

  const ontarioEthicsProration = () => {
    if (cpdYear >= 2022) {
      if (cpdMonth < 10) {
        return 4;
      }
      return 3;
    } else {
      return 3;
    }
  };

  const lastYearDB = hours[hours.length - 1].year;
  const catchUpYears = currentYear - lastYearDB;

  let totalRollingCPDHoursRequired,
    totalRollingEthicsRequired,
    totalRollingVerRequired;
  let currentYearNeedCPDHours,
    currentYearNeedVerHours,
    currentYearNeedEthicsHours;
  let pastVerHours = 0;
  let pastNonVerHours = 0;
  let pastEthicsHours = 0;

  //if CPD Year is more than 2 years ago, 3 year rolling applies
  if (cpdYear < lastYearDB) {
    totalRollingCPDHoursRequired = 120;
    totalRollingEthicsRequired = 4;
    totalRollingVerRequired = totalRollingCPDHoursRequired / 2;

    for (let i = 1; i < hours.length; i++) {
      pastVerHours = pastVerHours + hours[i].verifiable;
      pastNonVerHours = pastNonVerHours + hours[i].nonVerifiable;
      pastEthicsHours = pastEthicsHours + hours[i].ethics;
    }

    currentYearNeedCPDHours =
      totalRollingCPDHoursRequired - (pastVerHours + pastNonVerHours);
    currentYearNeedVerHours = totalRollingVerRequired - pastVerHours;
    currentYearNeedEthicsHours = totalRollingEthicsRequired - pastEthicsHours;

    if (currentYearNeedVerHours < 10) {
      currentYearNeedVerHours = 10;
    }
    if (currentYearNeedCPDHours < 20) {
      currentYearNeedCPDHours = 20;
    }

    if (currentYearNeedEthicsHours < 0) {
      currentYearNeedEthicsHours = 0;
    }
  }

  //if CPD Year is 2 years ago, 3 year rolling requirement is province dependent
  if (cpdYear === lastYearDB) {
    switch (province) {
      case 'Alberta':
      case 'Northwest Territories / Nunavut':
        totalRollingCPDHoursRequired = 40; //3 year rolling requirement does not apply
        totalRollingEthicsRequired = 1;
        break;
      case 'British Columbia':
      case 'Manitoba':
      case 'New Brunswick':
      case 'Saskatchewan':
      case 'Nova Scotia':
      case 'Yukon':
        totalRollingCPDHoursRequired = 120; //3 year rolling requirement fully applies
        totalRollingEthicsRequired = 4;
        break;
      case 'Ontario':
        totalRollingCPDHoursRequired = ontarioProration();
        totalRollingEthicsRequired = ontarioEthicsProration();
        break;
      case 'Prince Edward Island':
        totalRollingCPDHoursRequired = proration() * 2 + 80;
        totalRollingEthicsRequired = 4;
        break;
    }

    totalRollingVerRequired = totalRollingCPDHoursRequired / 2;

    for (let i = 1; i < hours.length; i++) {
      pastVerHours = pastVerHours + hours[i].verifiable;
      pastNonVerHours = pastNonVerHours + hours[i].nonVerifiable;
      pastEthicsHours = pastEthicsHours + hours[i].ethics;
    }

    currentYearNeedCPDHours =
      totalRollingCPDHoursRequired - (pastVerHours + pastNonVerHours);
    currentYearNeedVerHours = totalRollingVerRequired - pastVerHours;
    currentYearNeedEthicsHours = totalRollingEthicsRequired - pastEthicsHours;

    //minimum required is 10/20
    if (currentYearNeedVerHours < 10) {
      currentYearNeedVerHours = 10;
    }
    if (currentYearNeedCPDHours < 20) {
      currentYearNeedCPDHours = 20;
    }
    if (currentYearNeedEthicsHours < 0) {
      currentYearNeedEthicsHours = 1;
    }
  }

  //if CPD Year is 1 year ago, total CPD required is 20 as the 3 year rolling requirement is not applicable
  if (cpdYear === hours[1].year) {
    //3 year rolling requirement does not apply, but the app should recommend doing 20/40 hours
    //instead of the minimum of 10/20
    totalRollingCPDHoursRequired === 40;
    totalRollingEthicsRequired = 1;
    totalRollingVerRequired = totalRollingCPDHoursRequired / 2;

    for (let i = 1; i < hours.length; i++) {
      pastVerHours = pastVerHours + hours[i].verifiable;
      pastNonVerHours = pastNonVerHours + hours[i].nonVerifiable;
      pastEthicsHours = pastEthicsHours + hours[i].ethics;
    }

    currentYearNeedCPDHours =
      totalRollingCPDHoursRequired - (pastVerHours + pastNonVerHours);
    currentYearNeedVerHours = totalRollingVerRequired - pastVerHours;
    currentYearNeedEthicsHours = totalRollingEthicsRequired - pastEthicsHours;

    if (currentYearNeedVerHours < 10) {
      currentYearNeedVerHours = 10;
    }
    if (currentYearNeedCPDHours < 20) {
      currentYearNeedCPDHours = 20;
    }
    if (currentYearNeedEthicsHours < 0) {
      currentYearNeedEthicsHours = 1;
    }
  }

  //if CPD Year is current year
  if (cpdYear === hours[0].year) {
    //3 year rolling requirement does not apply, but the app should recommend doing 20/40 hours,
    switch (province) {
      case 'Alberta':
      case 'Northwest Territories / Nunavut':
        totalRollingCPDHoursRequired = 0; //3 year rolling requirement does not apply
        totalRollingEthicsRequired = 0;
        break;
      case 'British Columbia':
      case 'Manitoba':
      case 'New Brunswick':
      case 'Saskatchewan':
      case 'Nova Scotia':
      case 'Yukon':
        totalRollingCPDHoursRequired = 40; //3 year rolling requirement fully applies
        totalRollingEthicsRequired = 1;
        break;
      case 'Ontario':
        totalRollingCPDHoursRequired = ontarioProration() === 120 ? 40 : 0;
        totalRollingEthicsRequired = 1;
        break;
      case 'Prince Edward Island':
        totalRollingCPDHoursRequired = proration();
        totalRollingEthicsRequired = 1;
        break;
    }
    totalRollingVerRequired =
      totalRollingCPDHoursRequired > 0
        ? Number(totalRollingCPDHoursRequired / 2).toFixed(1)
        : 0;

    currentYearNeedCPDHours = totalRollingCPDHoursRequired;
    currentYearNeedVerHours = totalRollingVerRequired;
    currentYearNeedEthicsHours = totalRollingEthicsRequired;
  }

  return {
    currentYearNeedVerHours,
    currentYearNeedCPDHours,
    currentYearNeedEthicsHours,
    totalRollingVerRequired,
    totalRollingCPDHoursRequired,
    totalRollingEthicsRequired,
    pastVerHours,
    pastNonVerHours,
    pastEthicsHours,
  };
};

export { hoursRequiredLogic };
