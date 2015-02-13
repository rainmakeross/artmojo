module.exports = function(sequelize, DataTypes) {
  return sequelize.define("state", {
    id: DataTypes.INTEGER,
    countryId: DataTypes.INTEGER,
    name: DataTypes.STRING(255)
  })
}
