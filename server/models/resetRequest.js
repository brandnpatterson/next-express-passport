'use strict';
module.exports = (sequelize, DataTypes) => {
  const ResetRequest = sequelize.define(
    'ResetRequest',
    {
      email: DataTypes.STRING,
      token: DataTypes.STRING
    },
    {}
  );
  ResetRequest.associate = function (models) {
    // associations can be defined here
  };
  return ResetRequest;
};
