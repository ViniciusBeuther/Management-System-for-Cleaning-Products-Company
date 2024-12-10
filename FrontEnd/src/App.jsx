import React from "react";
import Login from "./modules/login/components/Login";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./modules/home/Home";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <main>
      <AppRoutes />
    </main>
  );
};

export default App;
