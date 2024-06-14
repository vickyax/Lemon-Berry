import React, { useEffect, useState } from "react";
import Logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';
import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import birdsImage from "../assets/birds.jpg";
import dragImage from "../assets/drag.jpg";
import shinchan1Image from "../assets/shinchan1.jpg";
import shinchan2Image from "../assets/shinchan2.jpg";
import doraemonImage from "../assets/doraemon.jpg";
import doraemonImage2 from "../assets/doraemonweb.jpg";
import backgroundMusic from "../assets/background.mp3"; // Adjust path to your audio file

const ImageSlideshow = () => {
  const images = [
    dragImage,
    birdsImage,
    shinchan1Image,
    shinchan2Image,
    doraemonImage,
    doraemonImage2,
  ];

  const zoomOutProperties = {
    duration: 3000,
    transitionDuration: 1000,
    infinite: true,
    indicators: true,
    arrows: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 500,
  };

  return (
    <div className="slide-container">
      <Zoom {...zoomOutProperties}>
        {images.map((each, index) => (
          <img key={index} style={{ width: "100%" }} src={each} alt={`Slide ${index}`} />
        ))}
      </Zoom>
    </div>
  );
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const navigate = useNavigate();
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    let email = e.target.email.value;
    let password = e.target.password.value;

    if (email.length > 0 && password.length > 0) {
      const formData = { email, password };
      try {
        const response = await axios.post("https://lemonserver.onrender.com/api/v1/login", formData);
        localStorage.setItem('auth', JSON.stringify(response.data.token));
        toast.success("Login successful");
        navigate("/dashboard");
      } catch (err) {
        console.error('Login error:', err);
        toast.error(err.message);
      }
    } else {
      toast.error("Please fill in all inputs");
    }
  };

  useEffect(() => {
    if (token !== "") {
      toast.success("You are already logged in");
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleGoogleRegisterSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const response = await axios.post("https://lemonserver.onrender.com/api/v1/gregister", { token });
      localStorage.setItem('auth', JSON.stringify(response.data.token));
      toast.success("Registration successful with Google");
      navigate("/dashboard");
    } catch (error) {
      console.error('Google registration error:', error);
      toast.error(error.message);
    }
  };

  const handleGoogleRegisterFailure = (error) => {
    console.error('Google registration failed:', error);
    toast.error('Failed to register with Google');
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <ImageSlideshow />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleLoginSubmit}>
              <input type="email" placeholder="Email" name="email" />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>

              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">Remember</label>
                </div>
                <Link to="#" className="forgot-pass-link">Forgot password?</Link>
              </div>

              <div className="login-center-buttons">
                <button type="submit">Log In</button>
                <GoogleLogin
                  onSuccess={handleGoogleRegisterSuccess}
                  onError={handleGoogleRegisterFailure}
                />
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
