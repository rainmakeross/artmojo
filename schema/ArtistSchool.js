module.exports = function(sequelize, DataTypes) {
  return sequelize.define("artists_schools", {
    schoolId: DataTypes.INTEGER,
    artistId: DataTypes.INTEGER
  })
}
