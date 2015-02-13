module.exports = function(sequelize, DataTypes) {
  return sequelize.define("city", {
    id: DataTypes.INTEGER,
    stateId: DataTypes.INTEGER,
    name: DataTypes.STRING(255),
    stateAbbr: DataTypes.STRING(3)
  })
}
