"use strict";
const { Model, DataTypes } = require("sequelize");


module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: '"Title" is required' },
          notNull: { msg: '"Title" is required' },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: '"description" is required' },
          notNull: { msg: '"description" is required' },
        },
      },
      estimatedTime: {
        type: DataTypes.STRING,
        //allowNull: false,
      },
      materialsNeeded: {
        type: DataTypes.STRING,
        //allowNull: false,
      },
    },
    { sequelize }
  );

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: "userID",
        allowNull: false,
      },
    });
  };

  return Course;
};
