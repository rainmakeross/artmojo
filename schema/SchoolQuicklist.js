module.exports = function(sequelize, DataTypes) {
  return sequelize.define("school_quicklist", {
    schoolId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  })
}
