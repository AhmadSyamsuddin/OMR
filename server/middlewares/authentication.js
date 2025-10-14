const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

async function authentication(req, res, next) {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    throw { name: "Unauthorized", message : "Invalid Token" }
  }
  try {
    const access_token = bearerToken.split(" ")[1];
    const data = verifyToken(access_token);

    const user = await User.findByPk(data.id);
    if (!user) {
      throw { name: "Unauthorized", message : "Invalid Token" }
    }

    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authentication;