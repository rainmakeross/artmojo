module.exports = function(sequelize, DataTypes) {
  return sequelize.define("token", {
    id: DataTypes.INTEGER,
    token: DataTypes.STRING,
    userId: DataTypes.INTEGER
  })
}
