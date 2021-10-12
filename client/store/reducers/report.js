import { REPORT_AVAILABLE, REPORT_NOT_AVAILABLE } from '../types';

const initialState = {
  report: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REPORT_AVAILABLE:
      return {
        report: true,
      };
    case REPORT_NOT_AVAILABLE:
      return {
        report: false,
      };
    default:
      return state;
  }
};
