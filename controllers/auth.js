require("dotenv").config();
const Broker = require("../models/brokerRegistration");
const User = require("../models/userRegistration");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const crypto = require("crypto-js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const Admin = require("../models/adminSchema");

const adminUpdate = async (req, res) => {
  const admin = req.params.admin;
  console.log("userName", admin);
  const { username, firstname, lastname, password, country } = req.body;
  const salt = bcrypt.genSaltSync(10);
  console.log(" is here", salt);
  try {
    const userLogin = await Admin.findOne({
      username: admin,
      adminType: "admin",
      isLoggedIn: true,
    });
    console.log("userLogin", userLogin);
    if (!userLogin) {
      return res.status(404).json({ message: "User not found" });
    }
    const oldUser =
      (await Broker.findOne({ username: username })) &&
      User.findOne({ username: username }) &&
      Admin.findOne({ username: username });
    if (oldUser) {
      return res.status(409).send(`username ${username} already taken`);
    }
    const pwdhash = bcrypt.hashSync(password, salt);
    console.log(" new pswdhash", pwdhash);
    const updateDetail = await Admin.updateMany(
      { username: admin },
      {
        username: username,
        firstname: firstname,
        lastname: lastname,
        country: country,
        password: pwdhash,
      }
    );
    res.status(200).json({ success: "Admin registerd", user: updateDetail });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(409).send(`username ${username} already taken`);
    } else {
      res.status(401).json({ message: error });
    }
  }
};

//for User registeration
const userregistration = async (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const { username, firstname, lastname, email, password, country } =
    req.body.data;
  // console.log(req.body);

  try {
    if (!(username && email && password)) {
      res.status(400).send("All input is required");
    }
    const oldUser =
      (await Broker.findOne({ username: username })) &&
      User.findOne({ username: username });
    if (oldUser) {
      return res.status(409).send(`username ${username} already taken`);
    }
    const pwdhash = bcrypt.hashSync(password, salt);
    const newuser = new User({
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: pwdhash,
      country: country,
      // brokerID:randomNumber,
    });
    newuser.save((err, user) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      res.status(200).json({ success: "User Created", user: user });
    });
  } catch (error) {
    console.log(error);
  }
};

//Broker  registration
const brokerregistration = async (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const username = req.body.data.username;
  const firstname = req.body.data.firstname;
  const lastname = req.body.data.lastname;
  const email = req.body.data.email;
  const password = req.body.data.password;
  const country = req.body.data.country;
  const parent = req.body.data.parent;
  // Generate a four-digit random number
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  console.log(randomNumber);

  console.log(req.body);
  //  console.log(req.query.refer);
  try {
    let parentBroker;
    if (req.query.refer == undefined) {
      parentBroker = "admin";
    } else {
      parentBroker = req.query.refer;
    }
    if (!(username && email && password)) {
      return res.status(400).send("All input is required");
    }

    //Broker adding himself as a broker
    if (parentBroker == username) {
      return res.status(409).send(`Can't refer yourself`);
    }

    const oldBroker =
      (await User.findOne({ username: username })) &&
      Broker.findOne({ username: username });
    if (oldBroker) {
      return res.status(409).send(`username ${username} already taken`);
    }

    const pwdhash = bcrypt.hashSync(password, salt);
    const newBroker = new Broker({
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: pwdhash,
      country: country,
      parent: parent,
      brokerID: randomNumber,
    });

    //First Broker Registration
    if (parentBroker == "") {
      newBroker.save((err, user) => {
        if (err) {
          res.status(400).json({ message: err });
        }
        return res.status(200).json({ success: "Broker Created", user: user });
      });
    } else {
      //Second Broker Registration
      const broker1 = await Broker.findOneAndUpdate(
        // console.log(broker1);
        { brokerID: parentBroker },
        { $push: { level1: { $each: [username] } } }
      );

      if (broker1.parent == "") {
        broker1.save((err, user) => {
          if (err) {
            console.log(err);
            console.log("Error in adding Broker 1");
            return res.status(400).json({ message: err });
          }
        });
        newBroker.save((err, user) => {
          if (err) {
            return res.status(400).json({ message: err });
          }
          res.status(200).json({ success: "Broker Created", user: user });
        });
        return;
      }

      //Third Broker Registration
      const broker2 = await Broker.findOneAndUpdate(
        { brokerID: broker1.parent },
        { $push: { level2: { $each: [username] } } }
      );

      if (broker2.parent == "") {
        broker2.save((err, user) => {
          if (err) {
            console.log("Error in adding Broker 2");
            return res.status(400).json({ message: err });
          }
        });
        broker1.save((err, user) => {
          if (err) {
            console.log("Error in adding Broker 1");
            return res.status(400).json({ message: err });
          }
        });
        newBroker.save((err, user) => {
          if (err) {
            return res.status(400).json({ message: err });
          }
          res.status(200).json({ success: "Broker Created", user: user });
        });
        return;
      }

      const broker3 = await Broker.findOneAndUpdate(
        { brokerID: broker2.parent },
        { $push: { level3: { $each: [username] } } }
      );

      broker1.save((err, user) => {
        if (err) {
          console.log(err);
          console.log("Error in adding Broker 1");
          return res.status(400).json({ message: err });
        } else {
          broker2.save((err, user) => {
            if (err) {
              console.log(err);
              console.log("Error in adding Broker 2");
              return res.status(400).json({ message: err });
            } else {
              broker3.save((err, user) => {
                if (err) {
                  console.log("Error in adding Broker 3");
                  return res.status(400).json({ message: err });
                }
              });
            }
          });
        }
      });

      newBroker.save((err, user) => {
        if (err) {
          return res.status(400).json({ message: err });
        }
        res.status(200).json({ success: "Broker Created", user: user });
      });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: err });
  }
};

