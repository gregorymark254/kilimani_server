module.exports = {
  DBHOST: process.env.DBHOST,
  DBUSER: process.env.DBUSER,
  DBPORT : process.env.DBPORT,
  PASSWORD: process.env.PASSWORD,
  DATABASE : process.env.DATABASE,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
