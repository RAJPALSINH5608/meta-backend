const express = require("express");
const router = express.Router();

// const LandType = require("../controllers/landController");
const Admin = require("../controllers/SuperAdminControllers");
const auth = require("../middleware/auth");
router.post("/:username/createAdmin", auth, Admin.createAdmin);

router.route("/:username/addLand").post(auth, Admin.addNewCityDetail);
router.route("/:username/changePrice").post(auth, Admin.changeCityPrice);
router.route("/:username/detail").get(auth, Admin.getCollection);

module.exports = router;
