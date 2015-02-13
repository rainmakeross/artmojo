module.exports = function(sequelize, DataTypes) {
  return sequelize.define("job_type", {
    id: DataTypes.INTEGER,
    name: DataTypes.STRING(255)
  })
}
