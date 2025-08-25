const { Users, Companies } = require("../modals");
const JobApplication = require("../modals/JobApplication");
const sequelize = require("../utils/db-connection");
const Sib = require("sib-api-v3-sdk");

const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

const addNewJob = async (req, res) => {
  try {
    const {
      jobtitle,
      companyname,
      joblocation,
      status,
      notes,
      lastdate,
      remindbeforedays,
      document,
    } = req.body;

    const job = await JobApplication.create({
      jobtitle: jobtitle,
      companyname: companyname,
      joblocation: joblocation,
      status: status,
      notes: notes,
      lastdate: lastdate,
      remindbeforedays: remindbeforedays,
      document: document,
      UserId: req.user.id,
    });

    const user = await Users.findByPk(req.user.id);

    res.status(200).json({ message: "Job added successfully", job });
  } catch (error) {
    console.log("add new job error:", error);
    res.status(500).json({ error: "Unable to add the job" });
  }
};

const getJobs = async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;

  try {
    const userId = req.user.id;

    const totalJobs = await JobApplication.count({ where: { UserId: userId } });

    const jobs = await JobApplication.findAll({
      where: { UserId: userId },
      offset: (page - 1) * limit,
      limit: limit,
    });

    if (!jobs) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Jobs fetched successfully",
      jobs,
      currentPage: page,
      hasNextPage: limit * page < totalJobs,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalJobs / limit),
    });
  } catch (error) {
    console.log("get jobs error:", error);
    res.status(500).json({ error: "Unable to fetch the jobs" });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const {
      jobtitle,
      companyname,
      joblocation,
      status,
      notes,
      lastdate,
      remindbeforedays,
      document,
    } = req.body;

    const job = await JobApplication.findOne({
      where: { id, UserId: userId },
      include: [{ model: Users, attributes: ["email", "name"] }],
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const oldStatus = job.status;

    job.jobtitle = jobtitle || job.jobtitle;
    job.companyname = companyname || job.companyname;
    job.joblocation = joblocation || job.joblocation;
    job.status = status || job.status;
    job.notes = notes || job.notes;
    job.lastdate = lastdate || job.lastdate;
    job.remindbeforedays = remindbeforedays || job.remindbeforedays;
    job.document = document || job.document;

    let content;

    if (status && status !== oldStatus) {
      job.status = status;

      if (status === "applied") {
        if (lastdate) job.lastdate = lastdate;
        content=`Hi ${job.User.name},\n\nJust a reminder that the interview for your application to ${job.companyname} (${job.jobtitle}) is on ${job.lastdate}.\n\nGood luck!\n\nYour Job Tracker`
      } else if (status === "interviewed") {
        if (lastdate) job.lastdate = lastdate;
        content=`Hi ${job.User.name},\n\nJust a reminder that the results of your interview for your application to ${job.companyname} (${job.jobtitle}) is on ${job.lastdate}.\n\nGood luck!\n\nYour Job Tracker`
      } else if (status === "offered") {
        if (lastdate) job.lastdate = lastdate;
        content=`Hi ${job.User.name},\n\nJust a reminder that the Offer Letter for your application to ${job.companyname} (${job.jobtitle}) will be sent to you on ${job.lastdate}.\n\nGood luck!\n\nYour Job Tracker`
      } else if (status === "rejected" || status === "dropped") {
        job.lastdate = lastdate || new Date();
        content=`Hi ${job.User.name},\n\nJust a reminder that the you are either rejected or you dropped for your application to ${job.companyname} (${job.jobtitle}) is on ${job.lastdate}.\n\nGood luck!\n\nYour Job Tracker`
      }
    }

    await job.save();

    if (status && status !== oldStatus) {
      const subject = "Reminder: Follow up on your job application";
      let textContent = content;

      if (job.lastdate) {
        textContent += `\n\nImportant date associated with this status: ${job.lastdate}`;
      }

      await tranEmailApi.sendTransacEmail({
        sender: { email: process.env.EMAIL },
        to: [{ email: job.User.email, name: job.User.name }],
        subject,
        textContent,
      });

      console.log(`Status update email sent to ${job.User.email}`);
    }

    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    console.log("update job error:", error);
    res.status(500).json({ error: "Unable to update the job" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const job = await JobApplication.findOne({
      where: { id, UserId: userId },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.destroy();

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.log("delete job error:", error);
    res.status(500).json({ error: "Unable to delete the job" });
  }
};

const addNewCompany = async (req, res) => {
  try {
    const { name, industry, companysize, location, contact, notes } = req.body;

    const company = await Companies.create({
      name: name,
      industry: industry,
      companysize: companysize,
      location: location,
      contact: contact,
      notes: notes,
      UserId: req.user.id,
    });

    const user = await Users.findByPk(req.user.id);

    res.status(200).json({ message: "Comapny added successfully", company });
  } catch (error) {
    console.log("add new company error:", error);
    res.status(500).json({ error: "Unable to add the company" });
  }
};

const getCompanies = async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;

  try {
    const userId = req.user.id;

    const totalCompanies = await Companies.count({ where: { UserId: userId } });

    const companies = await Companies.findAll({
      where: { UserId: userId },
      offset: (page - 1) * limit,
      limit: limit,
    });

    if (!companies) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Comapnies fetched successfully",
      companies,
      currentPage: page,
      hasNextPage: limit * page < totalCompanies,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalCompanies / limit),
    });
  } catch (error) {
    console.log("get companies error:", error);
    res.status(500).json({ error: "Unable to fetch the companies" });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params; // company id from URL
    const userId = req.user.id;

    const { name, industry, companysize, location, contact, notes } = req.body;

    const company = await Companies.findOne({
      where: { id, UserId: userId },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    company.name = name || company.name;
    company.industry = industry || company.industry;
    company.companysize = companysize || company.companysize;
    company.location = location || company.location;
    company.contact = contact || company.contact;
    company.notes = notes || company.notes;

    await company.save();

    res.status(200).json({ message: "Company updated successfully", company });
  } catch (error) {
    console.log("update company error:", error);
    res.status(500).json({ error: "Unable to update the company" });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const company = await Companies.findOne({
      where: { id, UserId: userId },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    await company.destroy();

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.log("delete company error:", error);
    res.status(500).json({ error: "Unable to delete the company" });
  }
};

module.exports = {
  addNewJob,
  getJobs,
  updateJob,
  deleteJob,
  addNewCompany,
  getCompanies,
  updateCompany,
  deleteCompany,
};
