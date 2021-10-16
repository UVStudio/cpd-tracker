const secondsToHms = (d) => {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  const hDisplay = h > 0 ? (h < 10 ? '0' + h + ':' : h + ':') : '00:';
  const mDisplay = m > 0 ? (m < 10 ? '0' + m + ':' : m + ':') : '00:';
  const sDisplay = s > 0 ? (s < 10 ? '0' + s : s) : '00';
  return hDisplay + mDisplay + sDisplay;
};

const secondsToTime = (d) => {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  const hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
  const mDisplay = m > 0 ? m + (m == 1 ? ' minute ' : ' minutes ') : '';
  //const sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
  return hDisplay + mDisplay;
};

export { secondsToHms, secondsToTime };
