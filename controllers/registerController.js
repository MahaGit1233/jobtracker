const Users = require("../modals/Users");
const sequelize = require("../utils/db-connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const { ForgotPassword } = require("../modals");

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN);
};

const signupUsers = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Users.findOne({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    res.status(200).json({ message: `${name} is successfully signed up` });
  } catch (error) {
    console.log("signup error:", error);
  }
};

const loginUsers = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All the fields are required to be filled" });
    }

    const user = await Users.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    res.status(200).json({
      message: "User logged in successfully",
      token: generateAccessToken(user.id),
    });
  } catch (error) {
    console.log("login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const client = Sib.ApiClient.instance;

const apiKey = client.authentications["api-key"];
console.log("loaded api_key:", process.env.API_KEY);
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

const sender = {
  email: process.env.EMAIL,
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("recieved email:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const id = uuidv4();

    await ForgotPassword.create({
      id,
      UserId: user.id,
      isactive: true,
    });

    const resetLink = `http://localhost:4002/register/resetpassword/${id}`;

    await tranEmailApi.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: "Reset password link",
      htmlContent: `
      <p>Hello,</p> 
      <p>Click the link below to reset your password:</p> 
      <a href=${resetLink}>Reset Password</a>
      `,
    });

    res.status(200).json({
      message: "Password reset link sent successfully",
      email: user.email,
    });
  } catch (error) {
    console.log("forgot password error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getResetPasswordForm = async (req, res) => {
  try {
    const id = req.params.id;
    const request = await ForgotPassword.findOne({ where: { id } });

    if (!request || !request.isactive) {
      return res.status(400).send("<h2>Reset link expired or invalid</h2>");
    }

    res.send(`
        <form action='/register/updatepassword/${id}' method='POST'>
            <label>New Password:</label>
            <input type='password' name='password' required />
            <button type='submit'>Update Password</button>
        </form>
        `);
  } catch (error) {
    console.log("reset password form error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { password } = req.body;

    const request = await ForgotPassword.findOne({ where: { id } });

    if (!request || !request.isactive) {
      return res.status(400).send("<h2>Reset request expired or invalid</h2>");
    }

    const user = await Users.findByPk(request.UserId);
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    request.isactive = false;
    await request.save();

    res.send("Password updated successfully. You can now log in.");
  } catch (error) {
    console.log("update password error:", error);
    res.status(500).send("Failed to update password");
  }
};

module.exports = {
  signupUsers,
  loginUsers,
  forgotPassword,
  getResetPasswordForm,
  updatePassword,
};
