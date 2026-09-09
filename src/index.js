import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

ReactDOM.render(
  <BrowserRouter>
    <Toaster position="top-center" containerStyle={{ top: '90px', zIndex: 99999 }} />
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
