"use strict";

const auth = require("basic-auth");
const { User } = require("../models");
const bcrypt = require("bcrypt");

/**
 * Middleware to authenticate the request using Basic Authentication.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The function to call to pass execution to the next middleware.
 */

exports.authenticateUser = async (req, res, next) => {
    console.log(req.body);
  let message;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  if (credentials) {
    //Check if the user's email address) is associated with a known user account in the db using a Sequelize finder method.
    const user = await User.findOne({ where: { emailAddress: credentials.name } });

    if (user) {
      //compareSync() method to compare the user's password (from the Authorization header) to the encrypted password retrieved from the database
      const authenticated = bcrypt.compareSync(
        credentials.pass,
        user.password
      );
      if (authenticated) {
        console.log(`Authentication successful for username: ${user.emailAddress}`);

        // Store the user on the Request object.
        //req.currentUser means that you're adding a property named currentUser to the request object and setting it to the authenticated user.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Auth header not found";
  }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: "Access Denied" });
  } else {
    next();
  }
};
