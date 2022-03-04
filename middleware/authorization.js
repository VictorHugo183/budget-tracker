const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");

module.exports = async (req,res, next) => {
  const jwtToken = req.header("token");

  if (!jwtToken) {
    /* return res.status(403).json("Unauthorized Access"); */
    return res.sendFile(path.join(__dirname, "client/build/index.html"));
  }
  try {
    //check if jwt is valid, if it is it returns a payload we can use in our routes
    const payload = jwt.verify(jwtToken, process.env.jwtSecret)

    /* re-assign jwtGenerator.js payload's value */
    req.user = payload.user;
    /* Middleware will continue on if the token is inside localStorage */
    next();
    
  } catch (error) {
    console.error(error.message);
    /* return res.status(403).json("Unauthorized Access"); */
    return res.sendFile(path.join(__dirname, "client/build/index.html"));
  }
  next();
}