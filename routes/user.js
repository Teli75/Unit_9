"use strict";

const express = require("express");

// Construct a router instance.
const router = express.Router();
const User = require("../models").user;

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
    let users = await User.findAll();
    res.json(users);
  })
);

// Route that creates a new user.
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).json({ message: "Account successfully created!" });
    } catch (error) {
      console.log("ERROR: ", error.name);
    }
  })
);


/*
/api/courses/:id GET route that will return the corresponding course including the User associated with that course and a 200 HTTP status code. 
*/

/*
/api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
 */

/*
/api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
*/

module.exports = router;