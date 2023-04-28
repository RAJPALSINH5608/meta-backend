const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    adminType: { type: String,
      enum:["admin", "superadmin"],
      default:"admin" },

    username: {
      type: String,
      unique: true,
    },
    firstname: String,
    lastname: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    adminApproval: { type: Boolean, default: false },

    apikey: {
      type: String,
    },
    isLoggedIn: { type: Boolean, default: false },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: String,
    },
  },
  { timestamp: true }
);
module.exports = mongoose.model("Admin", adminSchema);