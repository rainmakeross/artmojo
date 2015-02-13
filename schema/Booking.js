module.exports = function(sequelize, DataTypes) {
  return sequelize.define("booking", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER },
    artistId: { type: DataTypes.INTEGER },
    courseId: { type: DataTypes.INTEGER },
    userName: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    artistName: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    status: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    requestDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    requestTime: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    requestSpan: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    amount: { type: DataTypes.DECIMAL(10, 2) },
    confirmed: { type: DataTypes.BOOLEAN, defaultValue: 0 }
    
  })
}
