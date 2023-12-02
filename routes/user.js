"use strict";

const express = require("express");

//handlers
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");

// Construct a router instance.
const router = express.Router();
//Give us access to fsjstd-restapi.db
const { User } = require("../models/index.js");

// Route that returns a list of users.
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    console.log(user);

    res.location('/');
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      password: user.password,
    });
  })
);

// Route that creates a new user.
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      console.log("entered user post route");
      console.log(req.body);

      await User.create(req.body);

      res.status(201).json();
      return;
    } catch (error) {
      console.log("ERROR: ", error.name);

      if (
        error.name === "SequelizeValidationError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
        //res.status(400).json({ message: "user info required" });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
