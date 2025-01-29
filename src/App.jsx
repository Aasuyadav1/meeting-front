import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import React from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MeetingTable from "./components/global/Meeting";
import MyCalendar from "./components/calendar/BigCalendar";
import Sidebar from "./components/global/Sidebar";
import Home from "./components/global/Home";


function App() {  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        <Route element={<Sidebar />}>
          <Route path="/meeting" element={<MeetingTable />} />
          <Route path="/calendar" element={<MyCalendar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
