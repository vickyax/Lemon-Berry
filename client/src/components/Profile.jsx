import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import useUserData from './getData';
import Navbar from "./Navbar";
const ProfileContainer = styled.div`
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const Info = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin: 0.5rem 0;
`;

const LoadingAnimation = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

const Loading = styled.div`
  font-size: 1.5rem;
  color: #007bff;
  animation: ${LoadingAnimation} 1s infinite;
`;

const NoUserData = styled.div`
  font-size: 1.5rem;
  color: #ff0000;
`;

const Profile = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const { user, loading } = useUserData(token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    }
  }, [token, navigate]);

  if (loading) {
    return <Loading>Loading...</Loading>; // Show loading indicator while fetching data
  }

  if (!user) {
    return <NoUserData>No user data</NoUserData>; // Show message if no user data found
  }

  return (
    <>
    <Navbar/>
    <ProfileContainer>
      <Title>Profile</Title>
      <Info><strong>Name:</strong> {user.name}</Info>
      <Info><strong>Email:</strong> {user.email}</Info>
      {/* Display other fields as needed */}
    </ProfileContainer>
    </>
  );
};

export default Profile;
