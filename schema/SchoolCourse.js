module.exports = function(sequelize, DataTypes) {
  return sequelize.define("schools_courses", {
    schoolId: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER
  })
}
