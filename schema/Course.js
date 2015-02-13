module.exports = function(sequelize, DataTypes) {
  return sequelize.define("course", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    categoryId: { type: DataTypes.INTEGER },
    course_name: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    course_image: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    course_description: { type: DataTypes.TEXT, allowNull: true, defaultValue: null},
    custom_desc: { type: DataTypes.BOOLEAN, defaultValue: 1 },
    number_of_views: { type: DataTypes.BIGINT, defaultValue: 1 },
    active: { type: DataTypes.BOOLEAN, defaultValue: 1 },
    meta_keyword: { type: DataTypes.TEXT, allowNull: true, defaultValue: null}
  })
}
