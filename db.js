/* connect our server to our database using the pg library */
const Pool = require("pg").Pool;
require('dotenv').config();

const devConfig = {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE
};

const proConfig = process.env.DATABASE_URL; //coming from heroku addon

/* Pool allows us to configure our connection. */

/* const pool = new Pool(
  process.env.NOD_ENV === "production" ? proConfig : devConfig
); */

const pool = process.env.NODE_ENV === "production" ?
  new Pool({
    connectionString: proConfig,
    ssl: {
      rejectUnauthorized: false
    }
  })
  :
  new Pool(devConfig)

module.exports = pool;