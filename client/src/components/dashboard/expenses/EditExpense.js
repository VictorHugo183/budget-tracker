/* 
This component is no longer used but I decided to leave it in the project for reference.
The problem I was facing was since to the modal was placed inside the table it wasn't being rendered properly on mobile.
My solution was to move this component's functionality to the ListExpenses component, where I could have the modal declared outside the table.
*/

import React, { useState } from "react";
import { FaEdit } from 'react-icons/fa';

const EditExpense = ({ expense, setExpensesChange }) => {
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);

  /* edit description on edit click */
  const updateDescription = async (e) => {
    e.preventDefault();
    try {
      const bodyDesc = { description, amount, category }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);
      const response = await fetch(`/dashboard/expenses/${expense.expense_id}`, {
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
  return (
    <>
      {/* add onClick to set description to default on all closing buttons so that if no edits are made the modal displays the original descriptions. */}
      <FaEdit role="button" className="" color="#f5f5f5" size="1.5rem" data-bs-toggle="modal" data-bs-target={`#id${expense.expense_id}`} onClick={() => {setDescription(expense.description); setAmount(expense.amount); setCategory(expense.category)}} />
      {/* need a unique class for our modals so they display the correct descriptions */}
      <div className="modal" id={`id${expense.expense_id}`} style={{color: "#f5f5f5"}}>
        <div className="modal-dialog">
          <div className="modal-content" style={{ backgroundColor: "#31435b"}}>

            <div className="modal-header">
              <h4 className="modal-title">Edit Expense</h4>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" onClick={() => {setDescription(expense.description); setAmount(expense.amount); setCategory(expense.category)}}></button>
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
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => {setDescription(expense.description); setAmount(expense.amount); setCategory(expense.category)}}>Cancel</button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default EditExpense;