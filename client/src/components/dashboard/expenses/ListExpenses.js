import React, { useEffect, useState } from "react";
/* import EditExpense from "./EditExpense"; */
import { FaTimesCircle } from 'react-icons/fa';

import { FaEdit } from 'react-icons/fa';


const ListExpenses = ({ allExpenses, setExpensesChange }) => {

  const [expenses, setExpenses] = useState([]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [target, setTarget] = useState("");

  /* update */

  const updateDescription = async (e) => {
    e.preventDefault();
    try {
      const bodyDesc = { description, amount, category }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);
      const response = await fetch(`/dashboard/expenses/${target}`, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(bodyDesc)
      })

      /* passed on from dashboard to ListExpenses down to EditExpense, changing this will trigger the useEffect in Dashboard and will update user info without refreshing */
      setExpensesChange(true);

    } catch (error) {
      console.error(error.message)
    }
  }

  /* delete todo function */
  const deleteExpense = async (id) => {
    try {
      const deletedExpense = await fetch(`/dashboard/expenses/${id}`, {
        method: "DELETE",
        headers: {token : localStorage.token}
      });
      /* make sure the list refreshes when item is deleted, by returning all todo items except if they have the id of the deleted item*/
      setExpenses(expenses.filter(item => item.expense_id !== id));
      setExpensesChange(true);
    } catch (error) {
      console.error(error.message)
    }
  }

  /* since getting all expenses is asynchronous, we need to watch for changes in allExpenses, when it changes we update our expenses state. */
  useEffect(() => {
    setExpenses(allExpenses);
  }, [allExpenses])

  return (
    <>
      <h2>Expenses:</h2>
      {/* table-scroll-y cystom-scroll */}
      <div className="table-responsive table-scroll-y custom-scroll">
        {(expenses.length === 0 || expenses[0].expense_id === null) &&
        <p className="empty-table-header">Add a transaction to begin tracking your finances</p>
        }
        <table className="table table-striped table-sm text-center mb-0">
          <thead className="">
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {(expenses.length !== 0 && expenses[0].expense_id !== null &&
            expenses.map(item => (
              <tr key={item.expense_id}>
                <td>{item.description}</td>
                <td>{item.amount}</td>
                <td>{item.category}</td>
                <td>{/* <EditExpense expense={item} setExpensesChange={setExpensesChange}/> */}
                  <FaEdit role="button" className="" color="#f5f5f5" size="1.5rem" data-bs-toggle="modal" data-bs-target={`#id${target}`} onClick={() => { setTarget(item.expense_id); setDescription(item.description); setAmount(item.amount); setCategory(item.category);}} /></td>
                <td><FaTimesCircle role="button" className="mt-1" size="1.5rem" color="#f94144" onClick={() => deleteExpense(item.expense_id)} /></td>
              </tr>
            ))) 
            }
          </tbody>
        </table>
      </div>

      <div className="modal" id={`id${target}`} style={{ color: "#f5f5f5" }}>
        <div className="modal-dialog">
          <div className="modal-content" style={{ backgroundColor: "#31435b" }}>

            <div className="modal-header">
              <h4 className="modal-title">Edit Expense</h4>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" onClick={() => { setDescription(description); setAmount(amount); setCategory(category) }}></button>
            </div>

            <div className="modal-body">
              <label>Description</label>
              <input type="text" className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
              <label>Amount</label>
              <input type="number" min="0" step="0.01" className="form-control" required value={amount} onChange={e => setAmount(e.target.value)} />
              <label>Category</label>
              <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Housing">Housing</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-login" data-bs-dismiss="modal" onClick={e => updateDescription(e)}>Apply</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { setDescription(description); setAmount(amount); setCategory(category) }}>Cancel</button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default ListExpenses;