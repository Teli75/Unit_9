"use strict";

const express = require("express");

// Construct a router instance.
const router = express.Router();
const User = require("../models").course;

//asyncHandler - wraps route handlers
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

// Route that returns a list of courses.
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    let courses = await User.findAll();
    res.json(courses);
  })
);

// Route that creates a new course.
router.post(
  "/courses",
  asyncHandler(async (req, res) => {
    try {
      await Course.create(req.body);
      res.status(201).json({ message: "Course successfully created!" });
    } catch (error) {
      console.log("ERROR: ", error.name);
    }
  })
);

module.exports = router;