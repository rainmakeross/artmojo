module.exports = function(sequelize, DataTypes) {
  return sequelize.define("course_description", {
    name: DataTypes.STRING(255),
    description: DataTypes.TEXT
  })
}
