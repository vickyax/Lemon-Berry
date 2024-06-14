const express = require("express");
const router = express.Router();
const {
  login,
  register,
  dashboard,
  googleRegister,
  getAllUsers,
  userInfo,
  messages,
  getAllMessages,
  updateMessage,
  deleteMessage
} = require("../controllers/user");
const authMiddleware = require('../middleware/auth');

router.post("/login", login);
router.post("/gregister", googleRegister);
router.post("/register", register);
router.get("/dashboard", authMiddleware, dashboard);
router.get("/users", getAllUsers);
router.get("/userInfo", authMiddleware, userInfo); // Route for fetching user info
router.post("/messages", authMiddleware, messages); // Ensure only authenticated users can post messages
router.get("/messages", getAllMessages);
router.put("/messages/:id", authMiddleware, updateMessage); // Update a specific message by ID
router.delete("/messages/:id", authMiddleware, deleteMessage); // Delete a specific message by ID

module.exports = router;
