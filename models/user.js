"use strict";
const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  class User extends Model {}
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A first name is required",
          },
          notEmpty: {
            msg: "Please provide a first name",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A last name is required",
          },
          notEmpty: {
            msg: "Please provide a last name",
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "The email you entered already exists",
        },
        validate: {
          notNull: {
            msg: "An email is required",
          },
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },
      password: {
        //"virtual fields". These are attributes of a Model that only Sequelize populates but don't actually exist or get inserted as a column into the SQL database table.
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          //val represents the value being set for confirmedPassword.
          if (val) {
            //pw is hashed using bcrypt
            const hashedPassword = bcrypt.hashSync(val, 10);
            //Set the pw to the hashedpw
            this.setDataValue('password', hashedPassword);
            console.log('Hashed Password Length:', hashedPassword.length);
          }
        },
        validate: {
          notNull: {
            msg: 'A password is required'
          },
          notEmpty: {
            msg: 'Please provide a password'
          },
        }
      },
    },
    { sequelize }
  );

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: "userId",
        //allowNull: false,
      },
    });
  };
  return User;
};
