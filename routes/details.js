const express = require('express')
const router = express.Router()

const details = require("../controllers/details");

router.get('/:user' , details.getDetails);

module.exports = router;