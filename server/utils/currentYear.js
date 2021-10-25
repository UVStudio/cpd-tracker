const currentYear = Number(
  new Date(Date.now()).toLocaleDateString().split('/').pop() //local
  //new Date(Date.now()).toLocaleDateString().split('-').shift() //remote server
);

module.exports = { currentYear };
