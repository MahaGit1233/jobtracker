const { Profile, Users } = require("../modals");
const sequelize = require("../utils/db-connection");

const addProfile = async (req, res) => {
  try {
    const { photo, phone, dateofbirth, address, summary, careergoals } =
      req.body;

    const profile = await Profile.create({
      photo: photo,
      phone: phone,
      dateofbirth: dateofbirth,
      address: address,
      summary: summary,
      careergoals: careergoals,
      UserId: req.user.id,
    });

    res.status(200).json({ message: "Profile added successfully", profile });
  } catch (error) {
    console.log("add profile error:", error);
    res.status(500).json({ error: "Unable to add your profile" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await Profile.findAll({
      where: { UserId: userId },
      include: [{ model: Users, attributes: ["name", "email"] }],
    });

    if (!profile) {
      res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile details fetched successfully", profile });
  } catch (error) {
    console.log("get profile error:", error);
    res.status(500).json({ error: "Unable to fetch your profile details" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { photo, phone, dateofbirth, address, summary, careergoals } =
      req.body;

    const profile = await Profile.findOne({
      where: { id: id, UserId: userId },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    await profile.update({
      photo: photo,
      phone: phone,
      dateofbirth: dateofbirth,
      address: address,
      summary: summary,
      careergoals: careergoals,
    });

    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.log("update profile error:", error);
    res.status(500).json({ error: "Unable to update your profile" });
  }
};

module.exports = {
  addProfile,
  getProfile,
  updateProfile,
};
