require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./utils/db-connection");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

require("./cron/notifications");

const registerRouter = require("./routes/registerRouter");
const jobApplicationRouter = require("./routes/jobApplicationRouter");
const profileRouter = require("./routes/profileRouter");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", { stream: accessLogStream }));

const userModal = require("./modals/Users");
const forgotPasswordModal = require("./modals/ForgotPassword");
const indexModal = require("./modals/index");
const JobApplicationModal = require("./modals/JobApplication");
const companiesModal = require("./modals/Companies");
const profileModal = require("./modals/Profile");

// app.get("/", (req, res) => {
//   res.send("<h1>Welcome to Job Application Tracker</h1>");
// });

app.use("/register", registerRouter);
app.use("/application", jobApplicationRouter);
app.use("/profile", profileRouter);

app.use(express.static(path.join(__dirname, "build")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

db.sync({ force: true })
  .then(() => {
    app.listen(4002, () => {
      console.log("Server is Running on http://localhost:4002");
    });
  })
  .catch((err) => {
    console.log(err);
  });
