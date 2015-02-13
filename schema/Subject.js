module.exports = function(sequelize, DataTypes) {
  return sequelize.define("subject", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    subject_name: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    courseId: { type: DataTypes.INTEGER },
    courseName: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null}
  })
}
