const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  landType: {
    type: String,
    enum: ["metro", "rural", "urban", "semiurban", "water", "forest"],
  },
  cityName: { type: String },
  price: Number,
});
const LandType = mongoose.model("citySchema", citySchema);

module.exports = LandType;