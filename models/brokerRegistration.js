const mongoose = require("mongoose");

const brokerSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  firstname: String,
  lastname: String,
  walletaddress: String,
  email: {
    type: String,
    unique: true,
  },
  brokerID: String,
  password: String,
  country: String,
  isVerified: Boolean,
  parent: String,
  level1: [String],
  level2: [String],
  level3: [String],
  walletaddress: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Wallet",
    },
  ],
  apikey: {
    type: String,
  },
  resetPasswordToken : {
    type: String,
  },
  resetPasswordExpires : {
    type: String,
  },
  totalNFTMinted: { type: Number, default: 0},
  NFTMinted: { type: [String]},
  totalTilesMinted: { type: Number, default: 0},
},
{ timestamp: true });

module.exports = mongoose.model("brokerSchema", brokerSchema);
