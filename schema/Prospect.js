module.exports = function(sequelize, DataTypes) {
  return sequelize.define("prospect", {
    name: DataTypes.TEXT,
    url: DataTypes.TEXT,
    notes: DataTypes.TEXT,
    completion_date: DataTypes.DATE,
    is_completed: DataTypes.BOOLEAN
  })
}
