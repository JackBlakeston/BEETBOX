import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import Sequencer from "./components/Sequencer";

export function App () {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthScreen/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/sequencer" element={<Sequencer/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}