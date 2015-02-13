module.exports = function(sequelize, DataTypes) {
  return sequelize.define("artist_rating", {
    artistId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    vote: DataTypes.INTEGER
  })
}
