module.exports = (err, req, res, next) => {
  console.log(err);
  if (err.name === "Bad Request") {
    res.status(400).json({ message: err.message });
  } else if (err.name === "SequelizeValidationError") {
    res
      .status(400)
      .json({ message: err.errors[0].message, errors: err.errors });
  } else if (err.name === "SequelizeUniqueConstraintError") {
    res
      .status(400)
      .json({ message: err.errors[0].message, errors: err.errors });
  }else if (err.name === "Unauthorized") {
    res.status(401).json({ message: err.message });
  }else if (err.name === "JsonWebTokenError") {
    res.status(401).json({ message: "Invalid Token" });
  } else if (err.name === "TokenExpiredError") {
    res.status(401).json({ message: "Session expired, please login again" });
  } else if (err.name === "Not Found" || err.name === "NotFound") {
    res.status(404).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
