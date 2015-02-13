module.exports = function(sequelize, DataTypes) {
  return sequelize.define("artist_comment", {
    rate: DataTypes.INTEGER,
    comments: DataTypes.TEXT,
    active: DataTypes.BOOLEAN
  })
}
