module.exports = function(sequelize, DataTypes) {
  return sequelize.define("school_comment", {
    rate: DataTypes.INTEGER,
    comments: DataTypes.TEXT,
    active: DataTypes.BOOLEAN
  })
}
