module.exports = function(sequelize, DataTypes) {
  return sequelize.define("country", {
    name: DataTypes.STRING(255)
  })
}
