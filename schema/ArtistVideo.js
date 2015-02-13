module.exports = function(sequelize, DataTypes) {
  return sequelize.define("artist_video", {
    artistId: DataTypes.INTEGER,
    title: DataTypes.STRING(255),
    videoCover: DataTypes.TEXT,
    video: DataTypes.TEXT
  })
}
