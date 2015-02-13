module.exports = function(sequelize, DataTypes) {
  return sequelize.define("event", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    description: { type: DataTypes.TEXT, allowNull: true, defaultValue: null},
    from_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    to_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
    contact_email: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    contact_phone: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    event_website: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    contact_address: { type: DataTypes.TEXT, allowNull: true, defaultValue: null},
    contact_zipcode: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    operator: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    image_url: { type: DataTypes.TEXT, allowNull: true, defaultValue: null}
  })
}
