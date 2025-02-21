import React from "react";
import "./TestHome.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar"; 

const TestHome = () => {

  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div className="row">
        <div className="col-md-2">
          <Sidebar /> 
        </div>
      </div>
    </div>
  );
};

export default TestHome;
