const router = require("express").Router()
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
/* import middleware */
const validInfo = require("../middleware/validInfo")
const authorization = require("../middleware/authorization");


//registering new user (accessed at /auth/register)
router.post("/register", validInfo, async(req,res) => {
  try {
    //1. destructure the req.body (name, email, password, budget)
    const { name, email, password, budget} = req.body;

    //2. check if user exists (if it already exists throw error)
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

    if (user.rows.length !== 0){
      return res.status(401).json("User already exists");
    }

    //3. if new user, bcrypt the user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);

    //4. enter new user inside database, with bcrypt password
    const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password, budget) VALUES ($1, $2, $3, $4) RETURNING *", [name, email, bcryptPassword, budget]);

    //5. generating our JWT (remember to import jwtGenerator)
    /* we have access to user_id because we used RETURNING * on our query */
    const token = jwtGenerator(newUser.rows[0].user_id);

    res.json({token});

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

/* log in route */
router.post("/login", validInfo, async(req,res) => {
  try {
    //1. destructure the req.body
    const {email, password} = req.body;
    //2. check if user doesn't exits (if not throw error)
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

    if(user.rows.length === 0){
      return res.status(401).json("Incorrect email or password");
    } 
    //3. check if incoming password is the same as database password
    const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
    if (!validPassword){
      return res.status(401).json("Incorrect email or password");
    }
    //4. give the user the JWT
    const token = jwtGenerator(user.rows[0].user_id);
    res.json({token});
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error")
  }
});

router.post("/verify", authorization, async (req,res) => {
  try {
    /* return true if authorization middleware returns true */
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Unauthorized")
  }
})

module.exports = router;