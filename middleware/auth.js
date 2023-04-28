const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/unauthenticated");
require("dotenv").config();

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    delete decoded.user.password;
    const { _id, username } = decoded?.user;
    req.user = { _id, username };
    console.log(username, _id);

    if (req.params.username && req.params.username !== username) {
      throw new ForbiddenError("Not authorized to update this user");
    }

    next();
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError("Not authorized to access this route");
  }
};

module.exports = authenticationMiddleware;