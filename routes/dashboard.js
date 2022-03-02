const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

/* Get user name,budget and list of expenses */
router.get("/", authorization, async (req,res) => {
  try {
    //after executing authorization middleware, req.user has the payload
    const user = await pool.query("SELECT users.user_name, users.budget, expenses.expense_id, expenses.description, expenses.amount, expenses.category FROM users LEFT JOIN expenses ON users.user_id = expenses.user_id WHERE users.user_id = $1", [req.user]);
    res.json(user.rows);
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

/* Edit budget */
router.put("/", authorization, async (req,res) => {
  try {
    const { budget } = req.body;
    const updateBudget = await pool.query(
      "UPDATE users SET budget = $1 WHERE user_id = $2 RETURNING *", [budget, req.user]
    );
    
    if (updateBudget.rows.length === 0){
      return res.json("This is not our budget")
    }

    res.json("Budget has been updated");
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
})

/* Create an expense */

router.post("/expenses", authorization, async (req,res) => {
  try {
    const { description, amount, category } = req.body;
    const newExpense = await pool.query(
      "INSERT INTO expenses (user_id, description, amount, category) VALUES ($1, $2, $3, $4) RETURNING *", [req.user, description, amount, category]
    );
    res.json(newExpense.rows[0]);
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

/* Update an expense */

router.put("/expenses/:id", authorization, async (req,res) => {
  try {
    const { id } = req.params;
    const { description, amount, category } = req.body;
    const updateExpense = await pool.query(
      "UPDATE expenses SET description = $1, amount = $2, category = $3 WHERE expense_id = $4 AND user_id = $5 RETURNING *",[description, amount, category, id, req.user]
    );

    if (updateExpense.rows.length === 0) {
      return res.json("This expense is not yours");
    }
    res.json("Expense was updated");

  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

/* Delete an expense */

router.delete("/expenses/:id", authorization, async (req,res) => {
  try {
    const { id } = req.params;
    const deleteExpense = await pool.query(
      "DELETE FROM expenses WHERE expense_id = $1 AND user_id = $2 RETURNING *", [id, req.user]
    );
    if (deleteExpense.rows.length === 0) {
      res.json("This expense is not yours");
    }
    res.json("Expense was deleted");
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;