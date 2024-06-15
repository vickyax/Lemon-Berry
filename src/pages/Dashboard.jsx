// Dashboard.jsx
import React, { useState, useEffect } from "react";
import "../responsive.css";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Preloader from "../components/Pre";
import 'react-slideshow-image/dist/styles.css';
import { Zoom } from 'react-slideshow-image';
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
import a from "../assets2/img1.jpg";
import b from "../assets2/img2.gif";
import c from "../assets2/img3.jpg";
import d from "../assets2/img4.jpg";
import ee from "../assets2/img5.jpg";
import f from "../assets2/img6.webp";
import birdsImage from "../assets/birds.jpg";
import dragImage from "../assets/drag.jpg";
import shinchan1Image from "../assets/shinchan1.jpg";
import shinchan2Image from "../assets/shinchan2.jpg";
import doraemonImage from "../assets/doraemon.jpg";
import doraemonImage2 from "../assets/doraemonweb.jpg";
import backgroundMusic from "../assets/background.mp3";
const Dashboard = () => {
  const [audioLoaded, setAudioLoaded] = useState(false); // Track if audio has been loaded
  useEffect(() => {
    const audio = new Audio(backgroundMusic);
    audio.loop = true;
    audio.play(); // Auto play when component mounts
  
    const handleAudioLoad = () => {
      setAudioLoaded(true);
    };
  
    audio.addEventListener('canplaythrough', handleAudioLoad);
  
    return () => {
      audio.removeEventListener('canplaythrough', handleAudioLoad);
      audio.pause();
      audio.currentTime = 0;
    };
  }, ); // Empty dependency array ensures this effect runs only once

  const ImageSlideshow = () => {
    const images = [
      a,b,c,d,ee,f,
      dragImage,
    birdsImage,
    shinchan1Image,
    shinchan2Image,
    doraemonImage,
    doraemonImage2,
    ];
  
    const zoomOutProperties = {
      duration: 1000,
      transitionDuration: 1000,
      infinite: true,
      indicators: true,
      arrows: true,
      autoplay: true,
      autoplaySpeed: 300,
    };
  
    return (
      <div className="slide-container">
        <Zoom {...zoomOutProperties}>
          {images.map((each, index) => (
            <img key={index} style={{ width: "100%" ,height:"auto"}} src={each} alt={`Slide ${index}`} />
          ))}
        </Zoom>
      </div>
    );
  };
  
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
        <div className="dash">
        <ImageSlideshow />
      </div>
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
