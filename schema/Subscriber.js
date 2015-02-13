module.exports = function(sequelize, DataTypes) {
  return sequelize.define("subscriber", {
    id: DataTypes.INTEGER,
    email: DataTypes.STRING(255)
  })
}
