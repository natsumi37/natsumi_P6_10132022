const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "f7YOb8P1GTY1vcn");
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      req.auth = { userId };
      next();
    }
  } catch {
    res.status(401).json({
      error: error
    });
  }
};