const referlink = async (req, res) => {
  const broker = req.params.user;
  console.log(broker);
  console.log(req.params.user);
  try {
    const foundbroker = await Broker.findOne({ username: broker });

    console.log(foundbroker);
    if (!foundbroker) {
      res.status(400).send("broker is not exist");
    }

    const referId = foundbroker.brokerID;
    res.status(200).send(referId);
    console.log(referId);
  } catch (err) {
    console.log(err);
  }
};
//  const referlink = await Broker.findOne(Broker:Broker)

const registrationWallet = async (req, res) => {};

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }
    const user = await User.findOne({ username: username });
    console.log("Fetchd data : ", user);
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      await User.findByIdAndUpdate({ _id: user._id }, { isLoggedIn: true });
      return res.send(token);
    }
    res.status(400).json("Invalid Credentials");
  } catch (err) {
    console.log("error: ", err);
    res.status(401).send({ message: err });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body.data;
    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }

    const user = await Admin.findOne({
      username: username,
      adminApproval: true,
    });
    console.log("Fetchd data : ", user.username,user.password,user._id);
  

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      const refreshToken = jwt.sign({ user }, process.env.JWT_REFRESH_SECRET , {
        expiresIn: "1 day",
      });

      const loggedin = await Admin.findByIdAndUpdate(
        { _id: user._id },
        { isLoggedIn: true }
      );

      res.status(200).send({ token: token, refreshToken: refreshToken });
    } else {
      res.status(400).json("Invalid Credentials or Admin not approved");
    }
  } catch (err) {
    console.log("error: ", err);
    res.status(401).send({ message: err });
  }
};

const brokerLogin = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    // console.log(req.body.data);
    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }

    const user = await Broker.findOne({ username: username });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        { username: username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
      // console.log(token);
      await User.findByIdAndUpdate({ _id: user._id }, { isLoggedIn: true });
      if (user) {
        const data = await Broker.findOne({ username: username });
        return res.status(200).json(data);
      }
      // return res.send(token);
    }
    return res.status(400).json("Invalid Credentials");
  } catch (err) {
    res.status(401).send({ message: err });
  }
};

