import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useDropzone } from 'react-dropzone';
import useUserData from './getData';
import Navbar from "./Navbar";
import "./style2.css";
const ProfileContainer = styled.div`
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #8FE6C4;
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
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
`;

const PostTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
`;

const PostContent = styled.p`
  font-size: 1rem;
  color: blue;
`;

const EditForm = styled(Form)`
  margin-top: 1rem;
`;

const FileUploadContainer = styled.div`
  margin-top: 1rem;
`;

const FileUploadLabel = styled.p`
  font-size: 1rem;
  color: ##007bff;
  margin-bottom: 0.5rem;
`;

const FileUploadButton = styled(Button)`
  background-color: #007bff;
  border-color: #007bff;

  &:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }
`;

const ResponseMessage = styled.p`
  font-size: 1rem;
  color: #555;
  margin-top: 0.5rem;
`;

const Post = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem('auth')) || '');
  const { user, loading } = useUserData(token);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState('');
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [editPostId, setEditPostId] = useState(null);
  const [editMessage, setEditMessage] = useState('');
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://lemonserver.onrender.com/api/v1/messages', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data.messages);
      } catch (error) {
        console.error('Error fetching posts', error);
      } finally {
        setPostLoading(false);
      }
    };
    fetchPosts();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setResponse('Please login to post a message.');
      return;
    }

    const formData = new FormData();
    formData.append('id', user.id);
    formData.append('username', user.name);
    formData.append('message', message);
    if (image) {
      formData.append('image', image);
    }

    try {
      const result = await axios.post('https://lemonserver.onrender.com/api/v1/messages', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponse(result.data.msg);
      setMessage('');
      setImage(null);

      const updatedPosts = await axios.get('https://lemonserver.onrender.com/api/v1/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(updatedPosts.data.messages);
    } catch (error) {
      setResponse('Error posting message. Please try again.');
      console.error('Error posting message', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`https://lemonserver.onrender.com/api/v1/messages/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post', error);
    }
  };

  const handleEdit = (post) => {
    setEditPostId(post._id);
    setEditMessage(post.message);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.put(
        `https://lemonserver.onrender.com/api/v1/messages/${editPostId}`,
        { message: editMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse(result.data.msg);
      setEditPostId(null);
      setEditMessage('');

      const updatedPosts = await axios.get('https://lemonserver.onrender.com/api/v1/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(updatedPosts.data.messages);
    } catch (error) {
      setResponse('Error editing message. Please try again.');
      console.error('Error editing message', error);
    }
  };

  if (loading) {
    return <Loading>Loading...</Loading>;
  }

  if (!user) {
    return <NoUserData>No user data</NoUserData>;
  }

  return (
    <>
      <Navbar />
      <Container>
        <Row>
          <Col>
            <Title>All Posts</Title>
            {postLoading ? (
              <Loading>Loading posts...</Loading>
            ) : posts.length === 0 ? (
              <NoUserData>No posts found</NoUserData>
            ) : (
              posts.map((post) => (
                <PostContainer key={post._id}>
                  <PostTitle>{post.username}</PostTitle>
                  <PostContent>{post.message}</PostContent>
                  {post.image && <img src={`https://lemonserver.onrender.com/${post.image}`} alt="Post" style={{ maxWidth: '100%' }} />}
                  {post.username === user.name && (
                    <>
                      <Button variant="warning" onClick={() => handleEdit(post)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(post._id)}>
                        Delete
                      </Button>
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
            <Title>Post a Message</Title>
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
              <FileUploadContainer>
                <FileUploadLabel class="upload">Upload Image</FileUploadLabel>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <FileUploadButton variant="secondary">Choose File</FileUploadButton>
                </div>
              </FileUploadContainer>
              <Button variant="primary" type="submit">
                Post
              </Button>
            </Form>
            <ResponseMessage>{response}</ResponseMessage>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Post;
