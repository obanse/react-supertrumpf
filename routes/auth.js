const express = require('express');

const AuthController = require('../controllers/auth');

const router = express.Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.get("/update/:id", AuthController.getUser);
router.put("/update/:id", AuthController.updateUser);

module.exports = router;
