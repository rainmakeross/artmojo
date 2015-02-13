module.exports = function(sequelize, DataTypes) {
  return sequelize.define("password_reset", {
    hash: DataTypes.STRING(255)
  })
}
