const currentYear = Number(
  new Date(Date.now()).toLocaleDateString().split('/').pop()
);

module.exports = { currentYear };
