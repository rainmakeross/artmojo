module.exports = function(sequelize, DataTypes) {
  return sequelize.define("artists_courses", {
    courseId: DataTypes.INTEGER,
    artistId: DataTypes.INTEGER
  })
}
