import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import useUserData from './getData';

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

const PostContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
  padding: 1rem;
`;

const PostTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
`;

const PostContent = styled.p`
  font-size: 1rem;
  color: #555;
`;

const EditForm = styled(Form)`
  margin-top: 1rem;
`;

const Post = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const { user, loading } = useUserData(token);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [editPostId, setEditPostId] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/api/v1/messages', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setPosts(response.data.messages);
        } catch (error) {
          console.error("Error fetching posts", error);
        } finally {
          setPostLoading(false);
        }
      }
    };
    fetchPosts();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setResponse("Please login to post a message.");
      return;
    }

    try {
      const id = user.id;
      const username = user.name;
      const result = await axios.post('http://localhost:3000/api/v1/messages', {
        id,
        username,
        message
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setResponse(result.data.msg);
      setMessage(""); // Clear the input field after successful post

      // Fetch the updated list of posts
      const updatedPosts = await axios.get('http://localhost:3000/api/v1/messages', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(updatedPosts.data.messages);
    } catch (error) {
      setResponse("Error posting message. Please try again.");
      console.error("Error posting message", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/messages/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Update the posts list after deletion
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  const handleEdit = (post) => {
    setEditPostId(post._id);
    setEditMessage(post.message);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.put(`http://localhost:3000/api/v1/messages/${editPostId}`, {
        message: editMessage
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setResponse(result.data.msg);
      setEditPostId(null);
      setEditMessage("");

      // Fetch the updated list of posts
      const updatedPosts = await axios.get('http://localhost:3000/api/v1/messages', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(updatedPosts.data.messages);
    } catch (error) {
      setResponse("Error editing message. Please try again.");
      console.error("Error editing message", error);
    }
  };

  if (loading) {
    return <Loading>Loading...</Loading>; // Show loading indicator while fetching user data
  }

  if (!user) {
    return <NoUserData>No user data</NoUserData>; // Show message if no user data found
  }

  return (
    <Container>
      <Row>
        <Col>
          <h2>All Posts</h2>
          {postLoading ? (
            <Loading>Loading posts...</Loading>
          ) : posts.length === 0 ? (
            <NoUserData>No posts found</NoUserData>
          ) : (
            posts.map(post => (
              <PostContainer key={post._id}>
                <PostTitle>{post.username}</PostTitle>
                <PostContent>{post.message}</PostContent>
                {post.username === user.name && (
                  <>
                    <Button variant="warning" onClick={() => handleEdit(post)}>Edit</Button>
                    <Button variant="danger" onClick={() => handleDelete(post._id)}>Delete</Button>
                  </>
                )}
                {editPostId === post._id && (
                  <EditForm onSubmit={handleEditSubmit}>
                    <Form.Group controlId="formEditMessage">
                      <Form.Label>Edit Message</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Edit your message"
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Save
                    </Button>
                  </EditForm>
                )}
              </PostContainer>
            ))
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <h1>Post a Message</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Post
            </Button>
          </Form>
          {response && <p>{response}</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default Post;
