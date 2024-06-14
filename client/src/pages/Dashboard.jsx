import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Preloader from "../components/Pre";
import Post from "../components/Post";
import Profile from "../components/Profile";
import Menu from "../components/Menu";
import Search from "../components/Search";
import Friends from "../components/Friends";
import Home from "../components/Home";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { toast } from 'react-toastify';
import "../styles/Dashboard.css";
import "../styles/index.css";
import "../style.css";

const Dashboard = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [load, updateLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      updateLoad(false);
    }, 1200);

    if (!token) {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }

    return () => clearTimeout(timer);
  }, [token, navigate]);

  if (!token) {
    return null; // Render nothing while redirecting to avoid flash of the dashboard
  }

  return (
    <>
      <Preloader load={load} />
        <Navbar />
      <div className="Dashboard" id={load ? "no-scroll" : "scroll"}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post" element={<Post />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/search" element={<Search />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default Dashboard;
