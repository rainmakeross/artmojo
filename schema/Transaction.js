module.exports = function(sequelize, DataTypes) {
  return sequelize.define("transaction", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bookingId: { type: DataTypes.INTEGER },
    paidBy: { type: DataTypes.INTEGER },
    paidTo: { type: DataTypes.INTEGER },
    paymentReason: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    transactionId: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    amount: { type: DataTypes.DECIMAL(10, 2) }
    
  })
}
