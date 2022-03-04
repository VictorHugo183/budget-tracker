import React, {useState, useEffect} from "react";
import './App.css';
import logo from "./budget-logo2.png";

import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* components */
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import Landing from "./components/Landing";

toast.configure();

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  }

  async function isAuth() {
    try {
      const response = await fetch("/auth/verify", {
        method: "POST",
        headers: {"token": localStorage.token}
      });
      const parseRes = await response.json();
      
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    isAuth();
  },[]);

  return (
    <>
    <Router>
        <Routes>
          <Route path="/" element={
            !isAuthenticated ? (
              <Landing setAuth={setAuth}/>
            ) : (
              <Navigate to="/dashboard" />
            )
          }
          />
          <Route path="/login" element={
            !isAuthenticated ? (
              <Login setAuth={setAuth}/> 
            ) : (
              <Navigate to="/dashboard" />
            )
          }
          />
          <Route path="/register" element={
            !isAuthenticated ? (
              <Register setAuth={setAuth}/> 
            ) : (
              <Navigate to="/login" />
            )
          }
          />
          <Route path="/dashboard" element={
            isAuthenticated ? (
              <Dashboard setAuth={setAuth}/> 
            ) : (
              <Navigate to="/" />
            )
          }
          />
        </Routes>
    </Router>
    </>
  );
}

export default App;
