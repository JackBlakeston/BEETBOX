import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Sequencer from "./components/Sequencer";

export function App () {
  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Sequencer/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}