// const Broker = require("../models/brokerRegistration");
const User = require("../models/userRegistration");
const Broker = require("../models/brokerRegistration");
const Token = require("../models/tokenSchema");
const Tile = require("../models/tileSchema");
const { get } = require("mongoose");

/**
 * nft id in increment
 * nftname need to be unique
 */

const createNFT = async (req, res) => {
  try {
    const userName = req.params.user;
    const {
      nftId,
      nftname,
      buyPrice,
      location,
      nftDetail,
      sellPrice,
      readyToSell,
      specialMonementPart,
      brokerID,
      tiles,
    } = req.body;




    const existNft = await Token.findOne({ nftname: nftname });
    if (existNft) {
      return res.status(409).send(`nftName ${nftname} already taken`);
    }
       
    let tileIDs = [];

    const allToken = await Token.find();
    const allTiles = allToken.map((token) => token.totalTiles);
    const getAllTokens = allTiles.flat();
    const initialGetAllTokens = getAllTokens;
    for (let i = 0; i < tiles.length; i++) {
      const tile = await Tile.findOne({
        longitude1: tiles[i].l1,
        longitude2: tiles[i].l2,
        latitude1: tiles[i].l3,
        latitude2: tiles[i].l4,
      });
      if (tile !== null) {
        tileIDs.push(tile.tile_ID);
      } else {
        let checkTiles = false;
        let generatedTileNumber;
        while(checkTiles !== true){

          let min = Math.pow(10, 5 - 1);
          let max = Math.pow(10, 5) - 1;
          generatedTileNumber =  Math.floor(Math.random() * (max - min + 1) + min);
          checkTiles = !getAllTokens.includes(generatedTileNumber);
        }
        const addTile = await Tile.create({
          tile_ID: generatedTileNumber,
          longitude1: tiles[i].l1,
          longitude2: tiles[i].l2,
          latitude1: tiles[i].l3,
          latitude2: tiles[i].l4,
          tileCategory: "urban",
          specialMonumentPart: false,
          pricing: 100,
          ownerShipHistory: [],
        });
        getAllTokens.push(generatedTileNumber);
        tileIDs.push(generatedTileNumber);
      }
    }
 
    const checkTiles = initialGetAllTokens.every((tile) => !tileIDs.includes(tile));
    if (checkTiles === false) {
      return res.status(409).send(`tile already taken`);
    }

// check broker exist 

    const checkBroker = await Broker.findOne({ brokerID: brokerID });
    if (!checkBroker) {
      console.log(brokerID);
       res.status(409).send(`broker not found`);
    }

    if (checkBroker === undefined){
     return res.status(404).send('broker is required');
    }

    const checkUser = await User.findOne({ username: userName });
    if (!checkUser) {
      return res.status(409).send(`user not found`);
    }

    //adding to broker db
    try {
      const brokerUpdate = await Broker.updateMany(
        { brokerID: brokerID },
        {
          $addToSet: { NFTMinted: nftId },
          $inc: { totalNFTMinted: 1, totalTilesMinted: tileIDs.length },
        }
      );
 
    } catch (err) {
      res.send({ status: "failed", message: "can't update broker" });
    }

    //adding to user db
    try {
      const userUpdate = await User.updateMany(
        { username: userName },
        {
          $inc: { noOfNFT: 1, noOfTiles: tileIDs.length },
        }
      );
      // console.log(userUpdate);
    } catch (err) {
      // console.log(err);
      res.send({ status: "failed", message: "can't update user" });
    }

    const tileInstance = await new Token({
      nftId: nftId,
      nftname: nftname,
      totalTiles: tileIDs,
      buyPrice: buyPrice,
      location: location,
      nftDetail: nftDetail,
      sellPrice:sellPrice,
      readyToSell: readyToSell,
      username: userName,
      specialMonementPart: specialMonementPart,
      brokerID: brokerID,
    });
    try {
      await tileInstance.save();
      res
        .status(200)
        .json({ success: true, message: "Tile inserted successfully" });
    } catch (err) {
      res.send({ status: "failed", message: "error in creating nft" });
    }
  } catch (err) {
    res.send({ status: "failed", message: "can't create nft" });
  }
};

const updateNFT = async (req, res) => {
  try {
    const userName = req.params.user;
    const nftId = req.params.nftId;
    const { readyToSell,sellPrice } = req.body;
    const existNft = await Token.findOneAndUpdate(
      { nftId: nftId },
      { readyToSell: readyToSell,
      sellPrice:sellPrice }
    );
    // console.log(existNft);
    if (!existNft) {
      return res.status(404).send(`nftName ${nftId} already taken`);
    } else {
      res.status(200).send(`nftName ${nftId} updated successfully`);
    }
  } catch (err) {
    res.send({ status: "failed", message: "can't create nft" });
  }
};


/**
 * find and update any thing
 */
// const findandUpdate = async (req, res ) => {
//   try{

// const nft =await Token.updateOne(
//   { username: 'xaini' },
//   { $push: { nftDetail: { $each: [12] } } })

//      console.log(nft);
//       res.status(200).json({nftIDs:nft});
//          }
//   catch(err){
//       res.send({ status: "failed", message: "error on saving data " });
//   }
//   }

// module.exports={ createTile ,findandUpdate , getAssetsByAddress , getNftDetail};
module.exports = { createNFT, updateNFT };
