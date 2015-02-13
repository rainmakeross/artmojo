module.exports = function(sequelize, DataTypes) {
  return sequelize.define("category", {
    name: DataTypes.STRING(255),
    icon: DataTypes.STRING(200),
    active: DataTypes.BOOLEAN
  })
}
