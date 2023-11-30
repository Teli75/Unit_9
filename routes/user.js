"use strict";

const express = require("express");

// Construct a router instance.
const router = express.Router();
const { User } = require("../models/index.js");

//asyncHandler - wraps route handlers 
function asyncHandler(cb){
  return async (req,res, next) => {
      try {
          await cb(req, res, next);
      } catch(err) {
          next(err);
      }
  }
}

// Route that returns a list of users.
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    console.log("Entered user get route")
    let users = await User.findAll();
    res.json(users);
  })
);

// Route that creates a new user.
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      console.log("entered user post route");
      await User.create(req.body);
      res.status(201).json({ message: "Account successfully created!" });
    } catch (error) {
      console.log("ERROR: ", error.name);

      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
  })
);



module.exports = router;