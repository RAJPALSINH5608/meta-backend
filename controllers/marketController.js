// const User = require("../models/userRegistration");
const { trusted } = require("mongoose");
const Token = require("../models/tokenSchema");

const AllNFT = async (req, res) => {
  try {
    const collection = await Token.find(
      { readyToSell: true },
      // { nftId: 1, _id: 0 }
    );
    console.log(collection);
    res.status(200).json({coll : collection });
  } catch (err) {
    res.send({ status: "failed", message: "error on saving data " });
  }
};

/**
 *
 *checking nft detail by name /id
 */
const NFTDetail = async (req, res) => {
  try {
    const { nftName, nftId } = req.query;
    if (nftName && nftId) {
      const data = await Token.findOne({
        nftname: nftName,
        nftId: nftId,
        _id: 0,
      });
      res.status(200).json({ data });
    } else if (nftId) {
      const data = await Token.findOne({ nftId: nftId });
      res.status(200).json({ data });
    } else if (nftName) {
      const data = await Token.findOne({ nftname: nftName });
      res.status(200).json({ data });
    } else {
      res.status(404).json({ data: no - data });
    }
  } catch (err) {
    res.send({ status: "failed", message: "error on saving data " });
  }
};

/**
 * check asset of a user
 */
const getAssetsByUsername = async (req, res) => {
  try {
    const { userName } = req.query;
    const data = await Token.find(
      { username: userName },
      { nftId: 1, nftname: 1, _id: 0 }
    );
    res.status(200).json({ data });
  } catch (err) {
    res.send({ status: "failed", message: "error on saving data " });
  }
};

module.exports = { AllNFT, NFTDetail, getAssetsByUsername };