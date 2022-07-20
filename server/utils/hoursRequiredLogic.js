const provinceObjs = require('../constants/Provinces');

const showThreeYearRolling = (province, cpdYear, showYear) => {
  //returns false if user is a recent CPA and 3 year rolling does not apply
  if (cpdYear > showYear - 2) return false;

  // returns true if CPA year is 2 years ago which 3 year rolling applies, except...
  // Alberta and Northwest Territories, where 1st year does not count for 3 year count
  if (cpdYear === showYear - 2) {
    switch (province) {
      case provinceObjs.alberta.name:
      case provinceObjs.nwtNu.name:
        return false;
      default:
        return true;
    }
  }
  //returns true is CPA year is over 2 years ago
  if (cpdYear < showYear - 2) return true;
};

const hoursRequiredLogic = (user, showYear) => {
  const { hours, province, cpdYear, cpdMonth } = user;

  const proration = () => {
    const prorated = Math.round(((12 - (cpdMonth - 1)) / 12) * 20); //month of CPA joined counts for CPA requirement
    return prorated;
  };

  const ontarioProration = () => {
    if (cpdYear >= 2022) {
      if (cpdMonth < 10) {
        return 120;
      }
      return 20;
    } else {
      return 120;
    }
  };

  const ontarioEthicsProration = () => {
    if (cpdYear >= 2022) {
      if (cpdMonth < 10) {
        return 4;
      }
      return 3;
    } else {
      return 4;
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
  if (cpdYear < showYear - 2) {
    totalRollingCPDHoursRequired = 120;
    totalRollingVerRequired = totalRollingCPDHoursRequired / 2;
    totalRollingEthicsRequired = 4;

    //currentYear Requirement
    const index = hours.findIndex((hour) => hour.year === showYear);
    let loopLength = 2;

    if (hours.length - 1 - index < 2) {
      loopLength = hours.length - 1 - index;
    }

    for (let i = index + 1; i <= index + loopLength; i++) {
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

    //showYearReq();

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
  if (cpdYear === showYear - 2) {
    switch (province) {
      case provinceObjs.alberta.name:
      case provinceObjs.nwtNu.name:
        totalRollingCPDHoursRequired = 40; //3 year rolling requirement does not apply
        totalRollingEthicsRequired = 1;
        break;
      case provinceObjs.britishColumbia.name:
      case provinceObjs.manitoba.name:
      case provinceObjs.newBrunswick.name:
      case provinceObjs.newfoundlandLabrador.name:
      case provinceObjs.saskatchewan.name:
      case provinceObjs.yukon.name:
        totalRollingCPDHoursRequired = 120; //3 year rolling requirement fully applies
        totalRollingEthicsRequired = 4;
        break;
      case provinceObjs.novaScotia.name:
        totalRollingCPDHoursRequired = novaScotiaLogic();
        totalRollingEthicsRequired = novaScotiaEthicsLogic();
      case provinceObjs.ontario.name:
        totalRollingCPDHoursRequired = ontarioProration();
        totalRollingEthicsRequired = ontarioEthicsProration();
        break;
      case provinceObjs.pei.name:
      case provinceObjs.quebec.name:
        totalRollingCPDHoursRequired = proration() * 2 + 80;
        totalRollingEthicsRequired = 4;
        break;
    }

    totalRollingVerRequired = totalRollingCPDHoursRequired / 2;

    const index = hours.findIndex((hour) => hour.year === showYear);
    let loopLength = 2;

    if (hours.length - 1 - index < 2) {
      loopLength = hours.length - 1 - index;
    }

    for (let i = index + 1; i <= index + loopLength; i++) {
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
      case provinceObjs.alberta.name:
      case provinceObjs.nwtNu.name:
        totalRollingCPDHoursRequired = 0; //3 year rolling requirement does not apply
        totalRollingEthicsRequired = 0;
        break;
      case provinceObjs.britishColumbia.name:
      case provinceObjs.manitoba.name:
      case provinceObjs.newBrunswick.name:
      case provinceObjs.newfoundlandLabrador.name:
      case provinceObjs.novaScotia.name:
      case provinceObjs.saskatchewan.name:
      case provinceObjs.yukon.name:
        totalRollingCPDHoursRequired = 20; //3 year rolling requirement fully applies
        totalRollingEthicsRequired = 1;
        break;
      case provinceObjs.ontario.name:
        totalRollingCPDHoursRequired = ontarioProration() === 120 ? 20 : 0;
        totalRollingEthicsRequired = 1;
        break;
      case provinceObjs.pei.name:
      case provinceObjs.quebec.name:
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

module.exports = { hoursRequiredLogic, showThreeYearRolling };
