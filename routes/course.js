"use strict";

const express = require("express");

//handlers
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");

// Construct a router instance.
const router = express.Router();

//Give us access to fsjstd-restapi.db
const { Course, User } = require("../models/index.js");

// Route that returns a list of courses.
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    console.log(req.body);
    let courses = await Course.findAll({
      include: [
        {
          model: User
        },
      ],
    });

    res.json(courses);
  })
);

// Route that creates a new course.
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      console.log("entered courses post route");
      console.log(req.body);

      let newCourse = await Course.create(req.body);
      res.location(`/courses/${newCourse.id}`);
      //res.location(`/courses/${req.body.id}`);

      res.status(201).json();
    } catch (error) {
      console.log("ERROR: ", error.name);
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

/*
/api/courses/:id GET route that will return the corresponding course including the User associated with that course and a 200 HTTP status code. 
*/

router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    console.log("Entered detail get route");
    //find course
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
      ],
    });

    if (course) {
      //res.json(course);
      res.status(200).json({ course });
    } else {
      //This generates an error that is sent to middlwware
      next();
    }
  })
);

/*
  /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
   */

router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      //find course
      const course = await Course.findByPk(req.params.id);

      if (course) {
        await course.update(req.body);

        res.status(204).end();
      } else {
        res.status(404).json({ message: "Quote Not Found" });
      }
    } catch (error) {
      console.log("ERROR: ", error.name);
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

/*
  /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
  */
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    let course;
    try {
      course = await Course.findByPk(req.params.id);
      if (course) {
        await course.destroy();
        res.status(204).end();
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
