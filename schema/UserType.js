module.exports = function(sequelize, DataTypes) {
  return sequelize.define("user_type", {
    name: DataTypes.STRING
  })
}
