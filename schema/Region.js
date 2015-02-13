module.exports = function(sequelize, DataTypes) {
  return sequelize.define("region", {
    name: DataTypes.STRING(255),
    region: DataTypes.STRING(4)
  })
}
