const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/messagePost");
const { OAuth2Client } = require("google-auth-library");
const ID = process.env.VITE_REACT_APP_googleauth;
const client = new OAuth2Client(ID);

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add email and password in the request body",
    });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      const isMatch = await foundUser.comparePassword(password);
      if (isMatch) {
        const token = jwt.sign(
          { id: foundUser._id, name: foundUser.name },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );
        return res.status(200).json({ msg: "User logged in", token });
      } else {
        return res.status(400).json({ msg: "Bad password" });
      }
    } else {
      return res.status(400).json({ msg: "Bad credentials" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

const messages = async (req, res) => {
  const { id,username, message } = req.body;

  if (!username || !message) {
    return res.status(400).json({ msg: "Please provide both username and message" });
  }

  try {
    const newMessage = new Message({ id,username, message });
    await newMessage.save();
    res.status(201).json({ msg: 'Message posted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error posting message', details: error.message });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({});
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages', details: error.message });
  }
};

const updateMessage = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ msg: 'Please provide a message to update' });
  }

  try {
    const updatedMessage = await Message.findByIdAndUpdate(req.params.id, { message }, { new: true });
    if (!updatedMessage) {
      return res.status(404).json({ msg: 'Message not found' });
    }
    res.status(200).json({ msg: 'Message updated successfully', updatedMessage });
  } catch (error) {
    res.status(500).json({ error: 'Error updating message', details: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ msg: 'Message not found' });
    }
    res.status(200).json({ msg: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting message', details: error.message });
  }
};

const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(200).json({
    msg: `Hello, ${req.user.name}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching users", error: error.message });
  }
};

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Please add all values in the request body" });
  }

  try {
    let foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const newUser = new User({ name: username, email, password });
    await newUser.save();
    res.status(201).json({ msg: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

const userInfo = async (req, res) => {
  try {
    res.status(200).json({
      name: req.user.name,
      email: req.user.email,
      id: req.user.id,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

const googleRegister = async (req, res) => {
  const token = req.body.token;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: ID,
    });

    const payload = ticket.getPayload();
    const { name, email } = payload;

    let foundUser = await User.findOne({ email });

    if (foundUser) {
      const authToken = jwt.sign(
        { id: foundUser._id, name: foundUser.name, email: foundUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      return res.status(200).json({ msg: "User logged in", token: authToken });
    } else {
      foundUser = new User({ name, email });
      await foundUser.save();
      const authToken = jwt.sign(
        { id: foundUser._id, name: foundUser.name, email: foundUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      return res.status(201).json({ msg: "User registered", token: authToken });
    }
  } catch (error) {
    console.error("Google registration error:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = {
  login,
  register,
  dashboard,
  userInfo,
  googleRegister,
  getAllUsers,
  messages,
  getAllMessages,
  updateMessage,
  deleteMessage,
};
