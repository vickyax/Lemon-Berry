import React, { useEffect, useState } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    console.log("rendered");
    e.preventDefault();
    let email = e.target.email.value;
    let password = e.target.password.value;

    if (email.length > 0 && password.length > 0) {
      const formData = { email, password };
      try {
        const response = await axios.post("http://localhost:3000/api/v1/login", formData);
        localStorage.setItem('auth', JSON.stringify(response.data.token));
        toast.success("Login successful");
        navigate("/dashboard");
      } catch (err) {
        console.log(err);
        toast.error(err.message);
      }
    } else {
      toast.error("Please fill all inputs");
    }
  };

  useEffect(() => {
    if (token !== "") {
      toast.success("You already logged in");
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleGoogleRegisterSuccess = async (credentialResponse) => {
    try {
      // Extract the credential from the response
      const token = credentialResponse.credential;
      console.log("token:"+token+" :token");
      console.log("auth:"+import.meta.env.VITE_REACT_APP_googleauth+":auth");
      
      // Send the token to your backend for registration
      const response = await axios.post("http://localhost:3000/api/v1/gregister", {token} );
      toast.success("Registration successful with Google");
      localStorage.setItem('auth', JSON.stringify(response.data.token));
      // Optionally, you can handle the registration response and redirect the user
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
        <img src={Image} alt="" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="" />
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
                <a href="#" className="forgot-pass-link">Forgot password?</a>
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
