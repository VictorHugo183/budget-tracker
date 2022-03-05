const express = require("express");
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 5000;

const app = express();

/* Heroku environment variables: */
/* process.env.PORT */
/* process.env.NODE_ENV => production or undefined */
app.use(express.static(path.join(__dirname, "client/build")));
/* MIDDLEWARES: */
if (process.env.NODE_ENV === "production"){
  //serve static content. import path, join the current directory name with the path to the build folder we want to serve.
  app.use(express.static(path.join(__dirname, "client/build")));
}

/* we'll need this to access req.body received from the frontend */
app.use(express.json())
/* need cors so our backend can interact with our frontend */
app.use(cors())

/* ROUTES - defined inside the routes folder */

/* register and login routes - routes/jwtAuth*/
app.use("/auth", require("./routes/jwtAuth"));

/* dashboard route /routes/dashboard.js */
app.use("/dashboard", require("./routes/dashboard"));

/* Catchall method */
app.get("*", (req,res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})