const mongoose = require("mongoose");

const tilesDetail = mongoose.Schema(
  {
    tile_ID: { type: Number, required: true, unique: true },
    longitude1: { type: String, required: true },
    longitude2: { type: String, required: true },
    latitude1: { type: String, required: true },
    latitude2: { type: String, required: true },
    tileCategory: {
      type: String,
      enum: ["urban", "semiUrban", "water"],
      required: true,
    },
    specialMonumentPart: { type: Boolean, default: false },
    pricing: { type: Number, required: true }, // if required convert it to string
    ownerShipHistory: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamp: true }
);

const Tile = mongoose.model("tilesSchema", tilesDetail);

module.exports = Tile;
