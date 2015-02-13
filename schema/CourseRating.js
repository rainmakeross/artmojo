module.exports = function(sequelize, DataTypes) {
  return sequelize.define("course_rating", {
    ip: DataTypes.STRING,
    vote: DataTypes.INTEGER
  })
}
