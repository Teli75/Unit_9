"use strict";

const express = require("express");

// Construct a router instance.
const router = express.Router();
const User = require("../models").course;
const { Course } = require("../models/index.js");

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
      console.log("entered courses post route");
      await Course.create(req.body);
      res.status(201).json({ message: "Course successfully created!" });
    } catch (error) {
      console.log("ERROR: ", error.name);
    }
  })
);

/*
/api/courses/:id GET route that will return the corresponding course including the User associated with that course and a 200 HTTP status code. 
*/

router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    //find course
    const course = await Course.findByPk(req.params.id);
    if (course) {
      res.json(course);
      res.status(200).json({ message: "Course Detail" });
    } else {
      //This generates an error that is sent to middlwware
      next();
    }
  })
);

/*
  /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
   */

// router.put(
//   "/courses/:id",
//   asyncHandler(async (req, res) => {
//     //find course
//     const course = await Course.findByPk(req.params.id);

//     if (course) {
//       course.title = req.body.title;
//       course.description = req.body.description;
//       course.estimatedTime = req.body.estimatedTime;
//       course.materialsNeeded = req.body.materialsNeeded;

//     await course.update(req.body);

//     res.status(204).end();
//     } else {
//       next();
//     }
//   })
// );

/*
  /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
  */

module.exports = router;
