module.exports = (sequelize, Sequelize) => {
  const Billing = sequelize.define("noise", {
    noise: {
      type: Sequelize.STRING
    }
  });


  return Billing
};
      