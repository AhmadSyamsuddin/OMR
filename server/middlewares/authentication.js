const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

async function authentication(req, res, next) {
  console.log('=== AUTHENTICATION MIDDLEWARE ===');
  console.log('Path:', req.path);
  console.log('URL:', req.originalUrl);
  console.log('Has Authorization:', !!req.headers.authorization);
  console.log('=================================');

  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    throw { name: "Unauthorized", message : "Invalid Token 1" }
  }
  try {
    const access_token = bearerToken.split(" ")[1];
    const data = verifyToken(access_token);

    const user = await User.findByPk(data.id);
    if (!user) {
      throw { name: "Unauthorized", message : "Invalid Token 2" }
    }

    req.user = {
      id: user.id,
      name: user.fullName,
      isMembership: user.isMembership,
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authentication;