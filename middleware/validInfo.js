module.exports = (req, res, next) => {
  const { email, name, password } = req.body;

  /* function to check if input email is in the right format using regex */
  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  /* Make sure the user cannot submit empty values and email with the wrong format */
  if (req.path === "/register") {
    console.log(!email.length);
    if (![email, name, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    }
    else if (name.includes("'") || name.includes(";")){
      return res.status(401).json("Name Contains Invalid Characters");
    }
    else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }

  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  }
  /* Next allows us to continue on with the route after the middleware runs. */
  next();
};