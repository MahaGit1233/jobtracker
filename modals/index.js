const Companies = require("./Companies");
const ForgotPassword = require("./ForgotPassword");
const JobApplication = require("./JobApplication");
const Profile = require("./Profile");
const Users = require("./Users");

Users.hasMany(ForgotPassword);
ForgotPassword.belongsTo(Users);

Users.hasMany(JobApplication);
JobApplication.belongsTo(Users);

Users.hasMany(Companies);
Companies.belongsTo(Users);

Users.hasOne(Profile);
Profile.belongsTo(Users);

module.exports = {
  Users,
  ForgotPassword,
  JobApplication,
  Companies,
  Profile,
};
