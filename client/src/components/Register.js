import React, { useState } from "react";
import { Link } from "react-router-dom"
import { toast } from "react-toastify";
import logo from "../../src/budget-logo2.png";
import "../styles/register.css";

const Register = ({ setAuth }) => {

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
    budget: 0
  })

  const { email, password, name, budget } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  const onSubmitForm = async (e) => {
    /* prevents page refresh on submit */
    e.preventDefault();
    try {
      const body = { email, password, name, budget };

      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      /* response will be a jwt token */
      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        toast.success("registration successful");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const handleGuestLogin = async (e) => {
    e.preventDefault();
    let chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let string = ''
    for (let i = 0; i < 15; i++) string += chars[Math.floor(Math.random() * chars.length)]
    let email = string + '@gmail.com';
    const name = "GUEST_ACCOUNT";
    const password = "123456";
    const budget = 1500;
    const bodyDesc = { email, password, name, budget };

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyDesc)
      });
      /* response will be a jwt token */
      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        toast.success("registration successful");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }

    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div className="register-page">

      <div className="py-xs-2 py-md-5">
        <div className="container-fluid pt-3 text-center">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="mt-2 display-5 fw-bold">Budget Tracker</h1>
        </div>
      </div>

      <div className="container signin-form">
        <h1 className="text-center pt-1">Register</h1>
        <form onSubmit={onSubmitForm} className="d-flex flex-column align-items-center">
          <div className="input-container">
            <input type="email" name="email" placeholder="email" className="my-1" value={email} onChange={e => onChange(e)} />
          </div>
          <div className="input-container">
            <input type="password" name="password" placeholder="password" className="my-1" value={password} onChange={e => onChange(e)} />
          </div>
          <div className="input-container">
            <input type="text" name="name" placeholder="name" className="my-1" value={name} onChange={e => onChange(e)} />
          </div>
          <button type="submit" className="btn btn-login">Register</button>
          <p className="mt-4 text-start align-self-start">Already have an account?
            <Link to="/login" role="button" className="ms-2 me-2 fw-bold">Sign In</Link>
          </p>
          <p className="text-start align-self-start">Or
            <span className="ms-2 fw-bold" role="button" onClick={(e) => handleGuestLogin(e)}>Try Demo</span>
          </p>
        </form>
      </div>

    </div>
  )
}

export default Register;