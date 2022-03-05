import React, { useState } from "react";

const InputExpense = ({ setExpensesChange }) => {

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const onSubmitForm = async (e) => {
    /* prevent refresh */
    e.preventDefault();
    /* prevent adding todo if input is empty or amount is too high */
    if (!description || !amount || !category || category === "" || amount > 99999999.99) {
      alert("Missing data or cost is too high");
      return
    }
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token)
      const bodyDesc = { description, amount, category };
      const response = await fetch("/dashboard/expenses", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(bodyDesc)
      });

      const parseRes = await response.json();

      /* the change in expensesChange will trigger the Dashboard useEffect in order to update user info without needing to refresh.
      reset all fields on form submit. */
      setExpensesChange(true);
      setDescription("");
      setAmount("");
      setCategory("");

    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <>
      <div className="row mt-3">
        <div className="col-sm">
          <form onSubmit={onSubmitForm}>
            <div className="row">
              <div className="col-md col-lg-3">
                <label>Description</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Groceries"
                  className="form-control"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
              <div className="col-md col-lg-3">
                <label>Cost</label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 50.00"
                  min="0"
                  step="0.01"
                  className="form-control"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              <div className="col-md col-lg-3">
                <label>Category</label>
                <select className="form-control" required value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">--Please select a category--</option>
                  <option value="Housing">Housing</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md col-lg-3 align-self-end">
                <button className="btn btn-login mt-2">Add</button>
              </div>
            </div>
            <div className="row mt-3">

            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default InputExpense;