const userResetPwd = async (req, res) => {
  const { username } = req.body;
  try {
    const foundUser = await User.findOne({ username: username });
    if (!foundUser) {
      return res.status(400).json({
        message: "User with that email" + email + "does not exist",
      });
    }
    let email = foundUser.email;

    const token = crypto.randomBytes(20).toString("hex");
    const expires = Date.now() + 3600000; // 1 hour

    foundUser.resetPasswordToken = token;
    foundUser.resetPasswordExpires = expires;
    await foundUser.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASS}`,
      },
    });

    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: `${email}`,
      subject: "[Promoquo] Reset Password Link",
      text:
        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
        `http://localhost:3000/api/v1/auth/account/resetUserPassword/${token} \n\n` +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n",
    };

    // send the email with the password reset link
    transporter.sendMail(mailOptions, (err, res) => {
      if (err) {
        console.log("ERROR coming from forgot.password js and it sucks", err);
      } else {
        console.log("Email Send Successfully");
        res.status(200).json({
          message: "recovery email sent hell yes",
        });
      }
    });
    res.status(200).json({
      message: "Reset password email has been sent WOOHOO 🎉",
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const brokerResetPwd = async (req, res) => {
  const { username } = req.body;
  try {
    const foundBroker = await Broker.findOne({ username: username });
    if (!foundBroker) {
      return res.status(400).json({
        message: "User with that email" + email + "does not exist",
      });
    }
    let email = foundBroker.email;

    const token = crypto.randomBytes(20).toString("hex");
    const expires = Date.now() + 3600000; // 1 hour

    // save the token and expiration time to the user's record in the database
    foundBroker.resetPasswordToken = token;
    foundBroker.resetPasswordExpires = expires;
    await foundBroker.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASS}`,
      },
    });

    // const resetUrl = `http://${req.headers.host}/reset-password/${token}`;

    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: `${email}`,
      subject: "[Promoquo] Reset Password Link",
      text:
        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
        `http://localhost:3000/api/v1/auth/account/resetBrokerPassword/${token} \n\n` +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n",
    };

    transporter.sendMail(mailOptions, (err, res) => {
      if (err) {
        console.log("ERROR coming from forgot.password js and it sucks", err);
      } else {
        console.log("Email Send Successfully");
        res.status(200).json({
          message: "recovery email sent hell yes",
        });
      }
    });
    res.status(200).json({
      message: "Reset password email has been sent WOOHOO 🎉",
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    const { user } = req;
    console.log("User : ", user);
    await User.findByIdAndUpdate({ _id: user._id }, { isLoggedIn: false });
    return res.status(200).json({ message: "Successfully Logged out" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const userResetPassword = async (req, res) => {
  User.findOne(
    {
      resetPasswordToken: req.params.tokenId,
      resetPasswordExpires: { $gt: Date.now() },
    },
    async function (err, user) {
      if (!user) {
        return res.send("Invalid Token!!");
      }
      let password = req.body.password;

      const salt = bcrypt.genSaltSync(10);
      const pwdhash = bcrypt.hashSync(password, salt);

      user.password = pwdhash;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      user.save(function (err) {
        if (err) {
          console.log("Error while reset!");
          return res.send("Error while resetting password!!");
        }

        var smtpTrans = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: `${process.env.EMAIL_USER}`,
            pass: `${process.env.EMAIL_PASS}`,
          },
        });
        var mailOptions = {
          to: user.email,
          from: "metaxland@gmail.com",
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            " - This is a confirmation that the password for your account " +
            user.email +
            " has just been changed.\n",
        };
        try {
          smtpTrans.sendMail(mailOptions, function (err) {
            if (err) {
              return res.redirect("back");
            }
          });
          console.log("Email send successfully!!");
          res.send("Password reset successful!");
        } catch (err) {
          console.log("Error while sending mail to the respective mail id!!");
        }
      });
    }
  );
};

const brokerResetPassword = async (req, res) => {
  Broker.findOne(
    {
      resetPasswordToken: req.params.tokenId,
      resetPasswordExpires: { $gt: Date.now() },
    },
    async function (err, user) {
      if (!user) {
        return res.send("Invalid Token!!");
      }
      let password = req.body.password;

      const salt = bcrypt.genSaltSync(10);
      const pwdhash = bcrypt.hashSync(password, salt);

      user.password = pwdhash;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      user.save(function (err) {
        if (err) {
          console.log("Error while reset!");
          return res.send("Error while resetting password!!");
        }

        var smtpTrans = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: `${process.env.EMAIL_USER}`,
            pass: `${process.env.EMAIL_PASS}`,
          },
        });
        var mailOptions = {
          to: user.email,
          from: "metaxland@gmail.com",
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            " - This is a confirmation that the password for your account " +
            user.email +
            " has just been changed.\n",
        };
        try {
          smtpTrans.sendMail(mailOptions, function (err) {
            if (err) {
              return res.redirect("back");
            }
          });
          console.log("Email send successfully!!");
          res.send("Password reset successful!");
        } catch (err) {
          console.log("Error while sending mail to the respective mail id!!");
        }
      });
    }
  );
};
const updatepassword = async (req, res) => {
  const salt = bcrypt.genSaltSync(10);

  const username = req.body.username;
  const password = req.body.password;
  const country = req.body.country;
  const pwdhash = bcrypt.hashSync(password, salt);
  try {
    const users = await Broker.updateMany(
      { username: username },
      { $set: { password: pwdhash, country: country } }
    );

    if (!users) {
      res.status(400).json({ message: "Invalid" });
    }

    res.status(200).json({ message: "update succesfully", users: users });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await Broker.find({}, { username: 1, _id: 0 });
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  adminUpdate,
  brokerregistration,
  userregistration,
  registrationWallet,
  userLogin,
  adminLogin,
  brokerLogin,
  userResetPwd,
  brokerResetPwd,
  logout,
  userResetPassword,
  brokerResetPassword,
  referlink,
  updatepassword,
  getUsers,
};
