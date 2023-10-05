const dbConfig = require("../DB/dbconfig");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DATABASE, dbConfig.DBUSER, dbConfig.PASSWORD, {
  host: dbConfig.DBHOST,
  port: dbConfig.DBPORT,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.noise = require("./noise")(sequelize, Sequelize);

module.exports = db;
