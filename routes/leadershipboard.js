const express = require('express')
const router = express.Router()

const leadershipController = require("../controllers/leadershipboard");

//Account related routes :->
router.get('/broker',leadershipController.leadershipboardBroker);
router.get('/user',leadershipController.leadershipboardUser);


module.exports = router;