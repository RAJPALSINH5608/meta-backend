const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
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
    country: String,
    walletaddress: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Wallet",
      },
    ],
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
    noOfNFT: { type: Number, default: 0 },
    noOfTiles: { type: Number, default: 0 },
  },
  { timestamp: true }
);
module.exports = mongoose.model("User", UserSchema);
