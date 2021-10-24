const currentYear = Number(
  //new Date(Date.now()).toLocaleDateString().split('/').pop() //local
  new Date(Date.now()).toLocaleDateString().split('/').pop() //remote server
);

module.exports = { currentYear };
