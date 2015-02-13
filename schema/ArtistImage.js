module.exports = function(sequelize, DataTypes) {
  return sequelize.define("artist_image", {
    artistId: DataTypes.INTEGER,
    title: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    profilepic: { type: DataTypes.BOOLEAN, defaultValue: 1 },
    image: { type: DataTypes.TEXT, allowNull: true, defaultValue: null}
  })
}
