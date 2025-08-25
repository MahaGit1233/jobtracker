const { CronJob } = require("cron");
const Sib = require("sib-api-v3-sdk");
const { Users } = require("../modals");
const { JobApplication } = require("../modals");
const { Op } = require("sequelize");

const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

const job = new CronJob(
  "0 9 * * *",
  async () => {
    console.log("Checking for upcoming follow-ups...");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const jobs = await JobApplication.findAll({
        include: [{ model: Users, attributes: ["email", "name"] }],
      });

      for (const job of jobs) {
        console.log("email:", job.User.email);
        console.log("name:", job.User.name);
        console.log("last date:", job.lastdate);
        console.log("reminder days:", job.remindbeforedays);

        if (!job.lastdate || !job.remindbeforedays) continue;

        const lastDate = new Date(job.lastdate);
        lastDate.setHours(0, 0, 0, 0);

        const reminderDate = new Date(lastDate);
        reminderDate.setDate(reminderDate.getDate() - job.remindbeforedays);
        console.log("remainder date:", reminderDate);

        if (today.getTime() === reminderDate.getTime()) {
          const email = {
            sender: { email: process.env.EMAIL },
            to: [{ email: job.User.email, name: job.User.name }],
            subject: "Reminder: Follow up on your job application",
            textContent: `Hi ${job.User.name},\n\nJust a reminder that the deadline for your application to ${job.companyname} (${job.jobtitle}) is on ${job.lastdate}.\n\nGood luck!\n\nYour Job Tracker`,
          };

          await tranEmailApi.sendTransacEmail(email);
          console.log(`Sent reminder to ${job.User.email}`);
        }
      }
    } catch (error) {
      console.error("Error sending reminders:", error);
    }
  },
  null,
  true,
  "Asia/Kolkata"
);

job.start();
