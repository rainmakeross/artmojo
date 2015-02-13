module.exports = function(sequelize, DataTypes) {
  return sequelize.define("user_balance", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER },
    balance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    applicableBalance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 }
    
  })
}
