module.exports = function(sequelize, DataTypes) {
  return sequelize.define("job", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    categoryId: { type: DataTypes.INTEGER },
    jobTitle: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    closingDate: { type: DataTypes.DATE, allowNull: true, defaultValue: null},
    job_typeId: { type: DataTypes.STRING(255), allowNull: true}, 
    salary: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    description: { type: DataTypes.TEXT, allowNull: true, defaultValue: null},
    applicationEmail: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    phone: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},    
    applicationPhone: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null}, 
    applicationAddress: { type: DataTypes.TEXT, allowNull: true, defaultValue: null},
    cityId: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
    closingDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    operator: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    image_url: { type: DataTypes.TEXT, allowNull: true, defaultValue: null}
  })
}
