const express = require('express')
const router = express.Router()
const auth = require("../middleware/auth");
const TileController = require("../controllers/tilesController");

router.route("/:user/createNFT",).post(auth, TileController.createNFT);
router.route("/:user/:nftId/updateNFT",).post(auth, TileController.updateNFT);

// router.get('/getTile',tileController.tileLandType);
// router.get('/:tileid?owner=true',tileController.tileOwner);
// router.put('//:tileid',tileController.tilePrice);

module.exports = router;