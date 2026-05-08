const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to the database is created successfully");
  } catch (error) {
    console.log(error);
  }
})();

module.exports = sequelize;
