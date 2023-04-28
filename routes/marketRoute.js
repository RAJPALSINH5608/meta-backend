const express = require('express')
const router = express.Router()

const MarketPLACE = require("../controllers/marketController");

router.route("/allnft").get(MarketPLACE.AllNFT);

router.route("/search").get(MarketPLACE.NFTDetail);

router.route("/userNft").get(MarketPLACE.getAssetsByUsername);



// router.route('/publish').post(MarketPLACE.publishNft);
// router.put('/api/v1/marketplace/:tileid',marketController.monumentDetail);


module.exports= router;