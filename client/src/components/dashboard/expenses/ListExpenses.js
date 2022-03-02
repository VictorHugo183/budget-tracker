import React, { useEffect, useState } from "react";
import EditExpense from "./EditExpense";
import { FaTimesCircle } from 'react-icons/fa';


const ListExpenses = ({ allExpenses, setExpensesChange }) => {

  const [expenses, setExpenses] = useState([]);

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
                <td><EditExpense expense={item} setExpensesChange={setExpensesChange}/></td>
                <td><FaTimesCircle role="button" className="mt-1" size="1.5rem" color="#f94144" onClick={() => deleteExpense(item.expense_id)} /></td>
              </tr>
            ))) 
            }
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ListExpenses;