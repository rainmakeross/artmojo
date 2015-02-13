module.exports = function(sequelize, DataTypes) {
  return sequelize.define("artist_quicklist", {
    artistId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  })
}
