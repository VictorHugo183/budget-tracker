import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";
import logo from "../../budget-logo2.png";
import "../../styles/dashboard.css"

/* components */
import InputExpense from "./expenses/InputExpense";
import ListExpenses from "./expenses/ListExpenses";

const Dashboard = ({ setAuth }) => {

  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [budgetEditable, setBudgetEditable] = useState(false);
  const [allExpenses, setAllExpenses] = useState([]);
  const [expensesChange, setExpensesChange] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState("");

  /* For each catergory, loop through all expenses, add up all the amount spent on a given category */
  const housingCosts = Math.abs(allExpenses.filter((item) => (item.category === "Housing")).map(i => parseFloat(i.amount)).reduce((a, b) => a + b, 0));
  const foodCosts = Math.abs(allExpenses.filter((item) => (item.category === "Food")).map(i => parseFloat(i.amount)).reduce((a, b) => a + b, 0));
  const transportCosts = Math.abs(allExpenses.filter((item) => (item.category === "Transport")).map(i => parseFloat(i.amount)).reduce((a, b) => a + b, 0));
  const entertainmentCosts = Math.abs(allExpenses.filter((item) => (item.category === "Entertainment")).map(i => parseFloat(i.amount)).reduce((a, b) => a + b, 0));
  const personalCareCosts = Math.abs(allExpenses.filter((item) => (item.category === "Personal Care")).map(i => parseFloat(i.amount)).reduce((a, b) => a + b, 0));
  const otherCosts = Math.abs(allExpenses.filter((item) => (item.category === "Other")).map(i => parseFloat(i.amount)).reduce((a, b) => a + b, 0));

  const remainingAmount = (budget - totalExpenses) >= 0 ? (Math.round((budget - totalExpenses) * 100) / 100).toFixed(2) : 0;

  async function getProfile() {
    try {
      const response = await fetch("/dashboard/", {
        method: "GET",
        headers: {"token": localStorage.token}
      });
      let parseRes = await response.json();

      /* Now sorts by expense ID to sort by oldest */
      parseRes = parseRes.sort((a, b) => (a.expense_id > b.expense_id) ? 1 : -1)

      setAllExpenses(parseRes)
      setName(parseRes[0].user_name);
      setBudget(parseRes[0].budget);

      /* Turn all amount strings into floats, add them all together, then round the total to two decimal points */
      const costList = parseRes.map(item => {
        return parseFloat(item.amount);
      })

      let totalCost = costList.reduce((acc, item) => {
        return acc + item;
      }, 0);

      totalCost = (Math.round(totalCost * 100) / 100).toFixed(2);

      setTotalExpenses(totalCost);

    } catch (error) {
      console.error(error.message)
    }
  }

  /* stores previous value of budget, so that when change is applied, we only contact the API if the new value is different from the old one */
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const prevBudget = usePrevious({ budget });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (budget > 99999999.99 || budget < 0) {
      alert(`Please enter a budget between 0.00 and 99,999,999.99`)
      return
    }
    if (prevBudget.budget !== budget) {
      try {
        const bodyDesc = { budget };
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", localStorage.token);
        const response = await fetch("/dashboard/", {
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify(bodyDesc)
        });
/*      const parseRes = await response.json();
        console.log(parseRes); */

      } catch (error) {
        console.error(error.message)
      }
    }
    setBudgetEditable(false);
  }

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
    toast.success("Logged out successfully")
  }

  /* by default expensesChange is false, when we add new data with the InputExpense component we change it to true, that change triggers this useEffect which will update our profile data without needing to refresh, it then sets expensesChange to false again.*/
  useEffect(() => {
    getProfile();
    setExpensesChange(false);
  }, [expensesChange])

  /* Configuring pie chart data */
  ChartJS.register(ArcElement, Tooltip, Legend);
  const pieData = {
    labels: ['Housing', 'Food', 'Transport', 'Entertainment', 'Personal Care', 'Other', 'Remaining Budget'],
    datasets: [
      {
        label: 'Expenses',
        data: [housingCosts, foodCosts, transportCosts, entertainmentCosts, personalCareCosts, otherCosts, remainingAmount],
        backgroundColor: ['#f3722c', '#f94144', '#f9c74f', '#90be6d', '#9C6FBE', '#277da1', '#888'], /*p-care #577590 */
        borderColor: ["#25364a", "#25364a", "#25364a", "#25364a", "#25364a", "#25364a", "#25364a"],
        hoverOffset: 3
      },
    ],
  }

  const pieOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12.5,
          color: "#f5f5f5"
        }
      }
    }
  }

  return (
    <div className="dashboard">
      <div className="header">
        <div className="d-flex">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="d-inline-block my-auto">Budget Tracker</h1>
        </div>
        <button className="btn btn-login" onClick={e => logout(e)}>Log out</button>
      </div>

      <div className="container">
        <h1 className="text-center">Personal Ledger</h1>
        <div className="row mt-3">
          {budgetEditable ?
            <form onSubmit={onSubmitForm} className="d-flex col-md p-0">
              <div className="budget col-md alert alert-secondary p-3 d-flex align-items-center justify-content-between w-100 me-md-4">
                <input required type="number" min="0" step="0.01" value={budget} onChange={e => setBudget(e.target.value)} className="form-control" />
                <button className="ms-2 btn btn-login">Apply</button>
              </div>
            </form>
            :
            <div className="budget col-md alert alert-secondary p-3 d-flex align-items-center justify-content-between me-md-4">Budget: {budget}
              <button className="btn btn-login" onClick={() => setBudgetEditable(true)}>Edit</button>
            </div>
          }
          <div className="remaining col-md alert p-4 alert-success me-md-4">Remaining:
            <span className={budget - totalExpenses < 0 ? "ms-1 text-danger" : "ms-1 text-reset"}>
              {isNaN(totalExpenses) ? budget : (Math.round((budget - totalExpenses) * 100) / 100).toFixed(2)}
            </span>
          </div>
          <div className="expenses col-md alert p-4 alert-danger">Total Expenses: {isNaN(totalExpenses) ? 0 : totalExpenses}</div>
        </div>
      </div>

      <div className="container">
        <InputExpense setExpensesChange={setExpensesChange} />
        <ListExpenses allExpenses={allExpenses} setExpensesChange={setExpensesChange} />
      </div>

      <div className="chart-container mt-5">
        <div className="chart-heading">
          <h2 className="text-center">Visualise your expenses</h2>
          <p className="text-center">(hover to view values, click on label to hide category)</p>
        </div>
        <div className="d-flex container justify-content-center">
          <div className="row">
            <div className="col-xs-12 mt-5 px-0">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center">
        Copyright &copy;2022 - Designed and Built By <a href="https://github.com/VictorHugo183" target="_blank" rel="noreferrer">Victor Nascimento</a>
      </footer>

    </div>
  )
}

export default Dashboard;