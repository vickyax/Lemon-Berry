import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Alert } from "react-bootstrap";
import axios from 'axios';
import useUserData from './getData';
import Navbar from "./Navbar";
import "./style2.css";
function Friends() {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem('auth')) || '');
  const { user, loading: userDataLoading } = useUserData(token);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });

  const fetchFriendsList = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/users/friends/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFriendsList(response.data.friends);
    } catch (error) {
      console.error('Error fetching friends list:', error);
      setAlert({ show: true, variant: 'danger', message: 'Error fetching friends list. Please try again later.' });
    }
  };

  useEffect(() => {
    if (!userDataLoading && user) {
      fetchFriendsList();
    }
  }, [user, userDataLoading]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/users/search?query=${searchQuery}`);
      setSearchResults(response.data.users);
    } catch (error) {
      console.error('Error searching users', error);
      setAlert({ show: true, variant: 'danger', message: 'Error searching users. Please try again later.' });
    }
  };

  const handleAddFriend = async (friendId, friendName) => {
    try {
      console.log('Token:', token);
      const data={userId: user.id,friendId};
      console.log(data);
      const response = await axios.post(`http://localhost:3000/api/v1/users/friends/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      console.log('Add Friend Response:', response);

      setAlert({ show: true, variant: 'success', message: `User ${friendName} added as friend` });
      fetchFriendsList(); // Fetch updated friends list
      setSearchResults([]); // Clear search results
    } catch (error) {
      console.error('Error adding friend:', error.response ? error.response.data : error.message);

      setAlert({ show: true, variant: 'danger', message: 'Failed to add friend. Please try again.' });
    }
  };

  const handleRemoveFriend = async (friendId, friendName) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/users/friends/${user.id}/${friendId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlert({ show: true, variant: 'info', message: `User ${friendName} removed from friends list` });
      fetchFriendsList(); // Fetch updated friends list
    } catch (error) {
      console.error('Error removing friend', error);
      setAlert({ show: true, variant: 'danger', message: 'Failed to remove friend. Please try again.' });
    }
  };

  return (
    <>
    <Navbar/>
    <Container>
      <Row>
        <Col>
          <h2>Add Friends</h2>
          <Form onSubmit={handleSearch}>
            <Form.Group controlId="searchQuery">
              <Form.Control
                type="text"
                placeholder="Search for users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Search
            </Button>
          </Form>
          {searchResults.length > 0 && (
            <ListGroup className="mt-3">
              {searchResults.map((user) => (
                <ListGroup.Item key={user._id}>
                  {user.name}
                  <Button
                    className="ml-3"
                    variant="success"
                    onClick={() => handleAddFriend(user._id, user.name)}
                  >
                    Add Friend
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col>
          <h2>Friends List</h2>
          <ListGroup className="mt-3">
            {friendsList.length > 0 ? (
              friendsList.map((friend) => (
                <ListGroup.Item key={friend._id}>
                  {friend.name}
                  <Button
                    className="ml-3"
                    variant="danger"
                    onClick={() => handleRemoveFriend(friend._id, friend.name)}
                  >
                    Remove
                  </Button>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No friends added yet</ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
      {alert.show && (
        <Alert className="mt-3" variant={alert.variant} onClose={() => setAlert({ show: false, variant: '', message: '' })} dismissible>
          {alert.message}
        </Alert>
      )}
    </Container>
    </>
  );
}

export default Friends;
