module.exports = function(sequelize, DataTypes) {
  return sequelize.define("blog", {
    id: DataTypes.INTEGER,
    title: DataTypes.STRING(255),
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    total_rate: DataTypes.INTEGER,
    url: DataTypes.STRING(255),
    total_comments: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  })
}
