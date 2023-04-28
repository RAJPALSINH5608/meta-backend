require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const LandType = require("../models/landSchema");
const nodemailer = require("nodemailer");
const Admin = require("../models/adminSchema");

/**
 * create admin only by superadmin
 **/
const createAdmin = async (req, res) => {
  try {

    const salt = bcrypt.genSaltSync(10);
    console.log(req.body, "line 17");
    const email = req.body.email;
    const username = req.params.username;
    const findAdmin = await Admin.findOne({
      username: username,
      adminType: "superadmin",
    });
    console.log("find super admin", findAdmin);
    if (!findAdmin) {
      return res.status(400).json({
        message: "no user found",
      });
    }

    const findEmail = await Admin.findOne({
      email: email,
      adminApproval: false,
    });
    if (findEmail) {
      return res.status(400).json({
        message: "email already registerd",
      });
    }
    const defaultText = "metax";

    const userName = (Math.random() + 1).toString(36).substring(7);
    const password = (Math.random() + 1).toString(36).substring(7);

    const pwdhash = bcrypt.hashSync(password, salt);
    let result = defaultText.concat(userName);
    console.log("username", result);
    console.log("password", password);

    const admin = new Admin({
      username: result,
      password: pwdhash,
      email: email,
      adminApproval: true,
    });
    const newAdmin = await admin.save();
    //////////////////////////////////////////////////
    var smtpTrans = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASS}`,
      },
    });
    var mailOptions = {
      to: email,
      from: "metaxland@gmail.com",
      subject: "successfully registered as admin please login",
      text:
        "Hello,\n\n" +
        " - This is your credential for login on metaxland \n" +
        "username :" +
        result +
        "\n" +
        "password :" +
        password +
        "\n" +
        " login and update your profile.\n",
    };
    await smtpTrans.sendMail(mailOptions);
    /////////////////////////////////////////

    return res.status(200).json({
      adminDetails: newAdmin,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(409).send(`data already exists`);
    } else {
      res.status(401).json({ message: err });
    }
  }
};

//adding new city
const addNewCityDetail = async (req, res) => {
  try {
  
    // const landType = req.params.landType;
    // console.log("landType",landType);
    var { cityName, landType, price } = req.body;
    console.log("cityName", cityName);
    const username = req.params.username;
    const findAdmin = await Admin.findOne({
      username: username
    });
    console.log("find super admin", findAdmin);
    if (!findAdmin) {
      return res.status(400).json({
        message: "user not found",
      });
    }
    console.log("findAdmin",findAdmin.adminType);
    if (!["admin", "superadmin"].includes(findAdmin.adminType)) {

      return res.status(400).json({
        message: "User not authorized"
      });
    }
    const oldType = await LandType.findOne({ cityName: cityName });
    if (oldType) {
      return res
        .status(404)
        .json({ message: `cityname ${cityName} already taken` });
    }
    const newType = new LandType({
      landType: landType,
      cityName: cityName,
      price: price,
    });
    var test = await newType.save();
    console.log(test);
    res.status(200).json({ test });
  } catch (err) {
    console.log(err);
    res.send({ status: "failed", message: "error on saving data " });
  }
};

//changing city price
const changeCityPrice = async (req, res) => {
  try {
    var username = req.params.username;
    // const landType = req.params.landType;
    // console.log(landType);
    var { cityName, price , landType} = req.body;
    console.log(cityName);
    const findAdmin = await Admin.findOne({
      username: username
    });
    console.log("find super admin", findAdmin);
    if (!findAdmin) {
      return res.status(400).json({
        message: "user not found",
      });
    }
    console.log("findAdmin",findAdmin.adminType);
    if (!["admin", "superadmin"].includes(findAdmin.adminType)) {

      return res.status(400).json({
        message: "User not authorized"
      });
    }
    const oldType = await LandType.findOne({ cityName: cityName });
    if (!oldType) {
      return res.status(404).json({ message: `cityname ${cityName} doesn't` });
    }

    const changePrice = await LandType.updateOne(
      { cityName: cityName },
      {
        $set: { price: price },
      }
    );
    res.status(200).json({ changePrice });
  } catch (err) {
    console.log(err);
    res.send({ status: "failed", message: "error on saving data " });
  }
};

//all collection of a land type
const getCollection = async (req, res) => {
  try {
    var username = req.params.username;
    var landType = req.query.data;
    console.log(req.query);
    const findAdmin = await Admin.findOne({
      username: username
    });
    // console.log("find super admin", findAdmin);
    if (!findAdmin) {
      return res.status(400).json({
        message: "user not found",
      });
    }
    // console.log("findAdmin",findAdmin.adminType);
    if (!["admin", "superadmin"].includes(findAdmin.adminType)) {

      return res.status(400).json({
        message: "User not authorized"
      });
    }
    const data = await LandType.find(
      { landType: landType },
      { _id: 0, cityName: 1, price: 1 }
    );
    // console.log(data);
    if (!data) {
      return res
        .status(404)
        .json({ message: `landType ${landType} doesn't exist` });
    }

    res.status(200).json({ landType: data });
  } catch (err) {
    console.log(err);
    res.send({ status: "failed", message: "error on saving data " });
  }
};
module.exports = {
  createAdmin,
  addNewCityDetail,
  changeCityPrice,
  getCollection,
};