import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"
import "../styles/landing.css"
import logo from "../../src/budget-logo2.png";

const Landing = ({setAuth}) => {

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
      const response = await fetch("http://localhost:5000/auth/register", {
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
    <div className="landing-page">

      <div className=" mb-4 py-xs-2 py-md-5">
        <div className="container-fluid pt-5 text-center">
          <img src={logo} alt="Logo" className="logo"/>
          <h1 className="mt-2 display-5 fw-bold">Budget Tracker</h1>
          <p className="text-center">Keep track of your budget, manage transactions and visualise your expenses.</p>
        </div>
      </div>

      <div className="container buttons-container">
        <div className="row">
          <div className="col-xs-12 justify-content-center align-items-center text-center">
            <Link to="/login" className="btn btn-login m-auto mb-2 d-block">Sign In</Link>
          </div>
          <div className="col-xs-12">
            <Link to="/register" className="btn btn-login m-auto mb-2 d-block">Register</Link>
          </div>
          <div className="col-xs-12">
            <span className="btn btn-login m-auto mb-2 d-block" onClick={(e) => handleGuestLogin(e)}>Try Demo</span>
          </div>
        </div>
      </div>

      <footer className="text-center pb-1 pt-2">
        Copyright &copy;2022 - Designed and Built By <a href="https://github.com/VictorHugo183" target="_blank" rel="noreferrer">Victor Nascimento</a>
      </footer>

    </div>
  );
}

export default Landing;