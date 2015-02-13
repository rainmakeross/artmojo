module.exports = function(sequelize, DataTypes) {
  return sequelize.define("artist_audio", {
    artistId: DataTypes.INTEGER,
    title: DataTypes.STRING(255),
    audioCover: DataTypes.TEXT,
    audio: DataTypes.TEXT
  })
}
