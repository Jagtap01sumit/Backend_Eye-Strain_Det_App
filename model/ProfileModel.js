const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  username: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  phone: {
    type: "number",
    default: "1234567890",
  },
  age: {
    type: "number",
    required: true,
  },

  gender: {
    type: "string",
    required: true,
    enum: ["male", "female"],
  },

  address: {
    type: "string",
    default: "Address",
  },
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
