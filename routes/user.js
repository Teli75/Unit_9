"use strict";

const express = require("express");

//handlers
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");

// Construct a router instance.
const router = express.Router();
const { User } = require("../models/index.js");

// Route that returns a list of users.
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    console.log(user);
    res.json({
      name: user.name,
      username: user.emailAddress,
    });
  })
);
//     console.log("Entered user get route")
//     let users = await User.findAll();
//     res.json(users);

// Route that creates a new user.
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      console.log("entered user post route");
      console.log(req.body);
      // if ( req.body.firstName && req.body.lastName && req.body.emailAddress && req.body.password ){
      //   console.log("Next step is to use create()")
      await User.create(req.body);

      res.status(201).json({ message: "Account successfully created!" });
      return;
    } catch (error) {
      console.log("ERROR: ", error.name);

      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
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
