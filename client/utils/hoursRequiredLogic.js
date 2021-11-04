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

  const novaScotiaLogic = () => {
    if (cpdYear >= 2021) {
      return 120;
    }
  };

  const novaScotiaEthicsLogic = () => {
    if (cpdYear >= 2021) {
      return 4;
    }
  };

  const lastYearDB = hours[hours.length - 1].year;
  //const catchUpYears = currentYear - lastYearDB;

  let totalRollingCPDHoursRequired,
    totalRollingEthicsRequired,
    totalRollingVerRequired;
  let currentYearNeedCPDHours,
    currentYearNeedVerHours,
    currentYearNeedEthicsHours;
  let pastVerHours = 0;
  let pastNonVerHours = 0;
  let pastEthicsHours = 0;
  let NBVarCarriedOverPotential = 0;
  let NBNonVarCarriedOverPotential = 0;

  //if CPD Year is more than 2 years ago, 3 year rolling applies universally
  if (cpdYear < lastYearDB) {
    totalRollingCPDHoursRequired = 120;
    totalRollingVerRequired = totalRollingCPDHoursRequired / 2;
    totalRollingEthicsRequired = 4;

    for (let i = 1; i < hours.length; i++) {
      pastVerHours = pastVerHours + hours[i].verifiable;
      pastNonVerHours = pastNonVerHours + hours[i].nonVerifiable;
      pastEthicsHours = pastEthicsHours + hours[i].ethics;
    }

    currentYearNeedCPDHours =
      totalRollingCPDHoursRequired - (pastVerHours + pastNonVerHours);
    currentYearNeedVerHours = totalRollingVerRequired - pastVerHours;
    currentYearNeedEthicsHours = totalRollingEthicsRequired - pastEthicsHours;

    if (currentYearNeedCPDHours < 20) {
      currentYearNeedCPDHours = 20;
    }
    if (currentYearNeedVerHours < 10) {
      currentYearNeedVerHours = 10;
    }
    if (currentYearNeedEthicsHours < 0) {
      currentYearNeedEthicsHours = 0;
    }

    //New Brunswick carried over calculation
    if (province === 'New Brunswick') {
      if (hours[1].verifiable > 20) {
        NBVarCarriedOverPotential = hours[1].verifiable - 20;
        NBNonVarCarriedOverPotential = hours[1].nonVerifiable - 20;
        if (NBVarCarriedOverPotential > 40) {
          NBVarCarriedOverPotential = 40;
        }
        if (NBNonVarCarriedOverPotential > 40) {
          NBNonVarCarriedOverPotential = 40;
        }
      }
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
      case 'Yukon':
        totalRollingCPDHoursRequired = 120; //3 year rolling requirement fully applies
        totalRollingEthicsRequired = 4;
        break;
      case 'Nova Scotia':
        totalRollingCPDHoursRequired = novaScotiaLogic();
        totalRollingEthicsRequired = novaScotiaEthicsLogic();
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
    if (currentYearNeedCPDHours < 20) {
      currentYearNeedCPDHours = 20;
    }
    if (currentYearNeedVerHours < 10) {
      currentYearNeedVerHours = 10;
    }
    if (currentYearNeedEthicsHours < 0) {
      currentYearNeedEthicsHours = 1;
    }

    //New Brunswick carried over calculation
    if (province === 'New Brunswick') {
      if (hours[1].verifiable > 20) {
        NBVarCarriedOverPotential = hours[1].verifiable - 20;
        NBNonVarCarriedOverPotential = hours[1].nonVerifiable - 20;
        if (NBVarCarriedOverPotential > 40) {
          NBVarCarriedOverPotential = 40;
        }
        if (NBNonVarCarriedOverPotential > 40) {
          NBNonVarCarriedOverPotential = 40;
        }
      }
    }
  }

  //if CPD Year is 1 year ago, total CPD required is 20 as the 3 year rolling requirement is not applicable
  if (hours.length === 2 && cpdYear === hours[1].year) {
    //3 year rolling requirement does not apply, but the app should recommend doing more
    //instead of the minimum of 10/20
    totalRollingCPDHoursRequired = 20;
    totalRollingVerRequired = totalRollingCPDHoursRequired / 2;
    totalRollingEthicsRequired = 1;

    currentYearNeedCPDHours = 20;
    currentYearNeedVerHours = 10;
    currentYearNeedEthicsHours = 1;

    //New Brunswick carried over calculation
    if (province === 'New Brunswick') {
      if (hours[1].verifiable > 20) {
        NBVarCarriedOverPotential = hours[1].verifiable - 20;
        NBNonVarCarriedOverPotential = hours[1].nonVerifiable - 20;
        if (NBVarCarriedOverPotential > 40) {
          NBVarCarriedOverPotential = 40;
        }
        if (NBNonVarCarriedOverPotential > 40) {
          NBNonVarCarriedOverPotential = 40;
        }
      }
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
      case 'Nova Scotia': //new non-exempt rule started in 2021, so NS belongs to this category
      case 'Yukon':
        totalRollingCPDHoursRequired = 20; //3 year rolling requirement fully applies
        totalRollingEthicsRequired = 1;
        break;
      case 'Ontario':
        totalRollingCPDHoursRequired = ontarioProration() === 120 ? 20 : 0;
        totalRollingEthicsRequired = 1;
        break;
      case 'Prince Edward Island':
        totalRollingCPDHoursRequired = proration();
        totalRollingEthicsRequired = 1;
        break;
    }
    totalRollingVerRequired =
      totalRollingCPDHoursRequired > 0 ? totalRollingCPDHoursRequired / 2 : 0;

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
    NBVarCarriedOverPotential,
    NBNonVarCarriedOverPotential,
  };
};

export { hoursRequiredLogic };
