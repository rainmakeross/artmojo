module.exports = function(sequelize, DataTypes) {
  return sequelize.define("school_rating", {
    vote: DataTypes.INTEGER
  })
}
