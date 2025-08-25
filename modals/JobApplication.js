const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const JobApplication = sequelize.define("JobApplication", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  jobtitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  joblocation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  lastdate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  remindbeforedays: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  document: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
});

module.exports = JobApplication;
