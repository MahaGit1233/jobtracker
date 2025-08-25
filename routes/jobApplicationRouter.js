const express = require("express");
const router = express.Router();
const jobApplicationController = require("../controllers/jobApplicationController");
const { authenticate } = require("../middleware/auth");

router.post(
  "/jobs/addnewjob",
  authenticate,
  jobApplicationController.addNewJob
);
router.get("/jobs/getjobs", authenticate, jobApplicationController.getJobs);
router.put(
  "/jobs/updatejob/:id",
  authenticate,
  jobApplicationController.updateJob
);
router.delete(
  "/jobs/deletejob/:id",
  authenticate,
  jobApplicationController.deleteJob
);
router.post(
  "/companies/addnewcompany",
  authenticate,
  jobApplicationController.addNewCompany
);
router.get(
  "/companies/getcompanies",
  authenticate,
  jobApplicationController.getCompanies
);
router.put(
  "/companies/updatecompany/:id",
  authenticate,
  jobApplicationController.updateCompany
);
router.delete(
  "/companies/deletecompany/:id",
  authenticate,
  jobApplicationController.deleteCompany
);

module.exports = router;
