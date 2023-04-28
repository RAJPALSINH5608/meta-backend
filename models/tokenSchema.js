const mongoose = require("mongoose");

// const tilesDetail = mongoose.Schema(
//   {
//     tile_ID: { type: Number, required: true, unique: true },
//     longitude1: { type: String, required: true },
//     longitude1: { type: String, required: true },
//     latitude1: { type: String, required: true },
//     latitude2: { type: String, required: true },
//     tileCategory: {
//       type: String,
//       enum: ["urban", "semiUrban","water"],
//       required: true,
//     },
//     specialMonumentPart: { type: Boolean, default: false },
//     pricing: { type: Number, required: true }, // if required convert it to string
//     ownerShipHistory: [{
//       type : mongoose.Schema.Types.Mixed,
//     }],
//   },
//   { timestamp: true }
// );

// const ownerSchema = mongoose.Schema({
//   ownerName: { type: String, required: true },
//   ownerWalletAddress: { type: String, required: true },
//   ownerShipDate: { type: Date, default: Date.now },
// });

const tokenSchema = mongoose.Schema(
  {
    nftname: { type: String, default: "unnamed Teritory" },
    nftId: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    walletAddress: { type: String },
    totalTiles: { type: [String] },
    buyPrice: { type: Number },
    sellPrice: { type: Number },
    location: { type: String },
    nftDetail: { type: [String] },
    readyToSell: { type: Boolean, default: true },
    specialMonementPart: { type: Boolean, default: false },
    mintedBy: { type: String},
  },
  { timestamp: true }
);

const Token = mongoose.model("tokenDetail", tokenSchema);
// const Owner = mongoose.model("ownerdetails", ownerSchema);
// const Tile = mongoose.model("tileDetail", tilesDetail);

module.exports = Token;
